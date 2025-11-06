type callbackFunction = (stat: boolean) => any;

/**
 * Worker class to handle interval functions
 */
export default class Worker {
    private static instance: Worker;

    timer: number | undefined;
    time: number;
    fn: TimerHandler;

    private constructor() {
        this.time = 0;
        this.fn = "";
    }

    /**
     * Get current running status
     */
    get isRunning() {
        return !!this.timer;
    }

    /**
     * Set interval time and function
     * @param {number} t time in milliseconds
     * @param {Function} fn function to be executed
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
     * Start the interval
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
     * @param {callbackFunction} callback will be execute when interval breaked
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

    static getOrCreate() {
        if (!Worker.instance) {
            Worker.instance = new Worker();
        }
        return Worker.instance;
    }
}
