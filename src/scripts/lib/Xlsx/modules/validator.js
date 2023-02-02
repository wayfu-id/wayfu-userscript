import MyArray from "../../../models/MyArray";
import { sheetData, cellData } from "../files/worksheet";

/**
 * @typedef {{
 *  filename: string,
 *  data: sheetData,
 *  sheetname?: string
 * }} xlsxConfig
 */

/**
 * @type {{(errorCode: number, name?: string, type?: string) => false | string}}
 */
const ERROR_MSG = (errorCode, name = "filename", type = "array") => {
    return [
        `Xlsx config missing property ${name}"`,
        `Xlsx ${name} can only be of type ${type}`,
    ][errorCode];
};
/**
 * Validate sheetData
 * @param {sheetData} rows
 * @returns {boolean}
 */
const sheetValidator = (rows) => {
    return rows.every((row) => {
        if (Array.isArray(row)) {
            return isValidCellData(row);
        }
        return false;
    });
};

/** @type {{ (data: cellData | string | number) => boolean }} */
const isValidCellData = (data) => {
    if (!data) return false;
    if (typeof data === "string" || typeof data === "number") return false;
    if (!data.type || !data.value) return false;
    return true;
};

/**
 * Validate XLSX Export Config
 * @param {xlsxConfig} config
 * @return {boolean}
 */
export default function validate(config) {
    let { filename, data } = config,
        errors = new MyArray();

    if (!filename) errors.push(ERROR_MSG(0));
    if (!data) errors.push(ERROR_MSG(0, "data"));
    if (typeof filename !== "string") errors.push(ERROR_MSG(1));
    if (!Array.isArray(data)) errors.push(ERROR_MSG(1, "sheet data", "array"));
    if (!sheetValidator(data)) errors.push(ERROR_MSG(1, "row data", "array"));

    if (!errors.isEmpty) errors.forEach((e) => console.error(e));
    return errors.isEmpty;
}
export { sheetValidator, isValidCellData };
