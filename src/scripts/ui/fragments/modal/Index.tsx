import AlertCard from "./AlertModal";
import ConfirmCard from "./ConfirmCard";
import ModalIcon from "./ModalIcon";
import ReportCard from "./ReportCard";
import type { ModalType } from "../ModalStack";

export function accentClass(type: ModalType, icon?: boolean) {
    if (!!icon) icon = false;
    const elementClass = icon ? "icon-" : "card-";

    if (type === "error") return `wf-modal-${elementClass}-danger`;
    if (type === "confirm") return `wf-modal-${elementClass}-warning`;
    if (type === "report") return `wf-modal-${elementClass}-success`;
    return `wf-modal-${elementClass}-info`;
}

export { AlertCard, ConfirmCard, ModalIcon, ReportCard };
