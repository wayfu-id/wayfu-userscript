import { Queue, Settings, Message, Client, Worker, EventBus } from "./structures/index";
import WAPI from "@wayfu/simple-wapi";
import DOM from "@wayfu/wayfu-dom";
import XLSX from "@wayfu/simple-xlsx";
import Waydown from "@wayfu/waydown";
import Main from "./ui/Main";
import React from "react";
import ReactDOM from "react-dom/client";
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

        // console.log(this);
        this.Client = Client.getClient(this);
        this.Message = Message.getMessage(this);
        this.Queue = Queue.getOrCreate();
        this.Settings = Settings.getSettings(this);
        this.Worker = Worker.getOrCreate();
        this._registerPanel();
        // console.log(this, unsafeWindow, window);
        return this;
    }

    _registerPanel() {
        const mount = document.createElement("div"),
            style = this.getResource("css"),
            { theme } = this.Settings;

        DOM.addStyle(style, { id: "wayfuStyle" });

        mount.id = "wayfu-root";
        document.querySelector("div#app")?.appendChild(mount);
        const app = React.createElement(Main, { app: this, style: theme });
        console.log(app);
        // console.log(React, ReactDOM);
        ReactDOM.createRoot(mount).render(app);
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
                target.WayFu = new App(_wapi);
            });
        }, 5000);
    }
}

export default App;
