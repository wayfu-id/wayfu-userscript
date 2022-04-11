/**
 * Extended Built-in Array
 */
export default class MyArray extends Array {
    /**
     * Get array isEmpty status
     */
    get isEmpty() {
        return this.length <= 0;
    }

    /**
     * Change the index of an array item.
     * Will modify and override current array
     * @param {number} oldIndex Old or current array index
     * @param {number} newIndex New or target index
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
     * Count a value inside the array
     * @param {any} val value that want to count in array
     * @returns
     */
    countValue(val) {
        let count = 0;
        this.forEach((e) => {
            count += e === val ? 1 : 0;
        });
        return count;
    }

    /**
     * Check one item is on this array or not.
     * @param {any} item
     * @returns {boolean}
     */
    isOnArray(item) {
        return this.some((elm) => item === elm);
    }

    /**
     * Create array by spliting from string
     * @param {string} string string
     * @param {string} delimiter delimiter
     * @returns
     */
    static split(string, delimiter) {
        let arr = string.split(delimiter);
        return new MyArray(...arr);
    }
}
