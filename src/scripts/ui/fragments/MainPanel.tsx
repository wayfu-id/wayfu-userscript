import { useApp } from "../context/AppContext";
import { Header, Footer, NavBar, TabContent } from "./Index";
import React, { useState } from "react";

import type { MainButtonProps } from "../Main";
import type { TabDetail } from "../context/Constans";

export interface MainPanelProps extends MainButtonProps {
    theme: "dark" | "light";
    setTheme: () => void;
    rootRef?: React.RefObject<HTMLDivElement | null>;
}

export default function MainPanel({ open, setOpen, theme, setTheme }: MainPanelProps) {
    const app = useApp();
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
                    <Header open={open} setOpen={setOpen} theme={theme} setTheme={setTheme} />
                    <NavBar tab={tab} setTab={handleSetTab} />
                    <TabContent tab={tab} setOpen={setOpen} />
                    <Footer />
                </>
            )}
        </div>
    );
}
