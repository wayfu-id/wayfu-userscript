import { useApp } from "../context/AppContext";
import { Icons, Button } from "../components/Index";
import type { MainPanelProps } from "./MainPanel";
import React from "react";

export default function Header({ open, setOpen, theme, setTheme }: MainPanelProps) {
    const app = useApp();
    const appInfo = app ? app.appInfo : undefined;
    const name = appInfo ? appInfo.name : "WayFu - Easy Follow Up";
    const version = appInfo ? appInfo.version : "5.0.0";
    const waVersion = app && app.WAPI ? app.WAPI.WA_VERSION : "22.0.22222";

    return (
        <div className="wf-panel-header">
            <div className="wf-panel-brand">
                <div className="wf-panel-logo-wrap">
                    <Icons.Logo theme={theme} />
                </div>
                <div>
                    <div className="wf-panel-title">{name}</div>
                    <div className="wf-panel-version">
                        APP: v{version} · WA: v{waVersion}
                    </div>
                </div>
            </div>
            <div className="wf-panel-actions">
                <Button
                    className={`wf-panel-action-btn${theme === "dark" ? " active" : ""}`}
                    onClick={setTheme}
                    title="Toggle theme">
                    {theme === "dark" ? <Icons.Sun /> : <Icons.Moon />}
                </Button>
                <Button className="wf-panel-action-btn" onClick={setOpen} title="Close">
                    <Icons.Close size={16} />
                </Button>
            </div>
        </div>
    );
}
