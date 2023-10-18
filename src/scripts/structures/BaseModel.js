import { intoObject, findValue } from "../utilities";

/** @type {import("../../index").BaseModel} */
export default class BaseModel {
    /** @param {import("../../index")} app  */
    constructor(app) {
        this.app = app;
    }

    /**
     * Set class propreties
     * @param {object} props properties
     * @param {boolean?} parse
     * @returns
     */
    _setProp(props, parse = true) {
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
     * @param {typeof Date | string | number | {}} input
     * @returns {string}
     */
    _serialize(input) {
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
     * @param {number | 2} depth dept default is `2`
     * @returns
     */
    _find(key, depth) {
        return findValue(key, this, depth);
    }
}
