import type { MessageEventMap } from "./MessageEvent";
import type { ModalEventMap } from "./ModalEvents";
import type { SettingEventMap } from "./ConfigEvent";
import type { RecipientEventMap } from "./RecipientEvent";
import type { CoreEventMap } from "./CoreEvent";
import type { UserEventMap } from "./UserEvents";

export type AppEventMap = CoreEventMap &
    SettingEventMap &
    MessageEventMap &
    ModalEventMap &
    RecipientEventMap &
    UserEventMap;

export * from "./ConfigEvent";
export * from "./CoreEvent";
export * from "./LoggerEvent";
export * from "./MessageEvent";
export * from "./ModalEvents";
export * from "./RecipientEvent";
export * from "./UserEvents";
