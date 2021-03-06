import BaseModel from "./BaseModel";
import MyDate from "./MyDate";
import MyArray from "./MyArray";
import { options } from "./Settings";
import { rgx } from "../lib/Constant";
import { setName, isNumeric, dateFormat } from "../lib/Util";

class Messages extends BaseModel {
    constructor() {
        super();
        this.apiLink = "api.whatsapp.com/send?phone=";
        this.inputMessage = "";
        this.inputCaption = "";
        this.imageFile = "";
        this.idNumber = "";
        this.name = "";
        this.phone = "";
        this.poinValue = "";
        this.date = "";
        this.sponsorName = "";
        this.other = [];
    }

    /**
     * Set message data
     * @param {string[]} data message arguments
     */
    setData(data) {
        const validPhone = (val) => rgx.phonePattern.test(val);

        [
            this.idNumber,
            this.name,
            this.phone,
            this.poinValue,
            this.date,
            this.sponsorName,
            ...this.other
        ] = validPhone(data[2]) ? data : ["", ...data];
    }

    /**
     * Get message as encodedURIComponent
     */
    get encodedMsg() {
        const { autoMode, useImage, hasImage, useCaption } = options;
        const printLink = autoMode
            ? useImage && hasImage
                ? useCaption === "caption"
                : true
            : true;
        const message =
            this.inputMessage && printLink ? this.subtitute(this.inputMessage) : "";

        return message !== ""
            ? encodeURIComponent(message)
                  .replace(/'/g, "%27")
                  .replace(/\(/g, "%28")
                  .replace(/\)/g, "%29")
            : message;
    }

    /**
     * Get message as whatsapp api link
     */
    get link() {
        return this.apiLink + this.phone + `&text=${this.encodedMsg}`;
    }

    /**
     * Set message and subtitute it data to the Keywords
     * @param {string} message raw message
     * @param {number} column column index of data
     * @param {any} value data value
     * @param {number} size size of data
     * @returns
     */
    setMessage(message, column, value) {
        const dataKey = (numb) => new RegExp(String.raw`(DATA_${numb})(\s|\D|$)`, "g");
        if (options.userType === "oriflame") {
            for (let i = column; i < 3; i++) {
                const isDate = rgx.datePattern.test(value),
                    isNumber = isNumeric(value);

                if (i === 0 && isNumber) {
                    const toGo = (value) => {
                        const val = options.targetBp - Number(value);
                        return val > 0 ? val : 0;
                    };
                    message = message
                        .replace(/P_BP/g, `${value} BP`)
                        .replace(/K_BP/g, `${toGo(value)} BP`);
                } else if (i === 1 && isDate) {
                    message = message
                        .replace(/L_DAY/g, this.lastDay(value))
                        .replace(/S_DAY/g, this.lastDay(value, 1));
                } else if (i === 2 && !(isNumber || isDate)) {
                    message = message
                        .replace(/F_INVS/g, setName(value, true))
                        .replace(/INVS/g, setName(value));
                }
            }
            return column > 2
                ? message.replace(dataKey(column - 2), `${value}$2`)
                : message;
        }
        return message.replace(dataKey(column + 1), `${value}$2`);
    }

    /**
     * Subtitute Raw message with data from csv
     * @param {string} message string message
     * @returns {string} subtituted message
     */
    subtitute(message) {
        if (message !== "" && message !== null) {
            const col = [this.poinValue, this.date, this.sponsorName, ...this.other];
            message = message
                .replace(/F_NAMA/g, setName(this.name, true))
                .replace(/NAMA/g, setName(this.name));
            message = message.replace(/PHONE/g, this.phone);
            message =
                this.idNumber !== ""
                    ? message.replace(
                          options.userType === "oriflame" ? /NO_KONS/g : /DATA_0/g,
                          this.idNumber
                      )
                    : message;
            col.forEach((e, i) => {
                message = e ? this.setMessage(message, i, e) : message;
            });
        }
        return message;
    }

    /**
     *
     * @param {string} dateStr Date string
     * @param {number} i selector
     * @returns {string} Date String formated
     */
    lastDay(dateStr, i = 0) {
        const mIdx_ = options.monthIndex,
            mIdx = options.default.monthIndex;

        let date = new MyDate(
            !options.isFormat && mIdx !== mIdx_
                ? MyArray.split(dateStr, "/").changeIndex(mIdx_, mIdx).join("/")
                : dateStr
        );

        if (i === 0) {
            date = date.addDays(30);
        }
        return dateFormat(date, i);
    }

    /**
     *
     * @param {ImageBitmap} imgFile
     * @returns
     */
    async sendImg() {
        const { useCaption } = options,
            caption = useCaption === "caption" ? this.inputCaption : this.inputMessage;

        return await window.WAPI.SendImgToChat(
            this.phone,
            this.imageFile,
            this.subtitute(caption)
        );
    }
}

const message = new Messages();
export { Messages as default, message };
