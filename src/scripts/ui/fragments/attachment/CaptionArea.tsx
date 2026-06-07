import { PreviewToggle } from "../../components/Index";
import { useAppEvent, useWaydown } from "../../hooks/AppHooks";
import { useApp } from "../../context/AppContext";
import React, { useState } from "react";

type CaptionAreaProps = {
    preview: boolean;
};

export default function CaptionArea() {
    const app = useApp(),
        { Message, Settings } = app ?? { Message: null, Settings: null },
        { inputCaption } = Message ?? "";

    const [caption, setCaption] = useState(inputCaption ?? "");
    const [preview, setPreview] = useState(() => app.Settings.previewMode);
    const isCaptionEnabled = Settings?.useCaption == "caption";
    const placeholder = isCaptionEnabled
        ? "Tulis caption di sini (opsional)…"
        : "Caption tidak tersedia, guakan form pesan untuk caption";

    let handleCaptionChange = (caption: string) => {
        app?.trigger("message:update", { caption });
        setCaption(caption);
    };

    useAppEvent("setting:sets", () => {
        setPreview(app.Settings.previewMode);
    });

    const html = useWaydown(Message?.caption || "");

    return (
        <>
            <div className="wf-tab-content-header">
                <span className="wf-label">Caption</span>
                <PreviewToggle />
            </div>
            {preview ? (
                <div className="wf-caption-input preview" dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
                <input
                    className="wf-caption-input"
                    placeholder={placeholder}
                    value={caption}
                    onChange={(e) => handleCaptionChange(e.target.value)}
                    disabled={!isCaptionEnabled}
                />
            )}
        </>
    );
}
