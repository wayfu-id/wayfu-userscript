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
        after = DOM.getElement("header > header") ? "header > header" : "header",
        { paneOne } = window.WAPI.WebClassesV3;

    // console.log(after, paneOne);
    DOM.createElement({
        tag: "header",
        id: "wayfuPanel",
        after: after,
        html: html.replace(/VERSION/, version).replace(/WA_VERSION/, window.WAPI.Debug.VERSION),
    });

    DOM.addStyle(style, { id: "wayfuStyle" }).setElement("img.appIco", { src: icon });
    if (after !== "header") DOM.setElementStyle(`.${paneOne} header`, { display: "grid" });

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
    const { paneOne } = window.WAPI.WebClassesV3,
        menuButton = DOM.getElement(`.${paneOne} header span [role='button']`),
        menuDiv = menuButton.parentElement, // stle: --xtransform
        menuItem = menuDiv.parentElement, // span
        headMenu = menuItem.parentElement, // tab-index
        headMenuContainer = headMenu.parentElement;

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
            tag: menuButton.tagName.toLocaleLowerCase(),
            role: "button",
            classid: menuButton.classList.value,
            tabindex: "0",
            "data-tab": "2",
            "aria-disabled": false,
            title: `${name}`,
            "aria-label": `${name}`,
            html: btnSpan.outerHTML,
        });

        const btnWarp = DOM.createElement({
            tag: menuDiv.tagName.toLocaleLowerCase(),
            classid: menuDiv.classList.value,
            id: "wayfuToggle",
            "data-testid": "menu-bar-wayfu-app",
            "data-target": "wayfuPanel",
            html: btnDiv.outerHTML,
        });

        const warpMenu = DOM.createElement({
            tag: menuItem.tagName.toLocaleLowerCase(),
            classid: menuItem.classList.value,
            html: btnWarp.outerHTML,
        });

        return DOM.createElement({
            tag: headMenu.tagName.toLocaleLowerCase(),
            "data-tab": "2",
            tabindex: "0",
            html: warpMenu.outerHTML,
        });
    };

    headMenuContainer.insertBefore(createBtnMenu(name), headMenu);
}

export { createView };
