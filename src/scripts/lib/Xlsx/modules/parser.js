import MyArray from "../../../models/MyArray";
import Xlsx from "../Xlsx";
import { getOuterXml } from "./dom";

/**
 * @typedef {{
 *     sheet?: string | number;
 *     trim?: boolean;
 *     epoch1904?: boolean;
 *     transformData?: (data: MyArray<MyArray<string | typeof Date | number>>) => any
 * }} baseOptions
 *
 * @typedef {{
 *    id: string,
 *    name: string,
 *    relationId:string
 * }} sheetProperties
 *
 * @typedef {{
 *    inlineStringValue: () => string,
 *    inlineStringXml: () => string,
 *    styleId: () => string,
 *    styles: MyArray<{numberFormat:any;}>,
 *    values: MyArray<string>,
 *    properties: parsedProperties,
 *    options: {trim?:boolean}
 * }} cellValueOptions
 *
 * @typedef {{
 *   epoch1904: boolean;
 *   sheets: MyArray<sheetProperties>
 * }} parsedProperties
 *
 * @typedef {{
 *   sheets: {};
 *   sharedStrings: string;
 *   styles: string;
 *  }} parsedFilePath
 *
 * @typedef { MyArray<{numberFormat:any}> } parsedStyles
 *
 * @typedef {{ row: number, column: number}} docDimension
 *
 * @typedef { docDimension & { value: Object }} parsedCellValue
 *
 * @typedef {{ cells:MyArray<parsedCellValue>, dimensions:docDimension }} parsedSheetData
 */

/**
 * Checking current value is datetimestamp or not
 * @param {String} styleId
 * @param {MyArray<{}} styles
 * @param {{}} options
 * @return {boolean}
 */
function isDateTimestamp(styleId, styles, options) {
    const BUILT_IN_DATE_NUMBER_FORMAT_IDS = [
            14, 15, 16, 17, 18, 19, 20, 21, 22, 27, 30, 36, 45, 46, 47, 50, 57,
        ],
        DATE_FORMAT_WEIRD_PREFIX = /^\[\$-414\]/,
        DATE_FORMAT_WEIRD_POSTFIX = /;@$/,
        DATE_TEMPLATE_TOKENS = [
            "ss",
            "mm",
            "h",
            "hh",
            "am",
            "pm",
            "d",
            "dd",
            "m",
            "mm",
            "mmm",
            "mmmm",
            "yy",
            "yyyy",
            "e",
        ];

    const { dateFormat, smartDateParser } = options;

    const isDateTemplate = (template) => {
        template = template
            .toLowerCase()
            .replace(DATE_FORMAT_WEIRD_PREFIX, "")
            .replace(DATE_FORMAT_WEIRD_POSTFIX, "");

        for (let token of template.split(/\W+/)) {
            if (DATE_TEMPLATE_TOKENS.indexOf(token) < 0) {
                return false;
            }
        }

        return true;
    };

    if (styleId) {
        let style = styles[styleId];
        if (!style) throw new Error(`Cell style not found: ${styleId}`);

        let { numberFormat } = style || styles,
            { id, template } = numberFormat;

        if (
            BUILT_IN_DATE_NUMBER_FORMAT_IDS.indexOf(parseInt(id)) >= 0 ||
            (dateFormat && template === dateFormat) ||
            (smartDateParser !== false && template && isDateTemplate(template))
        ) {
            return true;
        }
    }
    return false;
}

/**
 * Parse document dimensions
 * @param {Document} sheet on What document sheet?
 * @returns {docDimension[] | null}
 */
function parseDimensions(sheet) {
    let dimensions = Xlsx.getDimensions(sheet);

    if (dimensions) {
        let dm = dimensions
            .split(":")
            .map(parseCellCoordinates)
            .map((coords) => {
                let [row, column] = coords;
                return { row: row, column: column };
            });

        if (dm.length === 1) {
            dm = [dm[0], dm[0]];
        }

        return dm;
    }

    return null;
}

/**
 * Parse cells and get its value and ordinat
 * @param {Document} sheet
 * @param {MyArray<string>} values
 * @param {parsedStyles} styles
 * @param {parsedProperties} properties
 * @param {{}} options
 * @returns {MyArray<parsedCellValue|Element>}
 */
function parseCells(sheet, values, styles, properties, options) {
    let cells = Xlsx.getCells(sheet);

    /**
     * @type {{(node: Element): parsedCellValue}}
     */
    const parsedCell = (node) => {
        let [row, column] = parseCellCoordinates(node.getAttribute("r")),
            valueElement = Xlsx.getCellValue(node),
            value = valueElement && valueElement.textContent,
            type = node.getAttribute("t");

        /** @type {cellValueOptions} */
        let opt = {
            inlineStringValue: () => Xlsx.getCellInlineStringValue(node),
            inlineStringXml: () => getOuterXml(node),
            styleId: () => node.getAttribute("s"),
            styles: styles,
            values: values,
            properties: properties,
            options: options,
        };

        return { row: row, column: column, value: parseCellValue(value, type, opt) };
    };

    return !cells.isEmpty ? cells.map((val) => parsedCell(val)) : cells;
}

/**
 * Parse givent coordinats to array of number
 * @param {string} coords
 * @returns {[number, number]}
 */
function parseCellCoordinates(coords) {
    let [a, b] = coords.split(/(\d+)/);
    return [parseInt(b), columnLettersToNumber(a.trim())];
}

/**
 * Parse only cells value
 * @param {string} value
 * @param {string} type
 * @param {cellValueOptions} opt
 * @returns {string | typeof Date | number}
 */
function parseCellValue(value, type, opt) {
    let {
        inlineStringValue,
        inlineStringXml,
        styleId,
        styles,
        values,
        properties,
        options,
    } = opt;

    type = type || "n";

    switch (type) {
        case "str":
            value = parseString(value, options);
            break;

        case "inlineStr":
            value = inlineStringValue();

            if (!value) {
                throw new Error(
                    `Unsupported "inline string" cell value structure: ${inlineStringXml()}`
                );
            }

            value = parseString(value, options);
            break;

        case "s":
            let stringIdx = Number(value);

            if (isNaN(stringIdx)) {
                throw new Error(`Invalid "shared" string index: ${value}`);
            }

            if (stringIdx >= values.length) {
                throw new Error(`An out-of-bounds "shared" string index: ${value}`);
            }

            value = parseString(values[stringIdx], options);
            break;

        case "b":
            if (!/^(?:0|1)?$/g.test(value)) {
                throw new Error(`Unsupported "boolean" cell value: ${value}`);
            }

            value = value === "1";
            break;

        case "z":
            value = undefined;
            break;

        case "e":
            value = decodeError(value);
            break;

        case "d":
            if (value === undefined) break;

            let date = new Date(value);

            if (isNaN(date.valueOf())) {
                throw new Error(`Unsupported "date" cell value: ${value}`);
            }

            value = date;
            break;

        case "n":
            if (value === undefined) break;
            let numb = Number(value);

            if (isNaN(numb)) {
                throw new Error(`Invalid "numeric" cell value: ${value}`);
            }

            value = isDateTimestamp(styleId(), styles, options)
                ? parseDate(numb, properties)
                : numb;
            break;

        default:
            throw new TypeError(`Cell type not supported: ${type}`);
    }

    return value ? value : null;
}

/**
 * Calculate document dimensions if parsing gets null
 * @param {MyArray<parsedCellValue>} cells
 * @returns {docDimension[]}
 */
function calculateDimensions(cells) {
    const comparator = (a, b) => a - b;
    /**
     * @type {{(string): [number, number]}}
     */
    const getRange = (kind) => {
        let arr = cells.map((c) => c[kind]).sort(comparator);
        return [arr.shift(), arr.pop()];
    };

    let [minRow, maxRow] = getRange("row"),
        [minCol, maxCol] = getRange("column");

    return [
        { row: minRow, column: minCol },
        { row: maxRow, column: maxCol },
    ];
}

/**
 * Decode error message based on it's code
 * @param {String} errorCode
 * @returns {String}
 */
function decodeError(errorCode) {
    const errCodes = {
        0x00: "#NULL!",
        0x07: "#DIV/0",
        0x17: "#VALUE!",
        0x1d: "#NAME?",
        0x24: "#NUM!",
        0x2a: "#N/A",
        0x2b: "#GETTING_DATA",
    };

    return errCodes[errorCode] || `#ERROR_${errorCode}`;
}

/**
 * Parse value to string
 * @param {any} value
 * @param {Object} options
 * @param {boolean} options.trim
 * @returns {string | undefined}
 */
function parseString(value, options) {
    let { trim } = options;
    value = trim !== false ? value.trim() : value;

    return value ? value : undefined;
}

/**
 * Parse value to Date
 * @param {number} excelSerialDate
 * @param {Object} [options?]
 * @param {boolean} [options.epoch1904?]
 * @returns {typeof Date}
 */
function parseDate(excelSerialDate, options) {
    if (options && options.epoch1904) {
        excelSerialDate += 1462;
    }

    const daysBeforeUnixEpoch = 70 * 365 + 19,
        hour = 60 * 60 * 1000;

    return new Date(Math.round((excelSerialDate - daysBeforeUnixEpoch) * 24 * hour));
}

/**
 * Convert excel column letter to number
 * @param {string} columnLetters
 * @returns {number}
 */
function columnLettersToNumber(columnLetters) {
    const LETTERS = [
        "",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
    ];

    return ((n, cols) => {
        for (let char of cols) {
            n = n * 26 + LETTERS.indexOf(char);
        }
        return n;
    })(0, columnLetters);
}

/**
 * Parse string to Document Element
 * @param {String} content
 * @returns {Document}
 */
function createDocument(content) {
    return new DOMParser().parseFromString(content.trim(), "text/xml");
}

/**
 * Parse document properties
 * @param {string} content
 * @returns {parsedProperties}
 */
export function parseProperties(content) {
    let doc = createDocument(content),
        workbookProperties = Xlsx.getWorkbookProperties(doc),
        properties = {};

    if (workbookProperties && workbookProperties.getAttribute("date1904") === "1") {
        properties.epoch1904 = true;
    }

    /** @type {MyArray<sheetProperties>} */
    properties.sheets = new MyArray();

    /**s
     * @param {Element} sheet
     */
    let addSheetInfo = (sheet) => {
        if (sheet.getAttribute("name")) {
            properties.sheets.push({
                id: sheet.getAttribute("sheetId"),
                name: sheet.getAttribute("name"),
                relationId: sheet.getAttribute("r:id"),
            });
        }
    };

    Xlsx.getSheets(doc).forEach(addSheetInfo);
    return properties;
}

/**
 * Parse document file paths
 * @param {string} content
 * @returns {parsedFilePath}
 */
export function parseFilePaths(content) {
    let doc = createDocument(content),
        filePaths = {
            sheets: {},
            sharedStrings: undefined,
            styles: undefined,
        };

    /** @type {(path:string): string} */
    const getFilePath = (path) => {
        return path[0] === "/" ? path.slice("/".length) : `xl/${path}`;
    };

    /**
     * @param {Element} r
     */
    const addFilePathInfo = (r) => {
        let filePath = r.getAttribute("Target"),
            fileType = r.getAttribute("Type");

        switch (fileType) {
            case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles":
                filePaths.styles = getFilePath(filePath);
                break;

            case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings":
                filePaths.sharedStrings = getFilePath(filePath);
                break;

            case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet":
                filePaths.sheets[r.getAttribute("Id")] = getFilePath(filePath);
                break;
        }
    };

    Xlsx.getRelationships(doc).forEach(addFilePathInfo);
    return filePaths;
}

/**
 * Parse document styles
 * @param {string} content
 * @returns {parsedStyles}
 */
export function parseStyles(content) {
    if (!content) return {};

    /** @type {{ (numFmt:Element): {id:string, template:string} }} */
    const parseNumberFormatStyle = (numFmt) => {
        return {
            id: numFmt.getAttribute("numFmtId"),
            template: numFmt.getAttribute("formatCode"),
        };
    };

    /** @type {{ (xf:Element, numFmts: any[]) }} */
    const parseCellStyle = (xf, numFmts) => {
        let style = {};

        if (xf.hasAttribute("numFmtId")) {
            let numberFormatId = xf.getAttribute("numFmtId");

            style.numberFormat = numFmts[numberFormatId] ?? { id: numberFormatId };
        }

        return style;
    };

    let doc = createDocument(content),
        baseStyles = Xlsx.getBaseStyles(doc).map(parseCellStyle),
        numberFormats = Xlsx.getNumberFormats(doc)
            .map(parseNumberFormatStyle)
            .reduce((formats, format) => {
                formats[format.id] = format;
                return formats;
            }, []);

    /** @type {{ (xf:Element): parsedStyles }} */
    const getCellStyle = (xf) => {
        if (xf.hasAttribute("xfId")) {
            return Object.assign(
                {},
                baseStyles[xf.xfId],
                parseCellStyle(xf, numberFormats)
            );
        }

        return parseCellStyle(xf, numberFormats);
    };

    return Xlsx.getCellStyles(doc).map(getCellStyle);
}

/**
 * Get all shared strings
 * @param {string} content
 * @returns {MyArray<string>}
 */
export function parseSharedStrings(content) {
    if (!content) return new MyArray();

    return Xlsx.getSharedStrings(createDocument(content));
}

/**
 * Get parsed sheet data
 * @param {string} content
 * @param {MyArray<string>} values
 * @param {parsedStyles} styles
 * @param {parsedProperties} properties
 * @param {baseOptions} options
 * @returns {parsedSheetData}
 */
export function parseSheet(content, values, styles, properties, options) {
    let sheet = createDocument(content),
        cells = parseCells(sheet, values, styles, properties, options),
        dimensions = parseDimensions(sheet) || calculateDimensions(cells);

    return { cells: cells, dimensions: dimensions };
}
