import { Queue, Settings, Message, Client, Worker, EventBus } from "./structures/index";
import WAPI from "@wayfu/simple-wapi";
import DOM from "@wayfu/wayfu-dom";
import XLSX from "@wayfu/simple-xlsx";
import Waydown from "@wayfu/waydown";
import * as React from "react";
import * as ReactDOM from "react-dom";

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

        this.Client = Client.getClient(this);
        this.Message = Message.getMessage(this);
        this.Queue = Queue.getOrCreate();
        this.Settings = Settings.getSettings(this);
        this.Worker = Worker.getOrCreate();
        console.log(this);
        return this;
    }

    static init(target?: Window) {
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

interface App extends EventBus {
    WAPI: WAPI;
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
