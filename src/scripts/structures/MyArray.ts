/**
 * Extended Built-in Array
 */
export default class MyArray<T> extends Array<T | undefined> {
    constructor(...items: T[]) {
        super(...items);
        // Object.setPrototypeOf(this, Array.prototype);
        // input.forEach((element, index) => {
        //     this[index] = element;
        // });
    }

    /**
     * Check current array is empty or not
     * @return true if array is empty, false otherwise
     */
    get isEmpty() {
        return this.length <= 0;
    }

    /**
     * Get array with non empty values
     * @return new MyArray instance with non empty values
     */
    get nonEmptyValue() {
        return this.filter((val) => !!val);
    }

    /**
     * Get first array item
     * @return first item or undefined if array is empty
     */
    get first() {
        return !this.isEmpty ? this.at(0) : undefined;
    }

    /**
     * Get last array item
     * @return last item or undefined if array is empty
     */
    get last() {
        return !this.isEmpty ? this.at(this.length - 1) : undefined;
    }

    /**
     * Change index of an item
     * `Modifies current array`
     * @param {number} oldIndex current index of the item
     * @param {number} newIndex new index of the item
     * @return modified current array
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
     * Count occurrences of a value in the array
     * @param val value to count
     * @return number of occurrences
     */
    countValue(val: any): number {
        let count = 0;
        this.forEach((e) => {
            count += e === val ? 1 : 0;
        });
        return count;
    }

    /**
     * Check if an item is in the array
     * @param item item to check
     * @return true if item is in the array, false otherwise
     */
    isOnArray(item: any) {
        return this.some((elm) => item === elm);
    }

    /**
     * Reconstruct `String.split` to create new MyArray
     * From `string`.
     * @param {string} string string to split
     * @param {string} delimiter delimiter to split the string
     * @return new MyArray instance with splitted values
     */
    static split(string: string, delimiter: string) {
        let arr = string.split(delimiter);
        return new MyArray(...arr);
    }

    /**
     * Create MyArray from iterable or array-like object
     * @param {Iterable<Data> | ArrayLike<Data>} arrayLike iterable or array-like object to convert
     * @return new MyArray instance with converted values
     */
    static create<T>(arrayLike: Iterable<T> | ArrayLike<T>) {
        return new MyArray(...Array.from(arrayLike));
    }
}
