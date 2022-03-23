const rgx = {
    forVersion: /^\d+((\.|-)\d+[A-Za-z]?)*$/,
    phonePattern: /^(?:[\+\d]?[\- \d]{10,})$/,
    phoneValue: /^[0\+]*(?:(\d{9,})|([\d]{1,3}(?:[\- ]?[\d]{2,})+))$/,
    datePattern: /\d{1,4}[\/|-|:]\d{1,2}[\/|-|:]\d{2,4}/,
    formatedDate: /^\d{4}[\/|-|:]\d{1,2}[\/|-|:]\d{1,2}$/,
};

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

const queryElm = {
    send: "#main span[data-testid^='send']",
    input: "#main div[contenteditable='true']",
    linkElm: "div#panelBody span#_api-link a",
    errModal: ".overlay div[role^='button']",
    chatMessage: "#main div.message-out",
};

const dateOptDefault = {
    year: "numeric",
    month: "long",
    day: "numeric",
};

export { rgx, queryElm, dateOptDefault, eventLists };
