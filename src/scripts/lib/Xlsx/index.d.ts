import MyArray from "../../models/MyArray";

import { baseOptions, sheetProperties, parsedSheetData } from "./modules/parser";
import { sheetData } from "./files/worksheet";

/** Open and read Xlsx file data */
export default function readXlsxFile(file: File | Blob | ArrayBuffer, options?: baseOptions): Promise<ReturnType<typeof readXlsx>>;

/** Create and download file Xlsx */
export function writeXlsx(data: sheetData, filename: string, sheetname?: string): void;

/** Get Xlsx file contens */
declare function getXlsContents(input: File | Blob | ArrayBuffer): Promise<Map<string, string>>;

/** Read Xlsx contens data */
declare function readXlsx(contents: string, options: baseOptions): ReturnType<typeof getData>;

/** Get sheet Id */
declare function getSheetId(sheet: string | number, sheets: MyArray<sheetProperties>): string;

/** Create error instance if sheet not found */
declare function createSheetNotFoundError(sheet: string | number, sheets: MyArray<sheetProperties>): Error;

/** Get output data */
declare function getData(sheet: parsedSheetData<any>, options: baseOptions): MyArray<MyArray<string | typeof Date | number>>;

