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
function setWAPI(store) {
    let { WebClasses2, WebClasses3, ...WAPI } = store,
        WebClassesV2 = Object.assign({}, WebClasses2, WebClasses3);

    Object.assign(WAPI, { WebClassesV2: WebClassesV2 });

    Object.defineProperties(WAPI, {
        Me: {
            get: function getMe() {
                for (let person of this.Contact.getModelsArray()) {
                    if (person.isMe) return person.serialize();
                }
                return {};
            },
            enumerable: true,
        },
        SendImgToChat: {
            value: function sendImgToChat(phone, imgFile, caption = "", getChat = false) {
                if (!phone || !imgFile) return false;
                return new Promise((done) => {
                    this.Chat.find(`${phone}@c.us`).then((chat) => {
                        let mc = new this.MediaCollection(chat);
                        mc.processAttachments([{ file: imgFile }, 1], chat, 1)
                            .then(() => {
                                let [media] = mc.getModelsArray();
                                media.sendToChat(chat, { caption: caption });
                                done(getChat ? chat : true);
                            })
                            .catch((err) => (console.log(err), done(false)));
                    });
                });
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
 * Load WAPI needed modules from WhatsApp Web window
 * @param {window} target window target
 */
const loadWapi = (target) => {
    if (!window.WAPI || !window.WAPI.Msg) {
        function getStore(modules) {
            // let foundCount = 0;
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

        if (webpack && typeof target[webpack] === "object") {
            target[webpack].push([[parasite], {}, (o) => getStore(o)]);
        } else {
            console.error("Failed to load WAPI Module!");
        }
    }
};

export { loadWapi };
