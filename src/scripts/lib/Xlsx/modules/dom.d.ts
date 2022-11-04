import MyArray from "../../../models/MyArray";

type domCb = (node: Element, i?:number)=> void;

/**
 * Get children(s) of an element by given `tagName`
 */
export function findChild(node: Element, tagName: string): Element;
export function findChild(node: Element, tagName: string, all: true): MyArray<Element>;

/**
 * Get Element Tag Name
 */
export function getTagName(element: Element): string;

/**
 * Get outer XML content
 */
export function getOuterXml(node: Element): string;

/**
 * Do given function on every childrens by given `tagName`
 */
export function forEach(node: Element, tagName: string, func: domCb): void;

/**
 * Get Array of returned function 
 */
export function map(node: Element, tagName: string, func: domCb): MyArray<any>;