import MyArray from "../../../models/MyArray";
import { isValidCellData } from "./validator";

import { cellData, rowData } from "../files/worksheet";

/**
 * Generate and get valid cell data
 * @param {MyArray<cellData | number | string>} row
 * @return {rowData}
 */
const generateCellData = (row) => {
    if (!row.every((e) => isValidCellData(e))) {
        return row.map((val) => {
            if (typeof val === "number") return { value: val, type: "number" };
            return { value: val.toString(), type: "string" };
        });
    }

    return row;
};

export { generateCellData };
