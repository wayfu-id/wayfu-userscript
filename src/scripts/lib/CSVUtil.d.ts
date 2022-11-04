import MyArray from "../models/MyArray";

/** Calculate and get month indext on some datestring */
export function monthIndex(date: string[]): 0 | 1 | 2;

/** Scan and determine csv delimiter. Using comma or not. */
export function useComma(text: string): boolean;

/** Check and get the exact RegExp to get csv row value. */
export function rowValue(d?: string, flag?: string): RegExp;

/**
 * Check and get the sign up date based on RegExp pattern.
 * Return as string if any matched.
 * Return as null of no matched.
 */
export function getSignDate(date: string | MyArray<string>): string | null;

/** Get and convert current phone number */
export function setPhone(ph: string | string[] | number): string;

/** Transfrom row data */
export function transformRow(data: MyArray<string>): false | MyArray<string>;