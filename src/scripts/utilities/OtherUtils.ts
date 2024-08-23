import { isNumeric } from ".";
import { rgx, dateOptDefault } from "../config";

/**
 * Set and print date based on toLocaleDateString format
 * @param {String | Number | Date} value Date value
 * @param {boolean?} [printDays=true] print weekdays?
 */
function dateFormat (value: string | number | Date, printDays: boolean = true) {
    let formatOpt = Object.assign({}, dateOptDefault, {
        weekday: printDays ? "long" : undefined,
    }) as Intl.DateTimeFormatOptions;

    return new Date(value).toLocaleDateString("id-ID", formatOpt);
};

/**
 * Check current app version is up to date or not.
 * @param {String} local local/instaled version
 * @param {String} remote remote/server version
 */
function isUpToDate (local: string, remote: string) {
    const { forVersion } = rgx;
    if (!local || !remote || local.length === 0 || remote.length === 0) {
        return false;
    }
    if (local == remote) return true;
    const getArr = (str: string, s: string) => {
        return str.split(s).map((x) => (isNumeric(x) ? Number(x) : x));
    };
    const getDigit = (str: string) => Number(/\d+/.exec(str));
    const getAlpha = (str: string) => /[A-Za-z]/.exec(str);

    if (forVersion.test(local) && forVersion.test(remote)) {
        let spliter = local.includes(".") ? "." : "-",
            arrR = getArr(remote, spliter);

        return getArr(local, spliter).every((v, i, a) => {
            if (arrR[a.length]) return false;
            if (isNumeric(v) && isNumeric(arrR[i])) {
                return !(v === arrR[i]) ? v >= arrR[i] : true;
            }
            let [dig, alph] = ((l, r) => {
                return [
                    { l: getDigit(l as string), r: getDigit(r as string) },
                    { l: getAlpha(l as string), r: getAlpha(r as string) },
                ];
            })(v, arrR[i]);
            if (dig.l === dig.r) {
                return alph.l && alph.r ? alph.l[0] >= alph.r[0] : !!alph.l;
            }
            return dig.l >= dig.r;
        });
    }

    return local >= remote;
};

/**
 * Get Name or Full Name and change it to Title Case
 * @param {String} string input name
 * @param {Boolean} full is it full name?
 */
function setName (string: string, full: boolean = false) {
    const name = string.split(" ").map((s) => titleCase(s));
    return full ? name.join(" ") : name[0];
};

/**
 * Conver string to Title Case
 * @param {String} string input string
 */
function titleCase (string: string) {
    return ((s) => {
        return s.charAt(0).toUpperCase() + s.slice(1);
    })(string.toLowerCase());
};

export { dateFormat, isUpToDate, setName, titleCase };
