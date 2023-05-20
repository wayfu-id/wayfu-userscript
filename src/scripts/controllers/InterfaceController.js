import { eventLists } from "../lib/Constant";
import { listeners } from "./EventController";
import DOM from "../utils/DOM";

export default class InterfaceController {
    constructor(details) {
        this.createView(details);
        this.initListener();

        return this;
    }
    createView(details) {
        const { style, icon } = details;
        const props = (({ html, name, version }) => {
            return {
                id: "wayfuPanel",
                after: "header",
                html: html
                    .replace(/VERSION/, version)
                    .replace(/APP_NAME/, name)
                    .replace(/WA_VERSION/, window.WAPI.Debug.VERSION),
            };
        })(details);

        DOM.addStyle(style, { id: "wayfuStyle" });
        DOM.create("header", props);
        DOM.get("img.appIco").setProperties({ src: icon });

        return this;
    }
    initListener() {
        eventLists.forEach((evt) => {
            const { element, type, event } = evt;
            DOM.get(element || document).forEach((e) => {
                DOM.get(e).onEvent(type, function handleEvent(e) {
                    let elEvt = listeners[event];
                    if (typeof elEvt === "function") return elEvt(e);
                });
            });
        });

        // window.addEventListener("click", function (e) {
        //     Debug.current(e);
        // });
    }
    static init(details) {
        return new InterfaceController(details);
    }
}
