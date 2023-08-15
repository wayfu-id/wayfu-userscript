import fs from "fs";
import path from "path";
import mime from "mime";

/**
 * Media attached to a message
 */
export default class MessageMedia {
    /**
     * @param {string} mimetype MIME type of the attachment
     * @param {string} data Base64-encoded data of the file
     * @param {string?} filename Document file name. Value can be null
     * @param {number?} filesize Document file size in bytes. Value can be null
     */
    constructor(mimetype, data, filename, filesize) {
        /**
         * MIME type of the attachment
         * @type {string}
         */
        this.mimetype = mimetype;

        /**
         * Base64 encoded data that represents the file
         * @type {string}
         */
        this.data = data;

        /**
         * Document file name. Value can be null
         * @type {?string}
         */
        this.filename = filename;

        /**
         * Document file size in bytes. Value can be null
         * @type {?number}
         */
        this.filesize = filesize;
    }

    /**
     * Creates a MessageMedia instance from a local file path
     * @param {string} filePath
     * @returns {MessageMedia}
     */
    static fromFilePath(filePath) {
        const b64data = fs.readFileSync(filePath, { encoding: "base64" }),
            mimetype = mime.getType(filePath),
            filename = path.basename(filePath);

        return new MessageMedia(mimetype, b64data, filename);
    }
}
