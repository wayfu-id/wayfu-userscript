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
     * @param {number} t interval uint | miliseconds
     * @param {Function} fn function to loop
     */
    set(t, fn) {
        this.time = t;
        this.fn = fn;
    }

    /**
     * Start the interval interval
     * @param {Function} callback will be execute when interval started
     */
    start(callback = null) {
        if (!this.isRunning) {
            this.timer = setInterval(this.fn, this.time);
            if (!!callback && typeof callback === "function") {
                callback(true);
            }
        }
    }

    /**
     * Break the interval
     * @param {Function} callback will be execute when interval broke
     */
    break(callback = null) {
        if (this.isRunning) {
            clearInterval(this.timer);
            this.timer = false;
            if (!!callback && typeof callback === "function") {
                callback(false);
            }
        }
    }

    /**
     * Stop the interval
     * @param {Function} callback will be execute when interval stoped
     */
    stop(callback = null) {
        this.fn = null;
        this.time = null;
        this.break(callback);
    }
}
const loop = new Interval();
export { Interval as default, loop };
