import GM_Library from "./GM_Library";
import { setName, isNumeric, isDateStr, dateFormat, JSONParse } from "../lib/Util";
import { modal } from "./Modals.js";
import { options } from "./Settings";
import MyDate from "../models/MyDate";
import MyArray from "./MyArray";

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
        const savedUser = this.getValue("wayfu-user");

        for (let person of window.WAPI.Contact.models) {
            if (person.isMe) {
                const { userid, id, displayName, pushname } = person;
                this.phone = Number(userid || id.user) || "";
                this.name = displayName || pushname || "";
                break;
            }
        }

        return this.updateData(savedUser);
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
     * @param {object} prop User data as object
     * @returns
     */
    updateData(prop) {
        if (!prop) return this;
        prop = this.intoObject(prop);
        if (prop.phone !== this.phone) return this;

        for (const name in prop) {
            if (name !== "today") this[name] = prop[name];
        }

        this.end =
            this.end && this.end instanceof Date
                ? this.end
                : this.reg && this.mon
                ? new MyDate(this.reg).addMonths(this.mon)
                : null;
        return this;
    }

    /**
     * Set user properties
     * @param {object} data User data as object
     */
    setUser(data) {
        if (data && typeof data !== "undefined" && data !== null && data !== "") {
            this.reset().init().updateData(data).save();
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
        return this.isPremium || (await this.tryApp());
    }

    /**
     * User trying app
     * @returns
     */
    async tryApp() {
        if (!this.expires) {
            return !this.isTrial
                ? (await modal.confirm(
                      "Coba WayFu Gratis!",
                      "Apakah Anda mau mencoba 2 hari Trial?"
                  ))
                    ? await this.updateTrial()
                    : false
                : this.isTrial;
        }
        return this.isTrial;
    }

    /**
     *
     * @param {string} type type of trial ["add" | "update"]
     * @returns {Promise<boolean>}
     */
    updateTrial(type = "add") {
        const data = {
            version: this.appInfo.version,
            phone: this.phone,
            name: this.name,
            action: type,
        };

        const add = {};
        if (type === "add") {
            add.expires = new MyDate(this.today).addDays(2).toLocaleString("id-ID");
        } else {
            add.attempt = this.attempt += 1;
        }

        return new Promise((resolve, reject) => {
            let opt = Object.assign({}, this.defaultOpt, {
                data: JSON.stringify(Object.assign({}, data, add)),
                onload: async (res) => {
                    const { status, responseText } = res;
                    let data = null;
                    if (status === 200) {
                        data = await JSONParse(responseText);
                    }
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
                text: `Anda dapat menggunakan fitur kirim otomatis sebanyak ${
                    5 - this.attempt
                } kali lagi,
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
        let alrt =
            options.alert || on ? (modal.alert(text, title), false) : options.alert;

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
        const keys = new MyArray(
                "name",
                "phone",
                "attempt",
                "type",
                "reg",
                "mon",
                "end",
                "expires"
            ),
            data = {};
        for (let prop in this) {
            if (this.hasOwnProperty(prop) && keys.isOnArray(prop)) {
                let val =
                    this[prop] instanceof Date ? this[prop].toISOString() : this[prop];
                data[prop] = val;
            }
        }
        this.setValue("wayfu-user", data);
    }
}

const user = new Users();
export { Users as default, user };
