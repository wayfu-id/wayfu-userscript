import { Icons, Button } from "../../components/Index";
import { ModalIcon, accentClass } from "./Index";
import React from "react";

import type { ModalItem } from "../../ModalStack";

export interface ReportData {
    success: number;
    fail: number;
    error: number;
    onExportFail?: () => void;
    onExportAll?: () => void;
}

export default function ReportCard({ modal, onClose }: { modal: ModalItem; onClose: () => void }) {
    const { type, title, report } = modal;
    const r = report!;
    return (
        <div className={`wf-modal-card ${accentClass(type)}`}>
            <button className="wf-modal-close" onClick={onClose} aria-label="Close" type="button">
                <Icons.Close />
            </button>
            <div className="wf-modal-title">
                <ModalIcon type={type} /> {title}
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
                    <Button className="wf-modal-btn" onClick={r.onExportFail}>
                        <Icons.Download /> Export failed
                    </Button>
                )}
                {r.onExportAll && (
                    <Button className="wf-modal-btn" onClick={r.onExportAll}>
                        <Icons.Download /> Export all
                    </Button>
                )}
            </div>
        </div>
    );
}
