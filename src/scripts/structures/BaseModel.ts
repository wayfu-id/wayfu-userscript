import { intoObject, findValue } from "../utilities";
import App from "App";

export default class BaseModel {
    [k: string | number]: any;
    app: App;

    constructor(app: App) {
        this.app = app;
    }

    /**
     * Set class propreties
     * @param {object} props properties
     * @param {boolean?} [parse=true]
     * @returns
     */
    _setProp(props: any, parse: boolean = true) {
        props = intoObject(props, parse);
        for (let key in props) {
            if (this.hasOwnProperty(key)) {
                this[key] = props[key];
            }
        }
        return this;
    }

    /**
     * Serialize to string
     * @param {typeof Date | string | number | {[k: string | number]: any}} input
     */
    _serialize(input: typeof Date | string | number | {[k: string | number]: any}) {
        if (typeof input === "object") {
            let arr = [];
            for (let prop in input) {
                if (input.hasOwnProperty(prop)) {
                    arr.push(prop + "=" + encodeURI(input[prop]));
                }
            }
            return arr.join("&");
        }
        if (input.toString) return input.toString();
        return input;
    }

    /**
     * Get value from Object
     * @param {string} key Object key
     * @param {number} [depth=2] dept default is `2`
     */
    _find(key: string, depth: number = 2) {
        return findValue(key, this, depth);
    }
}
