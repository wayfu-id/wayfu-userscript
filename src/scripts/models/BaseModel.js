import { parseValue } from "../lib/Util";
export default class BaseModel {
    /**
     * Set message propreties
     * @param {object} props Message properties
     * @param {boolean?} parse
     * @returns
     */
    setProperties(props, parse = true) {
        props = this.intoObject(props, parse);
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
    serialize(input) {
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
     * Parse data into Object. Also parse the value of object items
     * @param {String | Array | Object} data input data
     * @param {boolean} parse input data
     * @returns {{[k:string]: any}}
     */
    intoObject(data, parse = true) {
        let obj = {};
        if (!data) return obj;

        if (typeof data === "string") {
            obj = JSON.parse(data);
        } else if (Array.isArray(data)) {
            data.forEach((e, i) => (obj[i] = e));
        } else if (typeof data === "object") {
            obj = data;
        }

        if (Object.keys(obj).length !== 0) {
            for (const key in obj) {
                obj[key] = parse ? parseValue(obj[key]) : obj[key];
            }
        }

        return obj;
    }

    /**
     * Get value from Object
     * @param {string} key Object key
     * @param {{} | this} object Object target, default is `this` class
     * @param {number | 2} depthrecursion dept default is `2`
     * @returns
     */
    findObjectValue(key, object, depth = 2) {
        if (!depth) return null;

        object = object || this;
        let value = object[key];
        if (value) return value;

        depth -= 1;
        for (let id of Object.keys(object)) {
            if (object[id] && typeof object[id] === "object") {
                value = this.findObjectValue(key, object[id], depth);
            }
        }

        return value;
    }
}
