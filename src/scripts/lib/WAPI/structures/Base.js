/**
 * @typedef {import("../index").WAPI} WAPI
 */

/**
 * Represents a WhatsApp data structure
 */
export default class Base {
    /**
     * @param {WAPI} app
     */
    constructor(app) {
        /**
         * The main app that instantiated this
         * @readonly
         */
        this.app = app;
        // Object.defineProperty(this, "app", { value: app });
    }

    _clone() {
        return Object.assign(Object.create(this), this);
    }

    _patch(data) {
        return data;
    }
}
