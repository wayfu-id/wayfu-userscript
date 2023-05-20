import DOM from "./scripts/utils/DOM";
import App from "./scripts/App";

async function init() {
    if (await DOM.has("div.two")) {
        unsafeWindow.WayFu = new App(unsafeWindow);
    } else {
        await init();
    }
}
init();
