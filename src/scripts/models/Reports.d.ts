import MyArray from "./MyArray";

export default class Reports {
    sukses: number;
    gagal: MyArray<Object>;
    error: MyArray<Object>;

    /** Reset report */
    reset(): void;

    /** Create report data for error and failed */
    createData(type: "gagal" | "error"): { count: number; data: MyArray<any> };

    /** Add success record */
    success(): void;

    /** Add fail record */
    fail(i: number, err?: number): void;
}
export const report: Reports;