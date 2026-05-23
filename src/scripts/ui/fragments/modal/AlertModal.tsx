import { Icons, Button } from "../../components/Index";
import { accentClass, ModalIcon } from ".";
import React from "react";

import type { ModalItem } from "../ModalStack";

export default function AlertCard({ modal, onClose }: { modal: ModalItem; onClose: () => void }) {
    return (
        <div className={`wf-modal-card ${accentClass(modal.type)}`}>
            <Button className="wf-modal-close" onClick={onClose} aria-label="Close">
                <Icons.Close />
            </Button>
            <div className="wf-modal-title">
                <ModalIcon type={modal.type} />
                {modal.title}
            </div>
            {modal.message && <div className="wf-modal-body">{modal.message}</div>}
            <div className="wf-modal-actions">
                <Button className="wf-modal-btn wf-modal-btn--primary" onClick={onClose}>
                    Got it
                </Button>
            </div>
        </div>
    );
}
