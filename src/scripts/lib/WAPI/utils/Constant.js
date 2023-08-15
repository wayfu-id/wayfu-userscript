/**
 * WAPI modules that needed to get
 */
const storeObjects = [
    {
        id: "Store",
        conditions: (module) =>
            module.default && module.default.Chat && module.default.Msg
                ? module.default
                : null,
    },
    {
        id: "Cmd",
        conditions: (module) => (module.Cmd ? module.Cmd : null),
    },
    {
        id: "ChatCollection",
        conditions: (module) => (module.ChatCollection ? module.ChatCollection : null),
    },
    {
        id: "OpaqueData",
        conditions: (module) =>
            module.default && module.default.createFromData ? module.default : null,
    },
    {
        id: "MediaPrep",
        conditions: (module) => (module.prepRawMedia ? module : null),
    },
    {
        id: "MediaObject",
        conditions: (module) => (module.getOrCreateMediaObject ? module : null),
    },
    {
        id: "MediaTypes",
        conditions: (module) => (module.msgToMediaType ? module : null),
    },
    {
        id: "MediaUpload",
        conditions: (module) => (module.uploadMedia ? module : null),
    },
    {
        id: "WidFactory",
        conditions: (module) => (module.createWid ? module : null),
    },
    {
        id: "MsgKey",
        conditions: (module) =>
            module.default && module.default.fromString ? module.default : null,
    },
    {
        id: "EphemeralFields",
        conditions: (module) => (module.getEphemeralFields ? module : null),
    },
    {
        id: "AddAndSendMsgToChat",
        conditions: (module) => (module.addAndSendMsgToChat ? module : null),
    },
    {
        id: "SendTextMsgToChat",
        conditions: (module) => (module.sendTextMsgToChat ? module : null),
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
        id: "WebClasses2",
        conditions: (module) =>
            module.default &&
            typeof module.default === "object" &&
            module.default.menu &&
            module.default.active
                ? module.default
                : null,
    },
    {
        id: "WebClasses3",
        conditions: (module) =>
            module.default &&
            typeof module.default === "object" &&
            module.default.chatHeader
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
        id: "Debug",
        conditions: (module) => (module.Debug ? module.Debug : null),
    },
    {
        id: "UploadUtils",
        conditions: (module) =>
            module.default && module.default.encryptAndUpload ? module.default : null,
    },
    {
        id: "WapQuery",
        conditions: (module) =>
            module.queryExist
                ? module
                : module.default && module.default.queryExist
                ? module.default
                : null,
    },
];

export { storeObjects };
