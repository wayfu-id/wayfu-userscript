import Base from "./Base";

/**
 * @type {import("../index").Message}
 */
export default class Message extends Base {
    constructor(app, data) {
        super(app);

        if (data) this._patch(data);
    }
    _patch(data) {
        this._data = data;

        /**
         * ACK status for the message
         */
        this.ack = data.ack;

        /**
         * MediaKey that represents the sticker 'ID'
         */
        this.mediaKey = data.mediaKey;

        /**
         * ID that represents the message
         */
        this.id = data.id;

        /**
         * Indicates if the message has media available for download
         */
        this.hasMedia = Boolean(data.mediaKey && data.directPath);

        /**
         * Message content
         */
        this.body = this.hasMedia ? data.caption || "" : data.body || "";

        /**
         * Message type
         */
        this.type = data.type;

        /**
         * Unix timestamp for when the message was created
         */
        this.timestamp = data.t;

        /**
         * ID for the Chat that this message was sent to, except if the message was sent by the current user.
         */
        this.from =
            typeof data.from === "object" && data.from !== null
                ? data.from._serialized
                : data.from;

        /**
         * ID for who this message is for.
         *
         * If the message is sent by the current user, it will be the Chat to which the message is being sent.
         * If the message is sent by another user, it will be the ID for the current user.
         */
        this.to =
            typeof data.to === "object" && data.to !== null
                ? data.to._serialized
                : data.to;

        /**
         * Indicates if the message was sent by the current user
         */
        this.fromMe = data.id.fromMe;

        /**
         * If the message was sent to a group, this field will contain the user that sent the message.
         */
        this.author =
            typeof data.author === "object" && data.author !== null
                ? data.author._serialized
                : data.author;

        /**
         * Links included in the message.
         */
        this.links = data.links;

        return super._patch(data);
    }

    get rawData() {
        return this._data;
    }

    _getChatId() {
        return this.fromMe ? this.to : this.from;
    }

    /**
     * Returns the Chat this message was sent in
     * @returns
     */
    async getChat() {
        return await this.app.findChat(this._getChatId());
    }

    /**
     * Returns the Contact this message was sent from
     * @returns
     */
    async getContact() {
        return await this.app.findContact(this.author || this.from);
    }
}
