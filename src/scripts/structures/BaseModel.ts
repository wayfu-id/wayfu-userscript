import { intoObject, findValue, parseValue } from "../utilities/index";
import App from "../App";

export default class BaseModel {
    [k: string | number]: any;
    defaultProp: { [k: string]: any } = {};

    constructor() {}

    /**
     * Get value from Object
     * @param {string} key Object key
     * @param {number} [depth=2] dept default is `2`
     */
    _find(key: string, depth: number = 2) {
        return findValue(key, this, depth);
    }

    /**
     * Serialize to string
     * @param {typeof Date | string | number | {[k: string | number]: any}} input
     */
    _serialize(input: typeof Date | string | number | { [k: string | number]: any }) {
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
     * Set class propreties
     * @param {object} props properties
     * @param {boolean?} [parse=true]
     * @returns
     */
    _setProps(props: any, parse: boolean = true) {
        props = intoObject(props, parse);
        for (let key in props) {
            this._setProp(key, props[key]);
        }
        return this;
    }

    /**
     * Set single property
     * @param {string | number} key property name
     * @param {any} value property value
     */
    _setProp(key: string | number, value: any) {
        value = parseValue(value);
        if (this.hasOwnProperty(key) || this.defaultProp.hasOwnProperty(key)) {
            this[key] = value;
        }
        return this;
    }
}
