import MyDate from "../utils/MyDate";
import MyArray from "../utils/MyArray";
import DOM from "../utils/DOM";
import Waydown from "../utils/Waydown";
import Modal from "../utils/Modal";

// import { Debug } from "./Debug";
import { svgData } from "../lib/Constant";
// import { waydown } from "./Waydown";
// import { options } from "../models/Settings";
// import { modal } from "../models/Modals";
// import { report } from "../models/Reports";
// import { loop } from "../models/Interval";
// import { queue } from "../models/Queue";
// import { user } from "../models/Users";
import { changes } from "../models/Changeslog";
// import { chat } from "../models/Chatrooms";
// import { message } from "../models/Messages";
// import { DOM } from "../lib/HtmlModifier";
// import CSVFile, { csvFile } from "../models/CSVFile";
import { dateFormat, isNumeric, titleCase } from "../utils";
// import {
//     loadRecipient,
//     resetRecipient,
//     checkStatus,
//     startProcess,
//     exportDataToFile,
// } from "./Main";

/**
 * A bunch of EventListener
 * @class AppEvents
 */
class AppEvents {
    constructor() {}
    /**
     * Run blast tasks
     * @param {Event} e Event
     * @returns {Promise<void>}
     */
    async runTasks(e) {
        // if (!(await user.check())) return;
        // if (await checkStatus()) return;

        // const { useImage } = options,
        //     time = !useImage ? 55e2 : 6e3,
        //     fn = () => {
        //         return startProcess();
        //     };

        // // initMessage();
        // report.reset();
        // loop.set(time, fn);
        // startProcess();
        function timeout(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }
        await timeout(1000);
        console.log("No task currently");
    }

    /**
     * Tab menu Listener
     * @param {Event} e Event
     */
    tabMenu(e) {
        const elm = e.currentTarget || e.target,
            menuName = elm.value;

        let activeTab = DOM.get("#wayfuPanel .menus")
            .set({ removeClass: "active" })
            .indexOf(elm);

        // tabs.setProperties({ removeClass: "active" });
        DOM.get(elm).set({ addClass: "active" });
        DOM.get("#wayfuPanel .menu-content").set({ display: "none" });
        DOM.get(`#${menuName}`).set({ display: "block" });

        // options.setOption("activeTab", activeTab);
    }

    /**
     * For preview text message and caption (if any)
     * @param {Event} e Event
     */
    textPreview(e) {
        let elm = e.currentTarget || e.target,
            chk = elm.checked;

        DOM.get("#wayfuPanel textarea").forEach((e) => {
            const prevId = e.id === "message" ? "msgPreview" : "captPreview";
            const content = ((chk, { id }) => {
                let dataId = id === "message" ? "Message" : "Caption";
                let { value, innerText } = e;

                if (chk) return Waydown.toHtml(value || innerText, !chk);

                return "";
            })(chk, e);

            const editable = ((chk, { id }) => {
                if (id === "message") return !chk;
                return !chk;
            })(chk, e);

            DOM.get(`#${prevId}`).set({
                display: editable ? "none" : "block",
                html: content,
            });
            DOM.get(e).set({ display: editable ? "block" : "none" });
        });
        // console.log("No task currently");
    }

    /**
     * Set message from its type (form or caption)
     * @param {Event} e Event
     */
    updateText(e) {
        const { id, value, innerText } = e.target || e.currentTarget,
            mode = DOM.get("#_mode").first;

        const isEmpty = DOM.get("#wayfuPanel textarea").every((e) => {
            let { value, innerText } = e;
            return !(value || innerText);
        });
        if (isEmpty) {
            if (mode.checked) mode.click();
        }
        DOM.get(mode).set({ disabled: isEmpty });
        // const key = ((i) => {
        //     let strs = `${i}`.match(/[A-Za-z]+/g);
        //     if (!strs) return `input${titleCase(i)}`;

        //     strs.forEach((e, idx) => (strs[idx] = titleCase(e)));
        //     return `input${strs.join()}`;
        // })(id);

        // message.setProperties({ [key]: value || innerText }, false);
        // console.log("No task currently");
    }

    /**
     * Allow message to attach an Image
     * @param {Event} e Event
     */
    async useImage(e) {
        // const useCapt = options.useCaption === "caption",
        const elm = e.currentTarget || e.target,
            // chk = useCapt ? elm.checked : false,
            title = elm.checked ? "" : "Caption menggunakan pesan",
            captId = elm.dataset.captId;

        DOM.get(`#${elm.value}`).set({ disabled: !elm.checked });
        DOM.get(`#${captId}`).set({ disabled: !elm.checked, title: title });
        DOM.get("#useCaption").set({ disabled: !elm.checked });

        // DOM.setElements([
        //     { elm: `#${elm.value}`, props: { disabled: !elm.checked } },
        //     { elm: `#${captId}`, props: { disabled: !chk, title: title } },
        //     { elm: "#useCaption", props: { disabled: !elm.checked } },
        // ]);

        // options.setOption("useImage", elm.checked);
        // console.log("No task currently");
    }

    /**
     * Load file recipients Data
     * @param {Event} e Event
     */
    async loadData(e) {
        // const elm = e.currentTarget || e.target,
        //     [file] = elm.files,
        //     mode = DOM.getElement("#_mode");

        // const data = await (async (f) => {
        //     if (!f) return null;
        //     try {
        //         return await csvFile.import(f);
        //     } catch (err) {
        //         modal.alert("[ERROR] File .xlsx penerima tidak valid!");
        //         console.error(err);
        //         return null;
        //     }
        // })(file);

        // resetRecipient();
        // if (data) {
        //     loadRecipient(data);
        // } else {
        //     DOM.setElement(elm, { value: null });
        //     if (mode.checked) mode.click();
        // }
        // // if (!data && mode.checked) mode.click();
        // DOM.setElement(mode, {
        //     title: !data ? "Masukkan File CSV" : "Mode Pesan",
        //     disabled: !data,
        // });
        function timeout(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }
        await timeout(1000);
        console.log("No task currently");
    }

    /**
     * Read and preview an Image File
     * @param {Event} e Event
     */
    imagePreview(e) {
        // const elm = e.currentTarget || e.target,
        //     maxSize = 4 * Math.pow(1024, 2),
        //     btn = elm.dataset.value;

        // let imgFile = null;

        // if (!btn) {
        //     imgFile = elm.files[0];
        //     if (imgFile && imgFile.size > maxSize) {
        //         modal.alert("Ukuran gambar tidak boleh lebih dari 4MB");
        //         imgFile = null;
        //     }
        // } else {
        //     DOM.setElement(`#${btn}`, { value: "" });
        // }

        // DOM.setElement("#_img-output", {
        //     src: imgFile ? URL.createObjectURL(imgFile) : "",
        // }).setElementStyle("#_deleteImg", {
        //     display: imgFile ? "block" : "none",
        // });

        // message.setProperties({ imageFile: imgFile });
        // options.setOptions({ hasImage: !!imgFile, imageFile: imgFile });
        console.log("No task currently");
    }

    /**
     * Open and close panel toggle button
     * @param {Event} e Event
     */
    toggleApp(e) {
        const elm = e.currentTarget || e.target,
            { active } = window.WAPI.WebClassesV2;

        const targetEl = ((e) => {
            let val = e.getAttribute("value"),
                target = e.dataset.target;

            return DOM.get(`#${val || target}`);
        })(elm);

        const { first: el } = targetEl,
            { style, scrollHeight } = el;

        targetEl.set({ height: style.height ? null : `${scrollHeight}px` });
        DOM.get(elm)
            .set({ toggleClass: "active" })
            .set({ toggleClass: active });

        // options.setOption("openPanel", a);
    }

    /**
     * For input type `Range` element(s)
     * @param {Event} e Event
     */
    inputRange(e) {
        // const elm = e.currentTarget || e.target,
        //     { id, value } = elm;
        // DOM.setElements([
        //     {
        //         elm: elm,
        //         props: {
        //             max:
        //                 id === "maxQueue"
        //                     ? options.queueLimit
        //                     : options.bpLimit,
        //         },
        //     },
        //     {
        //         elm: DOM.getElement("output", elm.parentElement),
        //         props: {
        //             text: value,
        //         },
        //     },
        // ]);
        // options.setOption(id, value);
        console.log("No task currently");
    }

    /**
     * For input type `Check` element(s)
     * @param {Event} e Event
     */
    inputChecks(e) {
        // const { id, value } = e.currentTarget || e.target;
        // options.setOption(id, value);
        console.log("No task currently");
    }

    /**
     * For input type `Select` element(s)
     * @param {Event} e Event
     */
    inputSelects(e) {
        // const { id, value } = e.currentTarget || e.target;
        // switch (id) {
        //     case "themeColor":
        //         (function (id, val) {
        //             DOM.setElementStyle("#wayfuPanel", {
        //                 backgroundColor: val,
        //             });
        //             options.setOption(id, val);
        //         })(id, value);
        //         break;
        //     case "dateFormat":
        //         (function (val) {
        //             if (isNumeric(val)) {
        //                 val = Number(val) !== 2 ? val : 0;
        //                 options.setOptions({
        //                     isFormat: val === 2,
        //                     monthIndex: val,
        //                     dateFormat: val,
        //                 });
        //             } else {
        //                 options.setOptions({
        //                     isFormat: false,
        //                     dateFormat: val,
        //                 });
        //                 const files = DOM.getElement("#getFile");
        //                 if (!queue.isEmpty || files.value !== "") {
        //                     DOM.setElement(files, { value: "" });
        //                     modal.alert(
        //                         "Untuk opsi <strong>Deteksi Otomatis</strong>, Silahkan masukkan ulang file penerima pesan.",
        //                         "[WARNING] Masukkan ulang CSV"
        //                     );
        //                     resetRecipient();
        //                 }
        //             }
        //         })(value);
        //         break;
        //     case "useCaption":
        //         (async function (id, val) {
        //             let useCaption = val !== "caption";

        //             if (useCaption) {
        //                 val = (await modal.confirm(
        //                     "Mengubah Pesan menjadi Caption akan menaikan potensi Banned dari WhatsApp. Apa Anda Yakin?"
        //                 ))
        //                     ? val
        //                     : "caption";

        //                 useCaption = val !== "caption";
        //             }

        //             DOM.setElement("#_caption", {
        //                 disabled: useCaption,
        //                 title: useCaption ? "Caption menggunakan pesan" : "",
        //             });

        //             options.setOption(id, val);
        //         })(id, value);
        //         break;
        //     case "exportType":
        //         (async function (id, val) {
        //             options.setOption(id, val);
        //             let downloadBtn = await DOM.hasElement("span.wfu-link");
        //             if (downloadBtn) {
        //                 // let el = DOM.getElement("span.wfu-link");
        //                 let title = (({ title: t }) => {
        //                     t = t.replace(
        //                         /(.*)\.[^.]+(["]+)$/g,
        //                         function (m, g1, g2) {
        //                             return `${g1}.${val + g2}`;
        //                         }
        //                     );
        //                     return t;
        //                 })(downloadBtn);
        //                 DOM.setElement(downloadBtn, { title: title });
        //             }
        //         })(id, value);
        //         break;
        // }

        console.log("No task currently");
    }

    /**
     * ChangeLog listener
     * @param {Event} e Event
     */
    changeLog(e) {
        const changelog = changes.Log.slice(0, 5);
        const container = DOM.create("div", {
            classid: "wfu-changelog",
        }).setStyles({ overflowY: "scroll" });

        changelog.forEach((e, i) => {
            let [content, title] = (({ date, content, version }, i) => {
                let dateStr = dateFormat(new MyDate(date), 1);
                let add = `${i === 0 ? "WayFu - " : ""}`,
                    title = `${add}Version: ${version} (${dateStr})`;

                return [content, title];
            })(e, i);

            let items = DOM.create("div", { class: "wfu-changelog-items" });

            // DOM.create("span", { text: title, append: items });
            DOM.create("span", { text: title }).insertTo(items);
            DOM.createList(content, "ul").insertTo(items);
            container.insert(items);
        });

        Modal.alert(container, "Detail Pembaruan.");

        // modal.alert(container.first, "Detail Pembaruan.");
    }

    /**
     * Checing current chat active
     * @param {Event} e Event
     */
    async checkChat(e) {
        const chat = window.WAPI.Chat.getActive(),
            { groupDownloadBtnSvg } = svgData,
            { chatHeader, chatControls, menu, menuDefault, item, button } =
                window.WAPI.WebClassesV2;

        const downloadMenu = await DOM.has(`.${chatControls} span.wfu-link`),
            chatMenu = await DOM.has(`.${chatHeader} .${menu}.${menuDefault}`);

        /** @type {(filename: string) => DOM} */
        const createDownloadMenu = (filename) => {
            const menuItem = DOM.create("div", { classid: item });
            const downloadMenu = DOM.create("div", {
                classid: button,
                role: "button",
                "data-tab": "6",
                tabindex: "0",
                "aria-disabled": false,
            });
            const downloadBtn = DOM.create("span", {
                title: `Download "${filename}"`,
                "data-testid": "download-alt",
                "data-icon": "download-alt",
                classid: "wfu-link",
            });
            const btnIcon = DOM.createIcon(groupDownloadBtnSvg, { size: "24" });

            downloadBtn.insert(btnIcon);
            downloadMenu.insert(downloadBtn);

            return menuItem.insert(downloadMenu);
        };

        if (chatMenu && chat && chat.isGroup) {
            let {
                groupMetadata: { subject, participants },
            } = chat;
            // let { fileUrl, fileName } = CSVFile.createFile(subject, contacts),
            //     fname = exportType === "csv" ? `${fileName}.csv` : `${subject}.xlsx`;
            if (!downloadMenu) {
                createDownloadMenu(subject).insertBefore(chatMenu, true);
                return;
            }
            if (e.target !== downloadMenu) return;

            let contacts = new MyArray();
            for (const { contact } of participants.getModelsArray()) {
                const {
                    id: { user },
                    name,
                    pushname,
                } = contact.getContactModel();

                contacts.push([pushname || name || user, user]);
            }
            console.log(contacts);
            return;
            // if (await user.check()) {
            //     return exportDataToFile(contacts, subject);
            // }
        }
    }
}

const listeners = new AppEvents();
export { AppEvents as default, listeners };
