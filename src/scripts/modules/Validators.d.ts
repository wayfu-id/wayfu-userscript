import MyArray from "./../models/MyArray";
import BaseModel from "./../models/BaseModel";

interface storeValidate {
    [k: string]: {
        rules: string[],
    }
}

export default class Validators extends BaseModel {
    errors: {};

    /** Get error list (if any) or return null */
    get errorList(): MyArray<Object>;

    /** Validate current data and it rules */
    validate(data: storeValidate): boolean;

    /** Validating for not empty value */
    notEmpty(key: string): boolean;

    /** Validating for under value */
    belowMax(key: string): boolean;

    /** Get error message */
    error(key: string): any;

    /** Display error list (if any) inside modal */
    showError(): void;
}
export const validator: Validators;