import MyArray from "../models/MyArray";
import { rgx, dateOptDefault } from "./Constant";

const useComa = (text) => {
    let pattern = String.raw`^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,;"\s\\]*(?:\s+[^,;"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,;"\s\\]*(?:\s+[^,;"\s\\]+)*)\s*)*$`,
        regExp = new RegExp(pattern);
    return regExp.test(text);
};

const isNumeric = (str) => {
    return typeof str === "string"
        ? !isNaN(str) && !isNaN(parseFloat(str))
        : typeof str === "number";
};

const isDateStr = (str) => {
    return typeof str !== "string"
        ? false
        : new Date(str).toString() !== "Invalid Date" && !isNaN(new Date(str));
};

const rowValue = (d = ",", flag = "") => {
    let add = d == "," ? `${d};` : d,
        pattern = String.raw`(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^${add}"\s\\]*(?:\s+[^${add}"\s\\]+)*))\s*(?:${d}|$)`;
    return flag ? new RegExp(pattern, flag) : new RegExp(pattern);
};

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

const getSignDate = (date) => {
    date = rgx.datePattern.exec(date);
    return date ? date.toString() : null;
};

const setName = (str, full = false) => {
    let name = [];
    str.split(" ").forEach((e) => {
        name.push(titleCase(e));
    });
    return full ? name.join(" ") : name[0];
};

const titleCase = (string) => {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const setPhone = (ph) => {
    ph = typeof ph === "string" ? ph : ph.join("");
    return ph.replace(rgx.phoneValue, function (m0, g1, g2) {
        let phone = g1 !== undefined ? g1 : g2.replace(/(\-| )/g, ""),
            extra = phone.charAt(0) === "8" && m0.charAt(0) !== "+" ? "62" : "";
        return extra + phone;
    });
};

const dateFormat = (value, i = 0) => {
    return new Date(value).toLocaleDateString(
        "id-ID",
        Object.assign({}, dateOptDefault, {
            weekday: i == 0 ? "long" : undefined,
        })
    );
};

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

const loadFile = (data) => {
    const idx = data.length > 1 && data[1] != "" ? 1 : 0,
        newData = new MyArray(),
        dt = new MyArray(),
        splitter = useComa(data[idx]) ? "," : ";";

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

const exportToCsv = (filename, data) => {
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

    return { fileUrl: csvUrl, fileName: filename };
};

export { isNumeric, isDateStr, isUpToDate, setName, dateFormat, loadFile, exportToCsv };
