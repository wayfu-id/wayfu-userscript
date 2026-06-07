import { useApp } from "../context/AppContext";
import { KEYWORDS } from "../context/Constans";
import { MessageArea } from "./Index";
import { Icons, Button } from "../components/Index";
import { useAppEvent } from "../hooks/AppHooks";
import React, { useState, useRef } from "react";

type MessageTabProp = {
    preview: boolean;
    setPreview: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MessageTab() {
    const app = useApp();
    let text = app ? app.Message.inputMessage : "",
        recipient = app?.Recipient,
        file = recipient?.file ?? null;

    const fileRef = useRef<HTMLInputElement>(null);

    const [hasFile, setHasFile] = useState(!!file);
    const [fileName, setFilename] = useState(() => file?.name ?? "");
    const [recipientCount, setRecipientCount] = useState(() => recipient?.data.length ?? 0);
    const [msgText, setMsgText] = useState(text);

    const inputAccept =
        ".csv, .txt, .xlsx, text/csv, text/plain, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    const handleFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const picked = e.target.files?.[0];
        if (!picked) return;
        setHasFile(true);
        setFilename(picked.name);
        app?.trigger("recipient:load", picked);
    };

    useAppEvent("recipient:loaded", (recipient) => {
        setRecipientCount(recipient.data.length);
    });

    let handleMessageChange = (text: string) => {
        app?.trigger("message:update", { text });
        setMsgText(text);
    };

    const openPicker = () => fileRef.current?.click();

    return (
        <>
            <MessageArea text={msgText} handleChange={handleMessageChange} />
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
            <div className="wf-msg-row wf-file-row">
                <input
                    ref={fileRef}
                    type="file"
                    title="Pilih file penerima"
                    accept={inputAccept}
                    className="hidden"
                    onChange={handleFilePick}
                    // reset value so onChange fires even if same file is picked
                    onClick={(e) => (e.currentTarget.value = "")}
                />
                <Button className="wf-file-btn" onClick={openPicker}>
                    <Icons.File />
                    {hasFile ? fileName : "Pilih file penerima (.csv / .xlsx)"}
                </Button>
                {hasFile && <span className="wf-file-badge">{recipientCount}</span>}
            </div>
        </>
    );
}
