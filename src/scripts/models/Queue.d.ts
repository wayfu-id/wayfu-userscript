import MyArray from "./MyArray";

/**
 * Queue Model Class
 * @class {Queue}
 * @classdesc Easy way to make Queue
 */
export default class Queue {
    currentIndex: number;
    queue: MyArray<Object>;
    stock: MyArray<Object>;
    offset: number;

    /** get current empty status */
    get isEmpty(): boolean;

    /** get current queue items */
    get now(): Object;

    /** get current queue size */
    get size(): number;

    /** get first queue size */
    get long(): number;

    /** Set queue data */
    setData(data: MyArray<any>): void;

    /** 
     * Get current queue items, increase it's counter.
     * Decrease it's size when it's counter is more or equal to half of the size
     */
    run(): Object;

    /** Reset queue */
    reset(): void;

    /** Reload queue with last setted data */
    reload(): void;
}
export const queue: Queue;