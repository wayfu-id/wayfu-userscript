import App from "../App";
import MyArray from "./MyArray";
import { intoObject } from "../utilities/index";
import ScriptManager from "./ScriptManager";

/**
 * Settings Interface
 */
interface Settings {
    monthIdx: 0 | 1 | 2;
    themeColor: string;
    debugMode: boolean;
    hasImage: boolean;
    imageFile: File | null;
    imageQuality: "Standard" | "HD";
    activeTab: number;
    targetBp: number;
    maxQueue: number;
    dateFormat: string;
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
class Settings extends ScriptManager {
    private static instance: Settings;

    /**
     * Default Properties
     * You can add new property here
     */
    defaultProp = {
        themeColor: "var(--butterbar-connection-background)",
        debugMode: false,
        hasImage: false,
        imageFile: null,
        imageQuality: "Standard",
        activeTab: 0,
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

    private constructor(app: App) {
        super(app);
        this._init();
    }

    /**
     * Internal init method to set default properties
     * @returns
     */
    _init() {
        const set = this.getValue("wayfu-options"),
            opt = Object.assign({}, this.defaultProp, intoObject(set));

        Object.assign(Settings.prototype, this.defaultProp);
        return this.setOptions(opt).colorList();
    }

    /**
     * Set multiple properties from object
     * @param {Object} options object of properties
     * @returns
     */
    setOptions(options: { [k: string]: any }) {
        return !options ? this : this._setProps(options);
    }

    /**
     * Set single property
     * @param {string} key property name
     * @param {any} value property value
     * @returns
     */
    setOption<K extends keyof defaultProp>(key: K, value: any) {
        return this._setProp(key, value).fillList().save();
    }

    fillList() {
        /**
         * UI Todo List
         */
        return this;
    }

    colorList() {
        /**
         * UI Todo
         * Color List
         */
        return this;
    }

    /**
     * Save current settings to local storage
     */
    save() {
        const keys: MyArray<string> = new MyArray<string>(
            "useImage",
            "hasImage",
            "imageFile",
            "fileType",
            "alert",
            "debugMode",
            "queueLimit",
            "bpLimit",
            "defaultProp"
        );
        let data: { [k: string]: any } = {};

        for (let prop in this) {
            if (this.defaultProp.hasOwnProperty(prop) && !keys.isOnArray(prop)) {
                data[prop] = this[prop];
            }
        }

        this.setValue("wayfu-options", data);
    }

    static getSettings(app: App) {
        if (!Settings.instance) {
            Settings.instance = new Settings(app);
        }
        return Settings.instance;
    }
}

export default Settings;
