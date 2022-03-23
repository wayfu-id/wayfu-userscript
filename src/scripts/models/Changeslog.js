import GM_Library from "./GM_Library";
import { isUpToDate } from "../lib/Util";
import { modal } from "./Modals";
import MyArray from "./MyArray";

class Changelog extends GM_Library {
    constructor() {
        super();
        const detail = this.getValue("changelog", []);
        this.details = detail.length != 0 ? new MyArray(...detail) : new MyArray();
    }

    /**
     * Request all changes from server
     * @returns {Promise<Array|false>} get changes as array or false if fail
     */
    get getChanges() {
        const { homepage } = this.appInfo;
        return new Promise((done) => {
            let req = {
                url: `${homepage}files/changelog.json`,
                onload: (res) => {
                    const { status, responseText } = res;
                    if (status === 200) {
                        let changelog = JSON.parse(responseText);
                        changelog = Array.isArray(changelog)
                            ? changelog
                            : changelog.changelog;
                        done(changelog);
                    } else {
                        done(status === 200);
                    }
                },
            };
            this.request(req);
        });
    }

    /**
     * Get all changes
     * @returns {MyArray} changes detail
     */
    get Log() {
        // if (this.details.isEmpty) return null;
        return this.details;
    }

    /**
     * Do we need to update this script?
     * @param {any} data script update metadata
     */
    async doUpdate(data) {
        const newVers = /\d+((\.|-)\d+[A-Za-z]?)*/.exec(data)[0],
            { version, name, downloadURL } = this.appInfo;
        if (!isUpToDate(version, newVers)) {
            const msg = `${name} ${newVers} sudah tersedia, perbaharui sekarang?`;
            if (await modal.confirm(msg)) {
                window.location.href = downloadURL;
            }
        }
    }

    /**
     * Do check updates
     * @returns
     */
    async checkUpdate() {
        const { updateURL } = this.appInfo;
        const data = new Promise((done) => {
            const req = {
                url: `${updateURL}`,
                onload: (res) => {
                    const { status, responseText } = res;
                    if (status === 200) {
                        done(responseText);
                    } else {
                        done(false);
                    }
                },
            };
            this.request(req);
        });

        this.details = new MyArray(...(await this.getChanges));
        this.save();

        this.doUpdate(await data);
        return this;
    }

    /**
     * Save changelog to locals
     */
    save() {
        this.setValue("changelog", this.details);
    }
}

const changes = new Changelog();
export { Changelog as default, changes };
