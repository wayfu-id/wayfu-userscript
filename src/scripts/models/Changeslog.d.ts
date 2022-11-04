import GM_Library from "./GM_Library";
import MyArray from "./MyArray";

export default class Changelog extends GM_Library {
    details: MyArray<any>;
    get getChanges(): Promise<false | any[]>;
    get Log(): MyArray<any>;
    doUpdate(data: any): Promise<void>;
    checkUpdate(): Promise<Changelog>;
    save(): void;
}
export const changes: Changelog;