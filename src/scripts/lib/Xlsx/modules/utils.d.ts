import { cellData, rowData } from "../files/worksheet";

/** Generate and get valid cell data */
export function generateCellData(row: MyArray<cellData | number | string>): rowData;