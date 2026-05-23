// src/events/RecipientEvent.ts
import App from "../App";
import { FileRecipient } from "../structures/index";
import { monthIndex } from "../utilities/DocumentUtils";
import { createFilteredObject } from "../utilities/index";

export type RecipientEventMap = {
    "recipient:load": { payload: File; return: null | undefined };
    "recipient:reset": { payload: void; return: void };
};

export function registerRecipientEvents(app: App) {
    app.on("recipient:load", async (file: File) => {
        let { Settings } = app,
            opt = createFilteredObject(Settings, ["monthIdx", "splitter"]),
            result: FileRecipient | null = null;

        try {
            result = await FileRecipient.readFile(file, opt);
        } catch (err) {
            console.error("[ERROR] File .xlsx penerima tidak valid!", err);
            return null;
        }

        if (result) {
            let { dateFormat, monthIdx } = Settings,
                { data, dateCollection, options } = result;

            let splitter = options.splitter,
                isFormat = false;

            if (dateFormat === "auto") {
                if (!dateCollection.isEmpty) {
                    monthIdx = monthIndex(dateCollection);
                    isFormat = monthIdx == 2;
                }
            } else {
                monthIdx = dateFormat;
            }

            app.trigger("setting:sets", { splitter, isFormat, monthIdx });
            app.Queue.setData(data);
        }
        app.Recipiemt = result;
        app.trigger("ui:update");
    });

    app.on("recipient:reset", () => {
        app.Recipiemt = null;
        app.Queue.reset();
        app.trigger("ui:update");
    });
}
