import MyArray from "../structures/MyArray";
import { rgx } from "../config/index";
import { isNumeric } from "./index";

/**
 * Calculate and get month indext on some datestring
 * @param date collection from all row
 * @returns
 */
const monthIndex = (date: string[]) => {
    if (rgx.formatedDate.test(date[0])) return 2;

    let a = new MyArray<string>(),
        b = new MyArray<string>();

    date.forEach((e, i) => {
        [a[i], b[i]] = e.split(/\/|:|-/);
    });

    return a.some((x) => Number(x) > 12) || b.some((x) => Number(x) > 12)
        ? a.some((x) => Number(x) > 12)
            ? 1
            : 0
        : a.countValue(a[0]) > b.countValue(b[0])
          ? 0
          : 1;
};

/**
 * Scan and determine csv delimiter. Using comma or not.
 * @param text text to be checked
 * @returns
 */
const useComma = (text: string) => {
    let pattern = String.raw`^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,;"\s\\]*(?:\s+[^,;"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,;"\s\\]*(?:\s+[^,;"\s\\]+)*)\s*)*$`,
        regExp = new RegExp(pattern);
    return regExp.test(text);
};

/**
 * Check and get the exact RegExp to get csv row value.
 * @param d csv delimiter, default is `,`
 * @param flag regex flag to be usde
 * @returns
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
 * @param date date expected data
 * @returns
 */
const getSignDate = (date: string | MyArray<string | Date>) => {
    let result: string | null = null;
    if (typeof date === "string") {
        let test = rgx.datePattern.exec(date);
        result = test ? test.toString() : null;
    } else {
        let [d] = date.filter((val) => (typeof val === "string" ? rgx.datePattern.test(val) : val));
        result = d ? d.toString() : null;
    }
    return result;
};

/**
 * Get and convert current phone number
 * @param ph phone number expected
 * @returns
 */
const setPhone = (ph: string | string[] | number) => {
    ph = typeof ph === "string" ? ph : Array.isArray(ph) ? ph.join("") : ph.toString();
    return ph.replace(rgx.phoneValue, function (m0, g1, g2, g3) {
        let phone = g1 !== undefined ? g1 : g2.replace(/(\-| )/g, ""),
            extra = phone.charAt(0) === "8" && m0.charAt(0) !== "+" ? "62" : "";
        return extra + phone;
    });
};

/**
 * Transfrom row data
 * @param data row or array data;
 * @return
 */
const transformRow = (data: MyArray<string | Date>) => {
    if (data.isEmpty) return false;

    const formatDate = (d: Date) => [d.getDate(), d.getMonth() + 1, d.getFullYear()].join("/");
    const validPhone = (val: string) => rgx.phonePattern.test(val);

    if (!data.some((val, idx) => !(val instanceof Date) && validPhone(val) && idx !== 0)) return false;

    let result = data.map((e, i) => {
        let result = e;

        if (typeof e == "string") {
            result = /^"(.*)"$/.test(e) ? e.replace(/(^")|("$)/g, "") : result;
            result = validPhone(e) ? setPhone(e) : isNumeric(e) ? Number(e).toString() : result;
        } else if (e instanceof Date) {
            result = formatDate(e);
        }

        return result.toString();
    });
    return MyArray.create(result);
};

export { monthIndex, setPhone, getSignDate, rowValue, useComma, transformRow };
