import { Queue, Settings, Message, Client, Worker } from "./structures/index";
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

class App implements App {
    private constructor(wapi: WAPI) {
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
                let _wapi = WAPI.init(target);
                if (_wapi) {
                    target.WayFu = new App(_wapi);
                }
                clearTimeout(loopTimer);
            });
        }, 5000);
    }
}

interface App {
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
