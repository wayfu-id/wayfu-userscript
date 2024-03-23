import { storeObjects, rgx } from "./Constant";

/**
 *
 * @param {Window & globalThis} target
 * @param {string} webpack
 * @returns {Promise<String>}
 */
const waitloaderType = async (target, webpack) => {
    return new Promise((resolve) => {
        const checkObjects = () => {
            if (target.__debug) {
                if (target.__debug.modulesMap?.WAWebUserPrefsMeUser) {
                    resolve("meta");
                } else {
                    setTimeout(checkObjects, 200);
                }
            } else {
                if (
                    target[webpack] &&
                    Array.isArray(target[webpack]) &&
                    target[webpack].every(
                        (item) => Array.isArray(item) && item.length > 0
                    )
                ) {
                    resolve("webpack");
                } else {
                    setTimeout(checkObjects, 200);
                }
            }
        };
        checkObjects();
    });
};

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
function setWAPI(store) {
    let { WebClasses2, WebClasses3, WebClasses4, ...WAPI } = store,
        WebClassesV2 = Object.assign({}, WebClasses2, WebClasses3, WebClasses4);

    Object.assign(WAPI, { WebClassesV2: WebClassesV2 });

    Object.defineProperties(WAPI.Chat.constructor.prototype, {
        findImpl: {
            value: async function findImpl(e, n) {
                let wid = await (async (id) => {
                    if (typeof id === "string") {
                        let check = await WAPI.WapQuery.queryPhoneExists(e);
                        if (!check) return null;
                        return check.wid;
                    }
                    return id;
                })(e);

                if (!wid) return null;

                let result = this.get(wid);
                if (!result) {
                    [result] = this.add(
                        { createLocally: true, id: wid },
                        { merge: true }
                    );
                }

                return result;
            },
        },
        clearAllDraft: {
            value: function clearAllDraft() {
                const hasDraft = (c) => {
                    if (c.draftMessage !== undefined && c.draftMessage.text !== "") {
                        return true;
                    }
                    return c.hasDraftMessage;
                };
                for (let chat of this.getModelsArray()) {
                    if (hasDraft(chat)) {
                        chat.clearDraft();
                    }
                }
            },
        },
    });
    Object.defineProperties(WAPI.Chat.modelClass.prototype, {
        open: {
            value: async function open() {
                let { Cmd } = WAPI;
                await Cmd.openChatAt(this);
            },
            enumerable: true,
        },
        clearDraft: {
            value: function clearDraft() {
                this.setComposeContents({ text: "", timestamp: Date.now() });
                return this;
            },
            enumerable: true,
        },
    });
    Object.defineProperties(WAPI, {
        Me: {
            get: function getMe() {
                return this.Contact.getMeContact();
            },
            enumerable: true,
        },
        SendImgToChat: {
            value: function sendImgToChat(phone, imgFile, caption = "", getChat = false) {
                if (!phone || !imgFile) return false;
                return new Promise((done) => {
                    this.Chat.find(`${phone}@c.us`)
                        .then((chat) => {
                            let mc = new this.MediaCollection(chat);
                            mc.processAttachments([{ file: imgFile }], chat, chat)
                                .then(() => {
                                    let [media] = mc.getModelsArray();
                                    media.sendToChat(chat, { caption: caption });
                                    done(getChat ? chat : true);
                                })
                                .catch((err) => (console.log(err), done(false)));
                        })
                        .catch((err) => (console.log(err), done(false)));
                });
            },
            enumerable: true,
        },
        composeAndSendMsgToChat: {
            value: function composeAndSendMsgToChat(phone, text, getChat = false) {
                const wait = (time) =>
                        new Promise((resolve) => setTimeout(resolve, time)),
                    { ComposeBox } = this;

                return new Promise((done) => {
                    this.Chat.find(`${phone}@c.us`)
                        .then(async (chat) => {
                            if (!chat.active) await chat.open();
                            await wait(5e2);

                            await ComposeBox.paste(chat, text);
                            await ComposeBox.send(chat);
                            done(getChat ? chat : true);
                        })
                        .catch((err) => (console.log(err), done(false)));
                });
            },
            enumerable: true,
        },
        openChat: {
            value: async function openChat(phone) {
                const { Chat } = this;

                phone = (({ phone: rgx }, p) => {
                    return rgx.test(p) ? p : `${p}@c.us`;
                })(rgx, phone);

                let res;
                try {
                    res = await Chat.find(phone);
                } catch (e) {}

                if (!res) return false;

                return await res.open();
            },
            enumerable: true,
        },
    });

    window.WAPI = Object.keys(WAPI)
        .sort()
        .reduce((obj, key) => {
            obj[key] = WAPI[key];
            return obj;
        }, {});

    return window.WAPI;
}

/**
 * Add support to WhatsApp Web v2.3xxx.xx
 * @param {Window & globalThis} target
 *
 */
const webpackFactory = (target) => {
    const webpackRequire = (id) => {
        try {
            target.ErrorGuard.skipGuardGlobal(true);
            return target.importNamespace(id);
        } catch (error) {}
        return null;
    };

    Object.defineProperty(webpackRequire, "m", {
        get: () => {
            const result = {};
            Object.keys(target.require("__debug").modulesMap)
                .filter((e) => e.includes("WA"))
                .forEach((id) => {
                    result[id] = {
                        default: modulesMap[id].defaultExport,
                        factory: modulesMap[id].factory,
                    };
                });

            return result;
        },
    });

    return webpackRequire;
};

/**
 * Load WAPI needed modules from WhatsApp Web window
 * @param {Window} target window targetr
 */
const loadWapi = async (target) => {
    if (!window.WAPI || !window.WAPI.Msg) {
        function getStore(modules) {
            // let foundCount = 0;
            console.log(modules);
            for (let idx in modules.m) {
                if (typeof modules(idx) === "object" && modules(idx) !== null) {
                    storeObjects.forEach((needObj) => {
                        if (!needObj.conditions || needObj.foundedModule) return;
                        let neededModule = needObj.conditions(modules(idx));
                        if (neededModule !== null) {
                            // foundCount++;
                            needObj.foundedModule = neededModule;
                        }
                    });
                    // if (foundCount == storeObjects.length) break;
                }
            }
            let neededStore = storeObjects.find((needObj) => needObj.id === "Store"),
                windowStore = neededStore.foundedModule ? neededStore.foundedModule : {};

            storeObjects.forEach((needObj) => {
                if (needObj.id !== "Store" && needObj.foundedModule) {
                    windowStore[needObj.id] = needObj.foundedModule;
                }
            });
            // console.log(windowStore);
            return setWAPI(windowStore);
        }
        const parasite = `parasite${Date.now()}`;
        const webpack = getWebpack(target);
        /** @type {"webpack" | "meta"} */
        const loaderType = await waitloaderType(target, webpack);
        console.log(loaderType);

        if (webpack && typeof target[webpack] === "object") {
            target[webpack].push([[parasite], {}, (o) => getStore(o)]);
        } else if (loaderType === "meta") {
            let webpackStore = webpackFactory(target);
            console.log(webpackStore);
            getStore(webpackStore);
        } else {
            console.error("Failed to load WAPI Module!");
        }
    }
};

export { loadWapi };
