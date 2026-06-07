// src/scripts/ui/components/PreviewToggle.tsx
import React from "react";
import { useApp } from "../context/AppContext";
import { useAppEvent } from "../hooks/AppHooks";
import { Icons } from "./Index";
import { useState } from "react";

export default function PreviewToggle() {
    const app = useApp();
    const [preview, setPreview] = useState(() => app.Settings.previewMode);

    useAppEvent("setting:sets", () => {
        setPreview(app.Settings.previewMode);
    });

    const toggle = () => {
        app.trigger("setting:sets", { previewMode: !preview });
    };

    return (
        <button
            className={`wf-preview-toggle${preview ? " active" : ""}`}
            onClick={toggle}
            type="button"
            title={preview ? "Tutup preview" : "Lihat preview"}>
            <Icons.WaIcon />
            <span>{preview ? "Preview" : "Preview"}</span>
            <div className={`wf-preview-dot${preview ? " active" : ""}`} />
        </button>
    );
}
