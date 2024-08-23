/**
 * Custom EventTarget class
 */
export default class EventBase extends EventTarget {
    constructor() {
        super();
    }

    /**
     * Add Listener
     */
    on(name: {[k: string]: EventListenerOrEventListenerObject}): this;
    on(name: string, callback: EventListenerOrEventListenerObject): this;
    on(name: string | {[k: string]: EventListenerOrEventListenerObject}, callback?: EventListenerOrEventListenerObject): this {
        if (typeof name !== "string") {
            for (let key in name) {
                this.addEventListener(key, name[key]);
            }

            return this;
        }
        
        let cbFunction: EventListenerOrEventListenerObject = callback ? callback : (e: Event) => {console.log(e)}
        this.addEventListener(name, cbFunction);

        return this;
    };

    /**
     * Fire an Event or a Custom Event and give the detail data
     * @param {string} name Event name
     * @param {{[k: string]: any}} detail detail data for custom event
     */
    do(name: string): boolean;
    do(name: string, detail: {[k: string]: any}): boolean;    
    do(name: string, detail?:{[k: string]: any}): boolean {
        return this.dispatchEvent(
            detail ? new CustomEvent(name, { detail: detail }) : new Event(name)
        );
    }
}
