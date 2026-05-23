import App from "../../App";
import { BlastButton } from "../components/Index";
import { MessageTab, AttachmentTab, SettingTab } from "./Index";
import React from "react";

export default function TabContent({ tab, app }: { tab: string; app?: App }) {
    return (
        <div className="wf-tab-content">
            <div className="wf-tab-pane">
                {tab == "msg" && <MessageTab app={app} />}
                {tab == "attach" && <AttachmentTab app={app} />}
                {tab == "settings" && <SettingTab app={app} />}
                {(tab == "msg" || tab == "attach") && <BlastButton />}
            </div>
        </div>
    );
}
