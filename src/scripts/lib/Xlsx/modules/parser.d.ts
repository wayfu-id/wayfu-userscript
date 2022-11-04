import MyArray from "../../../models/MyArray";

type baseOptions = {
    sheet?: string | number;
    trim?: boolean;
    epoch1904?: boolean;
    transformData?: (data: MyArray<MyArray<string | typeof Date | number>>) => any;
}

type sheetProperties = {
    id: string,
    name: string,
    relationId: string
}

type cellValueOptions = {
    inlineStringValue: () => string,
    inlineStringXml: () => string,
    styleId: () => string,
    styles: MyArray<{numberFormat:any;}>,
    values: MyArray<string>,
    properties: parsedProperties,
    options: {trim?:boolean}
}

type parsedProperties = {
    epoch1904: boolean;
    sheets: MyArray<sheetProperties>
}

type parsedFilePath = {
    sheets: {};
    sharedStrings: string;
    styles: string;
}

type parsedStyles = MyArray<{numberFormat:any}>

type docDimension = { row: number, column: number }

type parsedCellValue<T extends object> = docDimension & { value: T }

type parsedSheetData<T extends object> = { cells: MyArray<parsedCellValue<T>>, dimensions: docDimension[] }

/** Checking current value is datetimestamp or not */
declare function isDateTimestamp(styleId: string, styles: MyArray<{}>, options: {}): boolean;

/** Parse document dimensions */
declare function parseDimensions(sheet: Document):docDimension[];

/** Parse cells and get its value and ordinat */
declare function parseCells(sheet: Document, values: MyArray<string>, styles: parsedStyles, properties: parsedProperties, options: {}): parsedCellValue<string | typeof Date | number>[];

/** Parse givent coordinats to array of number */
declare function parseCellCoordinates(coords: string): [number, number];

/** Parse only cells value */
declare function parseCellValue(value: string, type: string, opt: cellValueOptions): string | typeof Date | number;

/** Calculate document dimensions if parsing gets null */
declare function calculateDimensions(cells: MyArray<parsedCellValue>): docDimension[];

/** Decode error message based on it's code */
declare function decodeError(errorCode: string): string;

/** Parse value to string */
declare function parseString(value: string | number, options?: {trim?: boolean}): string | undefined; 

/** Parse value to Date */
declare function parseDate(excelSerialDate: number, options?: {epoch1904?: boolean}): typeof Date;

/** Convert excel column letter to number */
declare function columnLettersToNumber(columnLetters: string): number;

/** Parse string to Document Element */
declare function createDocument(content: string): Document;

/** Parse document properties */
export function parseProperties(content: string): parsedProperties;

/** Parse document file paths */
export function parseFilePaths(content: string): parsedFilePath;

/** Parse document styles */
export function parseStyles(content: string): parsedStyles;

/** Get all shared strings */
export function parseSharedStrings(content: string): MyArray<string>;

/** Get parsed sheet data */
export function parseSheet(content: string, values: MyArray<string>, styles: parsedStyles, properties: parsedProperties, options?: baseOptions): parsedSheetData<string | typeof Date | number>;