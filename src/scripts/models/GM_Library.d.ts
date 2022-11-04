import BaseModel from "./BaseModel";

/**
 * GM_Library Model Class
 * @class GM_Library
 * @classdesc Contains Greasemonkey or Tampermonkey UserScript API
 */
export default class GM_Library extends BaseModel {
    /** Get current app information */
    get appInfo(): {[k: string]: string};

    /** Get current userscript manager name */
    get managerName(): "Greasemonkey" | "Tampermonkey" | "Scriptish" | "NinjaKit" | "Native";

    /** Get some app informations using keyname */
    getInfo(key?: string): string | {[k: string]: string};

    /** Get app resource */
    getResource(key: string, mode?: "text" | "url"): string;

    /** Delete value on local storage (not implemented yet) */
    deleteValue(name: string): void;

    /** Set and save some value to local storage */
    setValue<T extends object>(name: string, value: T): void;

    /** Get value from local storage using it's name as keyword */
    getValue<T extends object>(name: string, base?: T): any;

    /** GM XMLHttpRequest Implementation */
    request(options: Tampermonkey.Request): void;
}