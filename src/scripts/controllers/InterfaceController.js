import { eventLists } from "../lib/Constant";
import { listeners } from "./EventController";
import { svgData } from "../lib/Constant";
import DOM from "../utils/DOM";

export default class InterfaceController {
    constructor(details) {
        this.createView(details);

        return this;
    }

    /**
     * Inject all view
     * @param {{ [k: string]: string }} details
     */
    createView(details) {
        const { style, icon, name } = details,
            { menu, menuDefault, item, button } = window.WAPI.WebClassesV2,
            { wayFuSvg } = svgData;

        /** @type {(name: string) => DOM } */
        const createBtnMenu = (name) => {
            const menuItem = DOM.create("div", {
                id: "wayfuToggle",
                classid: item,
                "data-testid": "menu-bar-wayfu-app",
                "data-target": "wayfuPanel",
            });

            const wayFuMenu = DOM.create("div", {
                classid: button,
                role: "button",
                "data-tab": "2",
                tabindex: "0",
                "aria-disabled": false,
                title: `${name}`,
                "aria-label": `${name}`,
            });

            const wayfuBtn = DOM.create("span", {
                "data-testid": "wayfu-app",
                "data-icon": "wayfu-app",
            });

            const btnIcon = DOM.createIcon(wayFuSvg, {
                size: "24",
                viewBox: "0 0 128 128",
                class: "wayfu-app-icon",
            });

            wayfuBtn.insert(btnIcon);
            wayFuMenu.insert(wayfuBtn);

            return menuItem.insert(wayFuMenu);
        };

        const props = (({ html, version }) => {
            return {
                id: "wayfuPanel",
                after: "header",
                html: html
                    .replace(/VERSION/, version)
                    .replace(/WA_VERSION/, window.WAPI.Debug.VERSION),
            };
        })(details);

        let menuEl = DOM.get(`header .${menu}.${menuDefault} span`);

        DOM.addStyle(style, { id: "wayfuStyle" });
        DOM.create("header", props);
        DOM.get("img.appIco").setProperties({ src: icon });

        createBtnMenu(name).insertBefore(menuEl, true);
        return this.initListener();
    }

    /**
     * Init all eventListener
     */
    initListener() {
        eventLists.forEach((evt) => {
            const { element, type, event } = evt;
            DOM.get(element || document).forEach((e) => {
                /** @type {EventListener} */
                const handleEvent = (e) => {
                    let elEvt = listeners[event];
                    if (typeof elEvt === "function") return elEvt(e);
                };
                DOM.get(e).onEvent(type, handleEvent);
            });
        });
    }

    /**
     * Static method to initialize current UI
     * @param {{ [k: string]: string }} details
     * @returns
     */
    static init(details) {
        return new InterfaceController(details);
    }
}
