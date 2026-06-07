import App from "../App";
import { JSONParse, intoObject } from "../utilities/index";
import { MyDate } from "../structures/index";

import type { UserData } from "../structures/Client";

export type UserEventMap = {
    "user:load": { payload: UserData | null; return: void };
    "user:products_loaded": { payload: void; return: void };
    "user:request_data": { payload: void; return: boolean };
    "user:save": { payload: void; return: void };
    "user:sets": { payload: UserData | null; return: void };
    "user:update": { payload: UserData | any; return: void };
};

export function registerUserEvents(app: App) {
    app.on("user:load", (clientData: UserData | null) => {
        const { Manager, Client, WAPI } = app,
            Profile = WAPI.ME ?? WAPI.Contact.getMeContact().getModel();

        if (!Client.Profile) {
            Client.setProfile(Profile);
            clientData = Manager.getValue(Client.key);
            app.trigger("user:update", clientData);
            if (!clientData) {
                app.trigger("user:request_data");
            }
        } else {
            if (clientData && typeof clientData !== "undefined" && clientData !== null) {
                app.trigger("user:update", clientData);
            } else {
                setTimeout(() => {
                    app.trigger("user:request_data");
                }, 2e4);
            }
        }
    });

    app.on("user:update", (data) => {
        if (!data) return;
        data = intoObject(data);
        const { Client } = app;

        let { UserData } = Client,
            newData = Object.assign({}, UserData ?? {}, data),
            { end, reg, mon } = newData;

        newData.end = reg && mon ? new MyDate(reg).addMonths(mon) : end || null;
        app.trigger("user:sets", newData);
    });

    app.on("user:sets", (user: UserData | null) => {
        if (!user) return;

        const { Client } = app,
            { Subscription } = Client,
            { end, expires, attempt, type } = user,
            today = new MyDate();

        let isPremium = end ? end >= today : Subscription.isPremium,
            isTrial = expires && !!attempt ? attempt < 5 && expires >= today : Subscription.isTrial;

        Client.reset().setUserData(user).setSubscription({ isPremium, isTrial });

        const { Profile } = Client,
            isBusiness = Profile?.isBusiness || false,
            hasProducts = isBusiness && !!(Profile as WAPI.BusinessContact)?.Products?.length,
            attachType = isBusiness && hasProducts ? "product" : "file";

        app.trigger("setting:sets", { userType: type, attachType });
        app.trigger("user:save");
    });

    app.on("user:request_data", () => {
        const { Manager, Client, appInfo } = app,
            requsetOpt: Tampermonkey.Request = { method: "POST", url: `${appInfo.homepage}user/api` };

        return new Promise((resolve) => {
            const opt = Object.assign({}, requsetOpt, {
                data: JSON.stringify({
                    phone: Client.Profile?.phoneNumber,
                    version: appInfo.version,
                }),
                onload: async (res: Tampermonkey.Response<object>) => {
                    const { status, responseText } = res;
                    let data: UserData | null = null;
                    if (status === 200) {
                        data = await JSONParse<UserData>(responseText);
                    }
                    app.trigger("user:load", data);
                    resolve(status === 200 && data !== null);
                },
                onerror: () => app.trigger("user:load", null),
                ontimeout: () => app.trigger("user:load", null),
                onabort: () => app.trigger("user:load", null),
            });
            Manager.request(opt);
        });
    });

    app.on("user:save", () => {
        app.trigger("save_value", app.Client.save());
    });
}
