import { GroupChat } from "@wayfu/simple-wapi/src/structures";
import App from "../App";

import type { ReportSummary } from "../structures/Reports";
import type { StepFn } from "../structures/Worker";

export interface BlastState {
    running: boolean;
    index: number;
    total: number;
    phone: string;
    done: boolean;
}

type callBackPayload = {
    resolve: (value: boolean) => void;
};

export type CoreEventMap = {
    save_value: { payload: { [k: string]: any } | undefined; return: void };
    "blast:start": { payload: callBackPayload; return: void };
    "blast:started": { payload: void; return: void };
    "blast:progress": { payload: BlastState; return: void };
    "blast:stop": { payload: ReportSummary | void; return: void };
    "blast:done": { payload: ReportSummary | void; return: void };
    "blast:validate": { payload: callBackPayload; return: void };
    "chat:active": { payload: WAPI.Chat; return: void };
    "chat:closed": { payload: void; return: void };
    "chat:changed": { payload: void; return: WAPI.Chat | null };
    "chat:observe": { payload: void; return: void };
    "ui:ready": { payload: void; return: void };
    "ui:revert": { payload: { key: string; value: any }; return: void };
    "ui:update": { payload: any; return: void };
};

export function registerCoreEvent(app: App) {
    app.on("save_value", (data) => {
        const { Manager } = app;
        Manager.setValue(data);
    });

    app.on("blast:started", async () => {
        const { Worker, Queue, Message, Settings } = app,
            total = Queue.size;

        if (Worker.isRunning) return;

        Worker.start(
            // getNext — pull next item from queue
            () => Queue.next(),

            // onEach — return the steps for this recipient
            (data) => {
                Message.setData(data);
                const { hasAttach } = Settings,
                    hasProduct = !!Message.product;

                const steps: StepFn[] = [];

                // step 1 — always send text
                if (Settings.useCaption === "caption") {
                    steps.push(async () => {
                        let result = await app.request("message:send_text");
                        if (result) app.Report.success(data);
                        else app.Report.fail(data, "error");
                        return result;
                    });
                }

                // step 2 — image attachment if enabled
                if (hasAttach && Message.imageFile) {
                    steps.push(async () => {
                        let result = await app.request("message:send_media");
                        if (!result) app.Report.fail(data, "gagal");
                        return result;
                    });
                }

                // step 3 — product attachment if selected
                if (hasProduct && Message.product) {
                    steps.push(async () => {
                        let result = await app.request("message:send_product");
                        if (!result) app.Report.fail(data, "gagal");
                        return result;
                    });
                }

                return steps;
            },

            // onDone
            () => {
                app.trigger("blast:done", app.Report.getSummary());
            },

            // onProgress
            (index, phone) => {
                app.trigger("blast:progress", {
                    index,
                    phone,
                    total: total,
                    done: false,
                    running: true,
                });
            },
        );
    });

    app.on("blast:stop", () => {
        app.Worker.stop();
    });

    app.on("blast:validate", async ({ resolve }) => {
        const { Client, Message, Recipient, Queue } = app;

        if (!Client.canUseFeature()) {
            app.trigger("modal:alert", {
                type: "error",
                title: "Premium feature",
                message: "This requires a Trial or Premium account.",
            });
            resolve(false);
            return;
        }

        if (Queue.size === 0) {
            if (Recipient && Recipient.data.length !== 0) {
                const confirmed = await new Promise<boolean>((resolve) => {
                    app.trigger("modal:confirm", {
                        title: "Queue is empty",
                        type: "error",
                        message:
                            "Your recipient list has data but the queue is empty. Do you want to reload the queue from the recipient list?",
                        resolve: resolve,
                    });
                });

                if (confirmed) {
                    app.trigger("recipient:reload");
                }
                resolve(confirmed);
                return;
            }

            app.trigger("modal:alert", {
                title: "Validation Error",
                type: "error",
                message: "Queue is empty. Please add recipients before starting the blast.",
            });
            resolve(false);
            return;
        }

        if (!Recipient || Recipient.data.length === 0) {
            app.trigger("modal:alert", {
                title: "Validation Error",
                type: "error",
                message: "Recipient list cannot be empty.",
            });
            resolve(false);
            return;
        }

        if (!Message.value) {
            app.trigger("modal:alert", {
                title: "Validation Error",
                type: "error",
                message: "Message content cannot be empty.",
            });
            resolve(false);
            return;
        }
        resolve(true);
    });

    app.on("chat:changed", async () => {
        await app.WAPI.sleep(150);

        const main = document.querySelector("div#main");

        if (!main) {
            // no active chat
            app.trigger("chat:closed");
            return null;
        }

        const chat = app.WAPI.getActiveChat();
        if (chat) {
            app.trigger("chat:active", chat);
        }

        return chat;
    });

    app.on("chat:observe", () => {
        // #main's parent is stable — find it once
        // walk up from #main if it exists, otherwise find via structure
        const getObserveTarget = (): Element | null => {
            const target = document.querySelector("div#main"),
                intro = document.querySelector("div[data-testid='intro-panel']");
            return target ? target.parentElement : (intro?.parentElement?.parentElement as Element);
        };

        const target = getObserveTarget();
        if (!target) {
            console.warn("[chat:observe] could not find observe target");
            return;
        }

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                // we only care about attribute changes
                if (mutation.type !== "childList") continue;
                if (mutation.addedNodes.length == 0) continue;

                const [el] = mutation.addedNodes,
                    isMain = (el as Element).id === "main",
                    wasMain = !isMain; // id just changed away from "main"

                if (isMain || wasMain) {
                    app.trigger("chat:changed");
                    break;
                }
            }
        });

        observer.observe(target, {
            childList: true, // watch child nodes appearing/disappearing
        });

        app.setChatObserver(observer);
    });

    app.on("ui:ready", () => {
        const observer = new MutationObserver(() => {
            const waTheme = document.body.classList.contains("dark") ? "dark" : "light";
            app.trigger("setting:sets", { theme: waTheme });
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["class"],
        });

        // store ref so you can disconnect later if needed
        app.trigger("chat:observe");
        app.setThemeObserver(observer);
    });

    app.on("ui:ready", () => {
        let attempts = 0;
        const maxAttempts = 20; // 10 seconds total
        const { Client } = app;

        const checkProducts = setInterval(() => {
            attempts++;
            const products = (Client.Profile as WAPI.BusinessContact)?.Products;

            if (products && products.length > 0) {
                clearInterval(checkProducts);
                app.trigger("user:products_loaded");
                return;
            }

            if (attempts >= maxAttempts) {
                clearInterval(checkProducts);
                // no products found after timeout — still signal so UI
                // can settle into the "no products" empty state
                app.trigger("user:products_loaded");
            }
        }, 500);
    });
}
