// import App from "../App";
import { MainButton, MainPanel } from "./fragments/Index";
import { useApp } from "./context/AppContext";
import React, { useState, useRef, useEffect } from "react";

export interface MainButtonProps {
    open: boolean;
    setOpen: () => void;
}

export interface AppPanelProps {
    // app?: App;
    style?: "dark" | "light";
}

export default function Main({ style }: AppPanelProps) {
    const app = useApp();
    const appSetting = app ? app.Settings : undefined;
    const isOpen = appSetting ? appSetting.openPanel : false;
    const [theme, setTheme] = useState(appSetting?.theme ?? "light");
    const [open, setOpen] = useState(isOpen);
    const rootRef = useRef<HTMLElement>(app.Host);

    let handleOpenPanel = () => {
        let value = !open;
        app?.trigger("setting:sets", { openPanel: value });
        setOpen(value);
    };

    let handleChangeTheme = () => {
        let value: "dark" | "light" = theme === "dark" ? "light" : "dark";
        app?.trigger("setting:sets", { theme: value });
        setTheme(value);
    };

    useEffect(() => {
        let { current } = rootRef;
        if (current) current.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <div id="wayfu-root">
            <div className="wf-main relative">
                <MainButton open={open} setOpen={handleOpenPanel} />
                <MainPanel open={open} setOpen={handleOpenPanel} theme={theme} setTheme={handleChangeTheme} />
            </div>
        </div>
    );
}
