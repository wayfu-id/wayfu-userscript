import { Icons, Button } from "../../components/Index";
import { useWaydown } from "../../hooks/AppHooks";
import { accentClass, ModalIcon } from "./Index";
import React from "react";

import type { ModalItem } from "../../ModalStack";

export default function ConfirmCard({ modal, onClose }: { modal: ModalItem; onClose: () => void }) {
    const { title, message, type } = modal;

    const resolve = (v: boolean) => {
        modal.resolve?.(v);
        onClose();
    };

    return (
        <div className="wf-modal-confirm">
            {/* <div className="wf-modal-confirm-icon"></div> */}
            <div className="wf-modal-title">
                <ModalIcon type={type ?? "confirm"} className="wf-modal-confirm-icon" />
                {title}
            </div>
            {message && <div className="wf-modal-body" dangerouslySetInnerHTML={{ __html: useWaydown(message) }} />}
            <div className="wf-modal-actions">
                <Button className="wf-modal-btn" onClick={() => resolve(false)}>
                    Cancel
                </Button>
                <Button className="wf-modal-btn wf-modal-btn--danger" onClick={() => resolve(true)}>
                    Confirm
                </Button>
            </div>
        </div>
    );
}
