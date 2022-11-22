import MyArray from "./MyArray";
import { rgx } from "../lib/Constant";
import { isNumeric, createFilteredObject } from "../lib/Util";
import readXlsxFile from "../lib/Xlsx";
import { options } from "./Settings";
import * as util from "../lib/CSVUtil";

/**
 * @typedef {{
 *     fname: string[];
 *     ftype: string;
 *     numb: number;
 *     ext: string;
 * }} fileName;
 *
 * @typedef {{
 *     monthIndex: 0 | 1 | 2;
 *     splitter: string
 * }} csvOptions;
 *
 * @typedef {{
 *     fileUrl: string;
 *     fileName: string;
 * }} fileOutputInfo;
 */

class CSVFile {
    constructor() {
        this.types = new MyArray("gagal", "error");
        /** @type {fileName} */
        this.fileName = { fname: [], ftype: "", numb: 1, ext: ".csv" };
        /** @type {csvOptions} */
        this.options = createFilteredObject(options.default, ["monthIndex", "splitter"]);
    }

    /**
     * Read CSV or TXT CSV formated file
     * @param {File} file
     */
    async import(file) {
        if (!file) return this;
        this.constructFileName(file.name);
        const data = await ((f, { xlsxFileCheck }, { ext }) => {
            return xlsxFileCheck.test(f.type) && /(?:xlsx)/g.test(ext)
                ? f.arrayBuffer()
                : f.text();
        })(file, rgx, this.fileName);
        if (!data) return this;
        return this.readData(data);
    }

    /**
     * Construct current CSV filename
     * @param {String} filename
     */
    constructFileName(filename) {
        let [name, ext] = filename.split(".");
        const newName = { fname: [], ftype: "", numb: 1, ext: `.${ext || "csv"}` };
        name.replace(rgx.forFilename, (m, t, n, f) => {
            if (f !== undefined) newName.fname.push(f);
            if (t !== undefined && this.types.isOnArray(t)) newName.ftype = t || "";
            if (n !== undefined) newName.numb = isNumeric(n) ? Number(n) : 1;
            return "";
        });
        this.fileName = Object.assign({}, this.fileName, newName);
    }

    /**
     * Load file from text based filetype (csv/xls)
     * @param {String | ArrayBuffer} data String text or ArrayBuffer data file
     * @returns
     */
    async readData(data) {
        /** @type {String[]|MyArray<String>[]} */
        const dataArr =
            typeof data === "string"
                ? data.split(/\r\n|\r|\n/)
                : await this.handleExcel(data);

        const splitter = (([d, ...rest]) => {
            d = d || rest[0];
            if (typeof d !== "string") return false;
            return util.useComma(d) ? "," : ";";
        })(dataArr);

        /** @type {MyArray<String>[]} */
        const newData = new MyArray();
        /** @type {MyArray<String>} */
        const dt = new MyArray();

        dataArr.forEach((e) => {
            let row = ((e) => {
                let val = Array.isArray(e) ? e : this.toArray(e, splitter);
                return util.transformRow(val);
            })(e);
            if (row) {
                newData.push(row);
                let date = util.getSignDate(e);
                if (date) dt.push(date);
            }
        });

        this.options = Object.assign({}, this.options, {
            monthIndex: dt.isEmpty ? false : util.monthIndex(dt),
            splitter: splitter || this.options.splitter,
        });

        if (splitter) options.setOption("splitter", splitter);

        this.data = newData.filter((e) => !e.isEmpty);
        // console.log(newData, dt, this);

        return this;
    }

    /**
     * Handle excel file and return it as Array of rows
     * @param {ArrayBuffer} file
     * @param {import("./../lib/Xlsx/modules/parser").baseOptions?} options
     * @return {Promise<Array>}
     */
    async handleExcel(file, options = {}) {
        let opt = Object.assign({}, { sheet: 1 }, options);
        return await readXlsxFile(file, opt);
    }

    /**
     * Just Convert csv data into custom Array.
     * @param {String} text csv row value
     * @param {String} delimiter csv delimiter
     * @returns {MyArray<string>}
     */
    toArray(text, delimiter = ",") {
        /**
         * @type {MyArray<string>}
         */
        let data = new MyArray();
        /**
         * @type {{(m:string, ...groups:string[]):string}}
         */
        const replacer = (m, ...groups) => {
            groups.forEach((v, i) => {
                if (i >= groups.length - 2) return;
                const { rgx, val } = ((i) => {
                    return {
                        rgx: [/\\'/g, /\\"/g, /^['"]?(.*)['"]?$/][i],
                        val: ["'", '"', `$1`][i],
                    };
                })(i);
                if (!!v) data.push(v.replace(rgx, val));
            });
            return "";
        };
        text.replace(util.rowValue(delimiter, "g"), replacer);

        if (/,\s*$/.test(text)) data.push("");
        return data.nonEmptyValue;
    }

    /**
     * Export array to CSV File based on current file
     * @param {String} type error type
     * @param {Array | MyArray} data
     * @returns {fileOutputInfo}
     */
    export(type, data) {
        const { splitter } = this.options;
        // /**
        //  * Proceed array to Blob data
        //  */
        // const csvData = ((data, splitter) => {
        //     /**
        //      * Format row value to string
        //      * @param {string | Date | null} val
        //      * @returns {string}
        //      */
        //     const formatRowValue = (val) => {
        //         val = val
        //             ? val instanceof Date
        //                 ? val.toLocaleString()
        //                 : val.toString()
        //             : "";
        //         let result = val.replace(/"/g, '""');
        //         if (result.search(/("|,|\n)/g) >= 0) result = `"${result}"`;
        //         return result;
        //     };
        //     /**
        //      * Conver an array of row to csv row string
        //      * @param {MyArray | Array } row
        //      * @returns {String}
        //      */
        //     const proceedRow = (row) => {
        //         let delimiter = splitter || ",",
        //             finalVal = row.map(formatRowValue).join(delimiter);

        //         return `${finalVal}\n`;
        //     };

        //     let csvData = "";
        //     data.forEach((e) => (csvData += proceedRow(e)));
        //     // for (let i = 0; i < data.length; i++) {
        //     //     csvData += proceedRow(data[i]);
        //     // }

        //     return new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        // })(data, splitter);

        // /**
        //  * Create new file name to export
        //  */
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
        return CSVFile.createFile(newName, data, splitter);
    }

    /**
     * Create a csv file from array data
     * @param {String} name
     * @param {MyArray | Array} data
     * @param {String?} splitter
     * @returns {fileOutputInfo}}
     */
    static createFile(name, data, splitter = ",") {
        /**
         * Proceed array to Blob data
         */
        const csvData = ((data, splitter) => {
            /**
             * Format row value to string
             * @param {string | Date | null} val
             * @returns {string}
             */
            const formatRowValue = (val) => {
                val = val
                    ? val instanceof Date
                        ? val.toLocaleString()
                        : val.toString()
                    : "";
                let result = val.replace(/"/g, '""');
                if (result.search(/("|,|\n)/g) >= 0) result = `"${result}"`;
                return result;
            };

            /**
             * Conver an array of row to csv row string
             * @param {MyArray | Array } row
             * @returns {String}
             */
            const proceedRow = (row) => {
                let delimiter = splitter || ",",
                    finalVal = row.map(formatRowValue).join(delimiter);

                return `${finalVal}\n`;
            };

            let csvData = "";
            data.forEach((e) => (csvData += proceedRow(e)));
            // for (let i = 0; i < data.length; i++) {
            //     csvData += proceedRow(data[i]);
            // }

            return new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        })(data, splitter);
        /**
         * Proceed array to Blob data
         */
        // const csvData = ((data) => {
        //     /**
        //      * Conver an array row to csv string row
        //      * @param {Array | MyArray} row
        //      * @returns {String}
        //      */
        //     function proceedRow(row) {
        //         let finalVal = "";
        //         for (let j = 0; j < row.length; j++) {
        //             let innerValue = row[j] === null ? "" : row[j].toString();
        //             if (row[j] instanceof Date) {
        //                 innerValue = row[j].toLocaleString();
        //             }
        //             let result = innerValue.replace(/"/g, '""');
        //             if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
        //             if (j > 0) finalVal += ",";
        //             finalVal += result;
        //         }
        //         return finalVal + "\n";
        //     }

        //     let theData = "";
        //     for (let i = 0; i < data.length; i++) {
        //         theData += proceedRow(data[i]);
        //     }

        //     return new Blob([theData], { type: "text/csv;charset=utf-8;" });
        // })(data);

        return { fileUrl: URL.createObjectURL(csvData), fileName: `${name}.csv` };
    }
}

const csvFile = new CSVFile();
export { CSVFile as default, csvFile };
