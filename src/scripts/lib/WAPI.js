import { storeObjects } from "./Constant";

/**
 * Get webpack object/array/function from a window.
 * Return it's name if any, or null if not found.
 * @param {Window} window window target
 * @return {String | null}
 */
const getWebpack = (window) => {
    // let keys = Object.keys(window),
    //     val;
    for (let key of Object.keys(window)) {
        if (/[^|]?webpack./g.test(key)) return key;
    }
    return null;
};

/**
 * Set window.WAPI object from window.Store object
 * @param {any} store
 * @return {Object} WAPI Module
 */
// function setWAPI(store) {
//     let {
//             WebClasses2,
//             WebClasses3,
//             MediaObject,
//             MediaPrep,
//             MediaTypes,
//             MediaUpload,
//             MediaCollection,
//             ...WAPI
//         } = store,
//         Medias = {
//             Object: MediaObject,
//             Prep: MediaPrep,
//             Types: MediaTypes,
//             Upload: MediaUpload,
//             Collection: WAPI.MediaCollection,
//         };

//     Object.assign(WAPI, {
//         Medias,
//         WebClassesV2: { ...WebClasses2, ...WebClasses3 },
//     });

//     Object.defineProperties(WAPI, {
//         Me: {
//             get: function getMe() {
//                 for (let person of this.Contact.getModelsArray()) {
//                     if (person.isMe) return person.serialize();
//                 }
//                 return {};
//             },
//             enumerable: true,
//         },
//         SendImgToChat: {
//             value: function sendImgToChat(
//                 phone,
//                 imgFile,
//                 caption = "",
//                 getChat = false
//             ) {
//                 if (!phone || !imgFile) return false;
//                 return new Promise((done) => {
//                     this.Chat.find(`${phone}@c.us`).then((chat) => {
//                         let mc = new this.MediaCollection(chat);
//                         mc.processAttachments([{ file: imgFile }, 1], chat, 1)
//                             .then(() => {
//                                 let [media] = mc.getModelsArray();
//                                 media.sendToChat(chat, { caption: caption });
//                                 done(getChat ? chat : true);
//                             })
//                             .catch((err) => (console.log(err), done(false)));
//                     });
//                 });
//             },
//             enumerable: true,
//         },
//         // encryptAndUploadFile: {
//         //     value: async function e(t, f) {
//         //         // let bf = await f.arrayBuffer();
//         //         let filehash = ((e) => {
//         //             let sha = new jsSHA("SHA-256", "ARRAYBUFFER");
//         //             return sha.update(e).getHash("B64");
//         //         })(await f.arrayBuffer());

//         //         let mediaKey = (l) => {
//         //             let chars =
//         //                     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
//         //                 charsL = chars.length,
//         //                 res = "";
//         //             for (let i = 0; i < l; i++) {
//         //                 res += chars.charAt(Math.floor(Math.random() * charsL));
//         //             }
//         //             return res;
//         //         };

//         //         let signal = new AbortController().signal,
//         //             encrypted = this.UploadUtils.encryptAndUpload({
//         //                 blob: f,
//         //                 type: t,
//         //                 signal,
//         //                 mediaKey: mediaKey(32),
//         //             });

//         //         return {
//         //             ...encrypted,
//         //             clientUrl: encrypted.url,
//         //             filehash,
//         //             id: filehash,
//         //             uploadhash: encrypted.encFilehash,
//         //         };
//         //     },
//         //     enumerable: true,
//         // },
//     });

//     Object.defineProperties(WAPI.Chat.modelClass.prototype, {
//         sendMessage: {
//             value: function o(e) {
//                 return WAPI.SendTextMsgToChat(this, ...arguments);
//             },
//         },
//         sendImage: {
//             value: function i(m, c, p) {
//                 return new Promise((done) => {
//                     let mc = new WAPI.MediaCollection(this);
//                     mc.processAttachments([{ file: m }, 1], this, 1)
//                         .then(() => {
//                             let [media] = mc.getModelsArray();
//                             media.sendToChat(this, { caption: c ? c : "" });
//                             done(p ? this : true);
//                         })
//                         .catch((err) => (console.log(err), done(false)));
//                 });
//             },
//         },
//     });

//     window.WAPI = Object.keys(WAPI)
//         .sort()
//         .reduce((obj, key) => {
//             obj[key] = WAPI[key];
//             return obj;
//         }, {});

//     return window.WAPI;
// }

const createWAPI = (modStore) => {
    /** @type {(obj: Object) => Object} */
    const reConstruct = (obj) => {
        return Object.keys(obj)
            .sort()
            .reduce((o, k) => {
                o[k] = obj[k];
                return o;
            }, {});
    };
    let { Chat, Contact, WebClasses2, WebClasses3 } = modStore;

    Object.defineProperty(modStore, "WebClassesV2", {
        value: { ...WebClasses2, ...WebClasses3 },
        enumerable: true,
    });
    Object.defineProperties(Chat.modelClass.prototype, {
        getChatModel: {
            value: function getChatModel() {
                let res = this.serialize();
                let { isGroup, groupMetadata, formattedTitle } = this;

                if (isGroup && groupMetadata) {
                    groupMetadata = groupMetadata.serialize();
                }

                res = Object.assign({}, res, {
                    isGroup,
                    groupMetadata,
                    formattedTitle,
                });

                delete res.msgs;
                delete res.msgUnsyncedButtonReplyMsgs;
                delete res.unsyncedButtonReplies;

                return res;
            },
            enumerable: true,
        },
        open: {
            value: async function open() {
                await window.WAPI.Cmd.openChatAt(this);
            },
            enumerable: true,
        },
        close: {
            value: async function close() {
                if (this.active) await window.WAPI.Cmd.closeChat(this);
            },
            enumerable: true,
        },
    });
    Object.defineProperties(Contact.modelClass.prototype, {
        getChat: {
            value: function getChat() {
                return window.WAPI.Chat.get(this.id);
            },
            enumerable: true,
        },
        hasChat: {
            get: function get() {
                return !!this.getChat();
            },
            enumerable: true,
        },
        getContactModel: {
            value: function getContactModel() {
                let res = this.serialize();
                let {
                    isBusiness,
                    businessProfile,
                    isMe,
                    isUser,
                    isGroup,
                    isWAContact,
                    isMyContact,
                    isContactBlocked,
                    userid,
                } = this;

                if (isBusiness && businessProfile) {
                    res.bussinessProfile = businessProfile.serialize();
                }

                res = Object.assign({}, res, {
                    isBusiness,
                    isMe,
                    isUser,
                    isGroup,
                    isWAContact,
                    isMyContact,
                    isBlocked: isContactBlocked,
                    userid,
                });

                return res;
            },
            enumerable: true,
        },
        openChat: {
            value: async function openChat() {
                return this.hasChat ? await this.getChat().open() : false;
                // let chat = await window.WAPI.Chat.find(this.id);
                // if (!chat) return;
                // await chat.open();
            },
            enumerable: true,
        },
    });
    Object.defineProperties(Contact, {
        Me: {
            get: function get() {
                return this.getMeContact().getContactModel();
            },
        },
    });

    // modStore.WebClassesV2 = { ...WebClasses2, ...WebClasses3 };
    delete modStore.WebClasses2;
    delete modStore.WebClasses3;

    window.WAPI = modStore;

    return window.WAPI;
};

/**
 * Load WAPI needed modules from WhatsApp Web window
 * @param {window} target window target
 */
const loadWapi = (target) => {
    let modStore = {};
    if (!window.WAPI || !window.WAPI.Msg) {
        function getStore(modules) {
            for (let idx in modules.m) {
                if (typeof modules(idx) === "object" && modules(idx) !== null) {
                    storeObjects.forEach(({ id, conditions }) => {
                        if (!conditions || modStore[id]) return;

                        modStore = ((id, module) => {
                            let mod = (m) => (id === "Store" ? m : { [id]: m }),
                                add = (m) => (m !== null ? mod(m) : {});

                            return Object.assign(modStore, add(module));
                        })(id, conditions(modules(idx)));
                    });
                }
            }
        }

        const mID = `parasite${Date.now()}`,
            webpack = getWebpack(target);

        if (webpack && typeof target[webpack] === "object") {
            target[webpack].push([[mID], {}, (o) => getStore(o)]);

            return createWAPI(modStore);
        } else {
            console.error("Failed to load WAPI Module!");
        }
    }
};

export { loadWapi };
