import { Queue, Settings, Message, Client, Worker, EventBus } from "./structures/index";
import WAPI from "@wayfu/simple-wapi";
import DOM from "@wayfu/wayfu-dom";
import XLSX from "@wayfu/simple-xlsx";
import Waydown from "@wayfu/waydown";
import WayFuUI from "./ui/App";
import React from "react";
import ReactDOM from "react-dom/client";
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
        React: typeof React;
        ReactDOM: typeof ReactDOM;
    }
}

class App extends EventBus implements App {
    private constructor(wapi: WAPI) {
        super();
        return this._init(wapi);
    }

    _init(wapi: WAPI) {
        this.WAPI = wapi;
        this.DOM = DOM;
        this.XLSX = XLSX;
        this.Waydown = Waydown;
        // this.React = target.require("React");
        // this.ReactDOM = target.require("ReactDOM");

        console.log(this);
        this.Client = Client.getClient(this);
        this.Message = Message.getMessage(this);
        this.Queue = Queue.getOrCreate();
        this.Settings = Settings.getSettings(this);
        this.Worker = Worker.getOrCreate();
        this._registerPanel();
        console.log(this, unsafeWindow, window);
        return this;
    }

    _registerPanel() {
        const { React, ReactDOM } = window;
        const mount = document.createElement("div");
        // console.log(mount, 1);
        mount.id = "wayfu-root";
        document.querySelector("div#app")?.appendChild(mount);
        console.log(React, ReactDOM);
        // console.log(reactRoot, component);
        ReactDOM.createRoot(mount).render(React.createElement(WayFuUI, { style: "dark" }));
        // console.log(reactRoot);
        // console.log(mount, 3);
    }

    static init(target?: typeof unsafeWindow) {
        target = target ?? unsafeWindow;
        let { React, ReactDOM } = target;
        if (!!target.require && (!React || !ReactDOM)) {
            React = target.require("React");
            ReactDOM = target.require("ReactDOM");
            // console.log(React, ReactDOM);
            // window["React"] = React;
            // window["ReactDOM"] = ReactDOM;
            // console.log(window);
        }
        let loopTimer = setTimeout(() => {
            DOM.has("div.two").then(() => {
                clearTimeout(loopTimer);
                let _wapi = WAPI.init(target);
                if (!_wapi) {
                    throw new Error("WAPI failed to initialize.");
                }
                target.WayFu = new App(_wapi);
            });
        }, 5000);
    }
}

interface App extends EventBus {
    WAPI: WAPI;
    // React: typeof React;
    // ReactDOM: typeof ReactDOM;
    DOM: typeof DOM;
    XLSX: typeof XLSX;
    Waydown: typeof Waydown;
    Client: Client;
    Queue: Queue;
    Message: Message;
    Settings: Settings;
    Worker: Worker;
}

export default App;
