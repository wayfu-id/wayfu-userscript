import GM_Library from "scripts/models/GM_Library";
import MyDate from "scripts/models/MyDate";

type userOpt = {
    method: string;
    url: string;
    headers: {"Content-Type": string;};
}

interface userData extends ObjectConstructor {
    name: string | number;
    phone: string;
    type: "oriflame" | "umum";
    attempt?: number;
    reg?: string;
    mon: number;
    end?: MyDate;
    expires?: MyDate;
}

interface Users extends GM_Library, userData {
    today: MyDate;
    defaultOpt: userOpt;

    /** Get user premium status */
    get isPremium(): boolean;

    /** Get user trial status */
    get isTrial(): boolean;

    /** Initialize User data */
    init(): Users;

    /** Request userdata from server based on it's phone number */
    gettingData(): Promise<any>;

    /** Set/update current user data */
    updateData(prop: userData): Users;

    /** Set user properties */
    setUser(data?: userData): void;

    /** Do user grant premium access? */
    check(): Promise<boolean>;

    /** User trying app */
    tryApp(): Promise<boolean>;

    /** Update user's trial data */
    updateTrial(type?: "add" | "update"): Promise<boolean>;

    /** Show user alert */
    showAlert(i: number, on?: boolean): void;

    /** Reset current user data */
    reset(): Users;

    /** Save current user data to UserScript Manager Storage */
    save(): void;
}

export const user: Users;
export { Users as default };