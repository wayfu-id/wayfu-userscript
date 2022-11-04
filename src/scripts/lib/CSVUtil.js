import MyArray from "../models/MyArray";
import { rgx } from "./Constant";
import { isNumeric } from "./Util";

/**
 * Calculate and get month indext on some datestring
 * @param {string[]} date input datestring
 * @returns {0 | 1 | 2}
 */
const monthIndex = (date) => {
    if (rgx.formatedDate.test(date[0])) return 2;

    let a = new MyArray(),
        b = new MyArray();

    date.forEach((e, i) => {
        [a[i], b[i]] = e.split(/\/|:|-/);
    });

    return a.some((x) => x > 12) || b.some((x) => x > 12)
        ? a.some((x) => x > 12)
            ? 1
            : 0
        : a.countValue(a[0]) > b.countValue(b[0])
        ? 0
        : 1;
};

/**
 * Scan and determine csv delimiter. Using comma or not.
 * @param {String} text CSV row
 * @returns {Boolean}
 */
const useComma = (text) => {
    let pattern = String.raw`^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,;"\s\\]*(?:\s+[^,;"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,;"\s\\]*(?:\s+[^,;"\s\\]+)*)\s*)*$`,
        regExp = new RegExp(pattern);
    return regExp.test(text);
};

/**
 * Check and get the exact RegExp to get csv row value.
 * @param {String} d csv delimiter
 * @param {String} flag
 * @returns {RegExp}
 */
const rowValue = (d = ",", flag = "") => {
    let add = d == "," ? `${d};` : d,
        pattern = String.raw`(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^${add}"\s\\]*(?:\s+[^${add}"\s\\]+)*))\s*(?:${d}|$)`;
    return flag ? new RegExp(pattern, flag) : new RegExp(pattern);
};

/**
 * Check and get the sign up date based on RegExp pattern.
 * Return as string if any matched.
 * Return as null of no matched.
 * @param {String | MyArray<String>} date input datestring
 * @returns {String | null}
 */
const getSignDate = (date) => {
    if (typeof date === "string") {
        date = rgx.datePattern.exec(date);
        return date ? date.toString() : null;
    }
    let [d] = date.filter((val) => rgx.datePattern.test(val));
    return d ? d.toString() : null;
};

/**
 * Get and convert current phone number
 * @param {String | String[] | Number} ph input phone
 * @returns {String}
 */
const setPhone = (ph) => {
    ph = typeof ph === "string" ? ph : Array.isArray(ph) ? ph.join("") : ph.toString();
    return ph.replace(rgx.phoneValue, function (m0, g1, g2, g3) {
        let phone = g1 !== undefined ? g1 : g2.replace(/(\-| )/g, ""),
            extra = phone.charAt(0) === "8" && m0.charAt(0) !== "+" ? "62" : "";
        return extra + phone;
    });
};

/**
 * Transfrom row data
 * @param {MyArray<String>} data;
 * @return {false | MyArray<string>}
 */
const transformRow = (data) => {
    if (data.isEmpty) return false;

    /** @type {(val: string) => boolean} */
    const validPhone = (val) => rgx.phonePattern.test(val);
    if (!data.some((val, idx) => validPhone(val) && idx !== 0)) return false;

    data.forEach((e, i) => {
        data[i] = /^"(.*)"$/.test(e) ? e.replace(/(^")|("$)/g, "") : data[i];
        data[i] = validPhone(e)
            ? setPhone(e)
            : isNumeric(e)
            ? Number(e).toString()
            : data[i];
    });
    return data;
};

export { monthIndex, setPhone, getSignDate, rowValue, useComma, transformRow };
