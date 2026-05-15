import React from "react";
interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function ToggleSwitch({ checked, onChange }: ToggleProps) {
    return (
        <label className="wf-toggle-switch">
            {/** Empty */}
            <input type="checkbox" checked={checked} onChange={onChange} />
            <div className="wf-toggle-track" />
            <div className="wf-toggle-thumb translate-x-16" />
        </label>
    );
}
