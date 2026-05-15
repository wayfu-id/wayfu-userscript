// import type React from "react";
import { BlastButton, Icons } from "./components/Index.tsx";
import {
    Footer,
    Header,
    MainButton,
    NavBar,
    MessageTab,
    AttachmentTab,
    SettingTab,
    TabContent,
} from "./fragments/Index.tsx";
import React, { useState, useRef, useEffect } from "react";

// const { useState, useRef, useEffect } = unsafeWindow.require("React");

// ── Keywords for chip row ─────────────────────────────────────────────────────
const KEYWORDS = [
    { label: "NAMA", type: "normal" },
    { label: "F_NAMA", type: "normal" },
    { label: "PHONE", type: "normal" },
    { label: "DATA_1", type: "data" },
    { label: "DATA_2", type: "data" },
    { label: "DATA_3", type: "data" },
];

// ════════════════════════════════════════════════════════════════════════════
export default function WayFuUI({ style }) {
    const [theme, setTheme] = useState(style ?? "light");
    const [open, setOpen] = useState(true);
    const [tab, setTab] = useState("attach");

    const rootRef = useRef(null);
    useEffect(() => {
        if (rootRef.current) rootRef.current.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <div ref={rootRef} data-theme={theme}>
            <div className="wf-main relative">
                <MainButton open={open} setOpen={setOpen} />

                <div className={`wf-panel${open ? " visible" : " hidden"}`}>
                    {open && (
                        <>
                            <Header open={open} setOpen={setOpen} theme={theme} setTheme={setTheme} />
                            <NavBar tab={tab} setTab={setTab} />
                            <TabContent tab={tab} />
                            <Footer />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
