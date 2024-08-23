import { MyDate } from "../structures";

/**
 * Check and detect the string is datestring or not
 * @param {string} str input string
 */
function isDateStr (str: any) {
    return typeof str !== "string" ? false : new Date(str).toString() !== "Invalid Date" && !isNaN(new Date(str) as any);
};

/**
 * Check and detect the string is numeric or not
 * @param {string} str input string
 */
function isNumeric (str: any) {
    return typeof str === "string"
        ? !isNaN(str as any) && !isNaN(parseFloat(str))
        : typeof str === "number";
};

/**
 * Parse any value from any type of data
 * @param {any} val value to be parsed
 */
function parseValue (val: any) {
    if (typeof val === "string") {
        val = isNumeric(val) ? Number(val) : isDateStr(val) ? new MyDate(val) : val;
    }
    return val;
};

export { isDateStr, isNumeric, parseValue };
