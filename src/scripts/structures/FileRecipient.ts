import Xlsx from "@wayfu/simple-xlsx";
import MyArray from "./MyArray";
import { rgx } from "../config";
import { isNumeric } from "../utilities/index";
import { getSignDate, rowValue, transformRow, useComma } from "../utilities/DocumentUtils";

export type cellData = string;
export type rowData = MyArray<cellData>;
export type fullData = MyArray<rowData>;

interface XLSXOptions {
    sheet?: string | number;
    trim?: boolean;
    epoch1904?: boolean;
    transformData?: (data: fullData) => fullData;
}

interface CSVOptions {
    monthIdx: 0 | 1 | 2 | number;
    splitter: string;
}

export default class FileRecipient {
    types: MyArray<string>;
    file?: File;
    fileName: {
        fname: string[];
        ftype: string;
        numb: number;
        ext: ".csv" | ".xlsx";
    };
    data: rowData;
    dateCollection: MyArray<string>;
    options: CSVOptions;

    private constructor(options?: CSVOptions) {
        this.types = new MyArray("gagal", "error");
        this.fileName = { fname: [], ftype: "", numb: 1, ext: ".csv" };

        this.options = options ?? { monthIdx: 1, splitter: "," };
        this.data = new MyArray();
        this.dateCollection = new MyArray();
    }

    /** Construct current CSV filename     */
    constructFileName(filename: string) {
        let [name, ext] = filename.split(".");
        const newName = { fname: new MyArray(), ftype: "", numb: 1, ext: `.${ext || "csv"}` };
        name.replace(rgx.forFilename, (m, t, n, f) => {
            if (f !== undefined) newName.fname.push(f);
            if (t !== undefined && this.types.isOnArray(t)) newName.ftype = t || "";
            if (n !== undefined) newName.numb = isNumeric(n) ? Number(n) : 1;
            return "";
        });
        this.fileName = Object.assign({}, this.fileName, newName);
    }

    /** Load file from text based filetype (csv/xls)     */
    async readData(data: string | ArrayBuffer) {
        const dataArr: string[] | fullData =
            typeof data === "string" ? data.split(/\r\n|\r|\n/) : await this.handleExcel(data);

        const splitter = (([d, ...rest]) => {
            d = d || rest[0];
            if (typeof d !== "string") return ",";
            return useComma(d) ? "," : ";";
        })(dataArr);

        const newData: MyArray<rowData> = new MyArray();

        dataArr.forEach((e) => {
            let row = ((e) => {
                let val: rowData = Array.isArray(e) ? e : this.toArray(e, splitter);
                return transformRow(val);
            })(e);
            if (row) {
                newData.push(row);
                let date = getSignDate(e);
                if (date) this.dateCollection.push(date);
            }
        });

        this.data = MyArray.create(newData.filter((e) => !e.isEmpty).map((e) => e.toString()));
        return this;
    }

    /** Handle excel file and return it as Array of rows     */
    async handleExcel(file: ArrayBuffer, options?: XLSXOptions) {
        let opt = Object.assign({}, { sheet: 1 }, options);
        return await Xlsx.read(file, opt);
    }

    /** Just Convert csv data into custom Array.     */
    toArray(text: string, delimiter: string = ",") {
        let data: MyArray<string> = new MyArray();
        const replacer = (m: string, ...groups: string[]) => {
            groups.forEach((v, i) => {
                if (i >= groups.length - 2) return;
                const { rgx, val } = ((i) => {
                    return {
                        rgx: [/\\'/g, /\\"/g, /^['"]?(.*)['"]?$/][i],
                        val: ["'", '"', `$1`][i],
                    };
                })(i);
                if (v === "") data.length++;
                if (!!v) data.push(v.replace(rgx, val));
            });
            return "";
        };
        text.replace(rowValue(delimiter, "g"), replacer);

        if (/,\s*$/.test(text)) data.push("");
        return data;
    }

    /** Export array to CSV File based on current file     */
    export(type: string, data: fullData) {
        // const { splitter } = this.options;
        const newName = ((type) => {
            let { fname } = this.fileName;

            const getNumb = () => {
                let { ftype, numb } = this.fileName;
                if (type !== ftype) return "";

                return `_${numb + 1}`;
            };

            return `${fname.join("_")}_${type}${getNumb()}`;
        })(type);

        // return { fileUrl: URL.createObjectURL(csvData), fileName: newName };
        return FileRecipient.createFile(newName, data);
    }

    /** Read CSV or TXT CSV formated file     */
    static async readFile(file: File, options?: CSVOptions) {
        if (!file) return null;

        let result = new FileRecipient(options);
        result.constructFileName(file.name);
        result.file = file;

        const data = await ((f, { xlsxFileCheck }, { ext }) => {
            return xlsxFileCheck.test(f.type) && /xlsx/.test(ext) ? f.arrayBuffer() : f.text();
        })(file, rgx, result.fileName);

        if (!data) return null;
        return result.readData(data);
    }

    /** Create a csv file from array data     */
    static createFile(name: string, data: fullData, splitter: string = ",") {
        /** Proceed array to Blob data         */
        const csvData = ((data, splitter) => {
            /** Format row value to string             */
            const formatRowValue = (val: string | Date | null) => {
                val = val ? (val instanceof Date ? val.toLocaleString() : val.toString()) : "";
                let result = val.replace(/"/g, '""');
                if (result.search(/("|,|\n)/g) >= 0) result = `"${result}"`;
                return result;
            };

            /** Conver an array of row to csv row string             */
            const proceedRow = (row: rowData) => {
                let delimiter = splitter || ",",
                    finalVal = row.map(formatRowValue).join(delimiter);

                return `${finalVal}\n`;
            };

            let csvData = "";
            data.forEach((e) => (csvData += proceedRow(e)));

            return new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        })(data, splitter);

        return { fileUrl: URL.createObjectURL(csvData), fileName: `${name}` };
    }

    /** Create a Xlsx file from array data     */
    static exportToXlsx(name: string, data: fullData) {
        return Xlsx.write(data, name);
    }
}
