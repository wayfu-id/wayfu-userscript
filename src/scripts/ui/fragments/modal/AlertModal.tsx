import { Icons, Button } from "../../components/Index";
import { useWaydown } from "../../hooks/AppHooks";
import { accentClass, ModalIcon } from "./Index";
import React from "react";

import type { ModalItem } from "../../ModalStack";

export default function AlertCard({ modal, onClose }: { modal: ModalItem; onClose: () => void }) {
    const { message, title, type } = modal;
    return (
        <div className={`wf-modal-card ${accentClass(type)}`}>
            <Button className="wf-modal-close" onClick={onClose} aria-label="Close">
                <Icons.Close />
            </Button>
            <div className="wf-modal-title">
                <ModalIcon type={type} /> {title}
            </div>
            {message && <div className="wf-modal-body" dangerouslySetInnerHTML={{ __html: useWaydown(message) }} />}
            <div className="wf-modal-actions">
                <Button className="wf-modal-btn wf-modal-btn--primary" onClick={onClose}>
                    Got it
                </Button>
            </div>
        </div>
    );
}
