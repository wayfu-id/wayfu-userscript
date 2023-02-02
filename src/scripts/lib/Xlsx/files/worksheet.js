import { createXml, addXmlElement, createXmlElement } from "../modules/dom";
import { generateCellData } from "../modules/utils";

/** Types */
import MyArray from "../../../models/MyArray";
import { elementItem } from "../modules/dom";

/**
 * @typedef {{ type: "string" | "number", value: string | number }} cellData
 * @typedef {MyArray<cellData>} rowData
 * @typedef {MyArray<string | number>} altRowData
 * @typedef {MyArray<rowData | altRowData>} sheetData
 */

/**
 * Create XML Document Template
 * @return {XMLDocument}
 */
const createXMLTemplate = () => {
    const attr = [
        {
            name: "xmlns",
            value: "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
        },
        {
            name: "xmlns:mc",
            value: "http://schemas.openxmlformats.org/markup-compatibility/2006",
        },
        {
            name: "xmlns:mv",
            value: "urn:schemas-microsoft-com:mac:vml",
        },
        {
            name: "xmlns:mx",
            value: "http://schemas.microsoft.com/office/mac/excel/2008/main",
        },
        {
            name: "xmlns:r",
            value: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
        },
        {
            name: "xmlns:x14",
            value: "http://schemas.microsoft.com/office/spreadsheetml/2009/9/main",
        },
        {
            name: "xmlns:x14ac",
            value: "http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac",
        },
        {
            name: "xmlns:xm",
            value: "http://schemas.microsoft.com/office/excel/2006/main",
        },
    ];
    const prop = { tag: "worksheet", attributes: attr };
    return createXml(prop);
    // let sheetData = createXmlElement({ tag: "sheetData", doc });
    // return addXmlElement(doc, { tag: "sheetData" }, prop.tag);
};

/**
 * Format cells data to XML Element
 * @param {cellData} cell
 * @param {number} index
 * @param {number} rowIndex
 * @param {XMLDocument} doc
 * @return {Element}
 */
const formatCell = (cell, index, rowIndex, doc) => {
    const cellCoordinate = ((idx, rowNumber) => {
        /** @type {(colIndex: number)=> string} */
        const generateColumnLetter = (colIndex) => {
            if (typeof colIndex !== "number") return "";

            const prefix = Math.floor(colIndex / 26);
            const letter = String.fromCharCode(97 + (colIndex % 26)).toUpperCase();

            if (prefix === 0) return letter;
            return generateColumnLetter(prefix - 1) + letter;
        };

        return `${generateColumnLetter(idx)}${rowNumber}`;
    })(index, rowIndex);

    const cellAttr = (({ type }) => {
        let attr = new MyArray({ name: "r", value: cellCoordinate });
        if (type === "string") attr.push({ name: "t", value: "inlineStr" });
        return attr;
    })(cell);

    const cellElement = createXmlElement({ tag: "c", attributes: cellAttr }, doc);

    const itemElm = ((cell) => {
        const [cellValue, itemDetails] = (({ type, value }) => {
            let details = type === "string" ? { tag: "is" } : { tag: "v", value: value };
            return [value, details];
        })(cell);

        let el = createXmlElement(itemDetails, doc);
        if (cell.type === "string") {
            el.appendChild(createXmlElement({ tag: "t", value: cellValue }, doc));
        }
        return el;
    })(cell);

    cellElement.appendChild(itemElm);

    return cellElement;
};

/**
 * Format row data to XML Element
 * @param {rowData} row
 * @param {number} index
 * @param {XMLDocument} doc
 * @return {Element}
 */
const formatRow = (row, index, doc) => {
    const rowIndex = index + 1,
        rowAttr = { name: "r", value: `${rowIndex}` },
        rowElement = createXmlElement({ tag: "row", attributes: rowAttr }, doc);

    row.forEach((cell, index) => {
        rowElement.appendChild(formatCell(cell, index, rowIndex, doc));
    });

    return rowElement;
};

/**
 * Generate sheetData
 * @param {sheetData} data
 * @param {XMLDocument} doc
 * @return {Element}
 */
const createSheetData = (data, doc) => {
    const sheetData = createXmlElement("sheetData", doc);

    data.forEach((row, index) => {
        row = generateCellData(row);
        sheetData.appendChild(formatRow(row, index, doc));
    });

    return sheetData;
};

/**
 * Generate Worksheet
 * @param {sheetData} data
 * @return {XMLDocument}
 */
export default function generateWorksheet(data) {
    const xmlDoc = createXMLTemplate(),
        sheetData = createSheetData(data, xmlDoc);

    // xmlDoc.appendChild(sheetData);
    // return xmlDoc;
    return addXmlElement(xmlDoc, sheetData, "worksheet");
}
