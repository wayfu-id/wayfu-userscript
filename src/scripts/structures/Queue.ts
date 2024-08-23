import { MyArray } from ".";

export default class Queue {
    currentIndex: number;
    items: MyArray<any>;
    stock: MyArray<any>;
    offset: number;

    constructor() {
        this.currentIndex = 0;
        this.items = new MyArray();
        this.stock = new MyArray();
        this.offset = 0;
    }

    /**
     * get current empty status
     */
    get isEmpty() {
        return this.items.isEmpty;
    }

    /**
     * get current queue items
     */
    get now() {
        return !this.items.isEmpty ? this.items[this.offset] : undefined;
    }

    /**
     * get current queue size
     */
    get size() {
        return this.items.length - this.offset;
    }

    /**
     * get first queue size
     */
    get long() {
        return this.stock.length;
    }

    /**
     * Set queue data
     */
    setData(data: MyArray<any>) {
        this.items = data;
        this.stock = data;
    }

    /**
     * Get current queue items, increase it's counter.
     * Decrease it's size when it's counter is more or equal to half of the size
     */
    next() {
        if (this.items.isEmpty) return undefined;
        let item = this.items[this.offset];
        if (++this.offset * 2 >= this.items.length) {
            this.items = this.items.slice(this.offset) as MyArray<any>;
            this.offset = 0;
        }
        return item;
    }

    /**
     * Reset queue
     */
    reset() {
        this.items = new MyArray();
        this.stock = new MyArray();
        this.offset = 0;
        this.currentIndex = 0;
    }

    /**
     * Reload queue with last setted data
     */
    reload() {
        this.items = this.stock;
        this.currentIndex = 0;
        this.offset = 0;
    }

    *[Symbol.iterator]() {
        yield* [...this.items];
    }
}
