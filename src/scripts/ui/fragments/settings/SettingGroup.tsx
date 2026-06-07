import React from "react";
import SettingRow from "./SettingRow";

import type { AnySetting } from "../../context/Constans";

export default function SettingGroup({ label, items }: { label: string; items: AnySetting[] }) {
    return (
        <div className="wf-setting-group">
            <div className="wf-settings-section-label">{label}</div>
            {items.map((setting) => (
                <SettingRow key={setting.label} setting={setting} />
            ))}
        </div>
    );
}
