import MyArray from "./MyArray";

class reportData {
    constructor() {
        this.data = new MyArray();
    }
    get count() {
        return this.data.length;
    }
    add(data) {
        this.data.push(data);
        return this;
    }
}

class Reports {
    constructor() {
        this.sukses = new reportData();
        this.gagal = new reportData();
        this.error = new reportData();
    }

    /**
     * Reset report
     */
    reset() {
        for (let type in this) {
            this[type] = new reportData();
        }
        return this;
    }

    /**
     * Create report data for error and failed
     * @param {"sukses" | "gagal" | "error"} type type report
     * @returns {reportData} report count with it's detail
     */
    createData(type) {
        return this.hasOwnProperty(type) ? this[type] : new reportData();
    }

    /**
     * Add success record
     * @param {Object} data queue index
     */
    success(data) {
        this.sukses.add(data);
    }

    /**
     * add fail record
     * @param {Object} i queue index
     * @param {Number} err error type
     */
    fail(i, err = 1) {
        err ? this.error.add(i) : this.gagal.add(i);
    }
}

const report = new Reports();
export { Reports as default, report };
