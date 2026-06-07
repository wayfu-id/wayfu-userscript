import { useApp } from "../../context/AppContext";
import { handleOnChange } from "../../utilities";
import { InputSelect } from "../../components/Index";
import React, { useState, useEffect } from "react";

import type { Setting } from "../../context/Constans";

export default function SelectInput({ setting }: { setting: Setting<"select"> }) {
    let { id, label, items, value, onChange } = setting;

    const app = useApp();
    const [selected, setSelected] = useState(value);
    const onSelect = handleOnChange({ onChange, callback: setSelected });

    useEffect(() => {
        const onRevert = (d: { key: string; value: any }) => {
            if (d.key === setting.id) setSelected(d.value);
        };
        app.on("ui:revert", onRevert);
        return () => app.remove("ui:revert", onRevert);
    }, [app, setting.id]);

    items = items.map((i) => {
        i.selected = i.key == selected;
        return i;
    });

    return <InputSelect id={id} items={items} title={label} onChange={onSelect} />;
}
