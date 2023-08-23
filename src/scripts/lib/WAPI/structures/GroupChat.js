import Chat from "./Chat";
import GroupParticipant from "./GroupParticipant";

/**
 * @type {import("../index").GroupChat}
 */
export default class GroupChat extends Chat {
    _patch(data) {
        this.groupMetadata = data.groupMetadata;

        return super._patch(data);
    }

    get owner() {
        /** @type {import("../index").GroupMetadata} */
        let { owner } = this.groupMetadata;
        if (!owner) return Promise.resolve(null);
        let { _serialized: id } = owner;
        return this.app.findContact(id);
    }

    get participants() {
        let participants = this.groupMetadata.participants,
            results = [];

        for (let data of participants.getModelsArray()) {
            results.push(GroupParticipant.create(data));
        }
        return results;
    }

    async getOwner() {
        return await this.owner;
    }
}
