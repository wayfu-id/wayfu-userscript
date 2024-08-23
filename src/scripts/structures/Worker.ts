type callbackFunction = (stat: boolean) => any;

export default class Worker {
    timer: number | undefined;
    time: number;
    fn: TimerHandler;

    constructor() {
        this.time = 0;
        this.fn = "";
    }

    /**
     * Get is running interval status
     */
    get isRunning() {
        return !!this.timer;
    }

    /**
     * Set looping function for some interval
     * @param {number} t interval uint | miliseconds
     * @param {Function} fn function to loop
     */
    set(t: number, fn: Function) {
        this.time = t;
        this.fn = fn;
    }

    /**
     * Start the interval interval
     */
    start(): void;
    /**
     * Start the interval interval
     * @param {callbackFunction} callback will be execute when interval started
     */
    start(callback: callbackFunction): void;
    start(callback?: callbackFunction): void {
        if (!this.isRunning) {
            this.timer = setInterval(this.fn, this.time);
        }
        if (!!callback && typeof callback === "function") {
            callback(true);
        }
    }

    /**
     * Break the interval
     */
    break(): void;
    /**
     * Break the interval
     * @param {callbackFunction} callback will be execute when interval broke
     */
    break(callback: callbackFunction): void;
    break(callback?: callbackFunction): void {
        if (this.isRunning) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
        if (!!callback && typeof callback === "function") {
            callback(false);
        }
    }

    /**
     * Stop the interval
     */
    stop(): void;
    /**
     * Stop the interval
     * @param {callbackFunction} callback will be execute when interval stoped
     */
    stop(callback: callbackFunction): void;
    stop(callback?: callbackFunction): void {
        this.fn = "";
        this.time = 0;
        return callback ? this.break(callback) : this.break();
    }
}
