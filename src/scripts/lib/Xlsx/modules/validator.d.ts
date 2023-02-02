import { sheetData, cellData, altRowData } from "../files/worksheet";

type xlsxConfig = { filename: string, data: sheetData, sheetname?: string };

export function sheetValidator (rowData: sheetData): boolean
export function isValidCellData (data: cellData | string | number): true;

/** Validate XLSX Export Config */
export default function validate(config: xlsxConfig): boolean;

export { xlsxConfig }