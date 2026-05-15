import App from "../../App";
import { socials } from "../context/Constans";
import { Button } from "../components/Index";
import React from "react";

export default function Footer({ app }: { app?: App }) {
    const appInfo = app ? app.appInfo : undefined;
    const author = appInfo ? appInfo.author : "Rizal Nurhidayat";
    const waVersion = app && app.WAPI ? app.WAPI.WA_VERSION : "WA_VERSION";

    return (
        <div className="wf-panel-footer">
            <div className="wf-footer-info">
                <div className="flex items-center gap-4">
                    <div className="wf-status-dot" />
                    <span className="text-(--green) text-10 font-semibold">6 penerima dimuat</span>
                </div>
                {`© ${author} · WA: ${waVersion}`}
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
