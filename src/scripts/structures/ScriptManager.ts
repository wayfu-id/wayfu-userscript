import BaseModel from "./BaseModel";
import { findValue } from "../utilities";
import App from "../App";
/**
 * ScriptManager Model Class
 * @class ScriptManager
 * @classdesc Contains Greasemonkey or Tampermonkey UserScript API
 */
export default class ScriptManager extends BaseModel {
    constructor(app: App) {
        super(app);
    }

    /**
     * Get current app information
     */
    get appInfo(): Tampermonkey.ScriptMetadata {
        return this.getInfo()?.script as Tampermonkey.ScriptMetadata;
    }

    /**
     * Get current userscript manager name
     */
    get managerName() {
        if (typeof GM_info === "object") {
             // Tampermonkey (Chrome/Opera/Firefox)
            if (typeof GM_info.scriptHandler !== "undefined") {
                return "Tampermonkey";
            }
             // Greasemonkey (Firefox) 
            else {
                return "Greasemonkey";
            }
        } else {
            if (
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
     * @param {string} key keyname
     */
    getInfo(key: string = ""): Tampermonkey.ScriptInfo | null {
        if (!GM_info) return null;

        return key === "" ? GM_info : findValue(key, GM_info);
    }

    /**
     * Get app resource
     * @param {string} key name of the resource
     * @param {string} [mode="text" | "url"] type of resource `"text" | "url"`
     * @returns
     */
    getResource(key: string, mode: string = "text") {
        if (typeof GM_getResourceText !== "undefined" && mode === "text") {
            return GM_getResourceText(key);
        } else if (typeof GM_getResourceURL !== "undefined" && mode === "url") {
            return GM_getResourceURL(key);
        }
    }

    /**
     * Delete value on local storage (not implemented yet)
     * @param {string} name value name
     */
    deleteValue(name: string) {
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
     */
    setValue(name: { [k: string]: any }): void;
    /**
    * Set and save some value to local storage
    * @overload
    * @param {string} name what name
    * @param {any} value what value
    */
    setValue(name: string, value: any): void;
    setValue(name: string | { [k: string]: any }, value?: any): void {
        if (typeof GM_setValue === "undefined") return;

        if (typeof name === "object") {
            for (let key in name) {
                GM_setValue(key, name[key]);
            }
            return;
        }

        if (typeof name === "string" && !!value) {
            GM_setValue(name, value);
        }
        return;
    }

    /**
     * Get value from local storage using it's name as keyword
     * @param {string} name what name
     * @param {any} base set base value if not found. Difault is `null`
     */
    getValue(name: string, base: any = null) {
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
    request(options: Tampermonkey.Request) {
        options.url = options.url || this.appInfo.homepage || "";
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

        const _onload = options.onload as ((e: Tampermonkey.Response<object>) => any) | undefined,
            _onerror = options.onerror as ((e: Tampermonkey.ErrorResponse) => any) | undefined,
            _ontimeout = options.ontimeout,
            _onabort = options.onabort;

        options.onload = function (xhr) {
            return _onload ? _onload(xhr) : null;
        };
        options.onerror = function (xhr) {
            console.log(`request error: ${xhr.error || "unknown error"}`);
            return _onerror ? _onerror(xhr) : null;
        };
        options.ontimeout = function () {
            console.log(`request error: "timed out"`);
            _ontimeout ? _ontimeout() : null;
        };
        options.onabort = function () {
            console.log(`request error: "aborted"`);
            _onabort ? _onabort() : null;
        };

        if (typeof GM_xmlhttpRequest != "undefined") {
            GM_xmlhttpRequest(options);
        } else {
            console.log("XHR not Allowed!");
        }
    }
}
