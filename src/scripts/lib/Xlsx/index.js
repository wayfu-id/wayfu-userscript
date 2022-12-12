import { unzipSync, strFromU8 } from "fflate";
import {
    parseFilePaths,
    parseProperties,
    parseSharedStrings,
    parseSheet,
    parseStyles,
} from "./modules/parser";
import MyArray from "../../models/MyArray";
/** Import types */
import {
    baseOptions,
    parsedFilePath,
    parsedStyles,
    parsedProperties,
} from "./modules/parser";

/**
 * Open and read Xlsx file data
 * @param {File | Blob | ArrayBuffer} file
 * @param {baseOptions} options
 * @returns
 */
export default async function readXlsxFile(file, options = {}) {
    options = Object.assign({}, options);
    const contents = await getXlsContents(file);
    return readXlsx(contents, options);
}

/**
 * Get Xlsx file contens
 * @param {File | Blob | ArrayBuffer} input
 * @returns {Promise<Map<string, string>}
 */
async function getXlsContents(input) {
    input =
        input instanceof File || input instanceof Blob
            ? await input.arrayBuffer()
            : input;
    if (!input) return {};

    const archive = new Uint8Array(input),
        contents = unzipSync(archive),
        unzippedFile = new Map();

    for (let key of Object.keys(contents)) {
        unzippedFile.set(key, strFromU8(contents[key]));
    }

    return unzippedFile;
}

/**
 * Read Xlsx contens data
 * @param {Map<string, string>} contents
 * @param {baseOptions} options
 * @returns
 */
function readXlsx(contents, options = { sheet: 1 }) {
    let { sheet } = options;

    /**
     * Get Xml contens
     * @param {string} filePath
     * @returns {string} Path contents
     */
    const getXmlContent = (filePath) => {
        if (!contents.has(filePath)) {
            throw new Error(
                `"${filePath}" file not found inside the *.xlsx file zip archive`
            );
        }
        return contents.get(filePath);
    };

    /** @type { parsedFilePath } */
    const paths = parseFilePaths(getXmlContent("xl/_rels/workbook.xml.rels"));

    /** @type { MyArray<string> } */
    const values = paths.sharedStrings
        ? parseSharedStrings(getXmlContent(paths.sharedStrings))
        : [];

    /** @type { parsedStyles } */
    const styles = paths.styles ? parseStyles(getXmlContent(paths.styles)) : {};

    /** @type { parsedProperties } */
    const properties = parseProperties(getXmlContent("xl/workbook.xml"));

    /** @type { string } */
    const sheetId = getSheetId(sheet, properties.sheets);

    if (!sheetId || !paths.sheets[sheetId]) {
        throw createSheetNotFoundError(sheet, properties.sheets);
    }

    /** @type { string } */
    const content = getXmlContent(paths.sheets[sheetId]);

    /** @type { parsedSheetData } */
    const sheets = parseSheet(content, values, styles, properties, options);

    /** @type { MyArray<MyArray<string | typeof Date | number>>} */
    const data = getData(sheets, options);

    return data;
}

/**
 * Get sheet Id
 * @param {number | string} sheet
 * @param {MyArray<import("./modules/parser").sheetProperties>} sheets
 * @returns {string}
 */
function getSheetId(sheet, sheets) {
    if (typeof sheet === "number") {
        let { relationId } = sheets[sheet - 1];
        return relationId;
    }

    for (let { name, relationId } of sheets) {
        if (name === sheet) return relationId;
    }
}

/**
 * Create error instance if sheet not found
 * @param {number | string} sheet
 * @param {MyArray<import("./modules/parser").sheetProperties} sheets
 * @returns
 */
function createSheetNotFoundError(sheet, sheets) {
    const sheetsList = sheets.map(({ name }, i) => `"${name}" (#${i + 1})`).join(", "),
        _sheet = typeof sheet === "number" ? `#${sheet}` : `"${sheet}"`;

    return new Error(
        `Sheet ${_sheet} not found in the *.xlsx file.`.concat(
            sheets ? ` Available sheets: ${sheetsList}."` : ""
        )
    );
}

/**
 * Get output data
 * @param {import("./modules/parser").parsedSheetData<any>} sheets
 * @param {import("./modules/parser").baseOptions} options
 * @returns {MyArray<MyArray<string | typeof Date | number>>}
 */
function getData(sheets, options) {
    let { dimensions, cells } = sheets,
        { transformData } = options;

    if (cells.isEmpty) return [];

    let [topLeft, bottomRight] = dimensions,
        { row: maxRow, column: maxCol } = bottomRight;

    let data = new MyArray(maxRow);

    for (let { row, column, value } of cells) {
        row -= 1;
        column -= 1;
        if (column < maxCol && row < maxRow) {
            if (!data[row]) data[row] = new MyArray();
            data[row][column] = value;
        }
    }

    return transformData ? transformData(data) : data;
}
