import Base from "./Base";
/**
 * @type {import("../index").Chat}
 */
export default class Chat extends Base {
    constructor(app, data) {
        super(app);

        if (data) this._patch(data);
    }

    _patch(data) {
        /**
         * ID that represents the chat
         * @type {import("../index").ChatId}
         */
        this.id = data.id;

        /**
         * Title of the chat
         * @type {string}
         */
        this.name = data.formattedTitle;

        /**
         * Indicates if the Chat is a Group Chat
         * @type {boolean}
         */
        this.isGroup = data.isGroup;

        /**
         * Unix timestamp for when the last activity occurred
         * @type {number}
         */
        this.timestamp = data.t;

        /**
         * @type {import("../index").Contact}
         */
        this.contact = data.contact.getContactModel();

        return super._patch(data);
    }

    async open() {
        await this.app.openChat(this.id._serialized);
    }

    /**
     * Send text message
     * @param {string} message
     */
    sendText(message) {
        return this.app.sendMessage(this.id._serialized, message);
    }

    /**
     * Send Image with caption (optional)
     * @param {File} file
     * @param {string?} caption
     */
    sendImage(file, caption = "") {
        return this.app.sendMessage(this.id._serialized, "", { media: file, caption });
    }
}
