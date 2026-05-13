import App from "./scripts/App";
import React from "react";
import ReactDOM from "react-dom/client";

declare global {
    var unsafeWindow: Window &
        Omit<
            typeof globalThis,
            | "GM_addElement"
            | "GM_addStyle"
            | "GM_addValueChangeListener"
            | "GM_deleteValue"
            | "GM_download"
            | "GM_getResourceText"
            | "GM_getResourceURL"
            | "GM_getTab"
            | "GM_getTabs"
            | "GM_getValue"
            | "GM_info"
            | "GM_listValues"
            | "GM_log"
            | "GM_notification"
            | "GM_openInTab"
            | "GM_registerMenuCommand"
            | "GM_removeValueChangeListener"
            | "GM_saveTab"
            | "GM_setClipboard"
            | "GM_setValue"
            | "GM_unregisterMenuCommand"
            | "GM_xmlhttpRequest"
            | "GM"
        > & {
            require<T extends "React" | "ReactDOM">(
                module: T,
            ): T extends "React" ? typeof React : typeof ReactDOM;
        };
}

// console.log(React, ReactDOM);
window["React"] = unsafeWindow.require("React");
window["ReactDOM"] = unsafeWindow.require("ReactDOM");

App.init(unsafeWindow);
