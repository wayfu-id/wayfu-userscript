import { Contact } from "../structures";

export default class ContactFactory {
    static create(app, data) {
        return new Contact(app, data);
    }
}
