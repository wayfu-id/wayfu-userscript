import { parseValue } from "./DataUtils";

/**
 * Parse data into Object. Also parse the value of object items
 * @param {String | Array | Object} data input data
 * @param {boolean} parse input data
 * @returns {{[k:string]: any}}
 */
const intoObject = (data, parse = true) => {
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
};

/**
 * Get value from Object
 * @param {string} key Object key
 * @param {Object} object Object target, default is `this` class
 * @param {number | 2} depthrecursion dept default is `2`
 * @returns
 */
const findValue = (key, object, depth = 2) => {
    if (!depth) return null;

    object = object || {};
    let value = object[key];
    if (value) return value;

    depth -= 1;
    for (let id of Object.keys(object)) {
        if (object[id] && typeof object[id] === "object") {
            value = findValue(key, object[id], depth);
        }
    }

    return value;
};

/**
 * Check and detect the string is JSON valid or not.
 * If it's valid, then return it's JSON value.
 * If it isn't valid, then return it as null.
 * @param {string} str JSON string
 * @returns {Promise<JSON | null>}
 */
const JSONParse = (str) => {
    return new Promise((done) => {
        try {
            done(JSON.parse(str));
        } catch (e) {
            done(null);
        }
    });
};

/**
 * Create an Object from Filtered Object
 * @param {ObjectConstructor} obj inputed object
 * @param {Object | Array<Object>} filter What value of the filter
 * @param {"key" | "val"} type Type filter key or value
 * @return {ObjectConstructor} new object
 */
const createFilteredObject = (obj, filter, type = "key") => {
    let useFilter = Array.isArray(filter) ? filter : [filter];
    return Object.fromEntries(
        Object.entries(obj).filter(([k, v]) => {
            let val = type == "key" ? k : v;
            return useFilter.some((e) => val === e);
        })
    );
};

export { intoObject, findValue, JSONParse, createFilteredObject };
