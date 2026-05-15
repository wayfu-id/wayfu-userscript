import ScriptManager from "./ScriptManager";
import { JSONParse, intoObject } from "../utilities/index";
import App from "App";
import MyDate from "./MyDate";
import MyArray from "./MyArray";

type UserData = ObjectConstructor & {
    name: string | number;
    phone: string;
    type: "oriflame" | "umum";
    attempt?: number;
    reg?: string;
    mon: number;
    end: MyDate | null;
    expires: MyDate | null;
} & { [k: string | number]: any };

type Subscription = {
    isPremium: boolean;
    isTrial: boolean;
};

export default class Client extends ScriptManager {
    private static Instance: Client;

    defaultProp: Tampermonkey.Request;
    UserData?: UserData = undefined;
    Today: MyDate = new MyDate();
    Subscription: Subscription = {
        isPremium: false,
        isTrial: false,
    };
    app: App;

    private constructor(app: App) {
        super();

        this.app = app;
        this.defaultProp = {
            method: "POST",
            url: `${this.app.appInfo.homepage}user/api`,
        };

        this.gettingData();
    }

    get Profile() {
        const { WAPI } = this.app;

        return WAPI.ME ?? WAPI.Contact.getMeContact().getModel();
    }

    gettingData() {
        let { Profile } = this;
        return new Promise((resolve) => {
            const opt = Object.assign({}, this.defaultProp, {
                data: JSON.stringify({
                    phone: Profile.phoneNumber,
                    version: this.app.version,
                }),
                onload: async (res: Tampermonkey.Response<object>) => {
                    const { status, responseText } = res;
                    let data = null;
                    if (status === 200) {
                        data = await JSONParse<UserData>(responseText);
                    }
                    this.setCurrentUser(data);
                    resolve(status === 200 && data !== null);
                },
                onerror: () => this.setCurrentUser(null),
                ontimeout: () => this.setCurrentUser(null),
                onabort: () => this.setCurrentUser(null),
            });
            this.request(opt);
        });
    }

    subscriptionStatus() {
        const { isPremium, isTrial } = this.Subscription;
        return isPremium || isTrial;
    }

    setUserData(user: UserData) {
        this.UserData = user;

        const { end, expires, attempt } = user;
        let { isPremium, isTrial } = this.Subscription;

        // { Settings } = this.app;
        // Settings.setOption("userType", user.type);

        isPremium = end !== null ? end > this.Today : isPremium;
        isTrial = expires !== null && !!attempt ? attempt < 5 && expires < this.Today : isTrial;

        this.Subscription = { isPremium, isTrial };
        return this;
    }

    updateData(data?: UserData) {
        if (!data) return this;
        data = intoObject(data);

        let { UserData } = this,
            newData = Object.assign({}, UserData ?? {}, data),
            { end, reg, mon } = newData;

        newData.end = reg && mon ? new MyDate(reg).addMonths(mon) : end || null;
        return this.setUserData(newData);
    }

    setCurrentUser(data: UserData | null) {
        const user = data || this.getValue("wayfu-user");
        if (user && typeof user !== "undefined" && user !== null) {
            this.reset().updateData(user).save();
        }

        if (this.subscriptionStatus()) {
        } else {
            setTimeout(() => {
                this.gettingData();
            }, 2e4);
        }
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

        this.setValue("wayfu-user", data);
    }

    reset() {
        this.UserData = undefined;
        return this;
    }

    static getClient(app: App) {
        if (!Client.Instance) {
            Client.Instance = new Client(app);
        }
        return Client.Instance;
    }
}
