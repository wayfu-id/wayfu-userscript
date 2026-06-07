import { useApp } from "../context/AppContext";
import { socials } from "../context/Constans";
import { Button } from "../components/Index";
import { useAppEvent } from "../hooks/AppHooks";
import React, { useState } from "react";

export default function Footer() {
    const app = useApp();
    const appInfo = app ? app.appInfo : undefined;
    const author = appInfo ? appInfo.author : "Rizal Nurhidayat";
    const { Recipient } = app ?? {};

    const [recipientCount, setRecipientCount] = useState(() => Recipient?.data.length ?? 0);

    useAppEvent("recipient:loaded", (recipient) => {
        setRecipientCount(recipient.data.length);
    });

    useAppEvent("recipient:reset", () => {
        setRecipientCount(0);
    });

    let text = recipientCount > 0 ? `${recipientCount} penerima dimuat` : "Belum ada penerima";

    return (
        <div className="wf-panel-footer">
            <div className="wf-footer-info">
                <div className="flex items-center gap-4">
                    <div className="wf-status-dot" />
                    <span className="text-(--green) text-10 font-semibold">{text}</span>
                </div>
                {`© ${author}`}
            </div>
            <div className="wf-footer-socials">
                {socials.map((n) => (
                    <Button key={n} className="wf-social-btn" title={n}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="10" />
                        </svg>
                    </Button>
                ))}
            </div>
        </div>
    );
}
