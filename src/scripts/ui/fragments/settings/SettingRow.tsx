import RangeInput from "./RangeInput";
import SelectInput from "./SelectInput";
import React from "react";

import type { Setting, AnySetting } from "../../context/Constans";

const BetaBadge = () => <span className="wf-beta-badge">Beta</span>;

export default function SettingRow({ setting }: { setting: AnySetting }) {
    const isRangeType = (type: string) => type === "range";

    let { label, icon, beta, type } = setting;
    return (
        <div className="wf-setting-row">
            <span className="wf-setting-label">
                {icon} {label} {beta && BetaBadge()}
            </span>

            {/* TypeScript narrows automatically after the guard */}
            {isRangeType(type) ? (
                <RangeInput setting={setting as Setting<"range">} />
            ) : (
                <SelectInput setting={setting as Setting<"select">} />
            )}
        </div>
    );
}
