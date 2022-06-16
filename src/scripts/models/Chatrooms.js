import { DOM } from "../lib/DOM";

class Chatroom {
    constructor() {
        this.room = null;
        this.classId = "";
    }

    get isGroup() {
        return this.selected ? this.room.isGroup : false;
    }

    get groupMetadata() {
        return this.selected && this.isGroup ? this.room.groupMetadata : null;
    }

    /**
     * get contact from active chatroom
     */
    get contact() {
        if (this.room) {
            return this.room.contact;
        }

        return null;
    }

    /**
     * any selected chatroom?
     */
    get selected() {
        return !!this.room;
    }

    /**
     * Initialize chatoom
     * @param {string} activeClass chatroom active css class
     * @returns
     */
    init(activeClass) {
        this.classId = activeClass;
        return this;
    }

    selectChat() {
        let elm = this.classId !== "" ? DOM.getElement(`div.${this.classId}`) : null;
        if (elm !== null) {
            elm = elm.offsetParent;
            for (let key of Object.keys(elm)) {
                let { children } = elm[key];
                if (children) {
                    this.room = children.props.chat;
                    break;
                }
            }
        }

        return this;
    }
}

const chat = new Chatroom();
export { Chatroom as default, chat };
