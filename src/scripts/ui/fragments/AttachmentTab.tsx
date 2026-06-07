import { FileAttachment, CaptionArea } from "./attachment/Index";
import { ProductPicker } from "./products/Index";
import { useApp } from "../context/AppContext";
import { useAppEvent } from "../hooks/AppHooks";
import React, { useState } from "react";

export default function AttachmentTab() {
    const app = useApp();

    const [attachType, setAttachType] = useState(() => app.Settings.attachType),
        [selected, setSelected] = useState<WAPI.Product | undefined>(app.Message.product);

    useAppEvent("setting:sets", () => {
        setAttachType(app.Settings.attachType);
    });

    function handleSelect(product: WAPI.Product | null) {
        setSelected(product ?? undefined);
        app.trigger("message:attach_product", product);
    }

    return (
        <>
            {attachType === "file" && <FileAttachment />}
            {attachType === "product" && <ProductPicker selected={selected} onSelect={handleSelect} />}
            <CaptionArea />
        </>
    );
}
