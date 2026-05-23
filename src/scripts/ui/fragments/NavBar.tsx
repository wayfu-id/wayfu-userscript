import { Button } from "../components/Index";
import { tabs } from "../context/Constans";
import React from "react";

import type { TabDetail } from "../context/Constans";

interface NavProps {
    tab: string;
    setTab: (tab: TabDetail) => void;
}

export default function NavBar({ tab, setTab }: NavProps) {
    return (
        <>
            <div className="wf-tab-nav">
                {tabs.map((t) => (
                    <Button
                        key={t.id}
                        className={`wf-tab-btn ${tab == t.id ? "active" : ""}`}
                        onClick={() => setTab(t)}
                        type="button">
                        {t.icon} {t.label}
                    </Button>
                ))}
            </div>
            <div className="wf-tab-divider" />
        </>
    );
}
