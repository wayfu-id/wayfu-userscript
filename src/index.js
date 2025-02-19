import { DOM } from "./scripts/lib/HtmlModifier";
import App from "./scripts/App";

async function init() {
    // console.log(XLSX);
    if (await DOM.hasElement("div.two")) {
        unsafeWindow.WayFu = new App(unsafeWindow);
        Object.defineProperties(unsafeWindow, {
            pdfjsLib: {
                value: window["pdfjsLib"],
            },
        });
    } else {
        await init();
    }
}
init();
