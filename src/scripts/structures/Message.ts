import App from "../App";
import { isNumeric, dateFormat, setName } from "../utilities/index";
import BaseModel from "./BaseModel";
import MyDate from "./MyDate";
import MyArray from "./MyArray";
import { rgx } from "../config";

/**
 * Message Interface
 */
interface Message {
    inputMessage: string;
    inputCaption: string;
    imageFile: File | undefined;
    idNumber: string;
    name: string;
    phone: string;
    poinValue: number | string;
    date: Date | string;
    sponsorName: string;
    other: Array<any>;
}

/**
 * Message Model Class
 * @class Message
 * @classdesc Contains message data and methods to process and send messages
 */
class Message extends BaseModel {
    private static instance: Message;

    defaultProp = {
        inputMessage: "",
        inputCaption: "",
        imageFile: undefined,
        idNumber: "",
        name: "",
        phone: "",
        poinValue: "",
        date: "",
        sponsorName: "",
        other: [],
    };

    private constructor(App: App) {
        super(App);
        this._init();
    }

    /**
     * Internal init method to set default properties
     * @returns
     */
    _init() {
        // Object.assign(Message.prototype, this.defaultProp);
        return this._setProps(this.defaultProp);
    }

    /**
     * Set data from array
     * @param {Array<any>} data array of data
     * @returns
     */
    setData(data: Array<any>) {
        const validPhone = (val: string) => rgx.phonePattern.test(val);

        [this.idNumber, this.name, this.phone, this.poinValue, this.date, this.sponsorName, ...this.other] =
            validPhone(data[2]) ? data : ["", ...data];

        this.other = data.length > 6 ? data.slice(6) : [];
        return this;
    }

    /**
     * Get processed message value
     * @returns
     */
    get value() {
        return this.inputMessage ? this.substitute(this.inputMessage) : "";
    }

    /**
     * Get pricessed caption value
     * @returns
     */
    get caption() {
        return this.inputCaption ? this.substitute(this.inputCaption) : "";
    }

    /**
     * Substitute placeholders in the message with actual data
     * @param {string} message message template with placeholders
     * @returns
     */
    substitute(message: string) {
        const { userType } = this.app.Settings;
        if (message !== "" && message !== null && message !== undefined) {
            const col = [this.poinValue, this.date, this.sponsorName, ...this.other],
                colTreshold = userType === "oriflame" ? 3 : 0;

            message = message
                .replace(/F_NAMA/g, setName(this.name, true))
                .replace(/NAMA/g, setName(this.name));
            message = message.replace(/PHONE/g, this.phone);
            message =
                this.idNumber !== "" && this.idNumber !== undefined
                    ? message.replace(userType === "oriflame" ? /NO_KONS/g : /DATA_0/g, this.idNumber)
                    : message;

            col.forEach((val, idx) => {
                let bypass = idx >= colTreshold;
                message = val || bypass ? this.setMessage(message, idx, val) : message;
            });
        }
        return message;
    }

    /**
     * Set message for each column based on user type
     * @param {string} message current message
     * @param {number} column current column index
     * @param {string} value value to substitute
     * @returns
     */
    setMessage(message: string, column: number, value: string) {
        const { targetBp, userType } = this.app.Settings;
        const dataKey = (numb: number) => new RegExp(String.raw`(DATA_${numb})(\s|\D|$)`, "g");

        if (userType === "oriflame") {
            for (let i = column; i < 3; i++) {
                const isDate = rgx.datePattern.test(value),
                    isNumber = isNumeric(value);

                if (i === 0 && isNumber) {
                    const toGo = (value: string) => {
                        let val = targetBp - Number(value);
                        return val > 0 ? val : 0;
                    };
                    message = message.replace(/P_BP/g, `${value} BP`).replace(/K_BP/g, `${toGo(value)} BP`);
                } else if (i === 1 && isDate) {
                    message = message
                        .replace(/L_DAY/g, this.lastDay(value))
                        .replace(/S_DAY/g, this.lastDay(value, false));
                } else if (i === 2 && !(isNumber || isDate)) {
                    message = message.replace(/F_INVS/g, setName(value, true)).replace(/INVS/g, value);
                }
            }
            return column > 2 ? message.replace(dataKey(column - 2), `${value || ""}$2`) : message;
        }
        return message.replace(dataKey(column + 1), `${value || ""}$2`);
    }

    /**
     * Get formatted last day of the month based on input date
     * @param {string} dateStr input date string
     * @param {boolean} [isLastDay=true] whether to get the last day of the month
     * @returns formatted date string
     */
    lastDay(dateStr: string, isLastDay: boolean = true) {
        const {
            defaultProp: { monthIdx: mIdx },
            monthIdx: mIdx_,
            isFormat,
        } = this.app.Settings;

        let date: MyDate = new MyDate(
            !isFormat && mIdx_ !== mIdx
                ? MyArray.split(dateStr, "/").changeIndex(mIdx_, mIdx).join("/")
                : dateStr
        );

        date = isLastDay ? date.addDays(30) : date;

        return dateFormat(date, isLastDay);
    }

    /**
     * Send image message
     * @returns
     */
    async sendImage() {
        const { Settings, WAPI } = this.app,
            { useCaption, imageQuality } = Settings,
            caption = useCaption === "caption" ? this.caption : this.value;

        if (!this.imageFile) return;
        return await WAPI.sendMessage(this.phone, "", {
            media: this.imageFile,
            quality: imageQuality,
            caption,
        });
    }

    /**
     * Send text message
     * @returns
     */
    async sendText() {
        const { WAPI } = this.app;
        return await WAPI.inputAndSendTextMsg(this.phone, this.value);
    }

    static getMessage(app: App) {
        if (!Message.instance) {
            Message.instance = new Message(app);
        }
        return Message.instance;
    }
}

export default Message;
