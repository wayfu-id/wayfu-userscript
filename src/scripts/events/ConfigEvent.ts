import App from "../App";
import { isNumeric } from "../utilities/index";
import { Settings } from "../structures/index";

export type SettingEventMap = {
    "setting:load": { payload: void; return: void };
    "setting:save": { payload: void; return: void };
    "setting:sets": { payload: { [k: keyof Settings]: any }; return: void };
};

export function registerConfigEvent(app: App) {
    app.on("setting:load", () => {
        const { Manager, Settings } = app;
        app.trigger("setting:sets", Manager.getValue(Settings.key));
    });

    app.on("setting:save", () => {
        app.trigger("save_value", app.Settings.save());
    });

    // ConfigEvent.ts
    app.on("setting:sets", async (props) => {
        if ("useCaption" in props && props.useCaption !== "caption") {
            const confirmed = await new Promise<boolean>((resolve) => {
                app.trigger("modal:confirm", {
                    title: "Switch caption mode?",
                    type: "error",
                    message: "This increases ban risk.",
                    resolve,
                });
            });

            if (!confirmed) {
                // revert the UI back to previous value
                app.trigger("ui:revert", {
                    key: "useCaption",
                    value: app.Settings.useCaption,
                });
                return; // stop — don't apply the setting
            }
        }

        if ("dateFormat" in props) {
            let { Recipient } = app;
            let val = props.dateFormat;
            if (isNumeric(val)) {
                props["isFormat"] = val == 2;
            } else /*if (Recipient != null)*/ {
                app.trigger("modal:alert", {
                    type: "error",
                    title: "Masukkan ulang CSV",
                    message: "Untuk opsi *Automatic*, Silahkan masukkan ulang file penerima pesan.",
                });
                app.trigger("recipient:reset");
            }
        }
        // only reaches here if no confirmation needed, or confirmed
        app.Settings.setOptions(props);
        app.trigger("setting:save");
        app.trigger("message:update_setting");
    });
}
