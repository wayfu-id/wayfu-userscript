// src/events/RecipientEvent.ts
import App from "../App";
import DOM from "@wayfu/wayfu-dom";
import { FileRecipient, MyArray } from "../structures/index";
import { monthIndex } from "../utilities/DocumentUtils";
import { createFilteredObject } from "../utilities/index";

import type { fullData, rowData } from "../structures/FileRecipient";
export type RecipientEventMap = {
    "recipient:export": { payload: { data: Array<String[]>; title: string }; return: void };
    "recipient:load": { payload: File; return: FileRecipient | null };
    "recipient:loaded": { payload: FileRecipient; return: void };
    "recipient:reload": { payload: void; return: void };
    "recipient:reset": { payload: void; return: void };
};

export function registerRecipientEvents(app: App) {
    app.on("recipient:export", ({ data, title }) => {
        const { XLSX, Settings } = app,
            { exportType } = Settings;

        if (exportType === "csv") {
            let { fileName, fileUrl } = FileRecipient.createFile(title, data as fullData),
                element = DOM.create({ tag: "a", href: fileUrl, download: `${fileName}` });
            return element.first?.click();
        }

        return XLSX.write(data, title);
    });
    app.on("recipient:load", async (file: File) => {
        let { Settings, Queue } = app,
            opt = createFilteredObject(Settings, ["monthIdx", "splitter"]),
            result: FileRecipient | null = null;

        try {
            result = await FileRecipient.readFile(file, opt);
        } catch (err) {
            app.trigger("modal:alert", {
                title: "Opps! File tidak valid",
                type: "error",
                message:
                    "File penerima tidak valid. Pastikan file yang Anda unggah adalah file *CSV* atau *XLSX* yang benar.",
            });
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

            Queue.setData(data);
            app.trigger("recipient:loaded", result);
            app.trigger("setting:sets", { splitter, isFormat, monthIdx });
            app.trigger("message:set_data", data.first!);
        }
        app.Recipient = result;
        return result;
    });

    app.on("recipient:reload", () => {
        if (app.Recipient && app.Recipient.data.length > 0) {
            app.Queue.setData(app.Recipient.data);
        }
    });

    app.on("recipient:reset", () => {
        app.Recipient = null;
        app.trigger("message:reset_data");
        app.Queue.reset();
    });
}
