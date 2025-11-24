import { DOM } from "../lib/HtmlModifier";
import { eventLists, svgData } from "../lib/Constant";
import { listeners } from "./Events";
import { Debug } from "./Debug";
import win from "global";

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
    console.log(window.WAPI);
    const { name, version, icon } = details,
        after = DOM.getElement("header > header") ? "header > header" : "header",
        { paneOne } = window.WAPI.WebClasses.Main;


    // console.log(after, paneOne);
    DOM.createElement({
        tag: "header",
        id: "wayfuPanel",
        after: after,
        html: html.replace(/VERSION/, version).replace(/WA_VERSION/, window.WAPI.WA_VERSION),
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
    const { paneOne } = window.WAPI.WebClasses.Main,
        menuButton = DOM.getElement(`.${paneOne} header span button`),
        svgEl = DOM.getElement("svg", menuButton),
        spanSvg = svgEl.parentElement, // span
        spanContainer = spanSvg.parentElement, // div
        innerContainer = spanContainer.parentElement, // div
        outerContainer = innerContainer.parentElement,
        siblingSpanCont = spanContainer.nextSibling, // div
        menuDiv = menuButton.parentElement, // span
        menuItem = menuDiv.parentElement, // tab-index
        headMenu = menuItem.parentElement;
    // headMenuContainer = headMenu.parentElement;

    /** @type {(name: string) => HTMLElement} */
    const createBtnMenu = (name) => {
        const btnSpan = (() => {
            let ico = DOM.createSVGElement(svgData.wayFuSvg, {
                width: "24",
                height: "24",
                viewBox: "0 0 128 128",
                class: "wayfu-app-icon",
                // fillRule: "evenodd",
            });

            let span = DOM.createElement({
                tag: "span",
                classid: spanSvg.classList.value,
                "data-testid": "wayfu-app",
                "data-icon": "wayfu-app",
                html: ico.outerHTML,
            });

            return DOM.createElement({
                tag: "div",
                classid: spanContainer.classList.value,
                html: span.outerHTML,
            });
        })();

        const btnInner = (() => {
            let btnData = DOM.createElement({
                tag: innerContainer.tagName.toLocaleLowerCase(),
                classid: innerContainer.classList.value,
                html: btnSpan.outerHTML,
            });

            let btnSibling = siblingSpanCont !== null ? siblingSpanCont.cloneNode(true) : null;
            if (btnSibling) btnData.appendChild(btnSibling);

            return DOM.createElement({
                tag: outerContainer.tagName.toLocaleLowerCase(),
                classid: outerContainer.classList.value,
                html: btnData.outerHTML,
            });
        })();

        const btnDiv = DOM.createElement({
            tag: menuButton.tagName.toLocaleLowerCase(),
            type: "button",
            classid: menuButton.classList.value,
            tabindex: "0",
            "data-tab": "2",
            "aria-disabled": false,
            title: `${name}`,
            "aria-label": `${name}`,
            id: "wayfuToggle",
            "data-target": "wayfuPanel",
            html: btnInner.outerHTML,
        });

        const btnWarp = DOM.createElement({
            tag: menuDiv.tagName.toLocaleLowerCase(),
            classid: menuDiv.classList.value,
            "data-testid": "menu-bar-wayfu-app",
            html: btnDiv.outerHTML,
        });

        return DOM.createElement({
            tag: menuItem.tagName.toLocaleLowerCase(),
            "data-tab": "2",
            tabindex: "0",
            html: btnWarp.outerHTML,
        });
    };

    headMenu.insertBefore(createBtnMenu(name), menuItem);
}

export { createView };
