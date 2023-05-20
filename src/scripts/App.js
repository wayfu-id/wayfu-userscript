import GM_Library from "./models/GM_Library";
import { user } from "./models/Users";
import { options } from "./models/Settings";
import { chat } from "./models/Chatrooms";
import { csvFile } from "./models/CSVFile";
// import { createView } from "./modules/PanelView";
import { changes } from "./models/Changeslog";
// import { DOM } from "./lib/HtmlModifier";
import { loadWapi } from "./lib/WAPI";
import Injected from "./utils/Injected";
import DOM from "./utils/DOM";
import InterfaceController from "./controllers/InterfaceController";
import { Jobs } from "./structures/Queue";
import * as Utils from "./utils";
import Modal from "./utils/Modal";

export default class App extends GM_Library {
    /**
     *
     * @param {Window} target
     */
    constructor(target) {
        super();
        this.initialize(target);
    }
    initialize(target) {
        // Initialize WAPI Module;
        // Object.defineProperties(App.prototype, { WAPI: loadWapi(target) });
        this.WAPI = new Injected(loadWapi(target));
        this.DOM = DOM;
        this.Jobs = Jobs;
        this.Utils = Utils;
        this.Modal = Modal;

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

        this.UI = InterfaceController.init(details);
        DOM.get("#wayfuPanel .menus").at(0).click();
        DOM.get("#wayfuToggle").at(0).click();
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

        DOM.getElement("#wayfuPanel .menus", true)[
            options.activeTab || 0
        ].click();
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
}
