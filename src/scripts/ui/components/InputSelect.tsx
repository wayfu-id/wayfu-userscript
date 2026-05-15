import React from "react";
interface InputSelectProps extends React.InputHTMLAttributes<HTMLInputElement> {
    items: OptionItem[];
}

export interface OptionItem {
    key: string;
    label: string;
    selected?: boolean;
}

export default function InputSelect({ id, items, title }: InputSelectProps) {
    return (
        <select id={id} className="wf-setting-select" name={title} title={title}>
            {items.map((e) => (
                <option value={e.key} selected={e.selected}>
                    {e.label}
                </option>
            ))}
        </select>
    );
}
