import { createXml, addXmlElement } from "../modules/dom";

/**
 * Create XML Document Template
 * @return {XMLDocument}
 */
const createXMLTemplate = () => {
    const attr = {
        name: "xmlns",
        value: "http://schemas.openxmlformats.org/package/2006/content-types",
    };
    const prop = { tag: "Types", attributes: attr };
    return createXml(prop);
};

/**
 * Generate ContentTypes
 * @return {XMLDocument}
 */
export default function generateContentTypes() {
    const xmlDoc = createXMLTemplate();
    const items = [
        {
            tag: "Default",
            attributes: [
                { name: "Extension", value: "xml" },
                { name: "ContentType", value: "application/xml" },
            ],
        },
        {
            tag: "Default",
            attributes: [
                { name: "Extension", value: "rels" },
                {
                    name: "ContentType",
                    value: "application/vnd.openxmlformats-package.relationships+xml",
                },
            ],
        },
        {
            tag: "Override",
            attributes: [
                { name: "PartName", value: "/xl/workbook.xml" },
                {
                    name: "ContentType",
                    value: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml",
                },
            ],
        },
        {
            tag: "Override",
            attributes: [
                { name: "PartName", value: "/xl/worksheets/sheet1.xml" },
                {
                    name: "ContentType",
                    value: "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml",
                },
            ],
        },
    ];

    return addXmlElement(xmlDoc, items, "Types");
}
