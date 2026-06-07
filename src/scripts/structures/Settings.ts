import MyArray from "./MyArray";
import BaseModel from "./BaseModel";

/**
 * Settings Interface
 */
interface Settings {
    monthIdx: 0 | 1 | 2;
    theme: "dark" | "light";
    debugMode: boolean;
    hasAttach: boolean;
    attachFile: File | null;
    imageQuality: "Standard" | "HD";
    attachType: "file" | "product";
    activeTab: string;
    targetBp: number;
    maxQueue: number;
    dateFormat: "auto" | 0 | 1 | 2;
    openPanel: boolean;
    useCaption: "caption" | "message";
    userType: "umum" | "oriflame";
    splitter: "," | ";";
    isFormat: boolean;
    alert: boolean;
    queueLimit: number;
    previewMode: boolean;
    bpLimit: number;
    exportType: "csv" | "xlsx";
}

type defaultProp = Settings;

/**
 * Settings Model Class
 * @class Settings
 * @classdesc Contains application settings
 */
class Settings extends BaseModel {
    readonly #key = "wayfu-options";
    private static instance: Settings;

    /**
     * Default Properties
     * You can add new property here
     */
    readonly #defaultProp = {
        theme: document.body.classList.contains("dark") ? "dark" : "light",
        debugMode: false,
        hasAttach: false,
        attachFile: null,
        imageQuality: "Standard",
        attachType: "file" as "file" | "product",
        activeTab: "msg",
        monthIdx: 0,
        targetBp: 100,
        maxQueue: 500,
        dateFormat: "auto",
        openPanel: true,
        useCaption: "caption",
        userType: "umum",
        splitter: ",",
        isFormat: false,
        alert: true,
        queueLimit: 1000,
        bpLimit: 300,
        exportType: "csv",
        previewMode: false,
    };

    private constructor() {
        super();
        return this._setProps(this.#defaultProp);
    }

    get defaultProp() {
        return this.#defaultProp;
    }

    get key() {
        return this.#key;
    }

    /**
     * Set multiple properties from object
     * @param {Object} options object of properties
     * @returns
     */
    setOptions(options: { [k: string]: any }) {
        if (!options) return;
        return this._setProps(options);
    }

    /**
     * Set single property
     * @param {string} key property name
     * @param {any} value property value
     * @returns
     */
    setOption<K extends keyof defaultProp>(key: K, value: any) {
        return this._setProp(key, value);
    }

    /**
     * Save current settings to local storage
     */
    save() {
        const keys: MyArray<string> = new MyArray<string>(
            "hasAttach",
            "attachFile",
            "alert",
            "debugMode",
            "defaultProp",
            "previewMode",
            "key",
        );
        let data: Partial<Settings> = {};

        for (let prop in this) {
            if (this.defaultProp.hasOwnProperty(prop) && !keys.isOnArray(prop)) {
                data[prop] = this[prop];
            }
        }

        return { [this.#key]: data };
    }

    static getSettings() {
        if (!Settings.instance) {
            Settings.instance = new Settings();
        }
        return Settings.instance;
    }
}

export default Settings;
