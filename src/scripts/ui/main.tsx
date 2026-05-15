import App from "../App";
import { useState, useRef, useEffect } from "react";
import { Header, Footer, MainButton, NavBar, TabContent } from "./fragments/Index";

export interface MainButtonProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface MainPanelProps extends MainButtonProps {
    theme: "dark" | "light";
    setTheme: React.Dispatch<React.SetStateAction<"dark" | "light">>;
    app?: App;
}

function MainPanel({ open, setOpen, theme, setTheme, app }: MainPanelProps) {
    const [tab, setTab] = useState("msg");

    return (
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
    );
}

export default function Main({ app, style }: { app?: App; style: "dark" | "light" }) {
    style = app ? app.Settings.theme : style;
    const [theme, setTheme] = useState(style ?? "light");
    const [open, setOpen] = useState(true);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let { current } = rootRef;
        if (current) current.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <div ref={rootRef} data-theme={theme}>
            <div className="wf-main relative">
                <MainButton open={open} setOpen={setOpen} />
                <MainPanel open={open} setOpen={setOpen} theme={theme} setTheme={setTheme} app={app} />
            </div>
        </div>
    );
}
