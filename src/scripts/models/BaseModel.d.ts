/**
 * Base Model Class
 * @class BaseModel
 * @classdesc Base Model Class
 */

export default class BaseModel {
    setProperties(props: object): BaseModel;

    /** Serialize to string */
    serialize<T extends typeof Date | string | number | {}>(input: T): string;

    /** Parse data into Object. Also parse the value of object items */
    intoObject<T extends typeof Date | string | number>(data: string | Array<T> | T): {[k:string]: T};

    /** Get value from Object */
    findObjectValue<T extends object>(key: string, object?: {} | this, depth?: number | 2): T;
}