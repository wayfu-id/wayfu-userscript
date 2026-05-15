import App from "../../App";
import { BlastButton } from "../components/Index";
import { MessageTab, AttachmentTab, SettingTab } from "./Index";
import React from "react";

export default function TabContent({ tab, app }: { tab: string; app?: App }) {
    const text =
        "Halo *NAMA*, selamat menggunakan fitur premium *WayFu*. 🎉\n\nAnda bisa menggunakan pemformatan WhatsApp seperti *tebal*, _miring_, dan ~coret~.\n\nSalam hangat,";

    return (
        <div className="wf-tab-content">
            <div className="wf-tab-pane">
                {tab == "msg" && <MessageTab text={text} />}
                {tab == "attach" && <AttachmentTab />}
                {tab == "settings" && <SettingTab />}
                {(tab == "msg" || tab == "attach") && <BlastButton />}
            </div>
        </div>
    );
}
