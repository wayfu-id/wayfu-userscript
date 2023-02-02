import { DOM } from "../lib/HtmlModifier";

/**
 * Classes for Modal
 */
class Modals {
    constructor() {
        this.contens = 0;
        this.element = DOM.createElement({
            tag: "div",
            id: "wayfu-modal",
            classid: "wfu-modal",
            role: "alert",
        });
    }

    /**
     * Construct and display the modal
     * @param {string | HTMLElement} text Modal Content, wether it text or HTML Element
     * @param {string?} title Modal Title. (Optional)
     * @param {boolean?} confirm Is it confirm modal? (Optional)
     * @return {Promise<boolean | void>}
     */
    #construct(text, title = "", confirm = false) {
        return new Promise((done) => {
            let id = `wfu-content-${(this.contens += 1)}`,
                content = DOM.createElement({
                    tag: "div",
                    classid: "wfu-modal-container",
                    id: id,
                });
            if (title) {
                DOM.createElement({
                    tag: "h2",
                    text: title,
                    append: content,
                });
            }
            if (text) {
                if (text instanceof window.HTMLElement) {
                    DOM.insertElement(text, content);
                } else if (typeof text === "string") {
                    DOM.createElement({
                        tag: "p",
                        html: text,
                        append: content,
                    });
                } else if (typeof text === "object") {
                    DOM.createElement(
                        Object.assign(
                            {
                                tag: "p",
                                append: content,
                            },
                            text
                        )
                    );
                }
            }
            if (confirm) {
                let btnWrap = DOM.createElement({
                    tag: "ul",
                    classid: "wfu-buttons",
                    append: content,
                });
                let btns = [
                    {
                        tag: "a",
                        classid: "wfu-btn-ok",
                        text: "Ya",
                        event: {
                            click: (e) => {
                                this.closed(e);
                                done(true);
                            },
                        },
                    },
                    {
                        tag: "a",
                        classid: "wfu-modal-close",
                        text: "Tidak",
                        event: {
                            click: (e) => {
                                this.closed(e);
                                done(false);
                            },
                        },
                    },
                ];
                for (let btn of btns) {
                    let li = DOM.createElement({
                        tag: "li",
                        append: btnWrap,
                    });
                    DOM.createElement(
                        Object.assign({}, btn, {
                            append: li,
                        })
                    );
                }
            } else {
                DOM.createElement({
                    tag: "a",
                    href: "#",
                    html: "&times;",
                    classid: "wfu-btn-close img-replace wfu-modal-close",
                    append: content,
                    event: {
                        click: this.closed,
                    },
                });
            }
            DOM.onEvent(window, "click", this.closed).insertElement(
                content,
                this.element
            );
            this.show();
        });
    }

    /**
     * Construct and display the alert modal
     * @param {string} text innerText | innerHTML for the modal
     * @param {string} title modal title
     * @returns {Promise<void>}
     */
    async alert(text, title = "") {
        return await this.#construct(text, title);
    }

    /**
     * Construct and display the alert confirm
     * @param {string} text innerText | innerHTML for the modal
     * @param {string} title modal title
     * @returns {Promise<boolean>}
     */
    async confirm(text, title = "") {
        return await this.#construct(text, title, true);
    }

    /**
     * Show or destroy progress panel
     * @param {boolean} stat blasting or not
     * @param {(e: Event) => void} callback? calback function when panel closed
     */
    progressPanel(stat, callback = null) {
        if (stat) {
            let id = `wfu-content-${(this.contens += 1)}`,
                content = DOM.createElement({
                    tag: "div",
                    classid: "wfu-modal-container progress-panel",
                    id: id,
                }),
                element = [
                    {
                        tag: "h2",
                        text: "Pesanmu sedang dikirim",
                    },
                    {
                        tag: "div",
                        html: "<div class='waBar'></div>",
                        classid: "waProgress",
                    },
                    {
                        tag: "p",
                        html: "Mengirim pesan ke <span class='curPhone'></span> (<span class='curNumb'></span>)",
                    },
                    {
                        tag: "a",
                        href: "#",
                        html: "&times;",
                        classid: "wfu-btn-close img-replace",
                        event: {
                            click: callback,
                        },
                    },
                ];

            content = DOM.createElements(element, content);

            DOM.insertElement(content, "#wayfu-modal");
            this.show();
        } else {
            let elm = DOM.getElement(".wfu-modal-container.progress-panel"),
                popUp = DOM.getElement(".wfu-modal-container", true),
                modal = DOM.getElement("#wayfu-modal");
            if (elm) DOM.removeElement(elm, modal);
            if (modal && popUp.length === 0) {
                modal.classList.remove("is-visible");
            }
        }
    }

    /**
     * Show WayFu modal elements
     */
    show() {
        if (!DOM.getElement("#wayfu-modal")) {
            DOM.insertElement(this.element);
        }
        let modal = DOM.getElement("#wayfu-modal");
        modal.classList.add("is-visible");
    }

    /**
     * Destroy current popup modal
     * @param {event} e event callback
     */
    closed(e) {
        const elm = e.target,
            modal = DOM.getElement("#wayfu-modal"),
            content = DOM.getParents(elm, ".wfu-modal-container"),
            confirm = elm.classList.contains("wfu-btn-ok");

        if (modal && (confirm || elm.classList.contains("wfu-modal-close"))) {
            if (content.length !== 0) DOM.removeElement(content[0], modal);
            const popUp = DOM.getElement(".wfu-modal-container", true);
            if (modal && popUp.length === 0) {
                modal.classList.remove("is-visible");
            }
        }
    }
}
const modal = new Modals();
export { Modals as default, modal };
