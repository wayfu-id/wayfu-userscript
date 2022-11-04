import MyArray from "./MyArray";

class Reports {
    constructor() {
        this.sukses = 0;
        this.gagal = new MyArray();
        this.error = new MyArray();
    }

    /**
     * Reset report
     */
    reset() {
        this.sukses = 0;
        this.gagal = new MyArray();
        this.error = new MyArray();
    }

    /**
     * Create report data for error and failed
     * @param {"gagal" | "error"} type type report
     * @returns {{count:number, data:MyArray}} report count with it's detail
     */
    createData(type) {
        let data = this[type] || new MyArray();
        return { count: data.length, data: data };
    }

    /**
     * Add success record
     */
    success() {
        this.sukses++;
    }

    /**
     * add fail record
     * @param {Number} i queue index
     * @param {Number} err error type
     */
    fail(i, err = 1) {
        err ? this.error.push(i) : this.gagal.push(i);
    }
}

const report = new Reports();
export { Reports as default, report };
