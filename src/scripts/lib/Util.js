import MyDate from "../models/MyDate";
import { rgx, dateOptDefault } from "./Constant";

/**
 * Check and detect the string is numeric or not
 * @param {String} str input string
 * @returns {Boolean}
 */
const isNumeric = (str) => {
    return typeof str === "string"
        ? !isNaN(str) && !isNaN(parseFloat(str))
        : typeof str === "number";
};

/**
 * Check and detect the string is datestring or not
 * @param {String} str input string
 * @returns {Boolean}
 */
const isDateStr = (str) => {
    return typeof str !== "string"
        ? false
        : new Date(str).toString() !== "Invalid Date" && !isNaN(new Date(str));
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
 * Parse any value from any type of data
 * @param {any} val value to be parsed
 * @returns {any} parsed value
 */
const parseValue = (val) => {
    if (typeof val === "string") {
        val = isNumeric(val) ? Number(val) : isDateStr(val) ? new MyDate(val) : val;
    }
    return val;
};

/**
 * Check current app version is up to date or not.
 * @param {String} local local/instaled version
 * @param {String} remote remote/server version
 * @returns {Boolean}
 */
const isUpToDate = (local, remote) => {
    const { forVersion } = rgx;
    if (!local || !remote || local.length === 0 || remote.length === 0) {
        return false;
    }
    if (local == remote) {
        return true;
    }
    if (forVersion.test(local) && forVersion.test(remote)) {
        let spliter = local.includes(".") ? "." : "-",
            arrL = local.split(spliter).map((x) => {
                return isNumeric(x) ? Number(x) : x;
            }),
            arrR = remote.split(spliter).map((x) => {
                return isNumeric(x) ? Number(x) : x;
            });

        for (let i = 0; i < arrL.length; ++i) {
            if (arrR.length == i) {
                return true;
            }
            if (isNumeric(arrL[i]) && isNumeric(arrR[i])) {
                if (arrL[i] == arrR[i]) {
                    continue;
                } else {
                    return arrL[i] > arrR[i] ? true : false;
                }
            } else {
                let [digL, digR] = [
                        Number(/\d+/.exec(arrL[i])),
                        Number(/\d+/.exec(arrR[i])),
                    ],
                    [alpL, alpR] = [/[A-Za-z]/.exec(arrL[i]), /[A-Za-z]/.exec(arrR[i])];
                if (digL == digR) {
                    if (alpL && alpR && alpL[0] == alpR[0]) {
                        continue;
                    } else {
                        return alpL && alpR ? alpL[0] > alpR[0] : alpL ? true : false;
                    }
                } else {
                    return digL > digR;
                }
            }
        }
    }

    return local >= remote;
};

/**
 * Get Name or Full Name and change it to Title Case
 * @param {String} str input name
 * @param {Boolean} full is it full name?
 * @returns {String}
 */
const setName = (str, full = false) => {
    let name = [];
    str.split(" ").forEach((e) => {
        name.push(titleCase(e));
    });
    return full ? name.join(" ") : name[0];
};

/**
 * Conver string to Title Case
 * @param {String} string input string
 * @returns {String}
 */
const titleCase = (string) => {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Set and print date based on toLocaleDateString format
 * @param {String | Number | Date} value Date value
 * @param {boolean=true} printDays print weekdays?
 * @returns {String}
 */
const dateFormat = (value, printDays = true) => {
    return new Date(value).toLocaleDateString(
        "id-ID",
        Object.assign({}, dateOptDefault, {
            weekday: printDays ? "long" : undefined,
        })
    );
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

export {
    isNumeric,
    isDateStr,
    isUpToDate,
    setName,
    dateFormat,
    JSONParse,
    parseValue,
    createFilteredObject,
};
