import GM_Library from "./GM_Library";

type datePaternOpt = "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY/MM/DD";

type messageAttachment = {
    file: File | null;
    type: string;
};

interface defaultOpt extends ObjectConstructor {
    themeColor: string;
    /** @deprecated */
    autoMode: false;
    debug: boolean;
    // hasImage: boolean;
    // imageFile: File;
    useAttc: boolean;
    hasAttc: boolean;
    msgAttc: messageAttachment;
    activeTab: number;
    targetBp: number;
    maxQueue: number;
    dateFormat: "auto" | datePaternOpt;
    openPanel: boolean;
    useCaption: "caption" | "pesan";
    userType: "umum" | "oriflame";
    splitter: "," | ";";
    monthIndex: 0 | 1 | 2;
    isFormat: boolean;
    alert: boolean;
    queueLimit: number;
    bpLimit: number;
    exportType: "ask" | "csv" | "xlsx";
    fileType: "csv" | "xlsx";
}

interface Settings extends GM_Library, defaultOpt {
    default: defaultOpt;

    /** Initialize options */
    init(): Settings;

    /** Set options properties */
    setOptions(options?: { [k: keyof defaultOpt]: any }): Settings;

    /** Set option property */
    setOption(key: keyof defaultOpt, val: any): void;

    /** Fill options panel with all of the options properties */
    fillList(): Settings;

    /** Fill color list of the theme color into select option */
    colorList(): Settings;

    /** Native save the options to Tampermonkey Storage */
    save(): void;
}

export const options: Settings;
export { Settings as default };
