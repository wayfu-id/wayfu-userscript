import App from "../App";

export type ModalType = "alert" | "confirm" | "report" | "error";
export interface ReportData {
    success: number;
    fail: number;
    error: number;
    onExportFail?: () => void;
    onExportAll?: () => void;
}

export interface ModalItem {
    id: number;
    type: ModalType;
    title: string;
    message?: string;
    report?: ReportData;
    resolve?: (value: boolean) => void;
}

type BaseModal<T extends ModalType> = {
    type?: T;
    title: string;
    message: string;
};

type AlertModal = BaseModal<"alert">;

type ErrorModal = BaseModal<"error">;

type ConfirmModal = {
    resolve: (value: boolean) => void;
} & BaseModal<"confirm">;

type ReportModal = ReportData & {
    title?: string;
} & BaseModal<"report">;

export type ModalEventMap = {
    "modal:alert": { payload: AlertModal; return: void };
    "modal:confirm": { payload: ConfirmModal; return: void };
    "modal:report": { payload: ReportModal; return: void };
    "modal:error": { payload: ErrorModal; return: void };
};

export function registerModalEvents(app: App) {}
