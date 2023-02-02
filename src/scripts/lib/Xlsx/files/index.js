import generateContentTypes from "./contentTypes";
import generateRelationships from "./relationship";
import generateWorkbook from "./workbook";
import generateWorksheet from "./worksheet";

const contentTypes = generateContentTypes();
const relationships = generateRelationships();
const workBook = (sheetName = "Sheet1", sheetId = "rId3") => {
    return {
        data: generateWorkbook(sheetName, sheetId),
        rels: generateRelationships("worksheet"),
    };
};
const workSheet = generateWorksheet;

export { contentTypes, relationships, workBook, workSheet };
