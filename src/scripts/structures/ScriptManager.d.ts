import Base from "./Base";

/**
 * ScriptManager Model Class
 * @class ScriptManager
 * @classdesc Contains Greasemonkey or Tampermonkey UserScript API
 */
export default class ScriptManager extends Base {
    constructor();

    /** Get current app information */
    get appInfo(): { [k: string]: string };

    /** Get current userscript manager name */
    get managerName(): string | undefined;

    /** Get some app informations using keyname */
    getInfo(): Tampermonkey.ScriptInfo;
    getInfo(key?: string): string | { [k: string]: string } | undefined;

    /** Get app resource */
    getResource(key: string, mode: "text" | "url"): string | undefined;

    /** Delete value on local storage */
    deleteValue(name: string): void;

    /** Set and save some value to local storage */
    setValue(props: {[k: string]: any}): void;
    setValue(name: string, value: any): void;

    /** Get value from local storage using it's name as keyword */
    getValue(name: string): any | null;
    getValue<T>(name: string, base: T): any | T;

    /** GM XMLHttpRequest Implementation */
    request(options: Tampermonkey.Request): void;
}