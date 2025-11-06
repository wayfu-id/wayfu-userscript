import MyArray from "./MyArray";

/**
 * A simple Queue class with stock and reload feature
 */
export default class Queue {
    private static instance: Queue;

    currentIndex: number;
    items: MyArray<any>;
    stock: MyArray<any>;
    offset: number;

    private constructor() {
        this.currentIndex = 0;
        this.items = new MyArray();
        this.stock = new MyArray();
        this.offset = 0;
    }

    /**
     * Check if current queue is empty
     * @returns boolean
     */
    get isEmpty() {
        return this.items.isEmpty;
    }

    /**
     * get current queue item without increasing it's counter
     * @return current item or undefined if empty
     */
    get now() {
        return !this.items.isEmpty ? this.items[this.offset] : undefined;
    }

    /**
     * get current queue size
     * @returns number
     */
    get size() {
        return this.items.length - this.offset;
    }

    /**
     * get current queue long (total items)
     * @returns number
     */
    get long() {
        return this.stock.length;
    }

    /**
     * Set data to current queue, and stock it for later use
     * @param data MyArray<any>
     */
    setData(data: MyArray<any>) {
        this.items = data;
        this.stock = data;
    }

    /**
     * Get next item in queue, and increase it's counter
     * @returns next item or undefined if empty
     */
    next() {
        if (this.items.isEmpty) return undefined;
        let item = this.items[this.offset];
        if (++this.offset * 2 >= this.items.length) {
            this.items = MyArray.create(this.items.slice(this.offset));
            this.offset = 0;
        }
        return item;
    }

    /**
     * Reset queue to empty state
     */
    reset() {
        this.items = new MyArray();
        this.stock = new MyArray();
        this.offset = 0;
        this.currentIndex = 0;
    }

    /**
     * Reload queue from stock, and reset counter
     */
    reload() {
        this.items = this.stock;
        this.currentIndex = 0;
        this.offset = 0;
    }

    static getOrCreate() {
        if (!Queue.instance) {
            Queue.instance = new Queue();
        }
        return Queue.instance;
    }

    [Symbol.iterator]() {
        return this.next();
    }
}
