import App from "../App";
import { ReactNode } from "react";
import { dateFormat } from "../utilities/index";

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

type ErrorModal = BaseModal<"error">;

type ConfirmModal = {
    resolve: (value: boolean) => void;
} & BaseModal<ModalType>;

type ReportModal = ReportData & {
    title?: string;
} & BaseModal<"report">;

export type ModalEventMap = {
    "modal:alert": { payload: BaseModal<ModalType>; return: void };
    "modal:confirm": { payload: ConfirmModal; return: void };
    "modal:report": { payload: ReportModal; return: void };
    "modal:error": { payload: ErrorModal; return: void };
};

export function registerModalEvents(app: App) {
    const greetingsForPremiumUsers = () => {
        const { Client, isUiReady } = app,
            { UserData } = Client;

        if (!UserData || !isUiReady) return;
        if (Client.canUseFeature()) {
            let title = `Halo kak ${UserData.name}`,
                message = `Selamat menggunakan fitur Pengguna Premium.\nMasa aktif Kakak berakhir hari ${dateFormat(UserData.end!)} ya...`;
            app.trigger("modal:alert", { title, message });
        }
    };

    app.on("blast:start", async ({ resolve }) => {
        const isValidate = await new Promise<boolean>((resolve) => {
            app.trigger("blast:validate", { resolve });
        });
        if (isValidate) {
            app.trigger("blast:started");
            resolve(true);
            return;
        }
        resolve(false);
        return;
    });

    app.on("ui:ready", greetingsForPremiumUsers);
    app.on("user:save", greetingsForPremiumUsers);
}
