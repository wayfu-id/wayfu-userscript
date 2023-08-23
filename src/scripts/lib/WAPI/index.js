import { rgx } from "./utils/Constant";
import { getStore } from "./utils/Loader";
import { ChatFactory, ContactFactory } from "./factories";
import { Chat, Contact } from "./structures";

export default class WAPI {
    constructor(store) {
        return this._init(store);
    }

    /**
     * Delete key and its value from an object
     * @param {string[] | string} keys
     * @param {object?} obj
     * @returns
     */
    _del(keys, obj) {
        obj = obj || this;
        keys = Array.isArray(keys) ? keys : [keys];
        keys.forEach((key) => delete obj[key]);

        return obj;
    }

    /**
     * Initialize store object (Add or remove unused module)
     * @param {any} store
     * @returns
     */
    _init(store) {
        let { WebClasses2, WebClasses3 } = store;
        Object.defineProperty(store, "WebClassesV2", {
            value: { ...WebClasses2, ...WebClasses3 },
            enumerable: true,
        });

        store = this._del(["WebClasses2", "WebClasses3"], store);
        return this._clone(store);
    }

    /**
     * Clone Store object to `WAPI.prototype`.
     * Add and set some `prototype` properties.
     * @param {any} store
     */
    _clone(store) {
        Object.assign(WAPI.prototype, store);

        let app = this,
            { Chat, Cmd, Contact, MediaCollection } = app;

        Object.defineProperties(Chat.modelClass.prototype, {
            getChatModel: {
                value: function getChatModel() {
                    return ChatFactory.create(app, this);
                },
                enumerable: true,
            },
            open: {
                value: async function open() {
                    await Cmd.openChatAt(this);
                },
                enumerable: true,
            },
            close: {
                value: async function close() {
                    if (this.active) await Cmd.closeChat(this);
                },
                enumerable: true,
            },
            sendText: {
                value: async function sendText() {
                    if (!this.active) await this.open();

                    app.SendTextMsgToChat(this, ...arguments);
                },
                enumerable: true,
            },
            sendImage: {
                value: async function sendImage(file, caption = "", ret = false) {
                    if (!this.active) await this.open();

                    return new Promise((done) => {
                        let mc = new MediaCollection(this);
                        mc.processAttachments([{ file: file }, 1], this, 1).then(() => {
                            let [media] = mc.getModelArray();
                            media.sendToChat(this, { caption: caption });
                            done(ret ? this.getChatModel() : true);
                        });
                    }).catch((err) => {
                        console.log(err), done(false);
                    });
                },
                enumerable: true,
            },
        });

        Object.defineProperties(Contact.modelClass.prototype, {
            getContactModel: {
                value: function getContactModel() {
                    return ContactFactory.create(app, this);
                },
                enumerable: true,
            },
            openChat: {
                value: async function openChat() {
                    let [chat] = Chat.add(
                        { createLocally: true, id: this.id },
                        { merge: true }
                    );
                    await chat.open();
                    return chat;
                },
                enumerable: true,
            },
        });

        return this._patch();
    }

    /**
     * Add and set new WAPI Object Property
     * @returns
     */
    _patch() {
        const reConstruct = (obj) => {
            return Object.keys(obj).reduce((o, k) => {
                o[k] = { value: obj[k], enumerable: true };
                return o;
            }, {});
        };
        const myContact = (({ Contact }) => {
            return ContactFactory.create(this, Contact.getMeContact());
        })(this);

        Object.defineProperties(this, {
            ...reConstruct(this.Debug),
            checkPhone: {
                /** @type {(id:string) => Promise<any>} */
                value: async function checkPhone(phone) {
                    phone = (({ phone: rgx }, p) => {
                        return rgx.test(p) ? p : `${p}@c.us`;
                    })(rgx, phone);

                    return await this.WapQuery.queryPhoneExists(phone);
                },
                enumerable: true,
            },
            findChat: {
                /** @type {(id:string) => Promise<Chat>} */
                value: async function findChat(id) {
                    let chat = await this.Chat.find(id);
                    return ChatFactory.create(this, chat);
                },
                enumerable: true,
            },
            findContact: {
                value: async function findContact(id) {
                    let contact = await this.Contact.find(id);
                    return ContactFactory.create(this, contact);
                },
                enumerable: true,
            },
            getActiveChat: {
                value: function getActiveChat() {
                    let chat = this.Chat.getActive();
                    return chat ? ChatFactory.create(this, chat) : null;
                },
                enumerable: true,
            },
            myContact: {
                /**  @type {Contact} */
                value: myContact,
                enumerable: true,
            },
            openChat: {
                value: async function openChat(id) {
                    let chat = await this.Chat.find(id);
                    await chat.open();
                },
                enumerable: true,
            },
            sendMessage: {
                value: async function sendMessage(id, message, options = {}) {
                    let check = await this.checkPhone(id);
                    if (!check) throw new Error("Number doesn't exist!");

                    let { wid } = check,
                        chat = await this.Chat.find(wid),
                        contact = await this.Contact.fin(wid);

                    if (!chat) chat = await contact.openChat();
                    if (!chat.active) await chat.open();

                    let { media, caption } = options;
                    if (media) {
                        return await chat.sendImage(media, caption);
                    }
                    return await chat.sendText(message);
                },
                enumerable: true,
            },
        });
        return this;
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

        if (!WAPI.prototype.Chat || !WAPI.prototype.Contact) {
            if (webpackKey && typeof target[webpackKey] === "object") {
                let mID = `parasite${Date.now()}`,
                    modStore = {};

                target[webpackKey].push([[mID], {}, (o) => getStore(o, modStore)]);
                return new WAPI(modStore);
            } else {
                console.error("Failed to load WAPI Module!");
            }
        }
    }
}
