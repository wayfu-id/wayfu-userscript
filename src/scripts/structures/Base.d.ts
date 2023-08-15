import EventBase from "./EventBase";

export default class Base extends EventBase{
    constructor();

    /** Set class propreties */
    setProperties(props: typeof Object): this;
    setProperties(props: typeof Object, parse: boolean): this;

    /** Serialize to string */
    serialize(input: typeof Date | string | number | {}): string;

    /** Parse data into Object. Also parse the value of object items */
    intoObject(data: String | Array | typeof Object): {[k:string]: any};
    intoObject(data: String | Array | typeof Object, parse: boolean): {[k:string]: any};

    /** Get value from Object */
    findObjectValue(key: string, object: typeof Object | this): any;
    findObjectValue(key: string, object: typeof Object | this, depth: number): any;
}