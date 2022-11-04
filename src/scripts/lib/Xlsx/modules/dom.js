import MyArray from "../../../models/MyArray";
/**
 * @typedef {{(node: Element, i?:number) => void}} domCb
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

export { getTagName, getOuterXml, findChild, forEach, map };
