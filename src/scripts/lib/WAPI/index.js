import { getStore } from "./utils/Loader";
import { ChatFactory, ContactFactory } from "./factories";
import {
    Chat,
    Contact,
    GroupChat,
    Message,
    MessageMedia,
    MediaHandler,
} from "./structures/";

const WAPI = (function () {
    const _token = Symbol();

    return class WAPI {
        constructor(token, store) {
            if (_token !== token) {
                throw new TypeError("WAPI is not constructable. Use WAPI.init().");
            }

            return this.initialize(store);
        }

        initialize(store) {
            Object.assign(WAPI.prototype, { Store: store });
            this.MediaHandler = MediaHandler.init(this);

            return this;
        }

        myContact() {
            let { Store: WAPI } = this;
            return new Contact(this, WAPI.Contact.getMeContact());
        }

        /**
         * Find a Chat from given phone id
         * @param {string} id `******@c.us`
         * @returns
         */
        async findChat(id) {
            let { Store: WAPI } = this,
                chat = await WAPI.Chat.find(id);

            return ChatFactory.create(this, chat);
        }

        /**
         * Open or Start Chat from given phone id
         * @param {string} id `******@c.us`
         * @returns
         */
        async openChat(id) {
            let { Store: WAPI } = this;
            if (typeof id === "string") {
                id = WAPI.WidFactory.createWid(id);
            }
            let chat = await this.findChat(id);

            if (!chat) {
                chat = ((id) => {
                    let [c] = WAPI.Chat.add(
                        { createLocally: true, id: id },
                        { merge: true }
                    );
                    return c;
                })(id);
            }
            await chat.open();
        }

        /**
         * Find a Contact from given phone id
         * @param {string} id `******@c.us`
         * @returns
         */
        async findContact(id) {
            let { Store: WAPI } = this,
                contact = await WAPI.Contact.find(id);

            return ContactFactory.create(this, contact);
        }

        async _sendMessage(chat, content, options = {}) {
            let { Store: WAPI, MediaHandler: Medias } = this;

            let attOptions = {};
            if (options.attachment) {
                attOptions = await Medias.processMediaData(options.attachment);
                content = attOptions.preview;
                delete options.attachment;
            }

            const meUser = WAPI.Contact.getMeContact();
            const newMsgKey = WAPI.MsgKey.newId();
            const newMsgId = new WAPI.MsgKey({
                from: meUser,
                to: chat.id,
                id: newMsgKey,
                participant: undefined,
                selfDir: "out",
            });

            const extraOptions = options.extraOptions || {};
            delete options.extraOptions;

            const ephemeralFields = WAPI.EphemeralFields.getEphemeralFields(chat);

            const message = {
                ...options,
                id: newMsgId,
                ack: 0,
                body: content,
                from: meUser,
                to: chat.id,
                local: true,
                self: "out",
                t: parseInt(new Date().getTime() / 1000),
                isNewMsg: true,
                type: "chat",
                ...ephemeralFields,
                ...attOptions,
                ...(attOptions.toJSON ? attOptions.toJSON() : {}),
                ...extraOptions,
            };

            await WAPI.addAndSendMsgToChat(chat, message);
            return WAPI.Msg.get(newMsgId._serialized);
        }

        /**
         * @param {Window} target
         * @returns
         */
        static init(target) {
            const webpackKey = ((w) => {
                for (let key of Object.keys(w)) {
                    if (/[^|]?webpack./g.test(key)) return key;
                }
                return null;
            })(target);

            if (!WAPI.prototype.Store || !WAPI.prototype.Store.Msg) {
                if (webpackKey && typeof target[webpackKey] === "object") {
                    let mID = `parasite${Date.now()}`,
                        modStore = {};

                    target[webpackKey].push([[mID], {}, (o) => getStore(o, modStore)]);
                    return new WAPI(_token, modStore);
                } else {
                    console.error("Failed to load WAPI Module!");
                }
            }
        }
    };
})();

export default WAPI;
