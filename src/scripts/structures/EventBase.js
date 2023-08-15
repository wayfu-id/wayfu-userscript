/**
 * Custom EventTarget class
 * @class EventBase
 * @classdesc Custom EventTarget Class
 */
export default class EventBase extends EventTarget {
    constructor() {
        super();
    }

    /**
     * Add Listener
     * @overload
     * @param {{[k: string]: EventListenerOrEventListenerObject}} details
     * @returns {this}
     */ /**
     * Add Listener
     * @overload
     * @param {string} name
     * @param {EventListenerOrEventListenerObject} callback
     * @returns {this}
     */
    on(name, callback) {
        if (typeof name === "object") {
            for (let key in name) {
                this.addEventListener(key, name[key]);
            }

            return this;
        }

        this.addEventListener(name, callback);
        return this;
    }

    /**
     * Fire an Event to this target
     * @overload
     * @param {string} name Event name
     * @returns {boolean}
     */ /**
     * Fire a Custom Event and give the detail data
     * @param {string} name Event name
     * @param {{[k: string]: any}} detail detail data for custom event
     * @returns {boolean}
     */
    do(name, detail = false) {
        return this.dispatchEvent(
            detail ? new CustomEvent(name, { detail: detail }) : new Event(name)
        );
    }
}
