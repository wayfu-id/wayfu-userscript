import React, { useState } from "react";
interface RangeProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function InputRange({ min, max, step, value, title, id, onChange }: RangeProps) {
    return (
        <div className="flex items-center gap-6">
            <input
                id={id}
                type="range"
                className="wf-setting-slider"
                min={min}
                max={max}
                step={step}
                title={title}
                value={value}
                onChange={onChange}
            />
            <span className="wf-setting-output">{value}</span>
        </div>
    );
}
