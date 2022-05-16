/**
 * Regular Expression (RegExp) list pattern for some purpose
 */
const rgx = {
    forVersion: /^\d+(?:(?:\.|-)\d+[A-Za-z]?)*$/,
    getVersion: /(?:@version\s*(\d+(?:(?:\.|-)\d+[A-Za-z]?)*))/,
    phonePattern: /^(?:[\+\d]?[\- \d]{10,})$/,
    phoneValue: /^[0\+]*(?:(\d{9,})|([\d]{1,3}(?:[\- ]?[\d]{2,})+))$/,
    datePattern: /\d{1,4}[\/|-|:]\d{1,2}[\/|-|:]\d{2,4}/,
    formatedDate: /^\d{4}[\/|-|:]\d{1,2}[\/|-|:]\d{1,2}$/,
    forFilename: /(?!\s*$)\s*(?:(gagal|error)|(?:\(?([0-9]*)\)?)|([^_]*))(?:_|\s|$)/g,
};

/**
 * Event lists details to create eventListener
 */
const eventLists = [
    { element: "#panelBody .menus", type: "click", event: "tabMenu" },
    { element: "#_mode", type: "click", event: "autoMode" },
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
        conditions: (module) => (module.PLATFORMS && module.Conn ? module.Conn : null),
    },
];

export { rgx, queryElm, dateOptDefault, eventLists, storeObjects };
