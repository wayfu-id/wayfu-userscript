import App from "../../App";
import { KEYWORDS } from "../context/Constans";
import { Icons, Button, ToggleSwitch } from "../components/Index";
import React, { useState } from "react";

interface MessageTabProps {
    app?: App;
}

export default function MessageTab({ app }: MessageTabProps) {
    let text = app ? app.Message.inputMessage : "";

    const [previewMode, setPreviewMode] = useState(false);
    const [hasFile, setHasFile] = useState(false);
    const [msgText, setMsgText] = useState(text);

    let handleMessageChange = (text: string) => {
        app?.trigger("message:update", { text });
        setMsgText(text);
    };

    return (
        <>
            <textarea
                className="wf-msg-area"
                value={msgText}
                onChange={(e) => handleMessageChange(e.target.value)}
                placeholder="Tulis pesan di sini…"
            />

            {/* Keyword chips */}
            <div className="wf-label">Kata Kunci</div>
            <div className="wf-keyword-row">
                {KEYWORDS.map((k) => (
                    <Button
                        key={k.label}
                        className={`wf-chip${k.type === "data" ? " data" : ""}`}
                        onClick={() => handleMessageChange(`${msgText} ${k.label}`)}
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
