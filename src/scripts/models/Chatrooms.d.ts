import BaseModel from "./BaseModel";

type classId = {
    active: string;
    header: string;
}

interface contact {
    readonly id: {user: string};
    readonly name: string;
    readonly pushname: string;
    serialize: () => {
        id: {user: string};
        name: string;
        pushname: string;
    }
}

interface contacts {
    readonly _model: room[];
    getModelsArray: () => room[];
}

interface groupMeta {
    readonly subject: string;
    readonly participants: contacts;
}

interface room {
    readonly isGroup: boolean;
    readonly contact: contact;
    readonly groupmetadata?: groupMeta;
}

export default class Chatroom extends BaseModel {
    room: room;
    classId: classId;

    /** Is this a Group Chatroom? */
    get isGroup(): boolean;

    /** Get group metadata */
    get groupMetadata(): groupMeta | null;

    /** Get contact from active chatroom */
    get contact(): room;

    /** Any selected chatroom? */
    get selected(): boolean;

    /** Initialize chatoom */
    init(): Chatroom;
    
    /** Select, get, and set current active chatroom */
    selectChat(): Chatroom;
}
export const chat: Chatroom;