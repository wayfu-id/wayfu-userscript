import MyArray from "../../../models/MyArray";

type cellData = { type: "string" | "number", value: string | number };
type rowData = MyArray<cellData>;
type altRowData = MyArray<string | number>;
type sheetData = MyArray<rowData | altRowData>;

/** Generate Worksheet */
export default function generateWorksheet(data: sheetData): XMLDocument;

export { cellData, rowData, altRowData, sheetData };