import { storeObjects } from "./Constant";

/**
 * Get webpack object/array/function from a window.
 * Return it's name if any, or null if not found.
 * @param {Window} window window target
 * @return {String | null}
 */
const getWebpack = (window) => {
    let keys = Object.keys(window),
        val;
    for (let key of keys) {
        if (/[^|]?webpack./g.test(key)) {
            val = key;
        }
    }
    return val || null;
};

/**
 * Set window.WAPI object from window.Store object
 * @param {any} store
 */
function setWAPI(store) {
    window.WAPI = Object.assign({}, store);

    Object.defineProperty(window.WAPI, "sendImage", {
        value: function sendImg(number, imgFile, caption = "") {
            return new Promise((done) => {
                this.Chat.find(`${number}@c.us`).then((chat) => {
                    let mc = new this.MediaCollection(chat);
                    mc.processAttachments(
                        [
                            {
                                file: imgFile,
                            },
                            1,
                        ],
                        chat,
                        1
                    )
                        .then(() => {
                            let media = mc.models[0];
                            media.sendToChat(chat, {
                                caption: caption,
                            });
                            done(true);
                        })
                        .catch((err) => {
                            done(false);
                        });
                });
            });
        },
    });
}

/**
 * Load WAPI needed modules from WhatsApp Web window
 * @param {window} target window target
 */
const loadWapi = (target) => {
    if (!window.Store || !window.Store.Msg) {
        function getStore(modules) {
            let foundCount = 0;
            for (let idx in modules.m) {
                if (typeof modules(idx) === "object" && modules(idx) !== null) {
                    storeObjects.forEach((needObj) => {
                        if (!needObj.conditions || needObj.foundedModule) return;
                        let neededModule = needObj.conditions(modules(idx));
                        if (neededModule !== null) {
                            foundCount++;
                            needObj.foundedModule = neededModule;
                        }
                    });
                    if (foundCount == storeObjects.length) {
                        break;
                    }
                }
            }
            let neededStore = storeObjects.find((needObj) => needObj.id === "Store");
            window.Store = neededStore.foundedModule ? neededStore.foundedModule : {};
            storeObjects.forEach((needObj) => {
                if (needObj.id !== "Store" && needObj.foundedModule) {
                    window.Store[needObj.id] = needObj.foundedModule;
                }
            });
            return window.Store;
        }
        const parasite = `parasite${Date.now()}`;
        const webpack = getWebpack(target);

        if (webpack && typeof target[webpack] === "object") {
            target[webpack].push([
                [parasite],
                {},
                (o, e, t) => {
                    getStore(o);
                },
            ]);
            setWAPI(window.Store);
        } else {
            console.error("Failed to load WAPI Module!");
        }
    }
};

export { loadWapi };
