/**
 * Extended Built-in Array
 * @class MyArray
 * @classdesc An custom array extends built in array
 * @augments {Array}
 */
export default class MyArray extends Array {
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
     * @param {number} oldIndex
     * @param {number} newIndex
     * @returns
     */
    changeIndex(oldIndex, newIndex) {
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
     * @param {any} val
     * @returns {number}
     */
    countValue(val) {
        let count = 0;
        this.forEach((e) => {
            count += e === val ? 1 : 0;
        });
        return count;
    }

    /**
     * Check given value is on this array or not
     * @param {any} item
     * @returns {boolean}
     */
    isOnArray(item) {
        return this.some((elm) => item === elm);
    }

    /**
     * Create an array by spliting a string with a delimiter
     * @param {String} string
     * @param {String} delimiter
     * @returns {MyArray}
     */
    static split(string, delimiter) {
        let arr = string.split(delimiter);
        return new MyArray(...arr);
    }

    /**
     * Reconstruct `Array.from` to create new MyArray
     * From `IterableObject`.
     * @param {Iterable<any> | ArrayLike<any>} arrayLike
     * @returns {MyArray}
     */
    static create(arrayLike) {
        return new MyArray(...Array.from(arrayLike));
    }
}
