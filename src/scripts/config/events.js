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
    { element: "#wayfuToggle", type: "click", event: "toggleApp" },
    {
        element: "._input input[type='range']",
        type: "input",
        event: "inputRange",
    },
    {
        element: "._input input[type='checkbox']",
        type: "change",
        event: "inputChecks",
    },
    { element: "._input select", type: "change", event: "inputSelects" },
    { element: "#_blast", type: "click", event: "runTasks" },
    { element: "div#app", type: "click", event: "checkChat" },
];

export { eventLists };
