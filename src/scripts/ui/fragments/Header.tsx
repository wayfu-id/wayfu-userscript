import { Icons, Button } from "../components/Index";
import type { MainPanelProps } from "../Main";
import React from "react";

export default function Header({ open, setOpen, theme, setTheme, app }: MainPanelProps) {
    const appInfo = app ? app.appInfo : undefined;
    const name = appInfo ? appInfo.name : "WayFu - Easy Follow Up";
    const version = appInfo ? appInfo.version : "v5.0.0";

    return (
        <div className="wf-panel-header">
            <div className="wf-panel-brand">
                <div className="wf-panel-logo-wrap">
                    <Icons.Logo theme={theme} />
                </div>
                <div>
                    <div className="wf-panel-title">{name}</div>
                    <div className="wf-panel-version">{version}</div>
                </div>
            </div>
            <div className="wf-panel-actions">
                <Button
                    className={`wf-panel-action-btn${theme === "dark" ? " active" : ""}`}
                    onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                    title="Toggle theme">
                    {theme === "dark" ? <Icons.Sun /> : <Icons.Moon />}
                </Button>
                <Button className="wf-panel-action-btn" onClick={() => setOpen(false)} title="Close">
                    <Icons.Close size={16} />
                </Button>
            </div>
        </div>
    );
}
