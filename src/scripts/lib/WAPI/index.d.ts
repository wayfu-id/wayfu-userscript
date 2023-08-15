declare namespace WAPILib { 
    export class WAPI {
        private constructor(store);

        myContact(): Contact;

        findChat(id: string): Promise<Chat>;

        findContact(id: string): Promise<Contact>;

        openChat(id: string): Promise<void>;

        sendMessage(chatId: string, message: MessageContent, options: MessageSendOptions): Promise<Message>;

        getCommonGroups(id: string): Promise<ChatId[]>;

        static init(target: Window): WAPI;
    }
    
    /** Message types */
    export enum MessageTypes {
        TEXT = 'chat',
        IMAGE = 'image'
    }
    
    /** Message ACK */
    export enum MessageAck {
        ACK_ERROR = -1,
        ACK_PENDING = 0,
        ACK_SERVER = 1,
        ACK_DEVICE = 2,
        ACK_READ = 3,
        ACK_PLAYED = 4,
    }

    /**
     * Represents a Message on WhatsApp
     * 
     * @example
     * {
     *   mediaKey: undefined,
     *   id: {
     *     fromMe: false,
     *     remote: `554199999999@c.us`,
     *     id: '1234567890ABCDEFGHIJ',
     *     _serialized: `false_554199999999@c.us_1234567890ABCDEFGHIJ`
     *   },
     *   ack: -1,
     *   hasMedia: false,
     *   body: 'Hello!',
     *   type: 'chat',
     *   timestamp: 1591482682,
     *   from: `554199999999@c.us`,
     *   to: `554188888888@c.us`,
     *   author: undefined,
     *   isForwarded: false,
     *   broadcast: false,
     *   fromMe: false,
     *   hasQuotedMsg: false,
     *   hasReaction: false,
     *   location: undefined,
     *   mentionedIds: []
     * }
     */
    export interface Message {
        /** ACK status for the message */
        ack: MessageAck,
        /** If the message was sent to a group, this field will contain the user that sent the message. */
        author?: string,
        /** Message content */
        body: string,
        /** ID for the Chat that this message was sent to, except if the message was sent by the current user */
        from: string,
        /** Indicates if the message was sent by the current user */
        fromMe: boolean,
        /** Indicates if the message has media available for download */
        hasMedia: boolean,
        /** ID that represents the message */
        id: MessageId,
        /** MediaKey that represents the sticker 'ID' */
        mediaKey?: string,
        /** Unix timestamp for when the message was created */
        timestamp: number,
        /**
         * ID for who this message is for.
         * If the message is sent by the current user, it will be the Chat to which the message is being sent.
         * If the message is sent by another user, it will be the ID for the current user.
         */
        to: string,
        /** Message type */
        type: MessageTypes,
        /** Links included in the message. */
        links: Array<{
            link: string,
            isSuspicious: boolean
        }>,
        /** Returns message in a raw format */
        rawData: object,
        /** Returns the Chat this message was sent in */
        getChat: () => Promise<Chat>,
        /** Returns the Contact this message was sent from */
        getContact: () => Promise<Contact>,
    }

    /** ID that represents a message */
    export interface MessageId {
        fromMe: boolean,
        remote: string,
        id: string,
        _serialized: string,
    }

    export interface MessageSendOptions {
        /** Show links preview. Has no effect on multi-device accounts. */
        linkPreview?: boolean
        /** Send audio as voice message with a generated waveform */
        sendAudioAsVoice?: boolean
        /** Send video as gif */
        sendVideoAsGif?: boolean
        /** Send media as sticker */
        sendMediaAsSticker?: boolean
        /** Send media as document */
        sendMediaAsDocument?: boolean
        /** Send photo/video as a view once message */
        isViewOnce?: boolean
        /** Automatically parse vCards and send them as contacts */
        parseVCards?: boolean
        /** Image or videos caption */
        caption?: string
        /** Id of the message that is being quoted (or replied to) */
        quotedMessageId?: string
        /** Contacts that are being mentioned in the message */
        mentions?: Contact[]
        /** Send 'seen' status */
        sendSeen?: boolean
        /** Media to be sent */
        media?: MessageMedia
        /** Extra options */
        extra?: any
        /** Sticker name, if sendMediaAsSticker is true */
        stickerName?: string
        /** Sticker author, if sendMediaAsSticker is true */
        stickerAuthor?: string
        /** Sticker categories, if sendMediaAsSticker is true */
        stickerCategories?: string[]
    }

    /** Media attached to a message */
    export class MessageMedia {
        /** MIME type of the attachment */
        mimetype: string
        /** Base64-encoded data of the file */
        data: string
        /** Document file name. Value can be null */
        filename?: string | null
        /** Document file size in bytes. Value can be null. */
        filesize?: number | null

        /**
         * @param {string} mimetype MIME type of the attachment
         * @param {string} data Base64-encoded data of the file
         * @param {?string} filename Document file name. Value can be null
         * @param {?number} filesize Document file size in bytes. Value can be null.
         */
        constructor(mimetype: string, data: string, filename?: string | null, filesize?: number | null)

        /** Creates a MessageMedia instance from a local file path */
        static fromFilePath: (filePath: string) => MessageMedia
    }

    export type MessageContent = string | MessageMedia;

    /**
     * Represents a Contact on WhatsApp
     *
     * @example 
     * {
     *   id: {
     *     server: 'c.us',
     *     user: '554199999999',
     *     _serialized: `554199999999@c.us`
     *   },
     *   number: '554199999999',
     *   isBusiness: false,
     *   isEnterprise: false,
     *   name: undefined,
     *   pushname: 'John',
     *   shortName: undefined,
     *   isMe: false,
     *   isUser: true,
     *   isGroup: false,
     *   isWAContact: true,
     *   isMyContact: false,
     *   isBlocked: false
     * }
     */
    export interface Contact {
        /** Contact's phone number */
        number: string,
        /** Indicates if the contact is a business contact */
        isBusiness: boolean,
        /** ID that represents the contact */
        id: ContactId,
        /** Indicates if the contact is an enterprise contact */
        isEnterprise: boolean,
        /** Indicates if the contact is a group contact */
        isGroup: boolean,
        /** Indicates if the contact is the current user's contact */
        isMe: boolean,
        /** Indicates if the number is saved in the current phone's contacts */
        isMyContact: boolean
        /** Indicates if the contact is a user contact */
        isUser: boolean,
        /** Indicates if the number is registered on WhatsApp */
        isWAContact: boolean,
        /** Indicates if you have blocked this contact */
        isBlocked: boolean,
        /** The contact's name, as saved by the current user */
        name?: string,
        /** The name that the contact has configured to be shown publically */
        pushname: string,
        /** A shortened version of name */
        shortName?: string,

        /** Returns the Chat that corresponds to this Contact.  
         * Will return null when getting chat for currently logged in user.
         */
        getChat: () => Promise<Chat>,
        
        /** Gets the Contact's common groups with you. Returns empty array if you don't have any common group. */
        getCommonGroups: () => Promise<ChatId[]>

    }

    export interface ContactId {
        server: string,
        user: string,
        _serialized: string,
    }

    /**
     * Represents a Chat on WhatsApp
     *
     * @example
     * {
     *   id: {
     *     server: 'c.us',
     *     user: '554199999999',
     *     _serialized: `554199999999@c.us`
     *   },
     *   name: '+55 41 9999-9999',
     *   isGroup: false,
     *   timestamp: 1591484087,
     * }
     */
    export interface Chat {
        /** ID that represents the chat */
        id: ChatId,
        /** Indicates if the Chat is a Group Chat */
        isGroup: boolean,
        /** Title of the chat */
        name: string,
        /** Unix timestamp for when the last activity occurred */
        timestamp: number,

        /** Send a message to this chat */
        sendMessage: (content: MessageContent, options?: MessageSendOptions) => Promise<Message>,
        /** Returns the Contact that corresponds to this Chat. */
        getContact: () => Promise<Contact>,
    }

    /**
     * Id that represents the chat
     * 
     * @example
     * id: {
     *   server: 'c.us',
     *   user: '554199999999',
     *   _serialized: `554199999999@c.us`
     * },
     */
    export interface ChatId {
        /**
         * Whatsapp server domain
         * @example `c.us`
         */
        server: string,
        /**
         * User whatsapp number
         * @example `554199999999`
         */
        user: string,
        /**
         * Serialized id
         * @example `554199999999@c.us`
         */
        _serialized: string,
    }

    export type GroupParticipant = {
        id: ContactId,
        isAdmin: boolean
        isSuperAdmin: boolean
    }

    export interface GroupChat extends Chat {
        /** Group owner */
        owner: ContactId;
        /** Group participants */
        participants: Array<GroupParticipant>;
    }
}

export = WAPILib;