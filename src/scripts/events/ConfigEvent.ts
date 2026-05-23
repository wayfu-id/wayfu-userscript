import App from "../App";
import { Settings } from "../structures/index";

export type SettingEventMap = {
    "setting:load": { payload: void; return: void };
    "setting:save": { payload: void; return: void };
    "setting:sets": { payload: { [k: keyof Settings]: any }; return: void };
};

export function registerConfigEvent(app: App) {
    app.on("setting:load", () => {
        const { Manager, Settings } = app;
        app.trigger("setting:sets", Manager.getValue(Settings.key));
    });

    app.on("setting:save", () => {
        app.trigger("save_value", app.Settings.save());
    });

    app.on("setting:sets", (props: { [k: keyof Settings]: any }) => {
        app.Settings.setOptions(props);
        app.trigger("setting:save");
        app.trigger("message:update_setting");
    });
}
