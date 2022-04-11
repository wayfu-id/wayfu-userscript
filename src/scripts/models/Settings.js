import { DOM } from "../lib/DOM";
import { isNumeric } from "../lib/Util";
import GM_Library from "./GM_Library";
import MyArray from "./MyArray";

class Settings extends GM_Library {
    constructor() {
        super();
        this.default = {
            themeColor: "var(--butterbar-connection-background)",
            autoMode: false,
            hasImage: false,
            imageFile: null,
            useImage: false,
            fileName: "",
            activeTab: 0,
            targetBp: 100,
            maxQueue: 500,
            dateFormat: "auto",
            openPanel: true,
            useCaption: "caption",
            userType: "umum",
            splitter: ",",
            monthIndex: 0,
            isFormat: false,
            alert: true,
            queueLimit: 1000,
            bpLimit: 300,
        };
    }

    /**
     * Initialize options
     * @returns
     */
    init() {
        const set = this.getValue("wayfu-options"),
            opt = Object.assign({}, this.default, this.intoObject(set));

        return this.setOptions(opt).colorList();
    }

    /**
     * Set options properties
     * @param {object} options options properties
     * @returns
     */
    setOptions(options = {}) {
        if (options !== {}) {
            options = this.intoObject(options);
            for (let key in options) {
                this.setOption(key, options[key]);
            }
        }
        return this;
    }

    /**
     * Set option property
     * @param {string} key property key
     * @param {any} val property value
     * @returns
     */
    setOption(key, val) {
        val = isNumeric(val) ? Number(val) : val;
        if (this.hasOwnProperty(key) || this.default.hasOwnProperty(key)) {
            this[key] = val;
        }
        return this.fillList().save();
    }

    /**
     * Fill options panel with all of the options properties
     * @returns
     */
    fillList() {
        Object.entries(this).forEach((e) => {
            const [key, val] = e,
                elm = DOM.getElement(`#${key}`);
            if (elm) elm.type == "checkbox" ? (elm.checked = val) : (elm.value = val);
        });
        DOM.getElement("._input input[type='range']", true).forEach((elm) => {
            DOM.setElements([
                {
                    elm: elm,
                    props: {
                        max: elm.id == "maxQueue" ? this.queueLimit : this.bpLimit,
                    },
                },
                {
                    elm: DOM.getElement("output", elm.parentElement),
                    props: {
                        text: elm.value,
                    },
                },
            ]);
        });
        if (this.userType === "oriflame") {
            DOM.setElementStyle(".panel-options .oriflame", {
                display: "flex",
            });
        }

        return this;
    }

    /**
     * Fill color list of the theme color into select option
     * @returns
     */
    colorList() {
        let theme = this.getResource("clr");

        theme = typeof theme === "string" ? JSON.parse(theme) : theme;
        theme = Array.isArray(theme) ? theme : theme.colors;

        theme.forEach((e) => {
            let setting = {
                tag: "option",
                value: e.key,
                text: e.val,
                append: "select#themeColor",
            };
            DOM.createElement(setting);
        });
        return this;
    }

    /**
     * Native save the options to Tampermonkey Storage
     */
    save() {
        const keys = new MyArray(
                "useImage",
                "hasImage",
                "imageFile",
                "fileName",
                "autoMode",
                "alert",
                "bpLimit",
                "queueLimit",
                "default"
            ),
            data = {};
        for (let prop in this) {
            if (this.default.hasOwnProperty(prop) && !keys.isOnArray(prop)) {
                data[prop] = this[prop];
            }
        }
        // console.log(this);
        this.setValue("wayfu-options", data);
    }
}

const options = new Settings();
export { Settings as default, options };
