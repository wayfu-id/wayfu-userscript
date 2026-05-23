import { Icons } from "../../components/Index";
import { accentClass } from ".";
import React from "react";

import type { ModalType } from "../ModalStack";

export default function ModalIcon({ type }: { type: ModalType }) {
    const className = `wf-modal-icon ${accentClass(type, true)}`;
    const IconSpan = ((t) => {
        switch (t) {
            case "error":
                return <Icons.Warning />;
            case "confirm":
                return <Icons.Pause />;
            case "report":
                return <Icons.Chart />;
            default:
                return <Icons.Info />;
        }
    })(type);
    return <span className={className}>{IconSpan}</span>;
}
