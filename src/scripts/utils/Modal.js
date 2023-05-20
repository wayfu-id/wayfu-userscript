import DOM, { elemenOptions } from "./DOM";

/**
 * Classes for Modal
 */
export default class Modal {
    constructor() {
        /** @type {DOM} Main */
        this.main = ((id) => {
            let ele = DOM.get(`#${id}`),
                props = { id, classid: "wfu-modal", role: "alert" };

            return ele.isEmpty
                ? DOM.create("div", props).insertTo("body")
                : ele;
        })("wayfu-modal");

        /** @type {DOM} Prototype Element*/
        this.element = ((numb) => {
            let id = `wfu-content-${numb + 1}`;
            return DOM.create("div", { id, classid: "wfu-modal-container" });
        })(this.contens);
    }

    /** @type {Number} */
    get contens() {
        return this.main.childNodes.length;
    }

    /** @type {DOM} */
    get element() {
        return this._element;
    }

    set element(ele) {
        this._element = ele;
    }

    /**
     * Construct and display the modal
     * @param {string | HTMLElement | DOM | elemenOptions} content Modal Content, wether it text or HTML Element
     * @param {string?} title Modal Title. (Optional)
     * @param {boolean?} confirm Is it confirm modal? (Optional)
     * @return {Promise<boolean | void>}
     */
    addContent(content, title = "", confirm = false) {
        /**
         * Create Modal button
         * @param {{text?: String, classid: String, event: {[k:string]: EventListener}}} prop
         * @param {Boolean} confirm
         * @returns
         */
        const createButton = (prop = {}, confirm = false) => {
            let props = !confirm
                ? Object.assign({ href: "#", html: "&times;" }, prop)
                : prop;

            return DOM.create("a", props);
        };

        return new Promise((done) => {
            const element = this.element;

            if (title) DOM.create("h2", { text: title }).insertTo(element);
            if (content) {
                if (content instanceof HTMLElement || content instanceof DOM) {
                    DOM.get(content).insertTo(element);
                } else if (typeof content === "string") {
                    DOM.create("p", { html: content }).insertTo(element);
                } else if (typeof content === "object") {
                    let { tag, ...props } = content;
                    DOM.create(tag || "p", props).insertTo(element);
                }
            }
            let button = ((c) => {
                if (!c) {
                    return createButton({
                        classid: "wfu-btn-close img-replace wfu-modal-close",
                    }).onEvent("click", (e) => this.closed(e));
                }

                let wrap = DOM.create("ul", { classid: "wfu-buttons" }),
                    btnYes = { classid: "wfu-btn-ok", text: "Ya" },
                    btnNo = { classid: "wfu-modal-close", text: "Tidak" },
                    props = { y: btnYes, n: btnNo };

                for (let stat in props) {
                    let item = DOM.create("li").insertTo(wrap),
                        prop = props[stat];

                    createButton(prop, true)
                        .onEvent("click", (e) => this.closed(e))
                        .onEvent("click", (e) => done(stat === "y"))
                        .insertTo(item);
                }

                return wrap;
            })(confirm);

            button.insertTo(element);

            this.element = element;
            this.show();
        });
    }

    /**
     * Remove modal item
     * @param {string | HTMLElement | DOM}
     * @returns
     */
    remove(query) {
        if (this.contens !== 0) {
            this.main.remove(query);
        }

        return this;
    }

    /** Just to show modal */
    show() {
        this.element.insertTo(this.main);
        this.main.set({ addClass: "is-visible" });
    }

    /**
     * Destroy current popup modal
     * @param {event} e event callback
     */
    closed(e) {
        if (this instanceof Modal) {
            const { element, main } = this,
                { contens } = this.remove(element);

            main.set({ removeClass: !contens ? "is-visible" : "" });
            // if (contens == 0) main.set({ removeClass: "is-visible" });
            // let elm = e.target || e.currentTarget;
            // console.log(this, elm);
        }
    }

    /**
     * Construct and display the alert modal
     * @param {string | HTMLElement | DOM | elemenOptions} content innerText | innerHTML for the modal
     * @param {string} title modal title
     * @returns {Promise<void>}
     */
    static async alert(content, title = "") {
        return await new Modal().addContent(content, title);
    }

    /**
     * Construct and display the alert confirm
     * @param {string | HTMLElement | DOM | elemenOptions} content innerText | innerHTML for the modal
     * @param {string} title modal title
     * @returns {Promise<boolean>}
     */
    static async confirm(content, title = "") {
        return await new Modal().addContent(content, title, true);
    }

    /**
     * Show or destroy progress panel
     * @param {boolean} stat blasting or not
     * @param {(e: Event) => void} callback? calback function when panel closed
     */
    static progressPanel(stat, callback = null) {
        /** @type {(prop: elemenOptions) => DOM} */
        const createButton = (prop = {}) => {
            let props = Object.assign({ href: "#", html: "&times;" }, prop);
            return DOM.create("a", props);
        };

        let modal = new Modal(),
            { main, element } = modal;

        let hasPanel = (({ childNodes }) => {
            return DOM.get(childNodes).some((e) =>
                e.classList.contains("progress-panel")
            );
        })(main);

        if (stat && !hasPanel) {
            element.set({ addClass: "progress-panel" });
            let items = [
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
            ];

            items.forEach((e) => {
                let { tag, ...props } = e;
                DOM.create(tag, props).insertTo(element);
            });

            createButton({ classid: "wfu-btn-close img-replace" })
                .onEvent("click", callback)
                .insertTo(element);

            modal.element = element;
            modal.show();
        } else if (!stat && hasPanel) {
            let { contens } = modal.remove(".progress-panel");
            main.set({ removeClass: !contens ? "is-visible" : "" });
        }
    }
}
