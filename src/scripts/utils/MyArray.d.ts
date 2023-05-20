/**
 * Extended Built-in Array
 * @class MyArray
 * @classdesc An custom array extends built in array
 * @augments {Array}
 */
export default class MyArray<T extends Object> extends Array<T> {
    
    /** Create an array by spliting a string with a delimiter */
    static split(string: string, delimiter: string): MyArray<String>;

    static create<T extends Object>(arrayLike: Iterable<T> | ArrayLike<T>): MyArray<T>;


    constructor(arrayLength?: number);
    constructor(arrayLength: number);
    constructor(...items: T[]);

    /** Get empty status current array */
    get isEmpty(): boolean;

    /** Get all non epmty array items */
    get nonEmptyValue(): MyArray<T>;

    /** Get first array item */
    get first(): T | undefined;

    /** Get last array item */
    get last(): T | undefined;

    /**
     * Change index order of an items, and return this array.
     * `Carefull: This function will override old array.`
     */
    changeIndex(oldIndex: number, newIndex: number): MyArray<T>;

    
    /** Count number of a value in current array */
    countValue(val: any): number;

    /** Check given value is on this array or not */
    isOnArray(item: any): boolean;
}