import Base from "./Base";

/**
 * @typedef {import("../index").MessageMedia} MessageMedia
 * @typedef {import("../index").MessageSendOptions} MessageSendOptions
 */

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

        return super._patch(data);
    }

    async open() {
        return await this.app.openChat(this.id._serialized);
    }

    /**
     * Send a message to this chat
     * @param {string|MessageMedia} content
     * @param {MessageSendOptions?} options
     * @returns
     */
    async sendMessage(content, options) {
        return this.app.sendMessage(this.id._serialized, content, options);
    }

    /**
     * Returns the Contact that corresponds to this Chat.
     * @returns
     */
    async getContact() {
        return await this.app.findContact(this.id._serialized);
    }
}
