import BaseModel from "./BaseModel";

/**
 * Messages Class Model
 * @class {Messages}
 * @classdesc Contains message model
 */

export default class Messages extends BaseModel {
    apiLink: string;
    inputMessage: string;
    inputCaption: string;
    imageFile: string;
    idNumber: string;
    name: string;
    phone: string;
    poinValue: string;
    date: string;
    sponsorName: string;
    other: any[];

    /** Set message data */
    setData(data: string[]): void;

    /** Get message as encodedURIComponent */
    get encodedMsg(): string;

    /** Get message as whatsapp api link */
    get link(): string;

    /** Set message and subtitute it data to the Keywords */
    setMessage(message: string, column: number, value: string): string;

    /** Subtitute Raw message with data from csv */
    subtitute(message: string): string;

    /** Set last day data which is signup date + 30 days */
    lastDay(dateStr: string, isLastDay?: boolean): string;

    /** Send Image attachment */
    sendImg(): Promise<any>;
}

export const message: Messages;