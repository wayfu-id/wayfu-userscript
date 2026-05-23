import { Icons, Button } from "../../components/Index";
import React from "react";

import type { ModalItem } from "../ModalStack";

export default function ConfirmCard({ modal, onClose }: { modal: ModalItem; onClose: () => void }) {
    const { title, message } = modal;

    const resolve = (v: boolean) => {
        modal.resolve?.(v);
        onClose();
    };

    return (
        <div className="wf-modal-confirm">
            <div className="wf-modal-confirm-icon">
                <Icons.Pause />
            </div>
            <div className="wf-modal-title">{title}</div>
            <div className="wf-modal-body">{message}</div>
            <div className="wf-modal-actions">
                <Button className="wf-modal-btn" onClick={() => resolve(false)}>
                    Keep going
                </Button>
                <Button className="wf-modal-btn" onClick={() => resolve(false)}>
                    Resume later
                </Button>
                <Button className="wf-modal-btn wf-modal-btn--danger" onClick={() => resolve(true)}>
                    Stop &amp; clear
                </Button>
            </div>
        </div>
    );
}
