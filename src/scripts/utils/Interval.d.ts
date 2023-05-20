type callbackFunction = (stat: boolean) => unknown;

export default class Interval {
    timer: boolean;
    time: number;
    fn: Function;

    /** Get is running interval status */
    get isRunning(): boolean;

    /** Set looping function for some interval */
    set(interval: number, todo: Function): void;

    /** Start the interval interval */
    start(callback?: callbackFunction): void;

    /** Break the interval */
    break(callback?: callbackFunction): void;


    /** Stop the interval */
    stop(callback?: callbackFunction): void;
}
export const loop: Interval;