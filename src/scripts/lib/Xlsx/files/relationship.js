import { createXml, addXmlElement, createXmlElement } from "../modules/dom";

/**
 * Create XML Document Template
 * @return {XMLDocument}
 */
const createXMLTemplate = () => {
    const attr = {
        name: "xmlns",
        value: "http://schemas.openxmlformats.org/package/2006/relationships",
    };
    const prop = { tag: "Relationships", attributes: attr };
    return createXml(prop);
};

/**
 * Generate Relationships
 * @param {string} id
 * @param {string?} target
 * @return {XMLDocument}
 */
export default function generateRelationships(type = "", id = "") {
    // let { idVal, typeVal, target } = ((t, id) => {
    //     if (!t || t === "workbook") {
    //         return {
    //             idVal: "rId1",
    //             typeVal: "officeDocument",
    //             target: "worksheets/sheet1.xml",
    //         };
    //     }
    //     return {
    //         idVal: id ? id : "rId3",
    //         typeVal: "worksheet",
    //         target: "worksheets/sheet1.xml",
    //     };
    // })(type, id);
    const isWorksheet = type && type === "worksheet";
    const target = isWorksheet ? "worksheets/sheet1.xml" : "xl/workbook.xml";
    const typeVal = ((e) => {
        let val = e ? "worksheet" : "officeDocument";
        return `http://schemas.openxmlformats.org/officeDocument/2006/relationships/${val}`;
    })(isWorksheet);

    id = !isWorksheet ? "rId1" : id ? id : "rId3";

    const xmlDoc = createXMLTemplate();
    const item = createXmlElement(
        {
            tag: "Relationship",
            attributes: [
                { name: "Id", value: id },
                { name: "Type", value: typeVal },
                { name: "Target", value: target },
            ],
        },
        xmlDoc
    );

    return addXmlElement(xmlDoc, item, "Relationships");
}
