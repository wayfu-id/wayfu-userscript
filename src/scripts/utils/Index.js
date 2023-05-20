import MyDate from "./MyDate";
import { rgx, dateOptDefault } from "../lib/Constant";

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
        val = isNumeric(val)
            ? Number(val)
            : isDateStr(val)
            ? new MyDate(val)
            : val;
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
    if (local == remote) return true;
    /** @type {(str: String, s: String) => Array.<String | Number>} */
    const getArr = (str, s) => {
        return str.split(s).map((x) => (isNumeric(x) ? Number(x) : x));
    };
    /** @type {(str: String) => Number} */
    const getDigit = (str) => Number(/\d+/.exec(str));
    /** @type {(str: String) => RegExpExecArray | null} */
    const getAlpha = (str) => /[A-Za-z]/.exec(str);

    if (forVersion.test(local) && forVersion.test(remote)) {
        let spliter = local.includes(".") ? "." : "-",
            arrR = getArr(remote, spliter);

        return getArr(local, spliter).every((v, i, a) => {
            if (arrR[a.length]) return false;
            if (isNumeric(v) && isNumeric(arrR[i])) {
                return !(v === arrR[i]) ? v >= arrR[i] : true;
            }
            let [dig, alph] = ((l, r) => {
                return [
                    { l: getDigit(l), r: getDigit(r) },
                    { l: getAlpha(l), r: getAlpha(r) },
                ];
            })(v, arrR[i]);
            if (dig.l === dig.r) {
                return alph.l && alph.r ? alph.l[0] >= alph.r[0] : !!alph.l;
            }
            return dig.l >= dig.r;
        });
    }

    return local >= remote;
};

/**
 * Get Name or Full Name and change it to Title Case
 * @param {String} string input name
 * @param {Boolean} full is it full name?
 * @returns {String}
 */
const setName = (string, full = false) => {
    const name = string.split(" ").map((s) => titleCase(s));
    // let name = [];
    // str.split(" ").forEach((e) => {
    //     name.push(titleCase(e));
    // });
    return full ? name.join(" ") : name[0];
};

/**
 * Conver string to Title Case
 * @param {String} string input string
 * @returns {String}
 */
const titleCase = (string) => {
    return ((s) => {
        return s.charAt(0).toUpperCase() + s.slice(1);
    })(string.toLowerCase());
    // string = string.toLowerCase();
    // return string.charAt(0).toUpperCase() + string.slice(1);
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
    titleCase,
    dateFormat,
    JSONParse,
    parseValue,
    createFilteredObject,
};
