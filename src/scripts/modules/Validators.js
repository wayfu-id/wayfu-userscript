import BaseModel from "../models/BaseModel";
import MyArray from "../models/MyArray";
import { DOM } from "../lib/HtmlModifier";
import { options } from "../models/Settings";
import { message } from "../models/Messages";
import { queue } from "../models/Queue";
import { modal } from "../models/Modals";

class Validators extends BaseModel {
    constructor() {
        super();
        this.errors = {};
    }

    /**
     * Get error list (if any) or return null
     */
    get errorList() {
        const errList = new MyArray();
        if (Object.entries(this.errors).length !== 0) {
            for (const err in this.errors) {
                errList.push(this.error(err));
            }
        }
        return errList;
    }

    /**
     * Validate current data and it rules
     * @param {object} data
     * @returns
     */
    validate(data) {
        this.errors = {};
        data = this.intoObject(data);
        for (let key in data) {
            data[key].rules.forEach((e) => this[e](key));
        }
        return Object.entries(this.errors).length === 0;
    }

    /**
     * Validating for not empty value
     * @param {string} key which data
     * @returns
     */
    notEmpty(key) {
        let [valid, msg] = ((k) => {
            let [val, msg] = [false, ""];
            if (k === "message") {
                val = message.inputMessage !== "";
                msg = "Silahkan Masukkan Pesan terlebih dahulu...";
            } else if (k === "queue") {
                val = typeof queue.now !== "undefined";
                msg = "Silahkan Masukkan File Penerima Pesan...";
            }
            return [val, msg];
        })(key);

        if (!valid) this.errors[`${key}.isEmpty`] = msg;
        return valid;

        // let msg, val;
        // let ret = false;
        // switch (key) {
        //     case "message":
        //         val = message.inputMessage;
        //         ret = val !== "" && val !== null && typeof val !== "undefined";
        //         msg = "Silahkan Masukkan Pesan terlebih dahulu...";
        //         break;
        //     case "queue":
        //         ret = typeof queue.now !== "undefined";
        //         msg = "Silahkan Masukkan File Penerima Pesan...";
        //         break;
        // }
        // if (!ret) {
        //     this.errors[`${key}.isEmpty`] = msg;
        // }
        // return ret;
    }

    /**
     * Validating for under value
     * @param {string} key which data
     * @returns
     */
    belowMax(key) {
        let { maxQueue: max } = options,
            { size } = queue;
        if (size > max) {
            this.errors[
                `${key}.overMax`
            ] = `Blast Auto tidak boleh lebih dari ${max} Nomor!`;
            return false;
        }
        return true;
    }

    /**
     * Get error message
     * @param {string} key which error
     * @returns
     */
    error(key) {
        return this.errors[key];
    }

    /**
     * Display error list (if any) inside modal
     */
    showError() {
        const list = this.errorList;
        if (!list.isEmpty) {
            const errList = DOM.createListElement(list, "ul", { classid: "wfu-reports" });
            modal.alert(errList, "[ERROR] Proses Gagal Dimulai");
        }
    }
}

const validator = new Validators();
export { Validators as default, validator };
