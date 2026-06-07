import { rgx } from "../config";

export type StepFn = () => Promise<boolean>;

export default class Worker {
    private static instance: Worker;

    private _running: boolean = false;
    private _stopping: boolean = false;

    private constructor() {}

    get isRunning() {
        return this._running;
    }

    // random delay between min and max milliseconds
    private delay(minMs: number, maxMs: number): Promise<void> {
        const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // run a sequence of steps with delays between them
    async runSequence(steps: StepFn[]): Promise<void> {
        for (const step of steps) {
            if (this._stopping) break;
            const ok = await step();
            if (!ok) break; // stop remaining steps for this recipient
            // small delay between steps within one recipient
            await this.delay(300, 800);
        }
    }

    // run the full blast loop
    async start(
        getNext: () => any | undefined,
        onEach: (item: any) => StepFn[],
        onDone: () => void,
        onProgress: (index: number, phone: string) => void,
    ): Promise<void> {
        this._running = true;
        this._stopping = false;

        const validPhone = (val: string) => rgx.phonePattern.test(val);

        let index = 0,
            phoneIndex = 2;

        while (!this._stopping) {
            const item = getNext();

            // queue exhausted
            if (!item) break;
            if (!item[phoneIndex] || !validPhone(item[phoneIndex])) {
                phoneIndex = 1;
            }

            index++;
            const steps = onEach(item);
            onProgress(index, item[phoneIndex]); // phone at the current index

            await this.runSequence(steps);

            // random delay between recipients — 7s to 15s
            if (!this._stopping) {
                await this.delay(7000, 15000);
            }
        }

        this._running = false;
        this._stopping = false;
        onDone();
    }

    stop() {
        this._stopping = true;
    }

    static getOrCreate() {
        if (!Worker.instance) Worker.instance = new Worker();
        return Worker.instance;
    }
}

// type callbackFunction = (stat: boolean) => any;

// /**
//  * Worker class to handle interval functions
//  */
// export default class Worker {
//     private static instance: Worker;

//     timer: number | undefined;
//     time: number;
//     fn: TimerHandler;

//     private constructor() {
//         this.time = 0;
//         this.fn = "";
//     }

//     /**
//      * Get current running status
//      */
//     get isRunning() {
//         return !!this.timer;
//     }

//     /**
//      * Set interval time and function
//      * @param {number} t time in milliseconds
//      * @param {Function} fn function to be executed
//      */
//     set(t: number, fn: Function) {
//         this.time = t;
//         this.fn = fn;
//     }

//     /**
//      * Start the interval interval
//      */
//     start(): void;
//     /**
//      * Start the interval
//      * @param {callbackFunction} callback will be execute when interval started
//      */
//     start(callback: callbackFunction): void;
//     start(callback?: callbackFunction): void {
//         if (!this.isRunning) {
//             this.timer = setInterval(this.fn, this.time);
//         }
//         if (!!callback && typeof callback === "function") {
//             callback(true);
//         }
//     }

//     /**
//      * Break the interval
//      */
//     break(): void;
//     /**
//      * Break the interval
//      * @param {callbackFunction} callback will be execute when interval breaked
//      */
//     break(callback: callbackFunction): void;
//     break(callback?: callbackFunction): void {
//         if (this.isRunning) {
//             clearInterval(this.timer);
//             this.timer = undefined;
//         }
//         if (!!callback && typeof callback === "function") {
//             callback(false);
//         }
//     }

//     /**
//      * Stop the interval
//      */
//     stop(): void;
//     /**
//      * Stop the interval
//      * @param {callbackFunction} callback will be execute when interval stoped
//      */
//     stop(callback: callbackFunction): void;
//     stop(callback?: callbackFunction): void {
//         this.fn = "";
//         this.time = 0;
//         return callback ? this.break(callback) : this.break();
//     }

//     static getOrCreate() {
//         if (!Worker.instance) {
//             Worker.instance = new Worker();
//         }
//         return Worker.instance;
//     }
// }
