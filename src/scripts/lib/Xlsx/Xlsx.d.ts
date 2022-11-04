import MyArray from "../../models/MyArray";

export default class Xlsx {    
    /**
     * Get inline cells info
     */
    static getCells(doc: Document): MyArray<Element>;

    /**
     * Get merged cells info
     */
    static getMergedCells(doc: Node): MyArray<Element>;

    /**
     * Get cell value
     */
    static getCellValue(node: Node): Element;

    /**
     * Get Cell Inline String Value
     */
    static getCellInlineStringValue(node: Node): string;

    /**
     * Get Dimensions info
     */
    static getDimensions(doc: Document): string;

    /**
     * Get Shared strings
     */
    static getSharedStrings(doc: Document): MyArray<string>;

    /**
     * Get Based Styles elements
     */
    static getBaseStyles(doc: Document): MyArray<Element>;

    /**
     * Get Number formats elements
     */
    static getNumberFormats(doc: Document): MyArray<Element>;

    /**
     * Get Workbook properties
     */
    static getWorkbookProperties(doc: Document): Element;

    /**
     * Get Cell Styles elements
     */
    static getCellStyles(doc: Document): MyArray<Element>;

    /**
     * Get all Relationships elements
     */
    static getRelationships(doc: Document): MyArray<Element>;

    /**
     * Get all Sheets elements
     */
    static getSheets(doc: Document): MyArray<Element>;
}