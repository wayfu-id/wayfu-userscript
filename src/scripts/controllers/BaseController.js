export default class BaseController {
    /**
     * Base controller
     * @param {import("../../index").default} app
     */
    constructor(app) {
        /** @type {import("../../index").default} */
        this.app = app;
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
