/**
 * @typedef {{ (stat: boolean) => unknown }} callbackFunction
 */

class Interval {
    constructor() {
        this.timer = false;
        this.time = null;
        this.fn = null;
    }

    /**
     * Get is running interval status
     */
    get isRunning() {
        return this.timer !== false;
    }

    /**
     * Set looping function for some interval
     * @param {number} inverval interval uint | miliseconds
     * @param {Function} todo function to loop
     */
    set(inverval, todo) {
        this.time = inverval;
        this.fn = todo;
    }

    /**
     * Start the interval interval
     * @param {callbackFunction} callback will be execute when interval started
     */
    start(callback = null) {
        if (!this.isRunning) {
            this.timer = setInterval(this.fn, this.time);
        }
        if (!!callback && typeof callback === "function") {
            callback(true);
        }
    }

    /**
     * Break the interval
     * @param {callbackFunction} callback will be execute when interval broke
     */
    break(callback = null) {
        if (this.isRunning) {
            clearInterval(this.timer);
            this.timer = false;
        }
        if (!!callback && typeof callback === "function") {
            callback(false);
        }
    }

    /**
     * Stop the interval
     * @param {callbackFunction} callback will be execute when interval stoped
     */
    stop(callback = null) {
        this.fn = null;
        this.time = null;
        this.break(callback);
    }
}
const Loop = new Interval();
export { Interval as default, Loop };
