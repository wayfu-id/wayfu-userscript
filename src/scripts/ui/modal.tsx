import App from "../App";
import { Icons } from "./components/Index";
import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";

export type ModalType = "alert" | "confirm" | "report" | "error";

export interface ReportData {
    success: number;
    fail: number;
    error: number;
    onExportFail?: () => void;
    onExportAll?: () => void;
}

export interface ModalItem {
    id: number;
    type: ModalType;
    title: string;
    message?: string;
    report?: ReportData;
    resolve?: (value: boolean) => void;
}

// const Icons = {
//     Close: () => (
//         <svg
//             width="14"
//             height="14"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2.5"
//             strokeLinecap="round">
//             <line x1="18" y1="6" x2="6" y2="18" />
//             <line x1="6" y1="6" x2="18" y2="18" />
//         </svg>
//     ),
//     Info: () => (
//         <svg
//             width="15"
//             height="15"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round">
//             <circle cx="12" cy="12" r="10" />
//             <line x1="12" y1="8" x2="12" y2="12" />
//             <line x1="12" y1="16" x2="12.01" y2="16" />
//         </svg>
//     ),
//     Warning: () => (
//         <svg
//             width="15"
//             height="15"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round">
//             <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
//             <line x1="12" y1="9" x2="12" y2="13" />
//             <line x1="12" y1="17" x2="12.01" y2="17" />
//         </svg>
//     ),
//     Chart: () => (
//         <svg
//             width="15"
//             height="15"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round">
//             <line x1="18" y1="20" x2="18" y2="10" />
//             <line x1="12" y1="20" x2="12" y2="4" />
//             <line x1="6" y1="20" x2="6" y2="14" />
//         </svg>
//     ),
//     Download: () => (
//         <svg
//             width="13"
//             height="13"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round">
//             <polyline points="8 17 12 21 16 17" />
//             <line x1="12" y1="12" x2="12" y2="21" />
//             <path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29" />
//         </svg>
//     ),
//     Pause: () => (
//         <svg
//             width="18"
//             height="18"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2.5"
//             strokeLinecap="round">
//             <rect x="6" y="4" width="4" height="16" rx="1" />
//             <rect x="14" y="4" width="4" height="16" rx="1" />
//         </svg>
//     ),
// };

function accentClass(type: ModalType) {
    if (type === "error") return "wf-modal-card--danger";
    if (type === "confirm") return "wf-modal-card--warning";
    if (type === "report") return "wf-modal-card--success";
    return "wf-modal-card--info";
}

function ModalIcon({ type }: { type: ModalType }) {
    if (type === "error")
        return (
            <span className="wf-modal-icon wf-modal-icon--danger">
                <Icons.Warning />
            </span>
        );
    if (type === "confirm")
        return (
            <span className="wf-modal-icon wf-modal-icon--warning">
                <Icons.Pause />
            </span>
        );
    if (type === "report")
        return (
            <span className="wf-modal-icon wf-modal-icon--success">
                <Icons.Chart />
            </span>
        );
    return (
        <span className="wf-modal-icon wf-modal-icon--info">
            <Icons.Info />
        </span>
    );
}

function ReportCard({ modal, onClose }: { modal: ModalItem; onClose: () => void }) {
    const r = modal.report!;
    return (
        <div className={`wf-modal-card ${accentClass(modal.type)}`}>
            <button className="wf-modal-close" onClick={onClose} aria-label="Close" type="button">
                <Icons.Close />
            </button>
            <div className="wf-modal-title">
                <ModalIcon type={modal.type} />
                {modal.title}
            </div>
            <div className="wf-report-grid">
                <div className="wf-report-cell">
                    <span className="wf-report-num wf-report-num--success">{r.success}</span>
                    <span className="wf-report-label">Sent</span>
                </div>
                <div className="wf-report-cell">
                    <span className="wf-report-num wf-report-num--warning">{r.fail}</span>
                    <span className="wf-report-label">Failed</span>
                </div>
                <div className="wf-report-cell">
                    <span className="wf-report-num wf-report-num--danger">{r.error}</span>
                    <span className="wf-report-label">Error</span>
                </div>
            </div>
            <div className="wf-modal-actions">
                {r.onExportFail && (
                    <button className="wf-modal-btn" onClick={r.onExportFail} type="button">
                        <Icons.Download /> Export failed
                    </button>
                )}
                {r.onExportAll && (
                    <button className="wf-modal-btn" onClick={r.onExportAll} type="button">
                        <Icons.Download /> Export all
                    </button>
                )}
            </div>
        </div>
    );
}

function ConfirmCard({ modal, onClose }: { modal: ModalItem; onClose: () => void }) {
    const resolve = (v: boolean) => {
        modal.resolve?.(v);
        onClose();
    };
    return (
        <div className="wf-modal-confirm">
            <div className="wf-modal-confirm-icon">
                <Icons.Pause />
            </div>
            <div className="wf-modal-title">{modal.title}</div>
            <div className="wf-modal-body">{modal.message}</div>
            <div className="wf-modal-actions">
                <button className="wf-modal-btn" onClick={() => resolve(false)} type="button">
                    Keep going
                </button>
                <button className="wf-modal-btn" onClick={() => resolve(false)} type="button">
                    Resume later
                </button>
                <button className="wf-modal-btn wf-modal-btn--danger" onClick={() => resolve(true)}>
                    Stop &amp; clear
                </button>
            </div>
        </div>
    );
}

function AlertCard({ modal, onClose }: { modal: ModalItem; onClose: () => void }) {
    return (
        <div className={`wf-modal-card ${accentClass(modal.type)}`}>
            <button className="wf-modal-close" onClick={onClose} aria-label="Close" type="button">
                <Icons.Close />
            </button>
            <div className="wf-modal-title">
                <ModalIcon type={modal.type} />
                {modal.title}
            </div>
            {modal.message && <div className="wf-modal-body">{modal.message}</div>}
            <div className="wf-modal-actions">
                <button className="wf-modal-btn wf-modal-btn--primary" onClick={onClose} type="button">
                    Got it
                </button>
            </div>
        </div>
    );
}

let _idCounter = 0;

export function ModalStack({ app }: { app?: App }) {
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

    const portal = document.getElementById("wf-modal-root");
    if (!portal) return null;

    return ReactDOM.createPortal(
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
        </div>,
        portal,
    );
}
