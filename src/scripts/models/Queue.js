import MyArray from "./MyArray";

class Queue {
    constructor() {
        this.currentIndex = 0;
        this.queue = new MyArray();
        this.stock = new MyArray();
        this.offset = 0;
    }

    /**
     * get current empty status
     */
    get isEmpty() {
        return this.queue.isEmpty;
    }

    /**
     * get current queue items
     */
    get now() {
        return !this.queue.isEmpty ? this.queue[this.offset] : undefined;
    }

    /**
     * get current queue size
     */
    get size() {
        return this.queue.length - this.offset;
    }

    /**
     * get first queue size
     */
    get long() {
        return this.stock.length;
    }

    /**
     * set queue data
     * @param {MyArray} data
     */
    setData(data) {
        this.queue = data;
        this.stock = data;
    }

    /**
     * Get current queue items, increase it's counter.
     * Decrease it's size when it's counter is more or equal to half of the size
     * @returns {any} current queue items
     */
    run() {
        if (this.queue.isEmpty) return undefined;
        let item = this.queue[this.offset];
        if (++this.offset * 2 >= this.queue.length) {
            this.queue = this.queue.slice(this.offset);
            this.offset = 0;
        }
        return item;
    }

    /**
     * reset queue
     */
    reset() {
        this.queue = new MyArray();
        this.stock = new MyArray();
        this.offset = 0;
        this.currentIndex = 0;
    }

    /**
     * reload queue with last setted data
     */
    reload() {
        this.queue = this.stock;
        this.currentIndex = 0;
        this.offset = 0;
    }
}

const queue = new Queue();
export { Queue as default, queue };
