import BaseModel from "./BaseModel";
import MyDate from "./MyDate";
import MyArray from "./MyArray";
import { options } from "./Settings";
import { rgx } from "../lib/Constant";
import { setName, isNumeric, dateFormat } from "../lib/Util";

/**
 * Messages Class Model
 * @class {Messages}
 * @classdesc Contains message model
 */
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
     * @returns
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
        return this;
    }

    /**
     * Get message as value
     */
    get value() {
        return this.inputMessage ? this.subtitute(this.inputMessage) : "";
    }

    /**
     * Get message as encodedURIComponent
     */
    get encodedMsg() {
        const { useImage, hasImage, useCaption } = options;
        const printLink = useImage && hasImage ? useCaption === "caption" : true;
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
     * @param {string} value data value
     * @returns
     */
    setMessage(message, column, value) {
        /** @type {(numb: number) => RegExp} */
        const dataKey = (numb) => new RegExp(String.raw`(DATA_${numb})(\s|\D|$)`, "g");
        if (options.userType === "oriflame") {
            for (let i = column; i < 3; i++) {
                const isDate = rgx.datePattern.test(value),
                    isNumber = isNumeric(value);

                if (i === 0 && isNumber) {
                    /** @type {(value: string) => number} */
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
                        .replace(/S_DAY/g, this.lastDay(value, false));
                } else if (i === 2 && !(isNumber || isDate)) {
                    message = message
                        .replace(/F_INVS/g, setName(value, true))
                        .replace(/INVS/g, setName(value));
                }
            }
            return column > 2
                ? message.replace(dataKey(column - 2), `${value || ""}$2`)
                : message;
        }
        return message.replace(dataKey(column + 1), `${value || ""}$2`);
    }

    /**
     * Subtitute Raw message with data from csv
     * @param {string} message string message
     * @returns {string} subtituted message
     */
    subtitute(message) {
        if (message !== "" && message !== null) {
            const col = [this.poinValue, this.date, this.sponsorName, ...this.other],
                colTreshold = options.userType === "oriflame" ? 3 : 0;

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
                let bypass = i >= colTreshold;
                message = e || bypass ? this.setMessage(message, i, e) : message;
            });
        }
        return message;
    }

    /**
     * Set last day data which is signup date + 30 days
     * @param {string} dateStr Date string
     * @param {boolean} isLastDay selector
     * @returns {string} Date String formated
     */
    lastDay(dateStr, isLastDay = true) {
        const mIdx_ = options.monthIndex,
            mIdx = options.default.monthIndex;

        let date = new MyDate(
            !options.isFormat && mIdx !== mIdx_
                ? MyArray.split(dateStr, "/").changeIndex(mIdx_, mIdx).join("/")
                : dateStr
        );

        date = isLastDay ? date.addDays(30) : date;

        return dateFormat(date, isLastDay);
    }

    /**
     * Send Image attachment
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

    /**
     * Send Text message
     * @returns
     */
    async sendText() {
        return await window.WAPI.composeAndSendMsgToChat(this.phone, this.value);
    }
}

const message = new Messages();
export { Messages as default, message };
