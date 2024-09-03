import MyDate from "./../models/MyDate";

/** Conver string to Title Case */
export function titleCase(string: string): string;

/** Check and detect the string is numeric or not */
export function isNumeric(str: string): boolean;

/** Check and detect the string is datestring or not */
export function isDateStr(str: string): boolean;

/**
 * Check and detect the string is JSON valid or not.
 * If it's valid, then return it's JSON value.
 * If it isn't valid, then return it as null. */
export function JSONParse(str: string): Promise<JSON | null>;

/** Parse any value from any type of data */
export function parseValue(val: string): number | MyDate | string;
export function parseValue<T extends Object>(val: T): T;

/** Check current app version is up to date or not. */
export function isUpToDate(local: string, remote: string): boolean;

/** Get Name or Full Name and change it to Title Case */
export function setName(str: string, full?: boolean): string;

/** Set and print date based on toLocaleDateString format */
export function dateFormat(value: string | number | Date, printDays?: boolean): string;

export function check(header: any[]): (buffer: Uint8Array, offset?: number) => boolean;

export function getPDFPageThumb(file: File): Promise<string>;

export function readBuffer(file: File, start?: number, end?: number): Promise<ArrayBuffer>;

export function stringToBytes(string: string): any[];

/** Create an Object from Filtered Object */
export function createFilteredObject<T extends Object>(
    obj: ObjectConstructor,
    filter: T | T[],
    type?: "key" | "val"
): { [k: string]: T };
