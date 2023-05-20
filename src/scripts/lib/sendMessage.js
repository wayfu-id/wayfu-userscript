const sendMessage = async (chat, content, options = {}) => {
    let attOptions = {};
    if (options.attachment) {
        attOptions = options.sendMediaAsSticker
            ? await window.WWebJS.processStickerData(options.attachment)
            : await window.WWebJS.processMediaData(options.attachment, {
                  forceVoice: options.sendAudioAsVoice,
                  forceDocument: options.sendMediaAsDocument,
                  forceGif: options.sendVideoAsGif,
              });

        content = options.sendMediaAsSticker ? undefined : attOptions.preview;

        delete options.attachment;
        delete options.sendMediaAsSticker;
    }
    let quotedMsgOptions = {};
    if (options.quotedMessageId) {
        let quotedMessage = window.Store.Msg.get(options.quotedMessageId);

        // TODO remove .canReply() once all clients are updated to >= v2.2241.6
        const canReply = window.Store.ReplyUtils
            ? window.Store.ReplyUtils.canReplyMsg(quotedMessage.unsafe())
            : quotedMessage.canReply();

        if (canReply) {
            quotedMsgOptions = quotedMessage.msgContextInfo(chat);
        }
        delete options.quotedMessageId;
    }

    if (options.mentionedJidList) {
        options.mentionedJidList = options.mentionedJidList.map(
            (cId) => window.Store.Contact.get(cId).id
        );
    }

    let locationOptions = {};
    if (options.location) {
        locationOptions = {
            type: "location",
            loc: options.location.description,
            lat: options.location.latitude,
            lng: options.location.longitude,
        };
        delete options.location;
    }

    let vcardOptions = {};
    if (options.contactCard) {
        let contact = window.Store.Contact.get(options.contactCard);
        vcardOptions = {
            body: window.Store.VCard.vcardFromContactModel(contact).vcard,
            type: "vcard",
            vcardFormattedName: contact.formattedName,
        };
        delete options.contactCard;
    } else if (options.contactCardList) {
        let contacts = options.contactCardList.map((c) =>
            window.Store.Contact.get(c)
        );
        let vcards = contacts.map((c) =>
            window.Store.VCard.vcardFromContactModel(c)
        );
        vcardOptions = {
            type: "multi_vcard",
            vcardList: vcards,
            body: undefined,
        };
        delete options.contactCardList;
    } else if (
        options.parseVCards &&
        typeof content === "string" &&
        content.startsWith("BEGIN:VCARD")
    ) {
        delete options.parseVCards;
        try {
            const parsed = window.Store.VCard.parseVcard(content);
            if (parsed) {
                vcardOptions = {
                    type: "vcard",
                    vcardFormattedName:
                        window.Store.VCard.vcardGetNameFromParsed(parsed),
                };
            }
        } catch (_) {
            // not a vcard
        }
    }

    if (options.linkPreview) {
        delete options.linkPreview;

        // Not supported yet by WhatsApp Web on MD
        if (!window.Store.MDBackend) {
            const link = window.Store.Validators.findLink(content);
            if (link) {
                const preview = await window.Store.Wap.queryLinkPreview(
                    link.url
                );
                preview.preview = true;
                preview.subtype = "url";
                options = { ...options, ...preview };
            }
        }
    }

    let buttonOptions = {};
    if (options.buttons) {
        let caption;
        if (options.buttons.type === "chat") {
            content = options.buttons.body;
            caption = content;
        } else {
            caption = options.caption ? options.caption : " "; //Caption can't be empty
        }
        buttonOptions = {
            productHeaderImageRejected: false,
            isFromTemplate: false,
            isDynamicReplyButtonsMsg: true,
            title: options.buttons.title ? options.buttons.title : undefined,
            footer: options.buttons.footer ? options.buttons.footer : undefined,
            dynamicReplyButtons: options.buttons.buttons,
            replyButtons: options.buttons.buttons,
            caption: caption,
        };
        delete options.buttons;
    }

    let listOptions = {};
    if (options.list) {
        if (
            window.Store.Conn.platform === "smba" ||
            window.Store.Conn.platform === "smbi"
        ) {
            throw "[LT01] Whatsapp business can't send this yet";
        }
        listOptions = {
            type: "list",
            footer: options.list.footer,
            list: {
                ...options.list,
                listType: 1,
            },
            body: options.list.description,
        };
        delete options.list;
        delete listOptions.list.footer;
    }

    const meUser = window.Store.User.getMaybeMeUser();
    const isMD = window.Store.MDBackend;

    const newMsgId = new window.Store.MsgKey({
        from: meUser,
        to: chat.id,
        id: window.Store.MsgKey.newId(),
        participant: isMD && chat.id.isGroup() ? meUser : undefined,
        selfDir: "out",
    });

    const extraOptions = options.extraOptions || {};
    delete options.extraOptions;

    const ephemeralFields =
        window.Store.EphemeralFields.getEphemeralFields(chat);

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
        ...locationOptions,
        ...attOptions,
        ...(attOptions.toJSON ? attOptions.toJSON() : {}),
        ...quotedMsgOptions,
        ...vcardOptions,
        ...buttonOptions,
        ...listOptions,
        ...extraOptions,
    };

    await window.Store.SendMessage.addAndSendMsgToChat(chat, message);
    return window.Store.Msg.get(newMsgId._serialized);
};

const processMediaData = async (
    mediaInfo,
    { forceVoice, forceDocument, forceGif }
) => {
    const file = window.WWebJS.mediaInfoToFile(mediaInfo);
    const mData = await window.Store.OpaqueData.createFromData(file, file.type);
    const mediaPrep = window.Store.MediaPrep.prepRawMedia(mData, {
        asDocument: forceDocument,
    });
    const mediaData = await mediaPrep.waitForPrep();
    const mediaObject = window.Store.MediaObject.getOrCreateMediaObject(
        mediaData.filehash
    );

    const mediaType = window.Store.MediaTypes.msgToMediaType({
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

    if (!(mediaData.mediaBlob instanceof window.Store.OpaqueData)) {
        mediaData.mediaBlob = await window.Store.OpaqueData.createFromData(
            mediaData.mediaBlob,
            mediaData.mediaBlob.type
        );
    }

    mediaData.renderableUrl = mediaData.mediaBlob.url();
    mediaObject.consolidate(mediaData.toJSON());
    mediaData.mediaBlob.autorelease();

    const uploadedMedia = await window.Store.MediaUpload.uploadMedia({
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
};
