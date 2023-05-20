import MyArray from "./MyArray";

/**
 * @typedef { ElementCreationOptions & {
 *     namespace?: string,
 *     tag: keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap,
 *     text: string,
 *     html: string,
 *     class: string,
 *     classid?: string | string[],
 *     append?: String | HTMLElement,
 *     prepend?: String | HTMLElement,
 *     before?: String | HTMLElement,
 *     after?: String | HTMLElement,
 *     replace?: String | HTMLElement,
 *     event?: DocumentEventMap[],
 *     callback?: (node:HTMLElement) => any,
 * }} elemenOptions
 *
 * @typedef { elemenOptions & {
 *     title: String,
 *     content: String | MyArray<String>
 * }} listElementOptions
 *
 * @typedef { elemenOptions & {
 *     size: string,
 *     d: string | string[],
 *     dPath: string | string[],
 *     fill?: string,
 *     viewBox?: string
 * }} svgElemenOptions
 *
 * @typedef {{
 *     type: keyof SVGElementTagNameMap,
 *     data: SVGElement
 * }} svgElementDetails
 *
 * @typedef { HTMLElement | Document | Window } kindOfNode
 *
 * @typedef { CSSStyleDeclaration | {
 *      elm : kindOfNode | String,
 *      props: CSSStyleDeclaration
 * }[]} elementStyles;
 */

/**
 * Just a DOM Class using extended custom Array
 * @extends {MyArray<HTMLElement>}
 */
export default class DOM extends MyArray {
    /**
     * @type {{
     *  (query: String | kindOfNode | NodeList) => DOM;
     *  (query: elemenOptions | elemenOptions[], create: true) => DOM;
     *  (query: DOM) => DOM;
     *  () => DOM;
     * }}
     * @constructor
     */
    constructor(query = "", create = false) {
        super();
        return create ? this.create(query) : this.get(query);
    }

    /** Get current element childNodes */
    get childNodes() {
        return !this.isEmpty ? this.first.childNodes : undefined;
    }

    /** Get current element parent */
    get parent() {
        return !this.isEmpty ? this.first.parentNode : undefined;
    }

    /** Get current next sibling element */
    get nextSibling() {
        return !this.isEmpty ? this.first.nextSibling : undefined;
    }

    /** Get current element classList*/
    get classList() {
        return !this.isEmpty ? this.first.classList : undefined;
    }

    /**
     * Create new HTMLElement(s) and
     * Collect it into DOM Object
     * @param {elemenOptions | elemenOptions[] | null} props
     * @returns
     */
    create(props) {
        if (!props) return this;
        if (Array.isArray(props)) {
            for (let opt of props) {
                if (typeof opt !== "object" && !opt.tag) continue;

                this.createElement(props);
            }

            return this;
        }

        return this.createElement(props);
    }

    /**
     * Get some HTMLElement(s) and
     * Collect it into DOM Object
     * @param {String | kindOfNode | NodeList | DOM | null} query
     * @returns
     */
    get(query) {
        if (!query) return this;
        if (typeof query === "string") return this.getElement(query);
        if (query instanceof DOM) return query;

        const isNode = (q) =>
            q instanceof Document ||
            q instanceof Window ||
            q instanceof HTMLElement;

        if (isNode(query)) {
            this.push(query);
        } else if (query instanceof NodeList) {
            query.forEach((node) => this.push(node));
        }

        return this;
    }

    /**
     * Is current element matches with given query?
     * @param {String | kindOfNode | NodeList | DOM} query
     * @returns
     */
    matches(query) {
        let elms = DOM.get(query),
            { length: i } = elms;

        if (elms.isEmpty) return false;
        while (--i >= 0 && elms.at(i) !== this.first) {}
        return i > -1;
    }

    /**
     * Get some HTMLElement(s) that are parent for current element
     * and Collect it into DOM Object
     * @param {String | kindOfNode | NodeList | DOM | null} query
     * @returns
     */
    getParents(query) {
        /** @type {(elm: DOM) => DOM} */
        const setParent = (elm) => DOM.get(elm.parent);
        /** @type {(elm: DOM) => boolean} */
        const isPeek = (elm) => {
            let { isEmpty, first } = elm;
            return !isEmpty && first !== document;
        };

        let elem = this,
            parents = setParent(elem);

        for (; isPeek(elem); elem = setParent(elem)) {
            if (query) {
                if (elem.matches(query)) parents = elem;
                continue;
            }
            parents.unshift(elem.first);
        }
        return parents;
    }

    /**
     * Set single properties. Can be attributes or stylesheet
     * @param {String | {[String]: String | Number | Boolean}} key
     * @param {String | Number | Boolean | null} value
     * @returns
     */
    set(key, value) {
        if (typeof key === "object") {
            for (let name in key) {
                this.set(name, key[name]);
            }
            return this;
        }

        const isStyleKey = ((key) => {
            let keys = Object.getOwnPropertyNames(this.first.style);
            return keys.some((e) => e === key);
        })(key);
        const props = { [key]: value };

        return isStyleKey ? this.setStyles(props) : this.setProperties(props);
    }

    /**
     * Remove current element or an element from current element
     * @param {String | kindOfNode | DOM | null} query
     * @returns
     */
    remove(query) {
        const getEle = (query) => DOM.get(query).first;

        if (query) {
            this.first.removeChild(getEle(query));
        } else {
            getEle("body").removeChild(this.first);
        }
        return this;
    }

    /**
     * Insert an element into current element
     * @param {String | kindOfNode | DOM} element
     * @returns
     */
    insert(element) {
        const getEle = (query) => DOM.get(query).last;
        this.first.appendChild(getEle(element));

        return this;
    }

    /**
     * Insert current element into target element
     * @param {String | kindOfNode | DOM} target
     * @returns
     */
    insertTo(target) {
        const getEle = (query) => DOM.get(query).first;
        getEle(target).appendChild(this.first);

        return this;
    }

    /**
     * Insert current element into first child of target element
     * @param {String | kindOfNode | DOM} target
     * @param {Boolean?} prepend
     * @returns
     */
    insertBefore(target, prepend = false) {
        // const getEle = (query) => DOM.get(query).first,
        //     targetEle = getEle(target);

        // targetEle.insertBefore(this.first, targetEle.children[0]);
        const { first, parent, childNodes } = DOM.get(target);

        if (!prepend) {
            parent.insertBefore(this.first, first);
        } else {
            if (childNodes.length) {
                first.insertBefore(this.first, childNodes[0]);
            } else {
                this.insertTo(target);
            }
        }

        return this;
    }

    /**
     * Insert current element after target element
     * @param {String | kindOfNode | DOM} target
     * @returns
     */
    insertAfter(target) {
        const { parent, nextSibling } = DOM.get(target);
        parent.insertBefore(this.first, nextSibling);

        return this;
    }

    /**
     * Replace target element with current element
     * @param {String | kindOfNode | DOM} target
     * @returns
     */
    replace(target) {
        const { parent, first } = DOM.get(target);
        parent.replaceChild(this.first, first);

        return this;
    }

    /**
     * Actual method for creating Element(s)
     * and Collect it into DOM Object
     * @param {elemenOptions | svgElemenOptions} props
     * @returns
     */
    createElement(props) {
        const element = (({ tag, namespace }) => {
            if (namespace) return document.createElementNS(namespace, tag);
            return document.createElement(tag);
        })(props);

        delete props.tag;

        this.unshift(element);

        return this.setProperties(props);
    }

    /**
     *
     * Actual method for geting Element(s)
     * and Collect it into DOM Object
     * @param {String} query
     * @returns
     */
    getElement(query) {
        if (!this.first) {
            if (/^(?:document|window)$/g.test(query)) {
                return this.gets(/^document$/g.test(query) ? document : window);
            }
        }

        let res = (this.first || document).querySelectorAll(query);
        if (!res.length) return this;

        res.forEach((node) => this.push(node));
        return this;
    }

    /**
     * Set properties for current HTML Element
     * @param {elemenOptions} props
     * @returns
     */
    setProperties(props) {
        let { namespace } = props;

        delete props.namespace;
        /** @type {(node: HTMLElement) => void} */
        const setProp = (node) => {
            // const getEle = (query) => DOM.get(query).first;
            // let elem;

            for (const name in props) {
                if (props.hasOwnProperty(name)) {
                    if (!namespace) {
                        switch (name) {
                            case "text":
                                let text =
                                    "innerText" in document
                                        ? "innerText"
                                        : "textContent";
                                node[text] = props[name];
                                break;
                            case "html":
                                node.innerHTML = props[name];
                                break;
                            case "class":
                            case "classid":
                                if (typeof props[name] === "array") {
                                    for (let cls of props[name]) {
                                        node.classList.add(cls);
                                    }
                                } else if (typeof props[name] === "string") {
                                    node.className = props[name];
                                }
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
                            case "append":
                                DOM.get(node).insertTo(props[name]);
                                // DOM.get(props[name]).insert(node);
                                break;
                            case "prepend":
                                // elem = DOM.get(props[name]);
                                // if (DOM.get(props[name]).childNodes.length) {
                                //     DOM.get(node).insertBefore(props[name]);
                                // }
                                DOM.get(node).insertBefore(props[name], true);
                                break;
                            case "before":
                                // elem = getEle(props[name]);
                                // elem.parentNode.insertBefore(node, elem);
                                DOM.get(node).insertBefore(props[name]);
                                break;
                            case "after":
                                // elem = getEle(props[name]);
                                // elem.parentNode.insertBefore(
                                //     node,
                                //     elem.nextSibling
                                // );
                                DOM.get(node).insertAfter(props[name]);
                                break;
                            case "value":
                                node.value = props[name];
                                break;
                            case "dispatch":
                                node.dispatchEvent(props[name]);
                                break;
                            case "replace":
                                // elem = getEle(props[name]);
                                // elem.parentNode.replaceChild(node, elem);
                                DOM.get(node).replace(props[name]);
                                break;
                            case "event":
                                for (const evName in props.event) {
                                    if (props.event.hasOwnProperty(evName)) {
                                        this.onEvent(
                                            evName,
                                            props.event[evName]
                                        );
                                    }
                                }
                                break;
                            case "callback":
                                props[name](node);
                                break;
                            case "readonly":
                            case "readOnly":
                                node.readOnly = props[name];
                                break;
                            default:
                                node.setAttribute(name, props[name]);
                        }
                    } else {
                        const keyReplacer = (m) => `-${m.toLocaleLowerCase()}`;
                        let key = ((k) => {
                            return k !== "viewBox"
                                ? k.replace(/[A-Z]/g, keyReplacer)
                                : k;
                        })(name);

                        node.setAttributeNS(null, key, props[name]);
                    }
                }
            }
        };

        if (this.isEmpty) return this;

        if (this.length > 1) {
            this.forEach((e) => setProp(e));
        } else {
            setProp(this.first);
        }

        return this;
    }

    /**
     * Set Element(s) styles. Can process multiple element
     * @param {elementStyles} styles
     * @returns
     */
    setStyles(styles) {
        /** @type {(node: HTMLElement | undefined, props: CSSStyleDeclaration) => void} */
        const setStyle = (node, props) => {
            if (!node) return;
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
        };
        /** @type {(query: String | kindOfNode) => HTMLElement | undefined} */
        const getEle = (query) => DOM.get(query).first;

        if (Array.isArray(styles)) {
            styles.forEach(({ elm, props }) => {
                setStyle(getEle(elm), props);
            });

            return this;
        }

        if (this.isEmpty) return this;

        if (this.length > 1) {
            this.forEach((e) => setStyle(e, styles));
        } else {
            setStyle(this.first, styles);
        }

        return this;
    }

    /**
     * Add event listener to an element
     * @param {string} type type of event
     * @param {EventListener} listener event listener
     * @param {boolean} bubbles bubbling
     * @returns
     */
    onEvent(type, listener, bubbles = false) {
        if (window.addEventListener) {
            (this.first || window).addEventListener(type, listener, bubbles);
        }
        return this;
    }

    /**
     * Static method for creating new DOM instance with new Element(s)
     * @param {String | elemenOptions | elemenOptions[]} tag
     * @param {elemenOptions} opt
     * @returns
     */
    static create(tag, opt = {}) {
        const props = (tag, opt) => {
            return Object.assign(typeof tag === "string" ? { tag } : tag, opt);
        };

        if (Array.isArray(tag)) {
            tag.every((e) => {
                let { tag: t, props: p } = e;
                return !!p && typeof p === Object
                    ? props(t, { ...p, ...opt })
                    : props(e, opt);
            });

            return new DOM(tag, true);
        }

        return new DOM(Object.assign(props(tag, opt)), true);
    }

    /**
     * Static method for creating new DOM instance with new Element(s)
     * @param {MyArray<listElementOptions|String>} items
     * @param {"ol"|"ul"} type list type
     * @param {elemenOptions} opt
     * @returns
     */
    static createList(items, type = "ol", opt = {}) {
        let Lists = DOM.create(type, opt);
        if (Array.isArray(items)) {
            items.forEach((e) => {
                if (typeof e === "object") {
                    let { title, content } = e,
                        item = DOM.create("li", { html: title });

                    if (Array.isArray(content)) {
                        DOM.createList(content, type || "ol").insertTo(item);
                    }
                    Lists.insert(item);
                } else if (typeof e === "string") {
                    Lists.insert(DOM.create("li", { html: e }));
                }
            });
        }
        return Lists;
    }

    /**
     * Create an svg element
     * @param {svgElementDetails | Array.<svgElementDetails>} shape SVG Shape(s), can be object or array of object
     * @param {SVGSVGElement} attr main SVG attributes if any
     * @return
     */
    static createIcon(shape, attr = {}) {
        /** @type {(opt: Object) => Object} */
        const checkOpt = (opt) => {
            /** @type {(size: String) => [string, string]} */
            const deconstructSize = (size) => {
                return size.split(" ").length == 1
                    ? [size, size]
                    : size.split(" ");
            };
            let newOpt = {};
            for (const key in opt) {
                if (key !== "size") {
                    newOpt[key] = opt[key];
                } else {
                    /** @type {[string, string]} */
                    let [width, height] = deconstructSize(opt[key]);
                    newOpt = Object.assign({}, newOpt, { width, height });
                }
            }
            return newOpt;
        };

        const namespace = "http://www.w3.org/2000/svg",
            svgDOM = DOM.create("svg", { namespace, ...checkOpt(attr) }),
            shapes = Array.isArray(shape) ? shape : [shape];

        shapes.forEach(({ type, data }) => {
            svgDOM.insert(DOM.create(type, { namespace, ...checkOpt(data) }));
        });

        return svgDOM;
    }

    /**
     * Static method for creating new DOM instance with matched Element(s)
     * @param {String | kindOfNode | NodeList | DOM} query
     * @returns
     */
    static get(query) {
        if (query instanceof DOM) return query;
        return new DOM(query);
    }

    /**
     * Static method for checking for existing Element
     * @param {String | HTMLElement | kindOfNode} query target element
     * @param {Number} timeout uint miliseconds
     * @returns {Promise<HTMLElement | false>}
     */
    static async has(query, timeout = 10) {
        return new Promise((done) => {
            let loop = setInterval(() => {
                let { first } = DOM.get(query);
                if (first) {
                    done(first);
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
     * Static method for creating and inserting new stylesheet into active page
     * @param {String} css stylesheet
     * @param {elemenOptions} props other html attributes
     * @returns
     */
    static addStyle(css, props = {}) {
        let opt = { tag: "style", html: css, append: "head" },
            query = Object.assign({}, opt, props);

        return DOM.create(query);
    }
}
