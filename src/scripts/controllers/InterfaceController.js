import BaseController from "./BaseController";
import { eventLists, mainMenu } from "../config";
import { listeners } from "./EventController";
// import DOM from "@wayfu/wayfu-dom";

/**
 * @typedef {import("@wayfu/wayfu-dom").svgElementDetails} svgElementDetails
 *
 * @typedef {{
 *      menuItem: {[k: string]: string},
 *      menuButton: {[k: string]: string},
 *      button: {[k: string]: string},
 *      icon: {
 *          svg: svgElementDetails | svgElementDetails[],
 *          attr: SVGSVGElement
 *      }
 *  }} menuButtonDetails
 */

export default class InterfaceController extends BaseController {
    /** @param {import("../../index")} app  */
    constructor(app) {
        super(app);
        return this._init();
    }

    /**
     *
     * @param {menuButtonDetails} details
     * @returns
     */
    _createButtonMenu(details) {
        const { DOM, WAPI } = this,
            { item, button } = WAPI.WebClasses.V2;

        let { menuItem, menuButton, button: btn, icon } = details;

        const itemMenu = DOM.create("div", Object.assign(menuItem, { classid: item }));

        const buttonMenu = DOM.create(
            Object.assign({ tag: "div" }, menuButton, { classid: button })
        ).insertTo(itemMenu);

        DOM.create("span", btn)
            .insert(DOM.createIcon(icon.svg, icon.attr))
            .insertTo(buttonMenu);

        return itemMenu;
    }

    /**
     * Inject all view
     */
    _createView() {
        const { DOM, WAPI } = this,
            { menu, menuDefault } = WAPI.WebClasses.V2;

        const { style, name, ...details } = (({ app }) => {
            let { getResource: fn, appInfo: info } = app;
            return Object.assign({ html: fn("pnl"), style: fn("css") }, info);
        })(this);
        const props = (({ html, version }, { VERSION }) => {
            return {
                id: "wayfuPanel",
                after: "header",
                html: html.replace(/VERSION/, version).replace(/WA_VERSION/, VERSION),
            };
        })(details, WAPI);

        let ourView = DOM.get(`header #wayfuPanel`).isEmpty,
            noStyle = DOM.get(`#wayfuStyle`).isEmpty;

        if (noStyle) DOM.addStyle(style, { id: "wayfuStyle" });
        if (ourView) {
            let waMenu = DOM.get(`header .${menu}.${menuDefault} span`);

            DOM.create("header", props);
            this._createButtonMenu(mainMenu(name)).insertBefore(waMenu, true);
        }
    }

    _init() {
        this._createView();

        return this._patch();
    }

    _patch() {
        Object.defineProperties(this, {
            Events: {
                value: {},
                enumerable: true,
            },
            Modal: {
                value: {},
                enumerable: true,
            },
        });

        return super._init();
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
     * @param {import("../App").default} app
     * @returns
     */
    static init(app) {
        return new InterfaceController(app);
    }
}
