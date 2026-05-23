import { parseValue } from ".";

/**
 * Create an Object from Filtered Object
 * @param obj inputed object
 * @param filter What value of the filter
 * @param type Type filter `"key" | "val"`
 */
function createFilteredObject<T extends object, K extends keyof T>(obj: T, filter: K | K[], type?: "key"): Pick<T, K>;
function createFilteredObject<T extends object>(obj: T, filter: any | any[], type: "value"): Partial<T>;
function createFilteredObject(obj: any, filter: any | Array<any>, type: string = "key") {
    let useFilter = Array.isArray(filter) ? filter : [filter];
    return Object.fromEntries(
        Object.entries(obj).filter(([k, v]) => {
            let val = type == "key" ? k : v;
            return useFilter.some((e) => val === e);
        }),
    );
}

/**
 * Get value from Object
 * @param key Object key
 * @param object Object target, default is `this` class
 * @param depth dept default is `2`
 */
function findValue(key: string, object: any, depth: number = 2) {
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
}

/**
 * Parse data into Object. Also parse the value of object items
 * @param data input data
 * @param parse it parsed value? default `true`
 */
function intoObject<T extends Object>(data: T | Array<any>, parse: boolean = true): T {
    let obj: { [k: string | number]: any } = {};
    if (!data) return obj as T;

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

    return obj as T;
}

/**
 * Check and detect the string is JSON valid or not.
 * If it's valid, then return it's JSON value.
 * If it isn't valid, then return it as null.
 * @param str JSON string
 */
function JSONParse<T extends Object>(str: string) {
    return new Promise((done) => {
        try {
            done(JSON.parse(str));
        } catch (e) {
            done(null);
        }
    }) as Promise<T | null>;
}

export { createFilteredObject, findValue, intoObject, JSONParse };
