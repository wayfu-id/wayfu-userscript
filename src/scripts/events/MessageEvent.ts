import App from "../App";

import type { rowData } from "../structures/FileRecipient";

type KindOfProduct = WAPI.Product | WA.ProductModel | string;

export type MessageEventMap = {
    "message:attach": { payload: File | null; return: void };
    "message:attach_product": { payload: KindOfProduct | null; return: void };
    "message:reset_data": { payload: void; return: void };
    "message:send_text": { payload: void; return: boolean };
    "message:send_media": { payload: void; return: boolean };
    "message:send_product": { payload: void; return: boolean };
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

    app.on("message:reset_data", () => {
        app.Message.resetData();
    });

    app.on("message:set_data", (data) => {
        app.Message.setData(data);
    });

    app.on("message:attach_product", async (attachment: KindOfProduct | null) => {
        const { Message } = app;

        if (attachment === null) {
            Message.setAttachment(undefined);
            return;
        }

        try {
            const { WAPI } = app,
                { Product } = WAPI.ModelClass;

            // already a full Product model — use directly
            if (attachment instanceof Product) {
                Message.setAttachment(attachment);
                return;
            }

            // string id or partial product — resolve full model
            const id = typeof attachment === "string" ? attachment : attachment.id;

            if (!WAPI.BusinessUtils.ProductModel.isIdType(id)) {
                throw new Error("Invalid product id type.");
            }

            const product = await WAPI.findProduct(id);
            if (!product) throw new Error("Product not found.");

            Message.setAttachment(product);
        } catch (err) {
            console.error("[message:attach_product]", err);
            app.trigger("modal:alert", {
                type: "error",
                title: "Produk tidak ditemukan",
                message: "Gagal memuat produk. Silahkan coba lagi.",
            });
        }
    });

    app.on("message:attach", (file: File | null) => {
        const { Message, Settings } = app;
        Message.imageFile = file ?? undefined;

        if (file) {
            app.trigger("setting:sets", {
                hasAttach: true,
                attachFile: file,
            });
        } else {
            app.trigger("setting:sets", {
                hasAttach: false,
                attachFile: null,
            });
        }
    });

    app.on("message:send_text", async () => {
        const { WAPI, Message } = app,
            { phone, value } = Message;

        try {
            const result = await WAPI.inputAndSendTextMsg(phone, value);
            return !!result;
        } catch (e) {
            return false;
        }
    });

    app.on("message:send_media", async () => {
        const { Settings, WAPI, Message } = app,
            { useCaption, imageQuality } = Settings;

        let { caption, value, phone, imageFile } = Message;

        caption = useCaption === "caption" ? caption : value;

        if (!imageFile) return false;
        try {
            const [_, result] = await WAPI.sendAdvMessage(phone, "", {
                media: imageFile,
                quality: imageQuality,
                caption,
            });

            return result?.messageSendResult === "OK";
        } catch (e) {
            return false;
        }
    });

    app.on("message:send_product", async () => {
        const { Message } = app;

        if (!Message.product) return false;
        try {
            const [_, result] = await Message.product.sendToChat(Message.phone);
            return result?.messageSendResult === "OK";
        } catch (e) {
            return false;
        }
    });
}
