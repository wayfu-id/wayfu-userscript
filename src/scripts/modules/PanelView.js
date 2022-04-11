import { DOM } from "../lib/DOM";
import { eventLists } from "../lib/Constant";
import { listeners } from "./Events";

function createView(html, style, details) {
    const { name, version, icon } = details;
    DOM.createElement({
        tag: "header",
        id: "wayfuPanel",
        after: "header",
        html: html
            .replace(/VERSION/, version)
            .replace(/APP_NAME/, name)
            .replace(/WA_VERSION/, window.WAPI.Debug.VERSION),
    });

    DOM.addStyle(style, {
        id: "wayfuStyle",
    });

    DOM.setElement("img.appIco", { src: icon });

    initListener();
}

function initListener() {
    eventLists.forEach((evt) => {
        DOM.getElement(evt.element || document, true).forEach((e) => {
            DOM.onEvent(e, evt.type, function handleEvent(e) {
                let elEvt = listeners[evt.event];
                // console.log(elEvt);
                if (typeof elEvt === "function") return elEvt(e);
            });
        });
    });
}

export { createView };
