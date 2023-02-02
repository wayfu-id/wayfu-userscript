import { createXml, addXmlElement, createXmlElement } from "../modules/dom";

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
            name: "xmlns:r",
            value: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
        },
        {
            name: "xmlns:mx",
            value: "http://schemas.microsoft.com/office/mac/excel/2008/main",
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
    const prop = { tag: "workbook", attributes: attr };
    return createXml(prop);
    // let sheetData = createXmlElement({ tag: "sheetData", doc });
    //  addXmlElement(doc, { tag: "sheetData" }, prop.tag);
};

/**
 * Create Sheets Element
 * @param {string} name Sheet name
 * @param {string} id Sheet Id
 * @param {XMLDocument} doc Main XML Document
 */
const createSheets = (name, id, doc) => {
    const attr = [
        { name: "state", value: "visible" },
        { name: "name", value: name },
        { name: "sheetId", value: 1 },
        { name: "r:id", value: id },
    ];

    const sheets = createXmlElement("sheets", doc),
        sheet = createXmlElement({ tag: "sheet", attributes: attr }, doc);

    sheets.appendChild(sheet);

    return sheets;
};

/**
 * Generate Workbook
 * @param {string?} sheetName Custom sheet name
 * @param {string?} sheetId Custom sheet id
 * @return {XMLDocument} Workbook as XML
 */
export default function generateWorkbook(sheetName = "Sheet1", sheetId = "rId3") {
    const xmlDoc = createXMLTemplate(),
        sheetData = createSheets(sheetName || "Sheet1", sheetId || "rId3", xmlDoc);

    let items = ["workbookPr", sheetData, "definedNames", "calcPr"];

    return addXmlElement(xmlDoc, items, "workbook");
}
