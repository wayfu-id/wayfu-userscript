import MyArray from "../models/MyArray";
import { rgx, dateOptDefault } from "./Constant";

/**
 * Scan and determine csv delimiter. Using comma or not.
 * @param {String} text CSV row
 * @returns {Boolean}
 */
const useComma = (text) => {
    let pattern = String.raw`^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,;"\s\\]*(?:\s+[^,;"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,;"\s\\]*(?:\s+[^,;"\s\\]+)*)\s*)*$`,
        regExp = new RegExp(pattern);
    return regExp.test(text);
};

/**
 * Check and detect the string is numeric or not
 * @param {String} str input string
 * @returns {Boolean}
 */
const isNumeric = (str) => {
    return typeof str === "string"
        ? !isNaN(str) && !isNaN(parseFloat(str))
        : typeof str === "number";
};

/**
 * Check and detect the string is datestring or not
 * @param {String} str input string
 * @returns {Boolean}
 */
const isDateStr = (str) => {
    return typeof str !== "string"
        ? false
        : new Date(str).toString() !== "Invalid Date" && !isNaN(new Date(str));
};

/**
 * Check and detect the string is JSON valid or not.
 * If it's valid, then return it's JSON value.
 * If it isn't valid, then return it as null.
 * @param {string} str JSON string
 * @returns {Promise<JSON | null>}
 */
const JSONParse = (str) => {
    return new Promise((done) => {
        try {
            done(JSON.parse(str));
        } catch (e) {
            done(null);
        }
    });
};

/**
 * Check and get the exact RegExp to get csv row value.
 * @param {String} d csv delimiter
 * @param {String} flag
 * @returns {RegExp}
 */
const rowValue = (d = ",", flag = "") => {
    let add = d == "," ? `${d};` : d,
        pattern = String.raw`(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^${add}"\s\\]*(?:\s+[^${add}"\s\\]+)*))\s*(?:${d}|$)`;
    return flag ? new RegExp(pattern, flag) : new RegExp(pattern);
};

/**
 * Check current app version is up to date or not.
 * @param {String} local local/instaled version
 * @param {String} remote remote/server version
 * @returns {Boolean}
 */
const isUpToDate = (local, remote) => {
    const { forVersion } = rgx;
    if (!local || !remote || local.length === 0 || remote.length === 0) {
        return false;
    }
    if (local == remote) {
        return true;
    }
    if (forVersion.test(local) && forVersion.test(remote)) {
        let spliter = local.includes(".") ? "." : "-",
            arrL = local.split(spliter).map((x) => {
                return isNumeric(x) ? Number(x) : x;
            }),
            arrR = remote.split(spliter).map((x) => {
                return isNumeric(x) ? Number(x) : x;
            });

        for (let i = 0; i < arrL.length; ++i) {
            if (arrR.length == i) {
                return true;
            }
            if (isNumeric(arrL[i]) && isNumeric(arrR[i])) {
                if (arrL[i] == arrR[i]) {
                    continue;
                } else {
                    return arrL[i] > arrR[i] ? true : false;
                }
            } else {
                let [digL, digR] = [
                        Number(/\d+/.exec(arrL[i])),
                        Number(/\d+/.exec(arrR[i])),
                    ],
                    [alpL, alpR] = [/[A-Za-z]/.exec(arrL[i]), /[A-Za-z]/.exec(arrR[i])];
                if (digL == digR) {
                    if (alpL && alpR && alpL[0] == alpR[0]) {
                        continue;
                    } else {
                        return alpL && alpR ? alpL[0] > alpR[0] : alpL ? true : false;
                    }
                } else {
                    return digL > digR;
                }
            }
        }
    }

    return local >= remote;
};

/**
 * Check and get the sign up date based on RegExp pattern.
 * Return as string if any matched.
 * Return as null of no matched.
 * @param {String} date input datestring
 * @returns {String | null}
 */
const getSignDate = (date) => {
    date = rgx.datePattern.exec(date);
    return date ? date.toString() : null;
};

/**
 * Get Name or Full Name and change it to Title Case
 * @param {String} str input name
 * @param {Boolean} full is it full name?
 * @returns {String}
 */
const setName = (str, full = false) => {
    let name = [];
    str.split(" ").forEach((e) => {
        name.push(titleCase(e));
    });
    return full ? name.join(" ") : name[0];
};

/**
 * Conver string to Title Case
 * @param {String} string input string
 * @returns {String}
 */
const titleCase = (string) => {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Get and convert current phone number
 * @param {String | String[]} ph input phone
 * @returns {String}
 */
const setPhone = (ph) => {
    ph = typeof ph === "string" ? ph : ph.join("");
    return ph.replace(rgx.phoneValue, function (m0, g1, g2) {
        let phone = g1 !== undefined ? g1 : g2.replace(/(\-| )/g, ""),
            extra = phone.charAt(0) === "8" && m0.charAt(0) !== "+" ? "62" : "";
        return extra + phone;
    });
};

/**
 * Set and print date based on toLocaleDateString format
 * @param {String | Number | Date} value Date value
 * @param {Number} i weekday changing. if 0, then print. If other than 0, don't print
 * @returns {String}
 */
const dateFormat = (value, i = 0) => {
    return new Date(value).toLocaleDateString(
        "id-ID",
        Object.assign({}, dateOptDefault, {
            weekday: i == 0 ? "long" : undefined,
        })
    );
};

/**
 * Calculate and get month indext on some datestring
 * @param {String} date input datestring
 * @returns {0 | 1 | 2}
 */
const monthIndex = (date) => {
    if (rgx.formatedDate.test(date[0])) {
        return 2;
    }
    let a = new MyArray(),
        b = new MyArray();
    date.forEach((e, i) => {
        [a[i], b[i]] = e.split(/\/|:|-/);
    });
    return a.some((x) => x > 12) || b.some((x) => x > 12)
        ? a.some((x) => x > 12)
            ? 1
            : 0
        : a.countValue(a[0]) > b.countValue(b[0])
        ? 0
        : 1;
};

/**
 * Detect and get csv row data, then convert it into custom Array.
 * If it's invalid row, then return false.
 * @param {String} row CSV row data
 * @param {String} splitter csv delimiter
 * @returns {MyArray | False}
 */
const isValidRow = (row, splitter) => {
    const data = CSVtoArray(row, splitter),
        validPhone = (val) => rgx.phonePattern.test(val);
    if (row != "" && data && data.length >= 2) {
        if (!data.some((val) => validPhone(val))) return false;
        data.forEach((a, i) => {
            data[i] = /^"(.*)"$/.test(a) ? a.replace(/(^")|("$)/g, "") : data[i];
            data[i] = validPhone(a)
                ? setPhone(a)
                : isNumeric(a)
                ? Number(a).toString()
                : data[i];
        });
        return data;
    }
    return false;
};

/**
 * Just Convert csv data into custom Array.
 * @param {String} text csv row value
 * @param {String} delimiter csv delimiter
 * @returns {MyArray}
 */
const CSVtoArray = (text, delimiter = ",") => {
    let data = new MyArray();
    text.replace(rowValue(delimiter, "g"), function (match, g1, g2, g3) {
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
};

/**
 * Load file from text based filetype (txt/csv)
 * @param {Array} data csv|text file array of row data
 * @returns
 */
const loadFile = (data) => {
    const idx = data.length > 1 && data[1] != "" ? 1 : 0,
        newData = new MyArray(),
        dt = new MyArray(),
        splitter = useComma(data[idx]) ? "," : ";";

    let row, s;

    data.forEach((e) => {
        if ((row = isValidRow(e, splitter))) {
            newData.push(row);
            if ((s = getSignDate(row))) dt.push(s);
        }
    });

    return {
        option: {
            monthIndex: dt.isEmpty ? false : monthIndex(dt),
            splitter: splitter,
        },
        data: newData,
    };
};

/**
 * Convert and export an array to csv data. Also create URL to download it.
 * @param {String} filename
 * @param {Array} data csv data
 * @returns
 */
const exportToCsv = (filename, type, data) => {
    const processRow = function (row) {
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
    };

    let csvFile = "";
    for (let i = 0; i < data.length; i++) {
        csvFile += processRow(data[i]);
    }

    const blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
    const csvUrl = URL.createObjectURL(blob);

    return { fileUrl: csvUrl, fileName: `${filename}_${type}` };
};

export {
    isNumeric,
    isDateStr,
    isUpToDate,
    setName,
    dateFormat,
    loadFile,
    exportToCsv,
    JSONParse,
};
