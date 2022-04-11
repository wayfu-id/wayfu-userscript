import GM_Library from "./models/GM_Library";
import { user } from "./models/Users";
import { options } from "./models/Settings";
import { chat } from "./models/Chatrooms";
import { createView } from "./modules/PanelView";
import { changes } from "./models/Changeslog";
import { DOM } from "./lib/DOM";
import { loadWapi } from "./lib/WAPI";

export default class App extends GM_Library {
    constructor() {
        super();

        this.initialize();
    }
    initialize() {
        // Initialize WAPI Module;
        loadWapi(unsafeWindow);
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
        chat.init(window.WAPI.WebClasses.active);
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
        // console.log(settings);
        DOM.setElementStyle("#wayfuPanel", {
            "background-color": options.themeColor,
        });
        DOM.getElement("#panelBody .menus", true)[options.activeTab || 0].click();
        if (options.openPanel) DOM.getElement("#toggleApp").click();

        changes.checkUpdate();

        // console.log(this);
        // console.log(`${this.name} ${this.version} - ${this.tagLine}`);
    }
}
