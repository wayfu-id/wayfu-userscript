import Base from "./Base";

/**
 * @typedef {import("../index").WAPILib.MessageMedia} MessageMedia
 */

export default class MediaHandler extends Base {
    constructor(app) {
        super(app);

        return this._patch(app);
    }

    /**
     * Make a new Object with new key set
     * @param {ObjectConstructor} obj
     * @param {{[k: string]: string}} newKeys
     * @param {boolean?} slice
     * @returns
     */
    _renameKeys(obj, newKeys, slice = false) {
        const entries = Object.keys(obj).map((key) => {
            let newKey = newKeys[key];

            if (!newKey) {
                if (slice) return;
                newKey = key;
            }

            return { [newKey]: obj[key] };
        });

        return Object.assign({}, ...entries);
    }

    _patch(app) {
        const { Store } = app;

        let newKeys = {
            MediaCollection: "Collection",
            MediaObject: "Object",
            MediaPrep: "Prep",
            MediaTypes: "Types",
            MediaUpload: "Upload",
            OpaqueData: "OpaqueData",
        };

        Object.assign(this, this._renameKeys(Store, newKeys, true));
        return this;
    }

    /**
     * @param {MessageMedia}
     * @returns
     */
    toFile({ data, mimetype, filename }) {
        const binaryData = window.atob(data),
            buffer = new ArrayBuffer(binaryData.length),
            view = new Uint8Array(buffer);

        for (let i = 0; i < binaryData.length; i++) {
            view[i] = binaryData.charCodeAt(i);
        }

        const blob = new Blob([buffer], { type: mimetype });
        return new File([blob], filename, {
            type: mimetype,
            lastModified: Date.now(),
        });
    }

    /**
     *
     * @param {Blob} data
     * @returns
     */
    async getFileHash(data) {
        let buffer = await data.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
        return window.btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
    }

    /**
     *
     * @param {ArrayBuffer} arrayBuffer
     * @returns
     */
    arrayBufferToBase64(arrayBuffer) {
        const bytes = new Uint8Array(arrayBuffer),
            len = bytes.byteLength;

        let binary = "";
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    /**
     *
     * @param {ArrayBuffer} arrayBuffer
     * @returns {Promise<string | ArrayBuffer | null>}
     */
    arrayBufferToBase64Async(arrayBuffer) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader(),
                blob = new Blob([arrayBuffer], {
                    type: "application/octet-stream",
                });

            fileReader.onload = () => {
                const { result } = fileReader;
                resolve(result);
            };

            fileReader.onerror = (e) => reject(e);
            fileReader.readAsDataURL(blob);
        });
    }

    /**
     *
     * @param {MessageMedia} mediaInfo
     * @returns
     */
    async processMediaData(mediaInfo) {
        const file = this.toFile(mediaInfo);

        const mData = await this.OpaqueData.createFromData(file, file.type);
        const mediaPrep = this.Prep.prepRawMedia(mData, { asDocument: false });
        const mediaData = await mediaPrep.waitForPrep();
        const mediaObject = this.Object.getOrCreateMediaObject(mediaData.filehash);
        const mediaType = this.Types.msgToMediaType({ type: mediaData.type });

        if (!(mediaData.mediaBlob instanceof this.OpaqueData)) {
            mediaData.mediaBlob = await this.OpaqueData.createFromData(
                mediaData.mediaBlob,
                mediaData.mediaBlob.type
            );
        }

        mediaData.renderableUrl = mediaData.mediaBlob.url();
        mediaObject.consolidate(mediaData.toJSON());
        mediaData.mediaBlob.autorelease();

        const { mediaEntry } = await this.Upload.uploadMedia({
            mimetype: mediaData.mimetype,
            mediaObject,
            mediaType,
        });

        if (!mediaEntry) {
            throw new Error("upload failed: media entry was not created");
        }

        mediaData.set({
            clientUrl: mediaEntry.mmsUrl,
            deprecatedMms3Url: mediaEntry.deprecatedMms3Url,
            directPath: mediaEntry.directPath,
            mediaKey: mediaEntry.mediaKey,
            mediaKeyTimestamp: mediaEntry.mediaKeyTimestamp,
            filehash: mediaObject.filehash,
            encFilehash: mediaEntry.encFilehash,
            uploadhash: mediaEntry.uploadHash,
            size: mediaObject.size,
            streamingSidecar: mediaEntry.sidecar,
            firstFrameSidecar: mediaEntry.firstFrameSidecar,
        });

        return mediaData;
    }

    static init(app) {
        return new MediaHandler(app);
    }
}
