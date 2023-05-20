export default class Injected {
    constructor(store) {
        Object.assign(Injected.prototype, { Store: store });
        this.Medias = new Media(store);
        this.initialize();
    }
    initialize() {
        if (!this.Store) return;
        let { Chat, Contact } = this.Store;
        Object.assign(this, { Chat, Contact });
    }
    async generateHash(length) {
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    async sendMessage(chat, content, options = {}) {
        let attOptions = {};
        if (options.attachment) {
            attOptions = await this.Medias.processMediaData(
                options.attachment,
                {
                    forceVoice: options.sendAudioAsVoice,
                    forceDocument: options.sendMediaAsDocument,
                    forceGif: options.sendVideoAsGif,
                }
            );
            content = attOptions.preview;
            delete options.attachment;
        }

        const meUser = this.Store.Contact.Me.id;
        const newMsgKey = this.Store.MsgKey.newId();
        const newMsgId = new this.Store.MsgKey({
            from: meUser,
            to: chat.id,
            id: newMsgKey,
            participant: undefined,
            selfDir: "out",
        });

        const extraOptions = options.extraOptions || {};
        delete options.extraOptions;

        const ephemeralFields =
            this.Store.EphemeralFields.getEphemeralFields(chat);

        const message = {
            ...options,
            id: newMsgId,
            ack: 0,
            body: content,
            from: meUser,
            to: chat.id,
            local: true,
            self: "out",
            t: parseInt(new Date().getTime() / 1000),
            isNewMsg: true,
            type: "chat",
            ...ephemeralFields,
            ...attOptions,
            ...(attOptions.toJSON ? attOptions.toJSON() : {}),
            ...extraOptions,
        };

        await this.Store.addAndSendMsgToChat(chat, message);
        return this.Store.Msg.get(newMsgId._serialized);
    }
    // Medias
}

class Media {
    constructor(store) {
        this.initialize(store);
    }

    initialize(store) {
        Object.assign(this, {
            Collection: store.MediaCollection,
            Object: store.MediaObject,
            Prep: store.MediaPrep,
            Types: store.MediaTypes,
            Upload: store.MediaUpload,
            OpaqueData: store.OpaqueData,
        });
    }

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

    async getFileHash(data) {
        let buffer = await data.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
        return window.btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
    }

    arrayBufferToBase64(arrayBuffer) {
        const bytes = new Uint8Array(arrayBuffer),
            len = bytes.byteLength;

        let binary = "";
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    arrayBufferToBase64Async(arrayBuffer) {
        new Promise((resolve, reject) => {
            const fileReader = new FileReader(),
                blob = new Blob([arrayBuffer], {
                    type: "application/octet-stream",
                });

            fileReader.onload = () => {
                const [, data] = fileReader.result.split(",");
                resolve(data);
            };

            fileReader.onerror = (e) => reject(e);
            fileReader.readAsDataURL(blob);
        });
    }

    async processMediaData(mediaInfo, { forceVoice, forceDocument, forceGif }) {
        const file = this.toFile(mediaInfo);
        const mData = await this.OpaqueData.createFromData(file, file.type);
        const mediaPrep = this.Prep.prepRawMedia(mData, {
            asDocument: forceDocument,
        });
        const mediaData = await mediaPrep.waitForPrep();
        const mediaObject = this.Object.getOrCreateMediaObject(
            mediaData.filehash
        );

        const mediaType = this.Types.msgToMediaType({
            type: mediaData.type,
            isGif: mediaData.isGif,
        });

        if (forceVoice && mediaData.type === "audio") {
            mediaData.type = "ptt";
        }

        if (forceGif && mediaData.type === "video") {
            mediaData.isGif = true;
        }

        if (forceDocument) {
            mediaData.type = "document";
        }

        if (!(mediaData.mediaBlob instanceof this.OpaqueData)) {
            mediaData.mediaBlob = await this.OpaqueData.createFromData(
                mediaData.mediaBlob,
                mediaData.mediaBlob.type
            );
        }

        mediaData.renderableUrl = mediaData.mediaBlob.url();
        mediaObject.consolidate(mediaData.toJSON());
        mediaData.mediaBlob.autorelease();

        const uploadedMedia = await this.Upload.uploadMedia({
            mimetype: mediaData.mimetype,
            mediaObject,
            mediaType,
        });

        const mediaEntry = uploadedMedia.mediaEntry;
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
}
