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
    xlsxFileCheck: /^app.*\/vnd\.open[^\.]*(?:[^]*\.sheet)$/,
    // csvFileCheck: /^(?:app.*\/.*(?:csv|excel))|(?:text\/.*(?:csv|separated|plain).*)$/, // seems no longer needed
};

const downloadBtnSvg = {
    type: "path",
    data: {
        fill: "currentColor",
        d: "M480 352h-133.5l-45.25 45.25C289.2 409.3 273.1 416 256 416s-33.16-6.656-45.25-18.75L165.5 352H32c-17.67 0-32 14.33-32 32v96c0 17.67 14.33 32 32 32h448c17.67 0 32-14.33 32-32v-96C512 366.3 497.7 352 480 352zM432 456c-13.2 0-24-10.8-24-24c0-13.2 10.8-24 24-24s24 10.8 24 24C456 445.2 445.2 456 432 456zM233.4 374.6C239.6 380.9 247.8 384 256 384s16.38-3.125 22.62-9.375l128-128c12.49-12.5 12.49-32.75 0-45.25c-12.5-12.5-32.76-12.5-45.25 0L288 274.8V32c0-17.67-14.33-32-32-32C238.3 0 224 14.33 224 32v242.8L150.6 201.4c-12.49-12.5-32.75-12.5-45.25 0c-12.49 12.5-12.49 32.75 0 45.25L233.4 374.6z",
    },
};

const checksSvg = {
    type: "polyline",
    data: {
        points: "1 1 5 5 9 1",
    },
};

const groupDownloadBtnSvg = [
    {
        type: "path",
        data: {
            fill: "currentColor",
            d: "M18.948 11.112C18.511 7.67 15.563 5 12.004 5c-2.756 0-5.15 1.611-6.243 4.15-2.148.642-3.757 2.67-3.757 4.85 0 2.757 2.243 5 5 5h1v-2h-1c-1.654 0-3-1.346-3-3 0-1.404 1.199-2.757 2.673-3.016l.581-.102.192-.558C8.153 8.273 9.898 7 12.004 7c2.757 0 5 2.243 5 5v1h1c1.103 0 2 .897 2 2s-.897 2-2 2h-2v2h2c2.206 0 4-1.794 4-4a4.008 4.008 0 0 0-3.056-3.888z",
        },
    },
    {
        type: "path",
        data: {
            fill: "currentColor",
            d: "M13.004 14v-4h-2v4h-3l4 5 4-5z",
        },
    },
];

const svgData = { downloadBtnSvg, checksSvg, groupDownloadBtnSvg };

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
    errModal: "#app div[data-testid$='popup'] div[role^='button']",
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

export { rgx, svgData, queryElm, dateOptDefault, eventLists, storeObjects };
