import { PreviewToggle } from "../components/Index";
import { useApp } from "../context/AppContext";
import { useAppEvent, useWaydown } from "../hooks/AppHooks";
import React, { useState } from "react";

type MessageAreaProps = {
    text: string;
    handleChange: (val: string) => void;
};

export default function MessageArea({ text, handleChange }: MessageAreaProps) {
    const app = useApp();
    const [preview, setPreview] = useState(() => app.Settings.previewMode);

    useAppEvent("setting:sets", () => {
        setPreview(app.Settings.previewMode);
    });

    const html = useWaydown(app.Message.value);
    return (
        <>
            <div className="wf-tab-content-header">
                <span className="wf-label">Message</span>
                <PreviewToggle />
            </div>
            {preview ? (
                <article className="wf-msg-area preview" dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
                <textarea
                    className="wf-msg-area"
                    value={text}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="Tulis pesan di sini…"
                />
            )}
        </>
    );
}
