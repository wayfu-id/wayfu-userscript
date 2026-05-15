import { Button } from "../components/Index";
import { tabs } from "../context/Constans";
import React from "react";

interface NavProps {
    tab: string;
    setTab: React.Dispatch<React.SetStateAction<string>>;
}

export default function NavBar({ tab, setTab }: NavProps) {
    return (
        <>
            <div className="wf-tab-nav">
                {tabs.map((t) => (
                    <Button
                        key={t.id}
                        className={`wf-tab-btn ${tab == t.id ? "active" : ""}`}
                        onClick={() => setTab(t.id)}
                        type="button">
                        {t.icon} {t.label}
                    </Button>
                ))}
            </div>
            <div className="wf-tab-divider" />
        </>
    );
}
