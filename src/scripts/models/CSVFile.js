import MyArray from "./MyArray";
import { rgx } from "../lib/Constant";
import { isNumeric } from "../lib/Util";
import * as util from "../lib/CSVUtil";

class CSVFile {
    constructor() {
        this.types = new MyArray("gagal", "error");
        this.fileName = { fname: [], ftype: "", numb: 1, ext: ".csv" };
        this.options = {};
    }

    /**
     * Read CSV or TXT CSV formated file
     * @param {File} file
     */
    async import(file) {
        if (!file) return this;
        const data = await file.text();
        if (!data) return this;

        this.constructFileName(file.name);

        return this.readData(data.split(/\r\n|\r|\n/), file);
    }

    /**
     * Construct current CSV filename
     * @param {String} filename
     */
    constructFileName(filename) {
        let [name, ext] = filename.split(".");
        const newName = { fname: [], ftype: "", numb: 1, ext: `.${ext || "csv"}` };
        name.replace(rgx.forFilename, (m, t, n, f) => {
            if (f !== undefined) {
                newName.fname.push(f);
            }
            if (t !== undefined && this.types.isOnArray(t)) {
                newName.ftype = t || "";
            }
            if (n !== undefined) {
                newName.numb = isNumeric(n) ? Number(n) : 1;
            }

            return "";
        });
        this.fileName = Object.assign({}, this.fileName, newName);
    }

    /**
     * Load file from text based filetype (txt/csv)
     * @param {Array} data csv|text file array of row data
     * @returns
     */
    readData(data) {
        /**
         * Detect and get csv row data, then convert it into custom Array.
         * If it's invalid row, then return false.
         * @param {String} row CSV row data
         * @param {String} splitter csv delimiter
         * @returns {MyArray | False}
         */
        const isValidRow = (row, splitter) => {
            const data = this.toArray(row, splitter),
                validPhone = (val) => rgx.phonePattern.test(val);
            if (row != "" && data && data.length >= 2) {
                if (!data.some((val, idx) => validPhone(val) && idx !== 0)) return false;
                data.forEach((a, i) => {
                    data[i] = /^"(.*)"$/.test(a) ? a.replace(/(^")|("$)/g, "") : data[i];
                    data[i] = validPhone(a)
                        ? util.setPhone(a)
                        : isNumeric(a)
                        ? Number(a).toString()
                        : data[i];
                });
                return data;
            }
            return false;
        };

        const idx = data.length > 1 && data[1] != "" ? 1 : 0,
            newData = new MyArray(),
            dt = new MyArray(),
            splitter = util.useComma(data[idx]) ? "," : ";";

        data.forEach((e) => {
            let row;
            console.log(e, isValidRow(e, splitter));
            if ((row = isValidRow(e, splitter))) {
                newData.push(row);
                let s;
                if ((s = util.getSignDate(row))) dt.push(s);
            }
        });

        this.options = Object.assign({}, this.options, {
            monthIndex: dt.isEmpty ? false : util.monthIndex(dt),
            splitter: splitter,
        });

        this.data = newData;

        return this;
    }

    /**
     * Just Convert csv data into custom Array.
     * @param {String} text csv row value
     * @param {String} delimiter csv delimiter
     * @returns {MyArray}
     */
    toArray(text, delimiter = ",") {
        let data = new MyArray();
        text.replace(util.rowValue(delimiter, "g"), function (match, g1, g2, g3) {
            if (g1 !== undefined) {
                data.push(g1.replace(/\\'/g, "'"));
            } else if (g2 !== undefined) {
                data.push(g2.replace(/\\"/g, '"'));
            } else if (g3 !== undefined) {
                data.push(g3.replace(/^['"]?(.*)['"]?$/, `$1`));
            }
            return "";
        });
        if (/,\s*$/.test(text)) data.push("");
        return data;
    }

    /**
     * Export array to CSV File based on current file
     * @param {String} type error type
     * @param {Array | MyArray} data
     * @returns
     */
    export(type, data) {
        /**
         * Proceed array to Blob data
         */
        const csvData = ((data) => {
            function proceedRow(row) {
                let finalVal = "";
                for (let j = 0; j < row.length; j++) {
                    let innerValue = row[j] === null ? "" : row[j].toString();
                    if (row[j] instanceof Date) {
                        innerValue = row[j].toLocaleString();
                    }
                    let result = innerValue.replace(/"/g, '""');
                    if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
                    if (j > 0) finalVal += ",";
                    finalVal += result;
                }
                return finalVal + "\n";
            }

            let csvData = "";
            for (let i = 0; i < data.length; i++) {
                csvData += proceedRow(data[i]);
            }

            return new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        })(data);

        /**
         * Create new file name to export
         */
        const newName = ((type) => {
            let { fname, ext } = this.fileName;

            const getNumb = () => {
                let { ftype, numb } = this.fileName;
                if (type !== ftype) return "";

                return `_${numb + 1}`;
            };

            return `${fname.join("_")}_${type}${getNumb()}${ext}`;
        })(type);

        return { fileUrl: URL.createObjectURL(csvData), fileName: newName };
    }

    static createFile(name, data) {
        /**
         * Proceed array to Blob data
         */
        const csvData = ((data) => {
            function proceedRow(row) {
                let finalVal = "";
                for (let j = 0; j < row.length; j++) {
                    let innerValue = row[j] === null ? "" : row[j].toString();
                    if (row[j] instanceof Date) {
                        innerValue = row[j].toLocaleString();
                    }
                    let result = innerValue.replace(/"/g, '""');
                    if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
                    if (j > 0) finalVal += ",";
                    finalVal += result;
                }
                return finalVal + "\n";
            }

            let csvData = "";
            for (let i = 0; i < data.length; i++) {
                csvData += proceedRow(data[i]);
            }

            return new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        })(data);

        return { fileUrl: URL.createObjectURL(csvData), fileName: `${name}.csv` };
    }
}

const csvFile = new CSVFile();
export { CSVFile as default, csvFile };
