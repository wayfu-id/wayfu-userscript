import { options } from "../models/Settings";

export class Debug {
    static current(e) {
        if (options.debug) console.log("test", e);
    }
}
