/**
 * @typedef {import("../../index")} WayFu
 */

export default class BaseController {
    /**
     * Base controller
     * @param {WayFu} app
     */
    constructor(app) {
        /** @type {WayFu} */
        this.app = app;
        this.WAPI = app.WAPI;
        this.DOM = app.DOM;
    }

    _clone() {
        return Object.assign(Object.create(this), this);
    }

    _patch(data) {
        return data;
    }

    _init() {
        return this;
    }
}
