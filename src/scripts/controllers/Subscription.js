import GM_Library from "../models/GM_Library";
import MyDate from "../utils/MyDate";

class Subscription extends GM_Library {
    constructor(client) {
        this.client = client;
        this.today = new MyDate();
    }

    get isTrial() {}

    get isPremium() {}

    async tryApp() {}

    async check() {}

    async updateTrial() {}
}
