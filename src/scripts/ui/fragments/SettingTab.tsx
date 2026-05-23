import App from "../../App";
import { Icons, InputRange, InputSelect } from "../components/Index";
import { Settings } from "../context/Constans";
import type { Setting, AnySetting } from "../context/Constans";
import React, { useState } from "react";

// ── Sub-components ────────────────────────────────────────────────────────────
const BetaBadge = () => <span className="wf-beta-badge">Beta</span>;

function RangeInput({ setting }: { setting: Setting<"range"> }) {
    let { id, label, items, value, onChange } = setting;
    let { min, max, step } = items;

    const [rangeValue, setrangeValue] = useState(value);
    let handleOnChange: React.ChangeEventHandler<HTMLInputElement, HTMLInputElement> = (e) => {
        let { id, value } = e.target;
        if (onChange && typeof onChange == "function") onChange({ [id]: value });
        setrangeValue(e.target.value);
    };
    // setting.items is guaranteed RangeType here — no cast needed
    return (
        <InputRange
            id={id}
            min={min}
            max={max}
            step={step}
            value={rangeValue}
            title={label}
            onChange={handleOnChange}
        />
    );
}

function SelectInput({ setting }: { setting: Setting<"select"> }) {
    let { id, label, items, value, onChange } = setting;

    const [selected, setSelected] = useState(value);
    items = items.map((i) => {
        i.selected = i.key == selected;
        return i;
    });

    let handleOnChange: React.ChangeEventHandler<HTMLSelectElement, HTMLSelectElement> = (e) => {
        let { id, value } = e.target;
        if (onChange && typeof onChange == "function") onChange({ [id]: value });
        setSelected(e.target.value);
    };
    return <InputSelect id={id} items={items} title={label} onChange={handleOnChange} />;
}

// ── Single row component using the type guard ─────────────────────────────────
function SettingRow({ setting }: { setting: AnySetting }) {
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

function SettingGroup({ label, items }: { label: string; items: AnySetting[] }) {
    return (
        <div className="wf-setting-group">
            <div className="wf-settings-section-label">{label}</div>
            {items.map((setting) => (
                <SettingRow key={setting.label} setting={setting} />
            ))}
        </div>
    );
}

export default function SettingTab({ app }: { app?: App }) {
    const appSettings = app ? app.Settings : undefined;

    let handleChanges = (value: { [k: string]: any }) => {
        app?.trigger("setting:sets", value);
    };

    return (
        <>
            <div className="wf-setting-group wf-user-info">
                <div className="wf-settings-section-label">Data Pengguna</div>
                <div className="wf-setting-row">
                    <span className="wf-setting-label">
                        <Icons.User />
                        Tipe Pengguna
                    </span>
                    <span className="wf-setting-output">Oriflame</span>
                </div>
            </div>
            {Object.entries(Settings).map(([groupLabel, items]) => {
                items = items.map((i) => {
                    if (appSettings && appSettings.defaultProp.hasOwnProperty(i.id)) {
                        i.value = appSettings[i.id];
                        i.onChange = handleChanges;
                    }
                    return i;
                });

                return <SettingGroup key={groupLabel} label={groupLabel} items={items} />;
            })}
        </>
    );
}
