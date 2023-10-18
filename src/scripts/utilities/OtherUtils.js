import { rgx, dateOptDefault } from "../config";

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
    if (local == remote) return true;
    /** @type {(str: String, s: String) => Array.<String | Number>} */
    const getArr = (str, s) => {
        return str.split(s).map((x) => (isNumeric(x) ? Number(x) : x));
    };
    /** @type {(str: String) => Number} */
    const getDigit = (str) => Number(/\d+/.exec(str));
    /** @type {(str: String) => RegExpExecArray | null} */
    const getAlpha = (str) => /[A-Za-z]/.exec(str);

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
                    { l: getDigit(l), r: getDigit(r) },
                    { l: getAlpha(l), r: getAlpha(r) },
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
 * @returns {String}
 */
const setName = (string, full = false) => {
    const name = string.split(" ").map((s) => titleCase(s));
    return full ? name.join(" ") : name[0];
};

/**
 * Conver string to Title Case
 * @param {String} string input string
 * @returns {String}
 */
const titleCase = (string) => {
    return ((s) => {
        return s.charAt(0).toUpperCase() + s.slice(1);
    })(string.toLowerCase());
};

/**
 * Set and print date based on toLocaleDateString format
 * @param {String | Number | Date} value Date value
 * @param {boolean=true} printDays print weekdays?
 * @returns {String}
 */
const dateFormat = (value, printDays = true) => {
    return new Date(value).toLocaleDateString(
        "id-ID",
        Object.assign({}, dateOptDefault, {
            weekday: printDays ? "long" : undefined,
        })
    );
};

export { isUpToDate, setName, titleCase, dateFormat };
