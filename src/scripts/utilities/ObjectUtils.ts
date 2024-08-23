import { parseValue } from ".";

/**
 * Create an Object from Filtered Object
 * @param {any} obj inputed object
 * @param {any | Array<any>} filter What value of the filter
 * @param {string} [type="key"] Type filter `"key" | "val"`
 */
function createFilteredObject (obj: any, filter: any | Array<any>, type: string = "key") {
    let useFilter = Array.isArray(filter) ? filter : [filter];
    return Object.fromEntries(
        Object.entries(obj).filter(([k, v]) => {
            let val = type == "key" ? k : v;
            return useFilter.some((e) => val === e);
        })
    );
};

/**
 * Get value from Object
 * @param {string} key Object key
 * @param {Object} object Object target, default is `this` class
 * @param {number} [depth=2] dept default is `2`
 */
function findValue (key: string, object: any, depth: number = 2) {
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
 * Parse data into Object. Also parse the value of object items
 * @param {any | Array<any>} data input data
 * @param {boolean} [parse=true] is it parsed value? default `true`
 */
function intoObject (data: any | Array<any>, parse: boolean = true) {
    let obj: {[k: string | number]: any} = {};
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
 * Check and detect the string is JSON valid or not.
 * If it's valid, then return it's JSON value.
 * If it isn't valid, then return it as null.
 * @param {string} str JSON string
 */
function JSONParse (str: string) {
    return new Promise((done) => {
        try {
            done(JSON.parse(str));
        } catch (e) {
            done(null);
        }
    }) as Promise<JSON | null>;
}; 

export { createFilteredObject, findValue, intoObject, JSONParse,  };
