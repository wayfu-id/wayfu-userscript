import MyArray from './MyArray';

type elemenOptions = ElementCreationOptions & {
    tag: keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap,
    namespace?: string,
    text: string,
    html: string,
    class: string,
    classid?: string | string[],
    append?: String | HTMLElement,
    prepend?: String | HTMLElement,
    before?: String | HTMLElement,
    after?: String | HTMLElement,
    replace?: String | HTMLElement,
    event?: DocumentEventMap[],
    callback?: (node:HTMLElement) => any,
}

type listElementOptions = elemenOptions & {
    title: string,
    content: string | MyArray<string>,
}

type svgElementOptions = elemenOptions & {
    d: string | string[],
    dPath: string | string[],
    size?: string,
    fill?: string,
    viewBox?: string
}

type svgElementDetails = {
    type: keyof SVGElementTagNameMap,
    data: SVGElement
};

type kindOfNode = HTMLElement | Document | Window;

type elementStyles = CSSStyleDeclaration | { elm : kindOfNode | String, props: CSSStyleDeclaration }[];

export default class DOM extends MyArray<HTMLElement> {
    constructor(query: elemenOptions, create: true): DOM;
    constructor(query: kindOfNode | String | NodeList): DOM;
    constructor(query: DOM): DOM;
    constructor(): DOM;

    /** Get current element childNodes */
    get childNodes(): NodeListOf<ChildNode> | undefined;
    
    /** Get current element parent */
    get parent(): ParentNode | undefined;

    /** Get current next sibling element */
    get nextSibling(): ChildNode | undefined;

    /** Get current element classList*/
    get classList(): DOMTokenList | undefined;

    /**
     * Create new HTMLElement(s) and
     * Collect it into DOM Object
     */
    create(props?: elemenOptions | elemenOptions[]): this;
    
    /**
     * Get some HTMLElement(s) and
     * Collect it into DOM Object
     */
    get(query?: String | kindOfNode | NodeList | DOM): this;

    /** Is current element matches with given query? */
    mathces(query: String | kindOfNode): Boolean;

    /**
     * Get some HTMLElement(s) that are parent for current element
     * and Collect it into DOM Object
     */
    getParents(query?: String | kindOfNode | DOM): DOM;

    /** Set single properties. Can be attributes or stylesheet */
    set(key: String | {[k:String]: String | Number | Boolean}): this;
    set(key: String, value: String | Number | Boolean): this;

    /** Set a bunch of propertes. Can be attributes or stylesheet */
    // sets(props: {[k:String]: String | Number | Boolean}): this;

    /** Remove current element or an element from current element */
    remove(query?: String | kindOfNode | DOM): this;

    /** Insert an element into current element */
    insert(element?: String | kindOfNode | DOM): this;

    /** Insert current element into target element */
    insertTo(target?: String | kindOfNode | DOM): this;
    
    /** Insert current element into first child of target element */
    insertBefore(target?: String | kindOfNode | DOM, prepend?: boolean | false): this;
    
    /** Insert current element after target element */
    insertAfter(target?: String | kindOfNode | DOM): this;

    /** Replace target element with current element */
    replace(target?: String | kindOfNode | DOM): this;

    /**
     * Actual method for creating Element(s)
     * and Collect it into DOM Object
     */
    createElement(props: elemenOptions | svgElemenOptions): this;

    /**
     * Actual method for geting Element(s)
     * and Collect it into DOM Object
     */
    getElement(query: String): this;

    /** Set properties for current HTML Element */
    setProperties(props: elemenOptions): this;

    /** Set Element(s) styles. Can process multiple element */
    setStyles(styles: elementStyles): DOM;

    /** Add event listener to an element */
    onEvent(type: String, listener: EventListener, bubbles?: boolean): this;

    /** Static method for creating new DOM instance with new Element(s) */
    static create(tag: String, opt: elemenOptions): DOM;
    static create(prop: elemenOptions, opt?: elemenOptions): DOM;
    static create(props: elemenOptions[], opt?: elemenOptions): DOM;

    /** Static method for creating new DOM instance with new ListElement */
    static createList(items: MyArray<listElementOptions|String>, type: "ol" | "ul", opt?: elemenOptions): DOM;

    /** Static method for creating new DOM instance with new svg element */
    static createIcon(shape: svgElementDetails | Array.<svgElementDetails>, attr?: SVGSVGElement): DOM;
    
    /** Static method for creating new DOM instance with matched Element(s) */
    static get(query: String | kindOfNode | NodeList | DOM): DOM;
    
    /** Static method for checking for existing Element */
    static async has(query: String | HTMLElement | kindOfNode, timeout?: Number): Promise<HTMLElement | false>;
    
    /** Static method for creating and inserting new stylesheet into active page */
    static addStyle(css: String, opt?: elemenOptions): DOM;
}