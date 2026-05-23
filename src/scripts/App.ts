import { Queue, Settings, Message, Client, Worker, EventBus, ScriptManager, FileRecipient } from "./structures/index";
import WAPI from "@wayfu/simple-wapi";
import DOM from "@wayfu/wayfu-dom";
import XLSX from "@wayfu/simple-xlsx";
import Waydown from "@wayfu/waydown";
import Main from "./ui/Main";
import ModalStack from "./ui/fragments/ModalStack";
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
    DOM: typeof DOM;
    XLSX: typeof XLSX;
    Waydown: typeof Waydown;
    Client: Client;
    Queue: Queue;
    Message: Message;
    Manager: ScriptManager;
    Recipiemt: FileRecipient | null;
    Settings: Settings;
    Worker: Worker;
}

class App extends EventBus implements App {
    private _whatsappRootApp: string;
    private _rootElementId: string;
    private _rootModalElementId: string;

    private constructor(wapi: WAPI) {
        super();

        this.WAPI = wapi;
        this.DOM = DOM;
        this.XLSX = XLSX;
        this.Waydown = Waydown;

        this.Manager = ScriptManager.getManager();
        this.Client = Client.getClient();
        this.Message = Message.getMessage();
        this.Settings = Settings.getSettings();
        this.Queue = Queue.getOrCreate();
        this.Worker = Worker.getOrCreate();
        this.Recipiemt = null;

        this._whatsappRootApp = "div#app";
        this._rootElementId = "wayfu-root";
        this._rootModalElementId = "wf-modal-root";

        console.log(this);
        return this._init();
    }

    private _init() {
        console.log("init begin");
        this._initListener();
        console.log("after init listener");
        this._initEvents();
        console.log("affer fireing initial events");
        this._initUserInterface();
        console.log("UI should be construct");
        return this;
    }

    private _initListener() {
        Event.registerCoreEvent(this);
        Event.registerConfigEvent(this);
        Event.registerMessageEvent(this);
        Event.registerRecipientEvents(this);
        Event.registerUserEvents(this);
    }

    private _initEvents() {
        this.trigger("setting:load");
        this.trigger("user:load", null);
    }

    private _initUserInterface() {
        const root = this.Root ?? document.createElement("div"),
            modal = this.ModalRoot ?? document.createElement("div"),
            style = this._getResource("css"),
            { theme } = this.Settings;

        DOM.addStyle(style, { id: "wayfuStyle" });

        if (!root.id) root.id = this._rootElementId;
        if (!modal.id) modal.id = this._rootModalElementId;

        this.WhatsAppRoot?.append(root, modal);
        ReactDOM.createRoot(root).render(React.createElement(Main, { app: this, style: theme }));
        ReactDOM.createRoot(modal).render(React.createElement(ModalStack, { app: this }));
        // const app = React.createElement(Main, { app: this, style: theme });

        // console.log(app);
        // console.log(React, ReactDOM);
    }

    private _getResource(key: string) {
        return this.Manager?.getResource(key);
    }

    get appInfo() {
        return this.Manager?.appInfo;
    }

    get WhatsAppRoot() {
        return document.querySelector(this._whatsappRootApp);
    }

    get Root() {
        return document.getElementById(this._rootElementId);
    }

    get ModalRoot() {
        return document.getElementById(this._rootModalElementId);
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
