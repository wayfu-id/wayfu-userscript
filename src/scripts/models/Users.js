import GM_Library from "./GM_Library";
import { setName, dateFormat, JSONParse } from "../lib/Util";
import { modal } from "./Modals.js";
import { options } from "./Settings";
import MyDate from "../models/MyDate";
import MyArray from "./MyArray";

/**
 * @typedef {{
 *     method: "POST" | "GET";
 *     url: string;
 *     headers: {"Content-Type": string};
 * }} userOpt
 *
 * @typedef { ObjectConstructor & {
 *     name: string | number;
 *     phone: string;
 *     type: "oriflame" | "umum";
 *     attempt?: number;
 *     reg?: string;
 *     mon: number;
 *     end?: MyDate;
 *     expires?: MyDate;
 * }} userData
 *
 * @typedef { GM_Library & userData & {
 *     today: MyDate;
 *     defaultOpt: userOpt;
 *     isPremium: () => boolean;
 *     isTrial: () => boolean;
 *     init: () => User;
 *     gettingData: () => void;
 *     gettingData(): Promise<any>;
 *     updateData(prop: userData): User;
 *     setUser(data?: userData): void;
 *     check(): Promise<boolean>;
 *     tryApp(): Promise<boolean>;
 *     updateTrial(type?: "add" | "update"): Promise<boolean>;
 *     showAlert(i: number, on?: boolean): void;
 *     reset(): User;
 *     save(): void;
 * }} User
 */

/**
 * User Class Model
 * @class {Users}
 * @type {User}
 */
class Users extends GM_Library {
    constructor() {
        super();
        this.today = new MyDate();
        this.defaultOpt = {
            method: "POST",
            url: `${this.appInfo.homepage}user/api`,
            headers: {
                "Content-Type": "application/json",
            },
        };
    }

    /**
     * Get user premium status
     */
    get isPremium() {
        return this.end ? this.today < this.end : false;
    }

    /**
     * Get user trial status
     */
    get isTrial() {
        return this.expires ? this.attempt < 5 && this.today <= this.expires : false;
    }

    /**
     * Initialize User data
     * @returns
     */
    init() {
        const { id, name, pushname } = window.WAPI.Contact.getMeContact();
        // const { id, name, pushname } = window.WAPI.Me;
        this.phone = Number(id.user) || "";
        this.name = name || pushname || "";
        // this.offlineData = {
        //     phone: this.phone,
        //     name: "WayFu Offline",
        //     end: new Date("2024-12-14T17:00:00.000Z"),
        //     type: "oriflame",
        // };

        return this;
    }

    /**
     * Request userdata from server based on it's phone number
     */
    gettingData() {
        return new Promise((resolve) => {
            let opt = Object.assign({}, this.defaultOpt, {
                data: JSON.stringify({
                    phone: this.phone,
                    version: this.appInfo.version,
                }),
                onload: async (res) => {
                    const { status, responseText } = res;
                    let data = null;
                    if (status === 200) {
                        data = await JSONParse(responseText);
                    }
                    user.setUser(data);
                    resolve(status === 200 && data);
                },
                onerror: (err) => user.setUser(null),
                ontimeout: (rto) => user.setUser(null),
                onabort: (abrt) => user.setUser(null),
            });

            this.request(opt);
        });
    }

    /**
     * Set/update current user data
     * @param {userData} prop User data as object
     * @returns
     */
    updateData(prop) {
        if (!prop) return this;
        prop = this.intoObject(prop);
        if (prop.phone !== this.phone) return this;

        for (const name in prop) {
            if (name !== "today") this[name] = prop[name];
        }

        this.end = this.reg && this.mon ? new MyDate(this.reg).addMonths(this.mon) : this.end || null;
        return this;
    }

    /**
     * Set user properties
     * @param {userData?} data User data as object
     */
    setUser(data) {
        const user = data || this.getValue("wayfu-user");
        if (user && typeof user !== "undefined" && user !== null && user !== "") {
            this.reset().updateData(user).save();
            options.setOption("userType", this.type);
        }

        if (!this.isPremium && !this.isTrial) {
            setTimeout(() => {
                this.gettingData();
            }, 2e4);
        } else {
            this.showAlert(this.isPremium ? 0 : 1);
        }
    }

    /**
     * Do user grant premium access?
     * @returns {Promise<boolean>}
     */
    async check() {
        let ret = this.isPremium || (await this.tryApp());
        if (!ret) this.showAlert(2, true);
        return ret;
    }

    /**
     * User trying app
     * @returns
     */
    async tryApp() {
        if (!this.expires) {
            return !this.isTrial
                ? (await modal.confirm("Coba WayFu Gratis!", "Apakah Anda mau mencoba 2 hari Trial?"))
                    ? await this.updateTrial()
                    : false
                : this.isTrial;
        }
        return this.isTrial;
    }

    /**
     * Update user's trial data
     * @param {"add" | "update"} type type of trial
     * @returns {Promise<boolean>}
     */
    updateTrial(type = "add") {
        const data = {
            version: this.appInfo.version,
            phone: this.phone,
            name: this.name,
            action: type,
        };

        const add = ((t) => {
            let exp = new MyDate(this.today).addDays(2).toLocaleString("id-ID"),
                atmp = (this.attempt += 1);
            return t === "add" ? { expires: exp } : { attempt: atmp };
        })(type);

        return new Promise((resolve, reject) => {
            let opt = Object.assign({}, this.defaultOpt, {
                data: JSON.stringify(Object.assign({}, data, add)),
                onload: async (res) => {
                    const { status, responseText } = res;
                    let data = null;
                    if (status === 200) data = await JSONParse(responseText);
                    user.setUser(data);
                    resolve(status === 200 && data);
                },
                onerror: (err) => resolve(false),
                ontimeout: (rto) => resolve(false),
                onabort: (abrt) => resolve(false),
            });
            this.request(opt);
        });
    }

    /**
     * Show user alert
     * @param {Number} i index of message set
     * @param {boolean} on force show alert
     */
    showAlert(i, on = false) {
        const msg = [
            {
                title: `Halo kak ${setName(this.name, true)}!`,
                text: `Selamat menggunakan fitur Pengguna Premium.\n
                Masa aktif Kakak berakhir hari ${dateFormat(this.end)} ya...`,
            },
            {
                title: `Halo! Selamat Datang di ${this.appInfo.name}!`,
                text: `Anda dapat menggunakan fitur kirim otomatis sebanyak ${5 - this.attempt} kali lagi,
                Masa Trial Anda berakhir hari ${dateFormat(this.expires)} ya...`,
            },
            {
                title: `${this.appInfo.name} - Fitur Premium`,
                text: `Maaf, fitur ini hanya untuk Pengguna Premium. Informasi lebih lanjut, silahkan hubungi saya.`,
            },
            {
                title: `${this.appInfo.name} - Trial Mode`,
                text: `Saat ini Anda sedang menggunakan versi Trial. Anda masih dapat menggunakan fitur kirim otomatis sebanyak ${
                    5 - this.attempt
                } kali lagi.`,
            },
            {
                title: `${this.appInfo.name} - Trial Mode`,
                text: `Masa Trial Anda sudah berakhir. Silahkan berlanganan untuk menggunakan fitur premium.`,
            },
        ];
        const { title, text } = msg[i];
        let alrt = options.alert || on ? (modal.alert(text, title), false) : options.alert;

        options.setOption("alert", alrt);
    }

    /**
     * Reset current user data
     * @returns resetted user data
     */
    reset() {
        const keys = new MyArray("attempt", "type", "reg", "mon", "end", "expires");

        for (let prop in this) {
            if (this.hasOwnProperty(prop) && keys.isOnArray(prop)) {
                delete this[prop];
            }
        }
        return this.init();
    }

    /**
     * Save current user data to UserScript Manager Storage
     */
    save() {
        /** @type {keyof userData} */
        const keys = new MyArray("name", "phone", "attempt", "type", "reg", "mon", "end", "expires"),
            data = {};
        for (let key in this) {
            if (this.hasOwnProperty(key) && keys.isOnArray(key)) {
                data[key] = ((v) => (v instanceof Date ? v.toISOString() : v))(this[key]);
            }
        }
        this.setValue("wayfu-user", data);
    }
}

/** @type {User} */
const user = new Users();
export { Users as default, user };
