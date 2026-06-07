import { Icons, Button } from "../../components/Index";
import React from "react";

interface AttachResumeProps {
    meta: { name: string; size: number; type: string };
    fileRef: React.RefObject<HTMLInputElement | null>;
    handleRemove: () => void;
}

export default function AttachResume({ meta, fileRef, handleRemove }: AttachResumeProps) {
    return (
        <div className="wf-attach-resume">
            <div className="wf-attach-resume-info">
                <Icons.File />
                <div>
                    <span className="wf-attach-resume-name">{meta.name}</span>
                    <span className="wf-attach-resume-sub">
                        File dari sesi sebelumnya — pilih ulang untuk melampirkan
                    </span>
                </div>
            </div>
            <div className="wf-attach-resume-actions">
                <Button className="wf-modal-btn" onClick={() => fileRef.current?.click()}>
                    Pilih ulang
                </Button>
                <Button className="wf-modal-btn wf-modal-btn--danger" onClick={handleRemove}>
                    <Icons.Trash />
                </Button>
            </div>
        </div>
    );
}
