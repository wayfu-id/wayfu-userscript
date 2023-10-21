import WAPI from "@wayfu/simple-wapi";
import DOM from "@wayfu/wayfu-dom";
import XLSX from "@wayfu/simple-xlsx";
import Waydown from "@wayfu/waydown";

import ScriptManager from "./structures/ScriptManager";
import InterfaceController from "./controllers/InterfaceController";

export default class App extends ScriptManager {
    /**
     *
     * @param {Window} target
     */
    constructor(target) {
        super();
        this.initialize(target);
    }
    /**
     * @param {window} target
     * @returns
     */
    initialize(target) {
        // Initialize WAPI Module;
        // Object.defineProperties(App.prototype, { WAPI: loadWapi(target) });
        this.WAPI = WAPI.init(target);
        this.DOM = DOM;
        this.XLSX = XLSX;
        this.Waydown = Waydown;
        // this.Jobs = Jobs;
        // this.Utils = Utils;
        // this.Modal = Modal;

        // Create App Panel
        this.registerPanel();
        // let arr = Queue.set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        // while (arr.now) {
        //     setTimeout(() => {
        //         console.log(`Current queue item ${arr.run()}`);
        //     }, 1000);
        // }

        console.log(this);
        return;
        // Initialize and Register the User
        this.registerUser();
        // Initialize and Register the App Options
        this.registerOptions();
        // Whenever all loaded
        this.onLoadView();
        // Don't Forget to Check for Update
    }
    registerPanel() {
        const details = ((fn, info) => {
            let html = fn("pnl"),
                style = fn("css"),
                icon = fn("ico", "url");

            return Object.assign({ html, style, icon }, info);
        })(this.getResource, this.appInfo);

        this.UI = InterfaceController.init(this);
        // DOM.get("#wayfuPanel .menus").at(0).click();
        // DOM.get("#wayfuToggle").at(0).click();
    }
    registerUser() {
        user.init().gettingData();
        // console.info('User Data Loaded Successfully.');
    }
    registerOptions() {
        options.init();
        // console.info('Options Loaded Successfully.');
    }
    async onLoadView() {
        const MIME = [
            ".txt",
            ".csv",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];
        // console.log(settings);
        DOM.setElementStyle("#wayfuPanel", {
            "background-color": options.themeColor,
        }).setElement("input#getFile", {
            accept: MIME.join(","),
        });

        DOM.getElement("#wayfuPanel .menus", true)[options.activeTab || 0].click();
        if (options.openPanel) DOM.getElement("#toggleApp").click();

        changes.checkUpdate();
        // console.log(this);
        // console.log(`${this.name} ${this.version} - ${this.tagLine}`);
    }
    debug(e) {
        e = typeof e === "boolean" ? e : true;
        options.setOption("debug", e);
        if (e) {
            Object.assign(
                App.prototype,
                { options, user, chat, csvFile },
                window.WAPI_V2
            );
        } else {
            for (let key of [
                "options",
                "user",
                "chat",
                "csvFile",
                ...Object.keys(window.WAPI_V2),
            ]) {
                delete App.prototype[key];
            }
        }
        return this;
    }
    static async init() {
        if (await DOM.has("div.two")) {
            unsafeWindow.WayFu = new App(unsafeWindow);
        } else {
            await App.init();
        }
    }
}
