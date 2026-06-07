import { BlastButton } from "../components/Index";
import { MessageTab, AttachmentTab, SettingTab } from "./Index";
import React from "react";

export default function TabContent({ tab, setOpen }: { tab: string; setOpen: () => void }) {
    // const [previewMode, setPreviewMode] = useState(false);
    return (
        <div className="wf-tab-content">
            <div className="wf-tab-pane">
                {tab == "msg" && <MessageTab />}
                {tab == "attach" && <AttachmentTab />}
                {tab == "settings" && <SettingTab />}
                {(tab == "msg" || tab == "attach") && <BlastButton setOpen={setOpen} />}
            </div>
        </div>
    );
}
