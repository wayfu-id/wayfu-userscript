/**
 * Custom EventTarget class
 * @class EventBase
 * @classdesc Custom EventTarget Class
 */
export default class EventBase extends EventTarget {
    constructor();

    /** Add Listener */
    on(details: {[k: string]: EventListenerOrEventListenerObject}): this;
    on(name: string, callback: EventListenerOrEventListenerObject): this;
    
    /** Fire an Event to this target */
    do(name: string): boolean;
    /** Fire a Custom Event and give the detail data */
    do(name: string, detail: {[k: string]: any}): boolean;
}