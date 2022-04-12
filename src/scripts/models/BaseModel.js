import { parseValue } from "../lib/Util";
export default class BaseModel {
    /**
     * Set message propreties
     * @param {object} props Message properties
     * @returns
     */
    setProperties(props) {
        props = this.intoObject(props);
        for (let key in props) {
            if (this.hasOwnProperty(key)) {
                this[key] = props[key];
            }
        }
        return this;
    }

    /**
     * Serialize to string
     * @param {any} input
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
        return input;
    }

    /**
     * Parse data into Object. Also parse the value of object items
     * @param {any} data input data
     * @returns {object}
     */
    intoObject(data) {
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
                obj[key] = parseValue(obj[key]);
            }
        }

        return obj;
    }

    /**
     * Get value from Object
     * @param {string} key Object key
     * @param {object} object Object target
     * @returns
     */
    findObjectValue(key, object) {
        object = object || this;
        let value;
        Object.keys(object).some((k) => {
            if (k === key) {
                value = object[k];
                return true;
            }
            if (object[k] && typeof object[k] === "object") {
                value = this.findObjectValue(key, object[k]);
                return value !== undefined;
            }
        });
        return value;
    }
}
