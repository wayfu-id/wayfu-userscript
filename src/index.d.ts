import WAPI from "@wayfu/simple-wapi";
import DOM from "@wayfu/wayfu-dom";

declare namespace WayFu {
    type callbackFunction = (stat: boolean) => void;

    interface BaseController<T extends Object> {
        app: WayFu,
        DOM: typeof DOM,
        WAPI: WAPI,
        
        _clone(): BaseController<T>,
        _patch(data?: T): T | void,
        _init(): BaseController<T>,
    }

    export interface InterfaceController extends BaseController<any> {

    }

    export interface UserController extends BaseController<any> {

    }

    export interface MainController extends BaseController<any> {

    }

    /** Custom EventTarget interface */
    interface EventBase extends EventTarget {
        /** Add Listener */
        on(details: {[k: string]: EventListenerOrEventListenerObject}): this;
        on(name: string, callback: EventListenerOrEventListenerObject): this;
        
        /** Fire an Event to this target */
        do(name: string): boolean;
        /** Fire a Custom Event and give the detail data */
        do(name: string, detail: {[k: string]: any}): boolean;
    }

    interface BaseModel {
        app: WayFu,

        /** Set class propreties */
        _setProp(props: typeof Object): this;
        _setProp(props: typeof Object, parse: boolean): this;

        /** Serialize to string */
        _serialize(input: typeof Date | string | number | {}): string;

        /** Get value from Object */
        _find(key: string, depth?: number): any;
        

        /** Parse data into Object. Also parse the value of object items */
        toObject(data: String | Array<any> | typeof Object): {[k:string]: any};
        toObject(data: String | Array<any> | typeof Object, parse: boolean): {[k:string]: any};

        /** Get value from Object */
        findValue(key: string, object: typeof Object | this): any;
        findValue(key: string, object: typeof Object | this, depth: number): any;
    }

    interface ScriptManager extends BaseModel {
        /** Get current app information */
        get appInfo(): { [k: string]: string };
        /** Get current userscript manager name */
        get managerName(): string | undefined;
        /** Get some app informations using keyname */
        getInfo(): Tampermonkey.ScriptInfo;
        getInfo(key?: string): string | { [k: string]: string } | undefined;
        /** Get app resource */
        getResource(key: string, mode: "text" | "url"): string | undefined;
        /** Delete value on local storage */
        deleteValue(name: string): void;
        /** Set and save some value to local storage */
        setValue(props: {[k: string]: any}): void;
        setValue(name: string, value: any): void;
        /** Get value from local storage using it's name as keyword */
        getValue(name: string): any | null;
        getValue<T>(name: string, base: T): any | T;
        /** GM XMLHttpRequest Implementation */
        request(options: Tampermonkey.Request): void;
    }

    export class ScriptManager implements ScriptManager {
        constructor(app: WayFu);
    }

    /** Extended Built-in Array */
    export class MyArray<T extends Object> extends Array<T> {
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

        /** Create an array by spliting a string with a delimiter */
        static split(string: string, delimiter: string): MyArray<String>;
        /**
         * Reconstruct `Array.from` to create new MyArray
         * From `IterableObject`.
         */
        static create<T extends Object>(arrayLike: Iterable<T> | ArrayLike<T>): MyArray<T>;
    }

    /** Extended Built-in Date */
    export class MyDate extends Date {
        /**
         * Add days from the current date.
         * `Creating new MyDate instance`
         */
        addDays(days: number): MyDate;

        /**
        * Add months from the current date.
        * `Creating new MyDate instance`
        */
        addMonths(months: number): MyDate;
    }

    /** Queue Model Class */
    export class Queue {
        currentIndex: number;
        items: MyArray<Object>;
        stock: MyArray<Object>;
        offset: number;
        /** get current empty status */
        get isEmpty(): boolean;
        /** get current queue items */
        get now(): Object;
        /** get current queue size */
        get size(): number;
        /** get first queue size */
        get long(): number;

        /** Set queue data */
        setData(data: MyArray<any>): void;
        /** 
         * Get current queue items, increase it's counter.
         * Decrease it's size when it's counter is more or equal to half of the size
         */
        run(): Object;
        /** Reset queue */
        reset(): void;
        /** Reload queue with last setted data */
        reload(): void;
    }

    export class Worker {
        queue: Queue;
        time: number;
        /** Get Worker is running status */
        get isRunning(): boolean;    
        /** Set looping function for some interval */
        _set(time: number, data: any): void;
        /** Start the worker */
        _start(callback?: callbackFunction): void;
        /** Pause the worker */
        _pause(callback?: callbackFunction): void;
        /** Stop the worker */
        _stop(callback?: callbackFunction): void;
    }
}

declare class WayFu extends WayFu.ScriptManager {
    WAPI: WAPI;
    DOM: typeof DOM;
}

export = WayFu;