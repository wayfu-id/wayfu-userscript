/**
 * Extended Built-in Array
 */
export default class MyArray<Data extends any> extends Array {
    constructor(...input: Data[])
    constructor(input: Data[]) {
        super(input.length);
        input.forEach((element, index) => {
            this[index] = element;
        })
    }
    /**
     * Get empty status current array
     */
    get isEmpty() {
        return this.length <= 0;
    }

    /**
     * Get all non epmty array items
     */
    get nonEmptyValue() {
        return this.filter((val) => !!val);
    }

    /**
     * Get first array item
     */
    get first() {
        return !this.isEmpty ? this.at(0) : undefined;
    }

    /**
     * Get last array item
     */
    get last() {
        return !this.isEmpty ? this.at(this.length - 1) : undefined;
    }

    /**
     * Change index order of an items, and return this array.
     * `Carefull: This function will override old array.`
     */
    changeIndex(oldIndex: number, newIndex: number) {
        if (newIndex >= this.length) {
            let i = newIndex - this.length + 1;
            while (i--) {
                this.push(undefined);
            }
        }
        this.splice(newIndex, 0, this.splice(oldIndex, 1)[0]);
        return this;
    }

    /**
     * Count number of a value in current array;
     */
    countValue(val: any): number {
        let count = 0;
        this.forEach((e) => {
            count += e === val ? 1 : 0;
        });
        return count;
    }

    /**
     * Check given value is on this array or not
     */
    isOnArray(item: any) {
        return this.some((elm) => item === elm);
    }

    /**
     * Create an array by spliting a string with a delimiter
     */
    static split(string: string, delimiter: string) {
        let arr = string.split(delimiter);
        return new MyArray(...arr);
    }

    /**
     * Reconstruct `Array.from` to create new MyArray
     * From `IterableObject`.
     */
    static create<Data>(arrayLike: Iterable<Data> | ArrayLike<Data>) {
        return new MyArray(...Array.from(arrayLike));
    }
}
