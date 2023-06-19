import DOM from "@wayfu/wayfu-dom";
import MyArray from "./MyArray";
import { Waydown } from "./index";
import { svgData } from "../lib/Constant";

/**
 * @typedef {{
 *  id: string,
 *  query: string,
 *  type: string,
 *  fn: EventListener
 * }} wayfuEventDetail
 */

/** @type {wayfuEventDetail[]} */
const eventList = [
    {
        id: "tabMenu",
        query: "#wayfuPanel .menus",
        type: "click",
        fn: function tabMenu(e) {
            const elm = e.currentTarget || e.target,
                menuName = elm.value;

            let activeTab = DOM.get("#wayfuPanel .menus")
                .set({ removeClass: "active" })
                .indexOf(elm);

            // tabs.setProperties({ removeClass: "active" });
            DOM.get(elm).set({ addClass: "active" });
            DOM.get("#wayfuPanel .menu-content").set({ display: "none" });
            DOM.get(`#${menuName}`).set({ display: "block" });
        },
    },
    {
        id: "updateText",
        query: "#wayfuPanel textarea",
        type: "input",
        fn: function updateText(e) {
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
        },
    },
    {
        id: "textPreview",
        query: "#_mode",
        type: "click",
        fn: function textPreview(e) {
            let elm = e.currentTarget || e.target,
                chk = elm.checked;

            DOM.get("#wayfuPanel textarea").forEach((e) => {
                const prevId = e.id === "message" ? "msgPreview" : "captPreview";
                const content = ((chk, { id }) => {
                    let dataId = id === "message" ? "Message" : "Caption";
                    let { value, innerText } = e;

                    if (chk) return Waydown(value || innerText, !chk);

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
        },
    },
    {
        id: "useImage",
        query: "#useImage",
        type: "click",
        fn: async function useImage(e) {
            // const useCapt = options.useCaption === "caption",
            const elm = e.currentTarget || e.target,
                // chk = useCapt ? elm.checked : false,
                title = elm.checked ? "" : "Caption menggunakan pesan",
                captId = elm.dataset.captId;

            DOM.get(`#${elm.value}`).set({ disabled: !elm.checked });
            DOM.get(`#${captId}`).set({ disabled: !elm.checked, title: title });
            DOM.get("#useCaption").set({ disabled: !elm.checked });
        },
    },
    {
        id: "loadData",
        query: "#getFile",
        type: "change",
        fn: async function loadData(e) {
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
        },
    },
    {
        id: "imagePreview",
        query: "#_deleteImg",
        type: "click",
        fn: function imagePreview(e) {
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
        },
    },
    {
        id: "toggleApp",
        query: "#wayfuToggle",
        type: "click",
        fn: function toggleApp(e) {
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
            DOM.get(elm).set({ toggleClass: "active" }).set({ toggleClass: active });
        },
    },
    {
        id: "inputRange",
        query: "._input input[type='range']",
        type: "input",
        fn: function inputRange(e) {
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
        },
    },
    {
        id: "inputChecks",
        query: "._input input[type='checkbox']",
        type: "change",
        fn: function inputChecks(e) {
            // const { id, value } = e.currentTarget || e.target;
            // options.setOption(id, value);
            console.log("No task currently");
        },
    },
    {
        id: "inputSelects",
        query: "._input select",
        type: "change",
        fn: function inputSelects(e) {
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
        },
    },
    {
        id: "runTasks",
        query: "#_blast",
        type: "",
        fn: async function runTasks(e) {
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
        },
    },
    {
        id: "checkChat",
        query: "div#app",
        type: "click",
        fn: async function checkChat(e) {
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
        },
    },
];

export default eventList;
