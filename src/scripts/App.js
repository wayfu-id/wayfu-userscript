import GM_Library from "./models/GM_Library";
import { user } from "./models/Users";
import { message } from "./models/Messages";
import { options } from "./models/Settings";
import { chat } from "./models/Chatrooms";
import { csvFile } from "./models/CSVFile";
import { createView } from "./modules/PanelView";
import { changes } from "./models/Changeslog";
import { DOM } from "./lib/HtmlModifier";
import { loadWapi } from "./lib/WAPI";

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
        loadWapi(target);
        // Create App Panel
        this.registerPanel();
        // Initialize and Register the User
        this.registerUser();
        // Initialize and Register the App Options
        this.registerOptions();
        // Whenever all loaded
        this.onLoadView();
        // Don't Forget to Check for Update
    }
    registerPanel() {
        chat.init();
        // console.log(chat);
        const html = this.getResource("pnl"),
            style = this.getResource("css"),
            icon = this.getResource("ico", "url"),
            details = Object.assign({}, this.appInfo, { icon: icon });

        createView(html, style, details);
        // console.info('Panel Created Successfully.');
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
        if (options.openPanel) {
            DOM.getElement("#wayfuToggle").click();
        } else {
            DOM.setElementStyle("#wayfuPanel", { visibility: "collapse" });
        }

        window.WAPI.Chat.clearAllDraft();

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
                { message, options, user, chat, csvFile },
                window.WAPI
            );
        } else {
            for (let key of [
                "message",
                "options",
                "user",
                "chat",
                "csvFile",
                ...Object.keys(window.WAPI),
            ]) {
                delete App.prototype[key];
            }
        }
        return this;
    }
}
