/**
 * DOM / HTML Modifier Libraries.
 * Simplify built-in DOM function
 */
class HtmlModifier {
    constructor() {}

    /**
     * Get HTML element from query selector.
     * The args_0 can be the parrent element or boolean to get all.
     * The args_1 arguments just accept boolean for get all or not
     * @param {string | HTMLElement} selector
     * @param {[string | HTMLElement | boolean, boolean]} args
     * @returns
     */
    getElement(selector, ...args) {
        let contextNode = null,
            all = false;

        if (args.length !== 0) {
            contextNode =
                args[0] instanceof window.HTMLElement
                    ? args[0]
                    : typeof args[0] === "string"
                    ? document.querySelector(args[0].trim())
                    : null;
            all =
                typeof args[0] === "boolean"
                    ? args[0]
                    : args[1] != null
                    ? args[1]
                    : false;
        }

        if (typeof selector === "string") {
            selector = selector.trim();
            if (!all) {
                return (contextNode || document).querySelector(selector);
            } else {
                return (contextNode || document).querySelectorAll(selector);
            }
        } else if (
            selector instanceof window.HTMLElement ||
            selector instanceof window.NodeList
        ) {
            return selector;
        }
    }

    /**
     * Get parent element from an element
     * @param {string | HTMLElement} element current element
     * @param {string} selector HTML selector for parent element
     * @returns
     */
    getParents(element, selector) {
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                function (s) {
                    var matches = (this.document || this.ownerDocument).querySelectorAll(
                            s
                        ),
                        i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) {}
                    return i > -1;
                };
        }
        let parents = [],
            elem = this.getElement(element);
        for (; elem && elem !== document; elem = elem.parentNode) {
            if (selector) {
                if (elem.matches(selector)) {
                    parents.push(elem);
                }
                continue;
            }
            parents.push(elem);
        }
        return parents;
    }

    /**
     * Create an HTML Element
     * @param {object} props html tag and attributes
     * @returns {HTMLElement}
     */
    createElement(props) {
        let elem, node, text;
        for (const name in props) {
            if (props.hasOwnProperty(name)) {
                switch (name) {
                    case "tag":
                        node = document.createElement(props[name]);
                        break;
                    case "text":
                        text = "innerText" in document ? "innerText" : "textContent";
                        node[text] = props[name];
                        break;
                    case "html":
                        node.innerHTML = props[name];
                        break;
                    case "classid":
                        if (typeof props[name] === "array") {
                            for (let cls of props[name]) {
                                node.classList.add(cls);
                            }
                        } else if (typeof props[name] === "string") {
                            node.className = props[name];
                        }
                        break;
                    case "append":
                        elem = this.getElement(props[name]);
                        elem.appendChild(node);
                        break;
                    case "prepend":
                        elem = this.getElement(props[name]);
                        if (elem.childNodes.length) {
                            elem.insertBefore(node, elem.childNodes[0]);
                        } else {
                            elem.appendChild(node);
                        }
                        break;
                    case "before":
                        elem = this.getElement(props[name]);
                        elem.parentNode.insertBefore(node, elem);
                        break;
                    case "after":
                        elem = this.getElement(props[name]);
                        elem.parentNode.insertBefore(node, elem.nextSibling);
                        break;
                    case "replace":
                        elem = this.getElement(props[name]);
                        elem.parentNode.replaceChild(node, elem);
                        break;
                    case "event":
                        for (const evName in props.event) {
                            if (props.event.hasOwnProperty(evName)) {
                                this.onEvent(node, evName, props.event[evName]);
                            }
                        }
                        break;
                    case "callback":
                        props[name](node);
                        break;
                    default:
                        node.setAttribute(name, props[name]);
                }
            }
        }
        return node;
    }

    /**
     * Create some HTML elements, can be inserted to parent element if setted
     * @param {object[]} options elements properties
     * @param {string | HTMLElement} parent parent element
     * @returns
     */
    createElements(options = [], parent) {
        parent = parent
            ? parent instanceof window.HTMLElement
                ? parent
                : typeof parent === "object" && parent.tag != null
                ? this.createElement(parent)
                : null
            : null;
        if (typeof options === "object") {
            for (let props of options) {
                if (parent) props.append = parent;
                this.createElement(props);
            }
        }
        return parent ? parent : this;
    }

    /**
     *
     * @param {"ol"|"ul"} type list type
     * @param {any[]} items list items
     * @param {object} props other html properties for list
     * @returns
     */
    createListElement(type, items, props = {}) {
        let lists = this.createElement(
            Object.assign(
                {
                    tag: type || "ol",
                },
                props
            )
        );
        if (Array.isArray(items)) {
            items.forEach((e) => {
                if (typeof e === "object") {
                    let item = this.createElement({
                        tag: "li",
                        html: e.title,
                        append: lists,
                    });
                    if (Array.isArray(e.content)) {
                        this.createListElement(type || "ol", e.content, {
                            append: item,
                        });
                    }
                } else if (typeof e === "string") {
                    this.createElement({
                        tag: "li",
                        html: e,
                        append: lists,
                    });
                }
            });
        }
        return lists;
    }

    /**
     * Set/Edit single or multiple element style
     * @param {string | HTMLElement} selector target element
     * @param {object} props element style properties
     * @returns
     */
    setElementStyle(selector, props) {
        const elms =
            selector instanceof window.HTMLElement
                ? [selector]
                : this.getElement(selector, true);
        if (elms && elms.length !== 0 && !!elms[0]) {
            for (const node of elms) {
                for (const key in props) {
                    if (props.hasOwnProperty(key)) {
                        switch (key) {
                            case "zIndex":
                                node.style.zIndex = props[key];
                                break;
                            case "margin":
                                node.style.margin = props[key];
                                break;
                            case "padding":
                                node.style.padding = props[key];
                                break;
                            case "display":
                                node.style.display = props[key];
                                break;
                            default:
                                node.style[key] = props[key];
                        }
                    }
                }
            }
        }
        return this;
    }

    /**
     * Set/Edit multiple element style
     * @param {string | {elm:string, props:object}[]} selector elements target or array of object contains {elm, props}
     * @param {object} props element style properties
     * @returns
     */
    setElementsStyle(selector, props) {
        if (Array.isArray(selector)) {
            selector.forEach((e) => {
                this.setElementStyle(e.elm, e.props);
            });
        } else if (typeof selector === "string") {
            this.getElement(selector, true).forEach((e) => {
                this.setElementStyle(e, props);
            });
        }
        return this;
    }

    /**
     * Set/Edit single or multiple element tag
     * @param {string | HTMLElement} selector target element(s)
     * @param {object} props contains HTMLELement tag
     * @returns
     */
    setElement(selector, props) {
        const elms =
            selector instanceof window.HTMLElement
                ? [selector]
                : this.getElement(selector, true);
        let text;
        if (elms && elms.length !== 0 && !!elms[0]) {
            for (const node of elms) {
                for (const name in props) {
                    if (props.hasOwnProperty(name)) {
                        switch (name) {
                            case "text":
                                text =
                                    "innerText" in document ? "innerText" : "textContent";
                                node[text] = props[name];
                                break;
                            case "html":
                                node.innerHTML = props[name];
                                break;
                            case "class":
                                node.className = props[name];
                                break;
                            case "addClass":
                                node.classList.add(props[name]);
                                break;
                            case "removeClass":
                                node.classList.remove(props[name]);
                                break;
                            case "toggleClass":
                                node.classList.toggle(props[name]);
                                break;
                            case "disabled":
                                node.disabled = props[name];
                                break;
                            case "value":
                                node.value = props[name];
                                break;
                            case "dispatch":
                                node.dispatchEvent(props[name]);
                                break;
                            case "readonly":
                            case "readOnly":
                                node.readOnly = props[name];
                                break;
                            default:
                                node.setAttribute(name, props[name]);
                        }
                    }
                }
            }
        }
        return this;
    }

    /**
     * Set/Edit multiple element tag
     * @param {{elm:string, props:object}[]} options array of object contains {elm, props}
     * @returns
     */
    setElements(options = []) {
        if (Array.isArray(options)) {
            options.forEach((e) => {
                this.setElement(e.elm, e.props);
            });
        }
        return this;
    }

    /**
     * Check html element is exist or not
     * @param {string | HTMLElement} selector target element
     * @param {number} timeout uint miliseconds
     * @returns {Promise<HTMLElement | false>}
     */
    hasElement(selector, timeout = 10) {
        return new Promise((done) => {
            let loop = setInterval(() => {
                let elm = this.getElement(selector);
                if (elm) {
                    done(elm);
                    clearInterval(loop);
                }
                if ((timeout -= 1 == 0)) {
                    done(false);
                    clearInterval(loop);
                }
            }, 1e3);
        });
    }

    /**
     * Insert an element to target element
     * @param {string | HTMLElement} selector element
     * @param {string | HTMLElement} parent target element as parent
     * @returns
     */
    insertElement(selector, parent) {
        this.getElement(parent || "body").appendChild(this.getElement(selector));
        return this;
    }

    /**
     * Remove an element to target element
     * @param {string | HTMLElement} selector element
     * @param {string | HTMLElement} parent target element as parent
     * @returns {HTMLElement | this}
     */
    removeElement(selector, parent) {
        this.getElement(parent || "body").removeChild(this.getElement(selector));
        return parent || this;
    }
    /**
     * Add event listener to an element
     * @param {string | HTMLElement} selector element
     * @param {string} type type of event
     * @param {EventListener} listener event listener
     * @param {boolean} bubbles bubbling
     * @returns
     */
    onEvent(selector, type, listener, bubbles = false) {
        let element = this.getElement(selector);
        // console.log(element, type, listener);
        if (window.addEventListener) {
            (element || window).addEventListener(type, listener, bubbles);
        }
        return this;
    }

    /**
     * Force doing some event on an elemenet
     * @param {string | HTMLElement} selector element
     * @param {string} type event type
     * @param {string} message event message
     * @param {{bubble:boolean, composed:boolean}} opt
     * @returns
     */
    eventFire(selector, type, message, opt = { bubbles: true, composed: true }) {
        this.setElement(selector, {
            text: message || "",
            dispatch: type ? new InputEvent(type, opt) : new MouseEvent("mousedown", opt),
        });
        return this;
    }

    /**
     * Add <style> element at the head
     * @param {string} css stylesheet
     * @param {object} props other html attributes
     * @returns
     */
    addStyle(css, props = {}) {
        const opt = {
            tag: "style",
            html: css,
            append: "head",
        };
        this.createElement(Object.assign({}, opt, props));
        return this;
    }
}

const DOM = new HtmlModifier();
export { DOM };
