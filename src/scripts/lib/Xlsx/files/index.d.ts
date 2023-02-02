export const contentTypes: XMLDocument;
export const relationships: XMLDocument;
export const workSheet: XMLDocument;
export function workBook(sheetName?: string, sheetId?: string): {data: XMLDocument,rels: XMLDocument};