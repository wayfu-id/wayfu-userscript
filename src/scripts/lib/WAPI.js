const storeObjects = [
    {
        id: "Store",
        conditions: (module) =>
            module.default && module.default.Chat && module.default.Msg
                ? module.default
                : null,
    },
    {
        id: "WebClasses",
        conditions: (module) =>
            module.default &&
            typeof module.default === "object" &&
            module.default.chat &&
            module.default.active
                ? module.default
                : null,
    },
    {
        id: "MediaCollection",
        conditions: (module) =>
            module.default &&
            module.default.prototype &&
            module.default.prototype.processAttachments
                ? module.default
                : null,
    },
    {
        id: "Features",
        conditions: (module) =>
            module.FEATURE_CHANGE_EVENT && module.GK ? module.GK : null,
    },
    {
        id: "Debug",
        conditions: (module) => (module.Debug ? module.Debug : null),
    },
    {
        id: "Conn",
        conditions: (module) =>
            module.PLATFORMS && module.Conn ? module.Conn : null,
    },
];

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

const loadWapi = (target) => {
    if (!window.Store || !window.Store.Msg) {
        function getStore(modules) {
            let foundCount = 0;
            for (let idx in modules.m) {
                if (typeof modules(idx) === "object" && modules(idx) !== null) {
                    storeObjects.forEach((needObj) => {
                        if (!needObj.conditions || needObj.foundedModule)
                            return;
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
            let neededStore = storeObjects.find(
                (needObj) => needObj.id === "Store"
            );
            window.Store = neededStore.foundedModule
                ? neededStore.foundedModule
                : {};
            storeObjects.forEach((needObj) => {
                if (needObj.id !== "Store" && needObj.foundedModule) {
                    window.Store[needObj.id] = needObj.foundedModule;
                }
            });
            return window.Store;
        }
        const parasite = `parasite${Date.now()}`,
            webpack = getWebpack(target);

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
