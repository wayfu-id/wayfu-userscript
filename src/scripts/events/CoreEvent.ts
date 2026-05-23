import App from "../App";

type ReportSummary = { success: number; fail: number; error: number };

export interface BlastState {
    running: boolean;
    index: number;
    total: number;
    phone: string;
    done: boolean;
}

export type CoreEventMap = {
    loads_data: { payload: void; return: void };
    init_value: { payload: { key: string; value: any }; return: void };
    save_value: { payload: { [k: string]: any } | undefined; return: void };
    "blast:start": { payload: void; return: void };
    "blast:progress": { payload: BlastState; return: void };
    "blast:stop": { payload: ReportSummary | void; return: void };
    "blast:done": { payload: ReportSummary | void; return: void };
};

export function registerCoreEvent(app: App) {
    app.on("loads_data", () => {
        const { Manager } = app;
        const keys = ["wayfu-user", "wayfu-options"];
        keys.forEach((key) => {
            let value = Manager.getValue(key);
            app.trigger("init_value", { key, value });
        });
    });

    app.on("init_value", ({ key, value }) => {
        const { Client, Settings } = app;
        if (key.includes("user")) {
        } else {
            Settings._init(value);
        }
    });

    app.on("save_value", (data) => {
        const { Manager } = app;
        Manager.setValue(data);
    });
}
