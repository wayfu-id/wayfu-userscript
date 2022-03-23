import { DOM } from "../lib/DOM";

class Chatroom {
    constructor() {
        this.chat;
        this.chatClass = "";
    }

    /**
     * any selected chatroom?
     */
    get selected() {
        if (this.chatClass !== "") {
            this.chat = DOM.getElement(`div.${this.chatClass}`);
            return !!this.chat;
        }
        return false;
    }

    /**
     * Initialize chatoom
     * @param {string} activeClass chatroom active css class
     * @returns
     */
    init(activeClass) {
        this.chatClass = activeClass;
        return this;
    }
}

const chat = new Chatroom();
export { Chatroom as default, chat };
