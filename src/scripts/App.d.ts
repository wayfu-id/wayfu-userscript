// import GM_Library from "./models/GM_Library";
import ScriptManager from "./structures/ScriptManager";
import WAPI from "@wayfu/simple-wapi";
import DOM from "@wayfu/wayfu-dom";
import XLSX from "@wayfu/simple-xlsx";

export default class App extends ScriptManager {
    constructor(target: Window);
    DOM: typeof DOM;
    XLSX: typeof XLSX;
    WAPI: WAPI;
    debug(e: any): App;

    static init(): Promise<void>;
}
