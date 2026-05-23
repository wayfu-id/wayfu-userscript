import App from "../App";
import { Header, Footer, MainButton, NavBar, TabContent } from "./fragments/Index";
import React, { useState, useRef, useEffect } from "react";

import type { AppEventMap } from "../events";
import type { TabDetail } from "./context/Constans";

type Handler<T> = T extends void ? () => void : (data: T) => void;

export interface MainButtonProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    app?: App;
}

export interface MainPanelProps extends MainButtonProps {
    theme: "dark" | "light";
    setTheme: () => void;
    app?: App;
    rootRef?: React.RefObject<HTMLDivElement | null>;
}

export interface AppPanelProps {
    app?: App;
    style?: "dark" | "light";
}

function MainPanel({ open, setOpen, theme, setTheme, app }: MainPanelProps) {
    const appSetting = app ? app.Settings : undefined;
    const activeTab = appSetting ? appSetting.activeTab : "msg";
    const [tab, setTab] = useState(activeTab);

    let handleSetTab = (tab: TabDetail) => {
        setTab(tab.id);
        app?.trigger("setting:sets", { activeTab: tab.id });
    };

    return (
        <div className={`wf-panel${open ? " visible" : " hidden"}`}>
            {open && (
                <>
                    <Header open={open} setOpen={setOpen} theme={theme} setTheme={setTheme} app={app} />
                    <NavBar tab={tab} setTab={handleSetTab} />
                    <TabContent tab={tab} app={app} />
                    <Footer app={app} />
                </>
            )}
        </div>
    );
}

export function useAppEvent<K extends keyof AppEventMap>(
    app: App | undefined,
    event: K,
    callback: Handler<AppEventMap[K]["payload"]>,
) {
    useEffect(() => {
        if (!app) return;
        app.on(event, callback);
        return () => app.remove(event, callback); // cleanup on unmount
    }, [app, event]);
}

export default function Main({ style, app }: AppPanelProps) {
    const appSetting = app ? app.Settings : undefined;
    const isOpen = appSetting ? appSetting.openPanel : false;
    const [theme, setTheme] = useState(style ?? "light");
    const [open, setOpen] = useState(isOpen);
    const rootRef = useRef<HTMLDivElement>(null);

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
        <div ref={rootRef} data-theme={theme}>
            <div className="wf-main relative">
                <MainButton open={open} setOpen={handleOpenPanel} app={app} />
                <MainPanel open={open} setOpen={handleOpenPanel} theme={theme} setTheme={handleChangeTheme} app={app} />
            </div>
        </div>
    );
}
