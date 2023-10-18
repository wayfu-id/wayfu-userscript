import MyDate from "../structures/MyDate";

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

export { isDateStr, isNumeric, parseValue };
