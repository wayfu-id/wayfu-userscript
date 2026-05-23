import MyDate from "./MyDate";
import MyArray from "./MyArray";
import BaseModel from "./BaseModel";

export type UserData = ObjectConstructor & {
    name: string | number;
    phone: string;
    type: "oriflame" | "umum";
    attempt?: number;
    reg?: string;
    mon?: number;
    end?: MyDate | null;
    expires?: MyDate | null;
} & { [k: string | number]: any };

type Subscription = {
    isPremium: boolean;
    isTrial: boolean;
};

export default class Client extends BaseModel {
    private static instance: Client;
    private _profile?: WAPI.Contact;

    key: "wayfu-user";
    UserData?: UserData = undefined;
    Subscription: Subscription = {
        isPremium: false,
        isTrial: false,
    };

    private constructor() {
        super();
        this.key = "wayfu-user";
    }

    setProfile(value: WAPI.Contact) {
        this._profile = value;
    }

    get Profile() {
        return this._profile;
    }

    setSubscription({ isPremium, isTrial }: Subscription) {
        this.Subscription = { isPremium, isTrial };
        return this;
    }

    subscriptionStatus() {
        const { isPremium, isTrial } = this.Subscription;
        return isPremium || isTrial;
    }

    setUserData(user: UserData) {
        this.UserData = user;
        return this;
    }

    save() {
        const { UserData } = this;
        if (!UserData) return;

        const keys: MyArray<string> = new MyArray<string>(
            "name",
            "phone",
            "attempt",
            "type",
            "reg",
            "mon",
            "end",
            "expires",
        );
        let data: { [k: string]: any } = {};

        for (let key in UserData) {
            if (UserData.hasOwnProperty(key) && keys.isOnArray(key)) {
                data[key] = ((v: any) => (v instanceof Date ? v.toISOString() : v))(UserData[key]);
            }
        }

        return { [this.key]: data };
    }

    reset() {
        this.UserData = undefined;
        return this;
    }

    static getClient() {
        if (!Client.instance) {
            Client.instance = new Client();
        }
        return Client.instance;
    }
}
