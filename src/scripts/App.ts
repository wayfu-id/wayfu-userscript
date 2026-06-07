import {
    Queue,
    Settings,
    Message,
    Client,
    Worker,
    EventBus,
    Reports,
    ScriptManager,
    FileRecipient,
} from "./structures/index";
import WAPI from "@wayfu/simple-wapi";
import DOM from "@wayfu/wayfu-dom";
import XLSX from "@wayfu/simple-xlsx";
import Waydown from "@wayfu/waydown";
import { AppProvider, Main, ModalStack } from "./ui/Index";
// import Main from "./ui/Main";
// import ModalStack from "./ui/ModalStack";
import React from "react";
import ReactDOM from "react-dom/client";
import * as Event from "./events/index";
// import Main from "./ui/Main";
// import WayFuUI from "./ui/App";
declare global {
    interface Window {
        WayFu: App;
        Debug: {
            VERSION: string;
        };
        WAPI: WAPI;
        DOM?: DOM;
        XLSX: typeof XLSX;
        Waydown: typeof Waydown;
    }
}
interface App extends EventBus {
    WAPI: WAPI;
    XLSX: typeof XLSX;
    Waydown: typeof Waydown;
    Client: Client;
    Queue: Queue;
    Message: Message;
    Manager: ScriptManager;
    Report: Reports;
    Recipient: FileRecipient | null;
    Settings: Settings;
    Worker: Worker;
}

class App extends EventBus implements App {
    readonly #_whatsappRootApp = "div#app";
    readonly #_rootHost = "wayfu-host";
    readonly #_rootModalElementId = "wf-modal-root";
    #_uiReady = false;
    #_themeObserver?: MutationObserver;
    #_chatObserver?: MutationObserver;

    XLSX = XLSX;
    Waydown = Waydown;

    Manager = ScriptManager.getManager();
    Client = Client.getClient();
    Message = Message.getMessage();
    Queue = Queue.getOrCreate();
    Recipient: FileRecipient | null = null;
    Report = Reports.getOrCreate();
    Settings = Settings.getSettings();
    Worker = Worker.getOrCreate();

    private constructor(wapi: WAPI) {
        super();

        this.WAPI = wapi;
        return this._init();
    }

    private _init() {
        this._initListener();
        this._initEvents();
        this._initUserInterface();
        return this;
    }

    private _initListener() {
        Event.registerCoreEvent(this);
        Event.registerConfigEvent(this);
        Event.registerMessageEvent(this);
        Event.registerModalEvents(this);
        Event.registerRecipientEvents(this);
        Event.registerUserEvents(this);
    }

    private _initEvents() {
        this.trigger("setting:load");
        this.trigger("user:load", null);
    }

    private _initUserInterface() {
        const host = this.Host ?? document.createElement("div"),
            style = this._getResource("css"),
            { theme } = this.Settings;

        DOM.addStyle(style, { id: "wayfuStyle" });

        if (!host.id) host.id = this.#_rootHost;

        this.WhatsAppRoot?.append(host);

        ReactDOM.createRoot(host).render(
            React.createElement(
                AppProvider,
                { app: this },
                React.createElement(Main, { style: theme }),
                React.createElement(ModalStack), // portal renders into #wf-modal-root
            ),
        );
        this.setUiReady(true);
    }

    private _getResource(key: string) {
        return this.Manager?.getResource(key);
    }

    get themeObserver() {
        return this.#_themeObserver;
    }

    get chatObserver() {
        return this.#_chatObserver;
    }

    get isUiReady() {
        return this.#_uiReady;
    }

    get appInfo() {
        return this.Manager?.appInfo;
    }

    get WhatsAppRoot() {
        return document.querySelector(this.#_whatsappRootApp);
    }

    get Host() {
        return document.getElementById(this.#_rootHost);
    }

    get ModalRoot() {
        return document.getElementById(this.#_rootModalElementId);
    }

    setUiReady(value: boolean) {
        this.#_uiReady = value;
    }

    setThemeObserver(observer: MutationObserver) {
        this.#_themeObserver = observer;
    }

    setChatObserver(observer: MutationObserver) {
        this.#_chatObserver = observer;
    }

    static init(target?: typeof unsafeWindow) {
        target = target ?? unsafeWindow;

        let loopTimer = setTimeout(() => {
            DOM.has("div.two").then(() => {
                clearTimeout(loopTimer);
                let _wapi = WAPI.init(target);
                if (!_wapi) {
                    throw new Error("WAPI failed to initialize.");
                }
                const app = new App(_wapi);
                Object.defineProperties(target, {
                    WayFu: {
                        value: app,
                        enumerable: false,
                        configurable: false,
                        writable: false,
                    },
                });
            });
        }, 5000);
    }
}

export default App;
