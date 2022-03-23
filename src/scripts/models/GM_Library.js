import BaseModel from "./BaseModel";

export default class GM_Library extends BaseModel {
    constructor() {
        super();
    }
    get appInfo() {
        return this.getInfo("script");
    }
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
    getInfo(key = "") {
        if (!GM_info) {
            return null;
        }
        return key === "" ? GM_info : this.findObjectValue(key, GM_info);
    }
    getResource(key, mode = "text") {
        if (typeof GM_getResourceText !== "undefined" && mode === "text") {
            return GM_getResourceText(key);
        } else if (typeof GM_getResourceURL !== "undefined" && mode === "url") {
            return GM_getResourceURL(key);
        }
    }
    deleteValue(name) {
        if (typeof GM_deleteValue !== "undefined") {
            const vals = GM_listValues();
            for (const key of vals) {
                if (name && name !== key) {
                    continue;
                } else {
                    GM_deleteValue(key);
                }
            }
        }
    }
    setValue(name, value) {
        if (typeof GM_setValue !== "undefined") {
            GM_setValue(name, value);
        }
    }
    getValue(name, base = null) {
        if (typeof GM_listValues !== "undefined" && typeof GM_getValue !== "undefined") {
            const keys = GM_listValues();
            if (keys.length !== 0) {
                if (keys.some((key) => name === key)) {
                    return GM_getValue(name, base);
                }
            }
        } else {
            return base;
        }
    }
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
            console.log(xhr);
            _onerror(xhr);
        };
        options.ontimeout = function (xhr) {
            console.log(xhr);
            _ontimeout(xhr);
        };
        options.onabort = function (xhr) {
            console.log(xhr);
            _onabort(xhr);
        };

        if (typeof GM_xmlhttpRequest != "undefined") {
            GM_xmlhttpRequest(options);
        } else {
            console.log("XHR not Allowed!");
        }
    }
}
