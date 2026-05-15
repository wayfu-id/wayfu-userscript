import React, { useState } from "react";
interface RangeProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function InputRange({ min, max, step, defaultValue, title, id }: RangeProps) {
    const [rangeValue, setrangeValue] = useState(defaultValue);

    let handleOnChange: React.ChangeEventHandler<HTMLInputElement, HTMLInputElement> = (e) => {
        setrangeValue(e.target.value);
    };

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
                value={rangeValue}
                onChange={handleOnChange}
            />
            <span className="wf-setting-output">{rangeValue}</span>
        </div>
    );
}
