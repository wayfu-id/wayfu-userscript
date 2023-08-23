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
    phone: /^[0-9]*@c\.us$/,
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

const wayFuSvg = [
    {
        type: "path",
        data: {
            class: "fill0",
            d: "M84 3c1,0 2,1 3,1 7,3 13,8 19,13 5,5 10,12 13,19 3,7 4,15 4,23 0,6 0,11 -2,16 -1,5 -3,10 -5,14l8 31 -32 -8c-4,3 -9,4 -14,6 -4,1 -9,1 -14,1l0 0c-6,0 -11,0 -16,-2l2 -5c1,1 2,1 3,1 3,1 7,1 11,1 2,0 4,0 6,0 3,-1 5,-1 7,-2 2,0 4,-1 7,-2 2,-1 4,-1 6,-3l1 -1 3 1 22 6 -6 -22 0 -2 1 -2c1,-2 2,-4 3,-7 1,-2 2,-4 2,-6 1,-3 1,-5 2,-7 0,-3 0,-5 0,-8 0,-3 0,-7 -1,-11 -1,-3 -2,-6 -3,-10l0 0c-2,-3 -3,-6 -5,-9 -2,-3 -4,-6 -7,-8 -2,-3 -5,-5 -8,-7 -3,-2 -6,-3 -9,-5l0 0c-1,0 -1,0 -1,0l0 -6zm-29 68c-1,-2 -3,-3 -4,-5 -3,-3 -6,-6 -9,-10 -17,-20 4,-40 20,-51 -6,1 -12,2 -19,5 -13,4 -25,14 -30,30 -1,1 -1,1 -1,2 -4,16 -3,29 2,39 5,13 15,22 22,26l19 -36zm7 -1c-5,-5 -10,-10 -16,-17 -20,-25 33,-51 33,-51 -15,-5 -61,-1 -72,38 -13,45 20,70 31,74l24 -44z",
        },
    },
    {
        type: "path",
        data: {
            class: "fill1",
            d: "M93 126l-1 0c0,0 0,0 0,1 -5,1 -9,1 -14,1l0 0c-5,0 -10,-1 -15,-2l1 0 0 0c5,0 10,0 14,-2 5,-1 10,-3 14,-5l12 3c-3,2 -7,3 -11,4l0 0zm-14 -116l0 -4c0,0 -2,1 -6,3 -11,7 -34,22 -31,38 2,-19 37,-37 37,-37z",
        },
    },
    {
        type: "path",
        data: {
            class: "fill2",
            fillRule: "nonzero",
            d: "M62 84l0 -8 -24 44c-9,-2 -32,-19 -34,-50 -2,35 25,55 34,58l24 -44z",
        },
    },
];

const svgData = { downloadBtnSvg, checksSvg, groupDownloadBtnSvg, wayFuSvg };

/**
 * Event lists details to create eventListener
 */
const eventLists = [
    { element: "#wayfuPanel .menus", type: "click", event: "tabMenu" },
    { element: "#wayfuPanel textarea", type: "input", event: "updateText" },
    { element: "#_mode", type: "click", event: "textPreview" },
    { element: "#useImage", type: "click", event: "useImage" },
    { element: "#getFile", type: "change", event: "loadData" },
    { element: "#imgFile", type: "change", event: "imagePreview" },
    { element: "#_deleteImg", type: "click", event: "imagePreview" },
    // @deprecated { element: "#toggleApp", type: "click", event: "toggleApp" },
    { element: "#wayfuToggle", type: "click", event: "toggleApp" },
    { element: "._input input[type='range']", type: "input", event: "inputRange" },
    { element: "._input input[type='checkbox']", type: "change", event: "inputChecks" },
    { element: "._input select", type: "change", event: "inputSelects" },
    // @deprecated { element: "#changeLogs", type: "click", event: "changeLog" },
    { element: "#_blast", type: "click", event: "runTasks" },
    { element: "div#app", type: "click", event: "checkChat" },
];

/**
 * Element's query selector list for some kind of element
 */
const queryElm = {
    send: "#main span[data-icon^='send']",
    input: "#main div[contenteditable='true']",
    linkElm: "#wayfuPanel span#_api-link a",
    errModal: "#app div[role^='dialog'] button",
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
    {
        id: "WapQuery",
        conditions: (module) =>
            module.queryExist
                ? module
                : module.default && module.default.queryExist
                ? module.default
                : null,
    },
    {
        id: "Cmd",
        conditions: (module) => (module.Cmd ? module.Cmd : null),
    },
];

export { rgx, svgData, queryElm, dateOptDefault, eventLists, storeObjects };
