import MyArray from "./MyArray";

type reportType = "sukses" | "gagal" | "error";
export type ReportSummary = Record<reportType, number>;

class reportData {
    data: MyArray<any>;

    constructor() {
        this.data = new MyArray();
    }
    get count() {
        return this.data.length;
    }
    add(data: any) {
        this.data.push(data);
        return this;
    }
}

export default class Reports {
    static instance: Reports;
    #type: reportType[] = ["sukses", "gagal", "error"];

    sukses: reportData = new reportData();
    gagal: reportData = new reportData();
    error: reportData = new reportData();

    constructor() {}

    getSummary() {
        return this.#type.reduce((summary, type) => {
            summary[type] = this[type].count;
            return summary;
        }, {} as ReportSummary);
    }

    /**
     * Reset report
     */
    reset() {
        for (let type of this.#type) {
            this[type] = new reportData();
        }
        return this;
    }

    /**
     * Create report data for error and failed
     * @param type type report
     * @returns report count with it's detail
     */
    createData(type: "sukses" | "gagal" | "error") {
        return this.hasOwnProperty(type) ? this[type] : new reportData();
    }

    /**
     * Add success record
     * @param {Object} data queue index
     */
    success(data: any) {
        this.sukses.add(data);
    }

    /**
     * add fail record
     * @param i queue index
     * @param err error type
     */
    fail(i: any, err = "error" as "gagal" | "error") {
        this[err].add(i);
    }

    static getOrCreate() {
        if (!Reports.instance) {
            Reports.instance = new Reports();
        }
        return Reports.instance;
    }
}
