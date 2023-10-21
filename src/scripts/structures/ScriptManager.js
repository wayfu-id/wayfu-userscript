import BaseModel from "./BaseModel";
import { findValue } from "../utilities";
/**
 * ScriptManager Model Class
 * @class ScriptManager
 * @classdesc Contains Greasemonkey or Tampermonkey UserScript API
 */

export default class ScriptManager extends BaseModel {
    constructor() {
        super();
    }

    /**
     * Get current app information
     * @returns {{ [k: string]: string }}
     */
    get appInfo() {
        return this.getInfo("script");
    }

    /**
     * Get current userscript manager name
     */
    get managerName() {
        if (typeof GM_info === "object") {
            // Greasemonkey (Firefox)
            if (typeof GM_info.uuid !== "undefined") {
                return "Greasemonkey";
            } // Tampermonkey (Chrome/Opera)
            else if (typeof GM_info.scriptHandler !== "undefined") {
                return "Tampermonkey";
            }
        } else {
            // Scriptish (Firefox)
            if (typeof GM_getMetadata === "function") {
                return "Scriptish";
            } // NinjaKit (Safari/Chrome)
            else if (
                typeof GM_setValue !== "undefined" &&
                typeof GM_getResourceText === "undefined" &&
                typeof GM_getResourceURL === "undefined" &&
                typeof GM_openInTab === "undefined" &&
                typeof GM_setClipboard === "undefined"
            ) {
                return "NinjaKit";
            } else {
                // Native
                return "Native";
            }
        }
    }

    /**
     * Get some app informations using keyname
     * @param {String} key keyname
     * @returns {string | { [k: string]: string }}
     */
    getInfo(key = "") {
        if (!GM_info) return null;

        return key === "" ? GM_info : findValue(key, GM_info);
    }

    /**
     * Get app resource
     * @param {String} key name of the resource
     * @param {"text" | "url"} mode type of resource (text | url)
     * @returns
     */
    getResource(key, mode = "text") {
        if (typeof GM_getResourceText !== "undefined" && mode === "text") {
            return GM_getResourceText(key);
        } else if (typeof GM_getResourceURL !== "undefined" && mode === "url") {
            return GM_getResourceURL(key);
        }
    }

    /**
     * Delete value on local storage (not implemented yet)
     * @param {String} name value name
     */
    deleteValue(name) {
        if (typeof GM_deleteValue !== "undefined") {
            const vals = GM_listValues();
            for (const key of vals) {
                if (name && name === key) GM_deleteValue(key);
            }
        }
    }

    /**
     * Set and save some value to local storage
     *
     * @overload
     * @param {{ [k: string]: any }} props propertie(s) as object
     *
     */ /**
     * Set and save some value to local storage
     * @overload
     * @param {string} name what name
     * @param {any} value what value
     */
    setValue(name, value) {
        if (typeof GM_setValue === "undefined") return;

        if (typeof name === "object") {
            for (let key in name) {
                GM_setValue(key, name[key]);
            }
            return;
        }

        if (typeof name === "string") {
            GM_setValue(name, value);
        }
        return;
    }

    /**
     * Get value from local storage using it's name as keyword
     * @param {String} name what name
     * @param {any} base set base value if not found. Difault is `null`
     * @returns {any}
     */
    getValue(name, base = null) {
        if (typeof GM_listValues !== "undefined" && typeof GM_getValue !== "undefined") {
            const keys = GM_listValues();
            if (keys.length !== 0 && keys.some((key) => name === key)) {
                return GM_getValue(name, base);
            }
        }
        return base;
    }

    /**
     * GM XMLHttpRequest Implementation
     * @param {Tampermonkey.Request} options
     */
    request(options) {
        options.url = options.url || this.appInfo.homepage;
        options.method = options.method || "GET";
        options.headers = options.headers || {};
        options.timeout = options.timeout || 2e4; // 20s
        if (options.data || options.method == "POST") {
            options.method = "POST";
            options.data = this.serialize(options.data || {});
            options.headers = Object.assign({}, options.headers, {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/x-www-form-urlencoded",
            });
        }

        const _onload = options.onload,
            _onerror = options.onerror,
            _ontimeout = options.ontimeout,
            _onabort = options.onabort;

        options.onload = function (xhr) {
            _onload(xhr);
        };
        options.onerror = function (xhr) {
            console.log(`request error: ${xhr.error || "unknown error"}`);
            _onerror(xhr);
        };
        options.ontimeout = function (xhr) {
            console.log(`request error: ${xhr.error || "timed out"}`);
            _ontimeout(xhr);
        };
        options.onabort = function (xhr) {
            console.log(`request error: ${xhr.error || "aborted"}`);
            _onabort(xhr);
        };

        if (typeof GM_xmlhttpRequest != "undefined") {
            GM_xmlhttpRequest(options);
        } else {
            console.log("XHR not Allowed!");
        }
    }
}
