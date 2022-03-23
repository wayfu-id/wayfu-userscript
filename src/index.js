import { DOM } from "./scripts/lib/DOM";
import App from "./scripts/App";

async function init() {
    if (await DOM.hasElement("div.two")) {
        new App();
    } else {
        await init();
    }
}
init();
