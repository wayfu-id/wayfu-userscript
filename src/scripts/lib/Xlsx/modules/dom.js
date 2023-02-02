import MyArray from "../../../models/MyArray";
/**
 * @typedef {{(node: Element, i?:number) => void}} domCb
 *
 * @typedef {{
 *   name: String,
 *   value: String | Number
 * }} tagAttribute
 *
 * @typedef {{
 *   tag: String,
 *   attributes?: tagAttribute | MyArray<tagAttribute>,
 *   value?: String | Number
 * }} elementItem
 */

const NAMESPACE_REG_EXP = /.+\:/;

/**
 * Get children(s) of an element by given `tagName`
 * @param {Element} node
 * @param {String} tagName
 * @param {boolean=false} all
 * @returns {Element|MyArray<Element>}
 */
const findChild = (node, tagName, all = false) => {
    let results = new MyArray();

    for (let childNode of node.childNodes) {
        if (childNode.nodeType === 1 && getTagName(childNode) === tagName) {
            results.push(childNode);
        }
    }

    return all ? results : results.shift();
};

/**
 * Get Element Tag Name
 * @param {Element} element On what element?
 * @returns {String} Tagname value
 */
const getTagName = (element) => {
    return element.tagName.replace(NAMESPACE_REG_EXP, "");
};

/**
 * Set XML Element attribute(s)
 * @param {Element} node
 * @param {tagAttribute | MyArray<tagAttribute>} attributes
 * @return {Element}
 */
const setElementAttr = (node, attributes) => {
    if (Array.isArray(attributes)) {
        attributes.forEach((attr) => {
            setElementAttr(node, attr);
        });
    } else {
        let { name, value } = attributes;
        if (typeof name !== "undefined" && typeof value !== "undefined") {
            node.setAttribute(name, value);
        }
    }
    // console.log(node.nodeName, attributes);
    return node;
};

/**
 * Get outer XML content
 * @param {Element} node On what element?
 * @returns {String} XML value as string
 */
const getOuterXml = (node) => {
    if (node.nodeType !== 1) return node.textContent;

    const { attributes, childNodes } = node,
        attr = attributes.map((e) => `${e.name}="${e.value}"`).join(" "),
        tag = getTagName(node);
    let contents = "";

    childNodes.forEach((e) => (contents += getOuterXml(e)));
    return `<${tag} ${attr}>${contents}</${tag}>`;
};

/**
 * Do given function on every childrens by given `tagName` *
 * @param {Element} node
 * @param {String} tagName
 * @param {domCb} func
 */
function forEach(node, tagName, func) {
    let i = 0;
    for (let childNode of node.childNodes) {
        if (tagName) {
            if (childNode.nodeType === 1 && getTagName(childNode) === tagName) {
                func(childNode, i);
            }
        } else {
            func(childNode, i);
        }
        i++;
    }
}

/**
 * Get Array of returned function
 * @param {Element} node
 * @param {String} tagName
 * @param {domCb} func
 * @return {MyArray<domCb>}
 */
function map(node, tagName, func) {
    let results = new MyArray();
    forEach(node, tagName, function (node, i) {
        results.push(func(node, i));
    });
    return results;
}

/**
 * Create new XML Documents
 * @param {(elementItem | String)?} root
 * @returns {XMLDocument}
 */
function createXml(root) {
    const [parser, serializer] = [new DOMParser(), new XMLSerializer()],
        prefix = '<?xml version="1.0" encoding="utf-8" standalone="yes"?>',
        XMLDoc = document.implementation.createDocument(null, "", null);

    const setRoot = ((r) => {
        if (!r) return null;

        let { tag, attributes } = ((t) => {
            return typeof t === "string" ? { tag: t, attributes: null } : t;
        })(r);
        let rootEl = XMLDoc.createElement(tag.trim());

        return attributes && typeof attributes !== "undefined"
            ? setElementAttr(rootEl, attributes)
            : rootEl;
    })(root);

    if (setRoot) XMLDoc.appendChild(setRoot);

    return ((doc) => {
        const xmlStr = `${prefix}\n${serializer.serializeToString(doc)}`;
        return parser.parseFromString(xmlStr, "application/xml");
    })(XMLDoc);
}

/**
 * Create an XML elements
 * @param {string | elementItem} details
 * @param {XMLDocument} doc
 * @return {Element}
 */
function createXmlElement(details, doc) {
    let { tag, attributes, value } = ((d) => {
        return typeof d === "string" ? { tag: d, attributes: null, value: null } : d;
    })(details);

    let element = doc.createElement(tag.trim());
    if (value) element.textContent = `${value}`;

    return attributes && typeof attributes !== "undefined"
        ? setElementAttr(element, attributes)
        : element;
}

/**
 * Create and append it to parent
 * If parents are null, then append it to root
 * @param {XMLDocument} xml
 * @param {elementItem | Element | MyArray<elementItem | Element>} items
 * @param {(String | Element)?} parent
 * @returns {XMLDocument}
 */
function addXmlElement(xml, items, parent = null) {
    let el_parent = parent
        ? parent instanceof Element
            ? parent
            : xml.getElementsByTagName(parent)[0]
        : xml.childNodes[0];

    if (Array.isArray(items)) {
        items.forEach((item) => {
            addXmlElement(xml, item, el_parent);
        });
    } else {
        let element = ((e) => {
            if (e instanceof Element) return e;
            return createXmlElement(items, xml);
        })(items);

        el_parent.appendChild(element);
    }
    return xml;
}

export {
    getTagName,
    getOuterXml,
    findChild,
    forEach,
    map,
    createXml,
    createXmlElement,
    addXmlElement,
};
