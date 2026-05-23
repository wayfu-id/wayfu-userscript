import MyArray from "./MyArray";
import BaseModel from "./BaseModel";

/**
 * Settings Interface
 */
interface Settings {
    key: "wayfu-options";
    monthIdx: 0 | 1 | 2;
    theme: "dark" | "light";
    debugMode: boolean;
    hasImage: boolean;
    useImage: boolean;
    imageFile: File | null;
    imageQuality: "Standard" | "HD";
    activeTab: string;
    targetBp: number;
    maxQueue: number;
    dateFormat: "auto" | 0 | 1 | 2;
    openPanel: boolean;
    useCaption: string;
    userType: "general" | "oriflame";
    splitter: "," | ";";
    isFormat: boolean;
    akert: boolean;
    queueLimit: number;
    bpLimit: number;
    exportType: "ask" | "csv" | "xlsx";
    fileType: string;
}

type defaultProp = Settings;

/**
 * Settings Model Class
 * @class Settings
 * @classdesc Contains application settings
 */
class Settings extends BaseModel {
    private static instance: Settings;
    key: "wayfu-options";

    /**
     * Default Properties
     * You can add new property here
     */
    readonly #defaultProp = {
        theme: "dark",
        debugMode: false,
        hasImage: false,
        useImage: false,
        imageFile: null,
        imageQuality: "Standard",
        activeTab: "msg",
        monthIdx: 0,
        targetBp: 100,
        maxQueue: 500,
        dateFormat: "auto",
        openPanel: true,
        useCaption: "caption",
        userType: "general",
        splitter: ",",
        isFormat: false,
        akert: true,
        queueLimit: 1000,
        bpLimit: 300,
        exportType: "ask",
        fileType: "csv",
    };

    private constructor() {
        super();
        this.key = "wayfu-options";
        return this._setProps(this.#defaultProp);
    }

    get defaultProp() {
        return this.#defaultProp;
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
        if (key == "key") return;
        return this._setProp(key, value);
    }

    /**
     * Save current settings to local storage
     */
    save() {
        const keys: MyArray<string> = new MyArray<string>(
            "useImage",
            "hasImage",
            "imageFile",
            "alert",
            "debugMode",
            "defaultProp",
            "key",
        );
        let data: Partial<Settings> = {};

        for (let prop in this) {
            if (this.defaultProp.hasOwnProperty(prop) && !keys.isOnArray(prop)) {
                data[prop] = this[prop];
            }
        }

        return { [this.key]: data };
    }

    static getSettings() {
        if (!Settings.instance) {
            Settings.instance = new Settings();
        }
        return Settings.instance;
    }
}

export default Settings;
