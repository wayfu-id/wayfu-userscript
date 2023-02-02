import { saveAs } from "file-saver";
import { zipSync, strToU8 } from "fflate";
import { contentTypes, relationships, workBook, workSheet } from "../files";
import { xlsxConfig } from "./validator";

/**
 * Create Xlsx file based on its config
 * @param {xlsxConfig} config
 */
export function createXlsx(config) {
    const { filename, sheetname, data: sheetData } = config,
        { data: wb_data, rels: wb_rels } = workBook(sheetname);

    let file = zipSync({
        "[Content_Types].xml": xmlToU8(contentTypes),
        _rels: {
            ".rels": xmlToU8(relationships),
        },
        xl: {
            "workbook.xml": xmlToU8(wb_data),
            _rels: {
                "workbook.xml.rels": xmlToU8(wb_rels),
            },
            worksheets: {
                "sheet1.xml": xmlToU8(workSheet(sheetData)),
            },
        },
    });
    // console.log(file);
    saveAs(new Blob([file]), `${filename}.xlsx`);
}

/**
 *
 * @param {XMLDocument} xml
 * @returns
 */
function xmlToU8(xml) {
    return strToU8(getXmlString(xml));
}

/**
 *
 * @param {XMLDocument} xml
 * @returns {string}
 */
function getXmlString(xml) {
    return new XMLSerializer().serializeToString(xml).replace(/\s?xmlns=""/g, "");
}
