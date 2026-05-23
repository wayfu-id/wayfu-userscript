import App from "../App";

import type { rowData } from "../structures/FileRecipient";

type KindOfProduct = WAPI.Product | WA.ProductModel | string;

export type MessageEventMap = {
    "message:attach": { payload: File | null; return: void };
    "message:attach_product": { payload: KindOfProduct | null; return: void };
    "message:send": { payload: rowData; return: void };
    "message:send_text": { payload: any; return: WAPI.Chat | null };
    "message:send_media": { payload: any; return: boolean | undefined };
    "message:set_data": { payload: rowData; return: void };
    "message:update": { payload: { text?: string; caption?: string }; return: void };
    "message:update_setting": { payload: void; return: void };
};

export function registerMessageEvent(app: App) {
    app.on("message:update", ({ text, caption }) => {
        let { inputMessage, inputCaption } = app.Message;

        inputMessage = text ?? inputMessage;
        inputCaption = caption ?? inputCaption;

        app.Message._setProps({ inputMessage, inputCaption }, false);
    });

    app.on("message:update_setting", () => {
        const { Settings } = app;
        app.Message.updateSettings(Settings);
    });

    app.on("message:set_data", (data) => {
        app.Message.setData(data);
    });

    app.on("message:attach_product", async (attachment: KindOfProduct | null) => {
        if (attachment === null) return;
        try {
            const { WAPI, Message } = app,
                { Product } = WAPI.ModelClass;

            let result = null;
            if (attachment instanceof Product) {
                result = attachment;
            } else {
                let id = typeof attachment == "string" ? attachment : attachment.id;
                if (!WAPI.BusinessUtils.ProductModel.isIdType(id)) {
                    console.error("Attachment is not a valid product model.");
                }
                result = await WAPI.findProduct(id);
                if (!result || result === null) {
                    console.error("Product not found for the given attachment ID.");
                }
            }
            result = result !== null ? result : undefined;
            Message.setAttachment(result);
        } catch (err) {
            console.log("Error processing product attachment:", err);
        }
    });

    app.on("message:attach", (file: File | null) => {
        const { Message } = app;

        let imageFile = file !== null ? file : undefined,
            hasImage = !!file;

        Message.setAttachment(imageFile);
        app.trigger("setting:sets", { imageFile, hasImage });
    });

    app.on("message:send", (data) => {
        app.trigger("message:set_data", data);
    });

    app.on("message:send_text", async () => {
        const { WAPI, Message } = app,
            { phone, value } = Message;

        return await WAPI.inputAndSendTextMsg(phone, value);
    });

    app.on("message:send_media", async () => {
        const { Settings, WAPI, Message } = app,
            { useCaption, imageQuality } = Settings;

        let { caption, value, phone, imageFile } = Message;

        caption = useCaption === "caption" ? caption : value;

        if (!imageFile) return;
        const [_, result] = await WAPI.sendAdvMessage(phone, "", {
            media: imageFile,
            quality: imageQuality,
            caption,
        });

        return result?.messageSendResult == "ok";
    });
}
