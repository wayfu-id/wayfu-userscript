import { DOM } from "../lib/HtmlModifier";
import BaseModel from "./BaseModel";

/**
 * @typedef {{
 *     active: string;
 *     header: string;
 * }} classId
 *
 * @typedef {{
 *     id: string;
 *     name: string;
 *     pushname: string;
 *     serialize: () => {
 *        id: string;
 *        name: string;
 *        pushname: string;
 *     };
 * }} contact
 *
 * @typedef {{
 *     _model: room[];
 *     getModelsArray: () => room[];
 * }} contacts
 *
 * @typedef {{
 *     subject: string;
 *     participants: contacts;
 * }} groupMeta;
 *
 * @typedef {{
 *     isGroup: boolean;
 *     contact: contact;
 *     groupMetadata?: groupMeta;
 * }} room
 */

class Chatroom extends BaseModel {
    constructor() {
        super();

        /** @type {room | null} */
        this.room = null;

        /** @type {classId} */
        this.classId = { active: "", header: "" };
    }

    /**
     * Is this a Group Chatroom?
     * @return {boolean}
     */
    get isGroup() {
        return this.selected ? this.room.id.isGroup() : false;
    }

    /**
     * Get group metadata
     * @return {groupMeta | null}
     */
    get groupMetadata() {
        return this.selected && this.isGroup ? this.room.groupMetadata : null;
    }

    /**
     * Get contact from active chatroom
     * @return {contact|null}
     */
    get contact() {
        if (this.room) {
            return this.room.contact;
        }

        return null;
    }

    /**
     * Any selected chatroom?
     * @return {boolean}
     */
    get selected() {
        return !!this.room;
    }

    /**
     * Initialize chatoom
     * @returns
     */
    init() {
        const { active } = window.WAPI.WebClasses,
            { chatHeader } = window.WAPI.WebClassesV2;

        this.classId = { active: active, header: chatHeader };
        return this;
    }

    /**
     * Select, get, and set current active chatroom
     * @returns
     */
    selectChat() {
        this.room = window.WAPI.Chat.getActive();
        // this.room = ((classes) => {
        //     let room;
        //     for (let idx in classes) {
        //         room = ((elm, id) => {
        //             if (!elm) return null;
        //             elm = id === "active" ? elm.offsetParent : elm.parentNode;
        //             for (let key of Object.keys(elm)) {
        //                 let child = this.findObjectValue("children", elm[key]);
        //                 if (!child) continue;
        //                 let { chat, active } = this.findObjectValue("props", child);
        //                 if (active) return active.value;
        //                 return chat;
        //             }
        //         })(DOM.getElement(`.${classes[idx]}`), idx);

        //         if (room) return room;
        //     }
        // })(this.classId);

        return this;
    }
}

const chat = new Chatroom();
export { Chatroom as default, chat };
