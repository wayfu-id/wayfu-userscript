// import App from "../App";
import { AlertCard, ConfirmCard, ReportCard } from "./fragments/modal/Index";
import { useApp } from "./context/AppContext";
import React, { useState, useEffect, useCallback } from "react";
// import ReactDOM from "react-dom";

import type { ReportData } from "./fragments/modal/ReportCard";

export type ModalType = "alert" | "confirm" | "report" | "error";

export interface ModalItem {
    id: number;
    type: ModalType;
    title: string;
    message?: string;
    report?: ReportData;
    resolve?: (value: boolean) => void;
}

let _idCounter = 0;

export default function ModalStack() {
    const app = useApp();
    const [modals, setModals] = useState<ModalItem[]>([]);

    const push = useCallback((item: Omit<ModalItem, "id">) => {
        setModals((prev) => [...prev, { ...item, id: ++_idCounter }]);
    }, []);

    const remove = useCallback((id: number) => {
        setModals((prev) => prev.filter((m) => m.id !== id));
    }, []);

    useEffect(() => {
        if (!app) return;

        const onAlert = (data: { title: string; message?: string; type?: ModalType }) => {
            push({ type: data.type ?? "alert", title: data.title, message: data.message });
        };

        const onConfirm = (data: { title: string; message?: string; resolve: (v: boolean) => void }) => {
            push({ type: "confirm", title: data.title, message: data.message, resolve: data.resolve });
        };

        const onReport = (data: ReportData & { title?: string }) => {
            push({ type: "report", title: data.title ?? "Blast complete", report: data });
        };

        const onError = (data: { title: string; message: string }) => {
            push({ type: "error", title: data.title, message: data.message });
        };

        app.on("modal:alert", onAlert);
        app.on("modal:confirm", onConfirm);
        app.on("modal:report", onReport);
        app.on("modal:error", onError);

        return () => {
            app.remove("modal:alert", onAlert);
            app.remove("modal:confirm", onConfirm);
            app.remove("modal:report", onReport);
            app.remove("modal:error", onError);
        };
    }, [app, push]);

    useEffect(() => {
        app?.trigger("ui:ready");
    }, []);

    // const portal = app?.ModalRoot ?? document.getElementById("wf-modal-root");
    // if (!portal) return null;

    return (
        <div id="wf-modal-root">
            {modals.length > 0 && (
                <div
                    className="wf-modal-backdrop"
                    aria-hidden="true"
                    onClick={() => {
                        const top = modals[modals.length - 1];
                        if (top.type !== "confirm") {
                            setModals((prev) => prev.slice(0, -1));
                        }
                    }}
                />
            )}
            <div className="wf-modal-stack" aria-live="polite">
                {modals.map((modal) => (
                    <div key={modal.id} className="wf-modal-entry">
                        {modal.type === "confirm" ? (
                            <ConfirmCard modal={modal} onClose={() => remove(modal.id)} />
                        ) : modal.type === "report" ? (
                            <ReportCard modal={modal} onClose={() => remove(modal.id)} />
                        ) : (
                            <AlertCard modal={modal} onClose={() => remove(modal.id)} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
