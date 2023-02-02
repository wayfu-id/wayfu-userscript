import MyArray from "./MyArray";

type reportData = {
    data: MyArray<Object>;
    count: number;
    add(data: any): reportData;
}

export default class Reports {
    sukses: reportData;
    gagal: reportData;
    error: reportData;

    /** Reset report */
    reset(): void;

    /** Create report data for error and failed */
    createData(type: "sukses" | "gagal" | "error"): reportData;

    /** Add success record */
    success(i: Object): void;

    /** Add fail record */
    fail(i: Object, err?: number): void;
}
export const report: Reports;