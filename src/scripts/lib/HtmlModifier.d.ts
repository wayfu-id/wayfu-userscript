import MyArray from "./../models/MyArray";

type elemenOptions = ElementCreationOptions & {
    tag: keyof HTMLElementTagNameMap,
    text: string,
    html: string,
    classid?: string | string[],
    append?: String | HTMLElement,
    prepend?: String | HTMLElement,
    before?: String | HTMLElement,
    after?: String | HTMLElement,
    replace?: String | HTMLElement,
    event?: DocumentEventMap[],
    callback?: (node:HTMLElement) => any,
}

type listElemenOptions = elemenOptions & {
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

type elementStyles = elemenOptions & CSSStyleDeclaration;

type inputElement = elemenOptions & HTMLInputElement;

class HtmlModifier {
    /** Get HTML element(s) from query selector. */
    getElement(selector: String | HTMLElement): HTMLElement;
    getElement(selector: String | HTMLElement, parent:String | HTMLElement): HTMLElement;
    getElement(selector: String | HTMLElement, getAll: true): NodeList;
    getElement(selector: String | HTMLElement, parent: String | HTMLElement, getAll: true): NodeList;

    /** Get HTML Parent element(s) from query selector. */
    getParents(element: string | HTMLElement, selector: string): HTMLElement[];
    
    /** Create an Elements */
    createElement(props: elemenOptions): HTMLElement;

    /** Create multiple elements inside parents element */
    createElements(options: Array.<elemenOptions>): HtmlModifier;
    createElements(options: Array.<elemenOptions>, parent: elemenOptions | string | HTMLElement): HTMLElement;

    /** Create list element */
    createListElement(items: MyArray<listElemenOptions | string>, type?: "ol" | "ul", props?: elemenOptions): HTMLElement;

    /** Create SVG element */
    createSVGElement(props: elemenOptions): HTMLElement;

    /** Set/Edit single or multiple element style */
    setElementStyle(selector: string | HTMLElement, props: elementStyles): HtmlModifier;

    /** Set/Edit multiple element style */
    setElementsStyle(selector: string, props: elementStyles): HtmlModifier;
    setElementsStyle(selector: { elm: string; props: elementStyles }[]): HtmlModifier;

    /** Set/Edit single or multiple element tag */
    setElement(selector: string | HTMLElement, props: inputElement): HtmlModifier;

    /** Set/Edit multiple element tag */
    setElements(options?: { elm: string; props: inputElement }[]): HtmlModifier;

    /** Check html element is exist or not */
    hasElement(selector: string | HTMLElement, timeout?: number): Promise<HTMLElement | false>;

    /** Insert an element to target element */
    insertElement(selector: string | HTMLElement, parent: string | HTMLElement): HtmlModifier;

    /** Remove an element to target element */
    removeElement(selector: string | HTMLElement, parent: string | HTMLElement): HtmlModifier | HTMLElement;

    /** Add event listener to an element */
    onEvent(selector: string | HTMLElement, type: string, listener: EventListener, bubbles?: boolean): HtmlModifier;

    /** Force doing some event on an elemenet */
    eventFire(selector: string | HTMLElement, type: string, message: string, opt?: EventInit ): HtmlModifier;

    /** Add <style> element at the head */
    addStyle(css: string, props?: elemenOptions): HtmlModifier;
}

export const DOM: HtmlModifier;