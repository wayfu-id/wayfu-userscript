import { DOM } from "../lib/DOM";

class Chatroom {
    constructor() {
        this.room = null;
        this.classId = { active: "", header: "" };
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
     * @returns
     */
    init() {
        const { active } = window.WAPI.WebClasses,
            { chatHeader } = window.WAPI.WebClassesV2;

        this.classId = { active: active, header: chatHeader };
        return this;
    }

    selectChat() {
        this.room = ((classes) => {
            let room;
            for (let key in classes) {
                let elm = DOM.getElement(`.${classes[key]}`);
                if (elm) {
                    elm = key === "active" ? elm.offsetParent : elm.parentNode;
                    for (let key of Object.keys(elm)) {
                        let { children } = elm[key];
                        if (children) {
                            room = children.props.chat;
                            break;
                        }
                    }
                }
                if (room) {
                    return room;
                }
            }
        })(this.classId);

        return this;
    }
}

const chat = new Chatroom();
export { Chatroom as default, chat };
