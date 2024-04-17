import { DOM } from "../lib/HtmlModifier";
import { eventLists, svgData } from "../lib/Constant";
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
    const { name, version, icon } = details,
        { paneOne } = window.WAPI.WebClassesV3;

    DOM.createElement({
        tag: "header",
        id: "wayfuPanel",
        after: "header > header",
        html: html.replace(/VERSION/, version).replace(/WA_VERSION/, window.WAPI.Debug.VERSION),
    });

    DOM.addStyle(style, { id: "wayfuStyle" })
        .setElement("img.appIco", { src: icon })
        .setElementStyle(`.${paneOne} header`, { display: "grid" });

    createMenuButton(name);
    initListener();
}

/** Initialize all event listener */
function initListener() {
    eventLists.forEach((evt) => {
        const { element, type, event } = evt;
        DOM.getElement(element || document, true).forEach((e) => {
            DOM.onEvent(e, type, function handleEvent(e) {
                let elEvt = listeners[event];
                // console.log(elEvt);
                if (typeof elEvt === "function") return elEvt(e);
            });
        });
    });

    window.addEventListener("click", function (e) {
        Debug.current(e);
    });
}

/** Create WayFu Button Menu */
function createMenuButton(name) {
    const { menu, menuDefault, item, button } = window.WAPI.WebClassesV2,
        headMenu = DOM.getElement(`header .${menu}.${menuDefault} span`);

    /** @type {(name: string) => HTMLElement} */
    const createBtnMenu = (name) => {
        const btnSpan = (() => {
            let ico = DOM.createSVGElement(svgData.wayFuSvg, {
                width: "24",
                height: "24",
                viewBox: "0 0 128 128",
                class: "wayfu-app-icon",
            });

            return DOM.createElement({
                tag: "span",
                "data-testid": "wayfu-app",
                "data-icon": "wayfu-app",
                html: ico.outerHTML,
            });
        })();

        const btnDiv = DOM.createElement({
            tag: "div",
            classid: button,
            role: "button",
            "data-tab": "2",
            tabindex: "0",
            "aria-disabled": false,
            title: `${name}`,
            "aria-label": `${name}`,
            html: btnSpan.outerHTML,
        });

        return DOM.createElement({
            tag: "div",
            id: "wayfuToggle",
            classid: item,
            "data-testid": "menu-bar-wayfu-app",
            "data-target": "wayfuPanel",
            html: btnDiv.outerHTML,
        });
    };

    headMenu.insertBefore(createBtnMenu(name), headMenu.firstChild);
}

export { createView };
