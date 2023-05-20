// import { DOM } from "../lib/HtmlModifier";
import DOM from "../utils/DOM";
import { eventLists } from "../lib/Constant";
import { listeners } from "./Events";
import { Debug } from "./Debug";

/**
 * @typedef {{
 *     name: string;
 *     version: string;
 *     icon: string;
 * }} appDetails;
 */

/** Create and Construct Panel View
 *  @param {string} html
 *  @param {string} style
 *  @param {appDetails} details
 */
function createView(html, style, details) {
    const { name, version, icon } = details;

    DOM.addStyle(style, { id: "wayfuStyle" });
    DOM.create("header", {
        id: "wayfuPanel",
        after: "header",
        html: html
            .replace(/VERSION/, version)
            .replace(/APP_NAME/, name)
            .replace(/WA_VERSION/, window.WAPI.Debug.VERSION),
    });
    DOM.get("img.appIco").setProperties({ src: icon });
    // DOM.createElement({
    //     tag: "header",
    //     id: "wayfuPanel",
    //     after: "header",
    //     html: html
    //         .replace(/VERSION/, version)
    //         .replace(/APP_NAME/, name)
    //         .replace(/WA_VERSION/, window.WAPI.Debug.VERSION),
    // });
    // DOM.get("img.appIco").setProperties({ src: icon });
    // DOM.addStyle(style, { id: "wayfuStyle" }).setElement("img.appIco", { src: icon });
    initListener();
}

/** Initialize all event listener */
function initListener() {
    eventLists.forEach((evt) => {
        const { element, type, event } = evt;
        DOM.get(element || document).forEach((e) => {
            DOM.get(e).onEvent(type, function handleEvent(e) {
                let elEvt = listeners[event];
                // console.log(elEvt);
                if (typeof elEvt === "function") return elEvt(e);
            });
        });
        // DOM.getElement(element || document, true).forEach((e) => {
        //     DOM.onEvent(e, type, function handleEvent(e) {
        //         let elEvt = listeners[event];
        //         // console.log(elEvt);
        //         if (typeof elEvt === "function") return elEvt(e);
        //     });
        // });
    });

    window.addEventListener("click", function (e) {
        Debug.current(e);
    });
}

export { createView };
