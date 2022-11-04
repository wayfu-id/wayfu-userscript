import MyArray from "./MyArray";
import {baseOptions} from "./../lib/Xlsx/modules/parser";

type fileName = {
    fname: string[];
    ftype: string;
    numb: number;
    ext: string;
}

type csvOptions = {
    monthIndex: 0 | 1 | 2;
    splitter: string
}

type fileOutputInfo = {
    fileUrl: string;
    fileName: string;
}

export default class CSVFile {
    /** Create a csv file from array data */
    static createFile(name: string, data: MyArray<any> | any[], splitter?: string | null): fileOutputInfo;

    types: MyArray<string>;
    fileName: fileName;
    options: csvOptions;
    data: Object[] | MyArray<Object>;

    /** Read CSV or TXT CSV formated file */
    import(file: File): Promise<CSVFile>;

    /** Construct current CSV filename */
    constructFileName(filename: string): void;

    /** Load file from text based filetype (csv/xls) */
    readData(data: string | ArrayBuffer): Promise<CSVFile>;

    /** Handle excel file and return it as Array of rows */
    handleExcel(file: ArrayBuffer, options?: baseOptions | null): Promise<any[]>;

    /** Just Convert csv data into custom Array. */
    toArray(text: string, delimiter?: string): MyArray<string>;

    /** Export array to CSV File based on current file */
    export(type: string, data: any[] | MyArray<any>): fileOutputInfo;
}
export const csvFile: CSVFile;