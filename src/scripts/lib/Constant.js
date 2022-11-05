/**
 * Regular Expression (RegExp) list pattern for some purpose
 */
const rgx = {
    forVersion: /^\d+(?:(?:\.|-)\d+[A-Za-z]?)*$/,
    getVersion: /(?:@version\s*(\d+(?:(?:\.|-)\d+[A-Za-z]?)*))/,
    phonePattern: /^(?:[\+\d]?[\- \d]{10,})(?:\s|$)/,
    phoneValue: /^[0\+]*(?:(\d{9,})|([\d]{1,3}(?:[\- ]?[\d]{2,})+))(\s|$)/,
    datePattern: /\d{1,4}[\/|-|:]\d{1,2}[\/|-|:]\d{2,4}/,
    formatedDate: /^\d{4}[\/|-|:]\d{1,2}[\/|-|:]\d{1,2}$/,
    forFilename: /(?!\s*$)\s*(?:(gagal|error)|(?:\(?([0-9]*)\)?)|([^_]*))(?:_|\s|$)/g,
    xlsxFileCheck: /^app.*\/vnd\.(?:([^\.]*)\.([^\.]*sheet(?:.*)?))$/g,
    csvFileCheck: /^(?:(?:app.*\/.*csv.*)|(?:text\/.*(?:csv|separated|plain).*))$/g,
};

/**
 * Event lists details to create eventListener
 */
const eventLists = [
    { element: "#panelBody .menus", type: "click", event: "tabMenu" },
    { element: "#panelBody textarea", type: "input", event: "updateText" },
    { element: "#_mode", type: "click", event: "textPreview" },
    { element: "#useImage", type: "click", event: "useImage" },
    { element: "#getFile", type: "change", event: "loadData" },
    { element: "#imgFile", type: "change", event: "imagePreview" },
    { element: "#_deleteImg", type: "click", event: "imagePreview" },
    { element: "#toggleApp", type: "click", event: "toggleApp" },
    { element: "._input input[type='range']", type: "input", event: "inputRange" },
    { element: "._input input[type='checkbox']", type: "change", event: "inputChecks" },
    { element: "._input select", type: "change", event: "inputSelects" },
    { element: "#changeLogs", type: "click", event: "changeLog" },
    { element: "#_blast", type: "click", event: "runTasks" },
    { element: "div#app", type: "click", event: "checkChat" },
];

/**
 * Element's query selector list for some kind of element
 */
const queryElm = {
    send: "#main span[data-testid^='send']",
    input: "#main div[contenteditable='true']",
    linkElm: "div#panelBody span#_api-link a",
    errModal: ".overlay div[role^='button']",
    chatMessage: "#main div.message-out",
};

/**
 * This is default toLocaleDateString options
 */
const dateOptDefault = {
    year: "numeric",
    month: "long",
    day: "numeric",
};

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
    // {
    //     id: "Features",
    //     conditions: (module) =>
    //         module.FEATURE_CHANGE_EVENT && module.GK ? module.GK : null,
    // },
    // {
    //     id: "Conn",
    //     conditions: (module) => (module.PLATFORMS && module.Conn ? module.Conn : null),
    // },
    // {
    //     id: "Wap",
    //     conditions: (module) =>
    //         module.default && module.default.queryLinkPreview ? module.default : null,
    // },
    // {
    //     id: "MDBeckend",
    //     conditions: (module) => (module.isMDBackend ? module.isMDBackend() : null),
    // },
];

export { rgx, queryElm, dateOptDefault, eventLists, storeObjects };
