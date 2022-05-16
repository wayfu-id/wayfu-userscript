import MyArray from "../models/MyArray";
import { rgx } from "./Constant";

/**
 * Calculate and get month indext on some datestring
 * @param {String} date input datestring
 * @returns {0 | 1 | 2}
 */
const monthIndex = (date) => {
    if (rgx.formatedDate.test(date[0])) {
        return 2;
    }
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
 * @param {String} date input datestring
 * @returns {String | null}
 */
const getSignDate = (date) => {
    date = rgx.datePattern.exec(date);
    return date ? date.toString() : null;
};

/**
 * Get and convert current phone number
 * @param {String | String[]} ph input phone
 * @returns {String}
 */
const setPhone = (ph) => {
    ph = typeof ph === "string" ? ph : ph.join("");
    return ph.replace(rgx.phoneValue, function (m0, g1, g2) {
        let phone = g1 !== undefined ? g1 : g2.replace(/(\-| )/g, ""),
            extra = phone.charAt(0) === "8" && m0.charAt(0) !== "+" ? "62" : "";
        return extra + phone;
    });
};

export { monthIndex, setPhone, getSignDate, rowValue, useComma };
