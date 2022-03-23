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
     * Parse data into Object
     * @param {any} data input data
     * @returns {object}
     */
    intoObject(data) {
        if (typeof data === "string") {
            return JSON.parse(data);
        } else if (Array.isArray(data)) {
            let i = 0,
                obj = {};
            for (i; i < data.length; ++i) {
                obj[i] = data[i];
            }
            return obj;
        } else if (typeof data === "object") {
            return data;
        }
        return {};
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
