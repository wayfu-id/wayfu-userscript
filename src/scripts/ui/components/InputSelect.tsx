import React from "react";
interface InputSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    items: OptionItem[];
}

export interface OptionItem {
    key: string;
    label: string;
    selected?: boolean;
}

export default function InputSelect({ id, items, title, onChange }: InputSelectProps) {
    return (
        <select id={id} className="wf-setting-select" name={title} title={title} onChange={onChange}>
            {items.map((e) => (
                <option value={e.key} selected={e.selected}>
                    {e.label}
                </option>
            ))}
        </select>
    );
}
