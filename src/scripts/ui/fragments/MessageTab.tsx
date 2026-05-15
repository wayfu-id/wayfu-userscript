import App from "../../App";
import { KEYWORDS } from "../context/Constans";
import { Icons, Button, ToggleSwitch } from "../components/Index";
import React, { useState } from "react";

interface MessageTabProps {
    text: string;
    app?: App;
}

export default function MessageTab({ text, app }: MessageTabProps) {
    const [previewMode, setPreviewMode] = useState(false);
    const [msgText, setMsgText] = useState(text);
    const [hasFile, setHasFile] = useState(text);

    return (
        <>
            <textarea
                className="wf-msg-area"
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                placeholder="Tulis pesan di sini…"
            />

            {/* Keyword chips */}
            <div className="wf-label">Kata Kunci</div>
            <div className="wf-keyword-row">
                {KEYWORDS.map((k) => (
                    <Button
                        key={k.label}
                        className={`wf-chip${k.type === "data" ? " data" : ""}`}
                        onClick={() => setMsgText((t) => `${t} ${k.label}`)}
                        title={`Sisipkan ${k.label}`}>
                        {k.label}
                    </Button>
                ))}
            </div>

            {/* Mode toggle */}
            <div className="wf-msg-row wf-mode-row">
                <span className="wf-mode-label">
                    <Icons.WaIcon /> Mode Preview
                </span>
                <ToggleSwitch checked={previewMode} onChange={(e) => setPreviewMode(e.target.checked)} />
            </div>

            {/* File row */}
            <div className="wf-msg-row wf-file-row">
                <Button className="wf-file-btn">
                    <Icons.File />
                    {hasFile ? "Test_file.csv" : "Pilih file penerima (.csv / .xlsx)"}
                </Button>
                {hasFile && <span className="wf-file-badge">6</span>}
            </div>
        </>
    );
}
