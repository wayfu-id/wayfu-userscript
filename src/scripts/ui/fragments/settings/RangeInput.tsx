import { handleOnChange } from "../../utilities";
import { InputRange } from "../../components/Index";
import React, { useState } from "react";

import type { Setting } from "../../context/Constans";

export default function RangeInput({ setting }: { setting: Setting<"range"> }) {
    let { id, label, items, value, onChange } = setting;
    let { min, max, step } = items;

    const [rangeValue, setRangeValue] = useState(value);
    const onInput = handleOnChange({ onChange, callback: setRangeValue });
    return <InputRange id={id} min={min} max={max} step={step} value={rangeValue} title={label} onChange={onInput} />;
}
