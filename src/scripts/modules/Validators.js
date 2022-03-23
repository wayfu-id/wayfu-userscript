import BaseModel from "../models/BaseModel";
import { DOM } from "../lib/DOM";
import { options } from "../models/Settings";
import { chat } from "../models/Chatrooms";
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
        const errList = [];
        if (Object.entries(this.errors).length !== 0) {
            for (const err in this.errors) {
                errList.push(this.error(err));
            }
            return errList;
        } else {
            return null;
        }
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
        let msg, val;
        let ret = false;
        switch (key) {
            case "message":
                val = DOM.getElement("#message").value;
                ret = val !== "" && val !== null && typeof val !== "undefined";
                msg = "Silahkan Masukkan Pesan terlebih dahulu...";
                break;
            case "queue":
                ret = typeof queue.now !== "undefined";
                msg = "Silahkan Masukkan File Penerima Pesan...";
                break;
            case "chatroom":
                ret = chat.selected || options.autoMode;
                msg = "Silahkan Pilih Chatroom Terlebih dahulu";
                break;
        }
        if (!ret) {
            this.errors[`${key}.isEmpty`] = msg;
        }
        return ret;
    }

    /**
     * Validating for under value
     * @param {string} key which data
     * @returns
     */
    belowMax(key) {
        let max = options.maxQueue,
            ret = queue.size <= max;
        if (!ret) {
            this.errors[
                `${key}.overMax`
            ] = `Blast Auto tidak boleh lebih dari ${max} Nomor!`;
        }
        return ret;
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
        if (list) {
            const errList = DOM.createListElement("ul", list, {
                classid: "wfu-reports",
            });
            modal.alert(errList, "[ERROR] Proses Gagal Dimulai");
        }
    }
}

const validator = new Validators();
export { Validators as default, validator };
