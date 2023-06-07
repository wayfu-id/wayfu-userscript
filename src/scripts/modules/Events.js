import MyDate from "../models/MyDate";
import { Debug } from "./Debug";
import { svgData } from "../lib/Constant";
import { waydown } from "./Waydown";
import { options } from "../models/Settings";
import { modal } from "../models/Modals";
import { report } from "../models/Reports";
import { loop } from "../models/Interval";
import { queue } from "../models/Queue";
import { user } from "../models/Users";
import { changes } from "../models/Changeslog";
import { chat } from "../models/Chatrooms";
import { message } from "../models/Messages";
import { DOM } from "../lib/HtmlModifier";
import CSVFile, { csvFile } from "../models/CSVFile";
import { dateFormat, isNumeric, titleCase } from "../lib/Util";
import MyArray from "../models/MyArray";
import {
    loadRecipient,
    resetRecipient,
    checkStatus,
    startProcess,
    exportDataToFile,
} from "./Main";

/**
 * A bunch of EventListener
 * @class AppEvents
 */ class AppEvents {
    constructor() {}
    /**
     * Run blast tasks
     * @param {Event} e Event
     * @returns {Promise<void>}
     */
    async runTasks(e) {
        if (!(await user.check())) return;
        if (await checkStatus()) return;

        const { useImage } = options,
            time = !useImage ? 55e2 : 6e3,
            fn = () => {
                return startProcess();
            };

        // initMessage();
        report.reset();
        loop.set(time, fn);
        startProcess();
    }

    /**
     * Tab menu Listener
     * @param {Event} e Event
     */
    tabMenu(e) {
        const elm = e.currentTarget || e.target,
            menuName = elm.value,
            tabs = DOM.getElement("#wayfuPanel .menus", true);

        DOM.setElements([
            {
                elm: tabs,
                props: { removeClass: "active" },
            },
            {
                elm: elm,
                props: { addClass: "active" },
            },
        ]).setElementsStyle([
            {
                elm: "#wayfuPanel .menu-content",
                props: { display: "none" },
            },
            {
                elm: `#${menuName}`,
                props: { display: "block" },
            },
        ]);

        options.setOption("activeTab", Array.from(tabs).indexOf(elm));
    }

    /**
     * For preview text message and caption (if any)
     * @param {Event} e Event
     */
    textPreview(e) {
        let elm = e.currentTarget || e.target,
            form = DOM.getElement("#wayfuPanel textarea", true),
            chk = elm.checked;

        form.forEach((e) => {
            const prevId = e.id === "message" ? "msgPreview" : "captPreview";
            const content = ((chk, { id }) => {
                let text = message[`input${id === "message" ? "Message" : "Caption"}`];

                if (chk) {
                    message.setData(queue.now);
                    text = message.subtitute(text);
                    return waydown.toHtml(text, !chk);
                }

                return "";
            })(chk, e);

            const editable = ((chk, { id }) => {
                if (id === "message") return !chk;

                const { useCaption: capt } = options;
                return capt ? !chk : capt;
            })(chk, e);

            DOM.setElement(`#${prevId}`, { html: content })
                .setElementStyle(`#${prevId}`, { display: editable ? "none" : "block" })
                .setElementStyle(e, { display: editable ? "block" : "none" });
        });
    }

    /**
     * Set message from its type (form or caption)
     * @param {Event} e Event
     */
    updateText(e) {
        const { id, value, innerText } = e.target || e.currentTarget;
        const key = ((i) => {
            let strs = `${i}`.match(/[A-Za-z]+/g);
            if (!strs) return `input${titleCase(i)}`;

            strs.forEach((e, idx) => (strs[idx] = titleCase(e)));
            return `input${strs.join()}`;
        })(id);

        message.setProperties({ [key]: value || innerText }, false);
    }

    /**
     * Allow message to attach an Image
     * @param {Event} e Event
     */
    async useImage(e) {
        const useCapt = options.useCaption === "caption",
            elm = e.currentTarget || e.target,
            chk = useCapt ? elm.checked : false,
            title = useCapt ? "" : "Caption menggunakan pesan",
            captId = elm.dataset.captId;

        DOM.setElements([
            { elm: `#${elm.value}`, props: { disabled: !elm.checked } },
            { elm: `#${captId}`, props: { disabled: !chk, title: title } },
            { elm: "#useCaption", props: { disabled: !elm.checked } },
        ]);

        options.setOption("useImage", elm.checked);
    }

    /**
     * Load file recipients Data
     * @param {Event} e Event
     */
    async loadData(e) {
        const elm = e.currentTarget || e.target,
            [file] = elm.files,
            mode = DOM.getElement("#_mode");

        const data = await (async (f) => {
            if (!f) return null;
            try {
                return await csvFile.import(f);
            } catch (err) {
                modal.alert("[ERROR] File .xlsx penerima tidak valid!");
                console.error(err);
                return null;
            }
        })(file);

        resetRecipient();
        if (data) {
            loadRecipient(data);
        } else {
            DOM.setElement(elm, { value: null });
            if (mode.checked) mode.click();
        }
        // if (!data && mode.checked) mode.click();
        DOM.setElement(mode, {
            title: !data ? "Masukkan File CSV" : "Mode Pesan",
            disabled: !data,
        });
    }

    /**
     * Read and preview an Image File
     * @param {Event} e Event
     */
    imagePreview(e) {
        const elm = e.currentTarget || e.target,
            maxSize = 4 * Math.pow(1024, 2),
            btn = elm.dataset.value;

        let imgFile = null;

        if (!btn) {
            imgFile = elm.files[0];
            if (imgFile && imgFile.size > maxSize) {
                modal.alert("Ukuran gambar tidak boleh lebih dari 4MB");
                imgFile = null;
            }
        } else {
            DOM.setElement(`#${btn}`, { value: "" });
        }

        DOM.setElement("#_img-output", {
            src: imgFile ? URL.createObjectURL(imgFile) : "",
        }).setElementStyle("#_deleteImg", {
            display: imgFile ? "block" : "none",
        });

        message.setProperties({ imageFile: imgFile });
        options.setOptions({ hasImage: !!imgFile, imageFile: imgFile });
    }

    /**
     * Open and close panel toggle button
     * @param {Event} e Event
     */
    toggleApp(e) {
        const elm = e.currentTarget || e.target,
            { active } = window.WAPI.WebClassesV2,
            a = elm.classList.toggle("active");

        const acdBody = ((e) => {
            let targetId = e.getAttribute("value") || e.dataset.target;

            return DOM.getElement(`#${targetId}`);
        })(elm);

        acdBody.style.height = acdBody.style.height ? null : `${acdBody.scrollHeight}px`;

        elm.classList.toggle(active);

        let tabVisibility = acdBody.style.height ? "unset" : "collapse";
        DOM.setElementStyle("#wayfuPanel", { visibility: tabVisibility });

        options.setOption("openPanel", a);
    }

    /**
     * For input type `Range` element(s)
     * @param {Event} e Event
     */
    inputRange(e) {
        const elm = e.currentTarget || e.target,
            { id, value } = elm;
        DOM.setElements([
            {
                elm: elm,
                props: { max: id === "maxQueue" ? options.queueLimit : options.bpLimit },
            },
            {
                elm: DOM.getElement("output", elm.parentElement),
                props: {
                    text: value,
                },
            },
        ]);
        options.setOption(id, value);
    }

    /**
     * For input type `Check` element(s)
     * @param {Event} e Event
     */
    inputChecks(e) {
        const { id, value } = e.currentTarget || e.target;
        options.setOption(id, value);
    }

    /**
     * For input type `Select` element(s)
     * @param {Event} e Event
     */
    inputSelects(e) {
        const { id, value } = e.currentTarget || e.target;
        switch (id) {
            case "themeColor":
                (function (id, val) {
                    DOM.setElementStyle("#wayfuPanel", { backgroundColor: val });
                    options.setOption(id, val);
                })(id, value);
                break;
            case "dateFormat":
                (function (val) {
                    if (isNumeric(val)) {
                        val = Number(val) !== 2 ? val : 0;
                        options.setOptions({
                            isFormat: val === 2,
                            monthIndex: val,
                            dateFormat: val,
                        });
                    } else {
                        options.setOptions({ isFormat: false, dateFormat: val });
                        const files = DOM.getElement("#getFile");
                        if (!queue.isEmpty || files.value !== "") {
                            DOM.setElement(files, { value: "" });
                            modal.alert(
                                "Untuk opsi <strong>Deteksi Otomatis</strong>, Silahkan masukkan ulang file penerima pesan.",
                                "[WARNING] Masukkan ulang CSV"
                            );
                            resetRecipient();
                        }
                    }
                })(value);
                break;
            case "useCaption":
                (async function (id, val) {
                    let useCaption = val !== "caption";

                    if (useCaption) {
                        val = (await modal.confirm(
                            "Mengubah Pesan menjadi Caption akan menaikan potensi Banned dari WhatsApp. Apa Anda Yakin?"
                        ))
                            ? val
                            : "caption";

                        useCaption = val !== "caption";
                    }

                    DOM.setElement("#_caption", {
                        disabled: useCaption,
                        title: useCaption ? "Caption menggunakan pesan" : "",
                    });

                    options.setOption(id, val);
                })(id, value);
                break;
            case "exportType":
                (async function (id, val) {
                    options.setOption(id, val);
                    let downloadBtn = await DOM.hasElement("span.wfu-link");
                    if (downloadBtn) {
                        // let el = DOM.getElement("span.wfu-link");
                        let title = (({ title: t }) => {
                            t = t.replace(/(.*)\.[^.]+(["]+)$/g, function (m, g1, g2) {
                                return `${g1}.${val + g2}`;
                            });
                            return t;
                        })(downloadBtn);
                        DOM.setElement(downloadBtn, { title: title });
                    }
                })(id, value);
                break;
        }
    }

    /**
     * ChangeLog listener
     * @deprecated
     * @param {Event} e Event
     */
    changeLog(e) {
        // const container = DOM.createElement({
        //         tag: "div",
        //         classid: "wfu-changelog",
        //         style: "overflow-y:scroll",
        //     }),
        //     changelog = changes.Log.slice(0, 5);
        // changelog.forEach((e, i) => {
        //     let date = dateFormat(new MyDate(e.date), 1),
        //         title = `${i == 0 ? "WayFu" + " - " : ""}Version: ${
        //             e.version
        //         } (${date})`,
        //         items = DOM.createElement({
        //             tag: "div",
        //             classid: "wfu-changelog-items",
        //             append: container,
        //         });
        //     DOM.createElement({ tag: "span", text: title, append: items });
        //     DOM.createListElement(e.content, "ul", { append: items });
        // });
        // // console.log(container);
        // modal.alert(container, "Detail Pembaruan.");
    }

    /**
     * Checing current chat active
     * @param {Event} e Event
     */
    async checkChat(e) {
        const { chatHeader, menu, menuDefault, item, button } = window.WAPI.WebClassesV2,
            chatMenu = DOM.getElement(`.${chatHeader} .${menu}.${menuDefault}`),
            downloadMenu = DOM.getElement("span[data-icon='download-alt']", chatMenu);

        /** @type {(filename: string) => HTMLElement} */
        const createDonwloadBtn = (filename) => {
            const downloadBtn = ((name) => {
                let ico = DOM.createSVGElement(svgData.groupDownloadBtnSvg, {
                    width: "24",
                    height: "24",
                });

                return DOM.createElement({
                    tag: "span",
                    title: `Download "${name}"`,
                    "data-testid": "download-alt",
                    "data-icon": "download-alt",
                    classid: "wfu-link",
                    html: ico.outerHTML,
                });
            })(filename);

            return ((downloadBtn) => {
                let btn = DOM.createElement({
                    tag: "div",
                    classId: button,
                    role: "button",
                    "data-tab": "6",
                    tabindex: "0",
                    "aria-disabled": false,
                    html: downloadBtn.outerHTML,
                });

                return DOM.createElement({
                    tag: "div",
                    classId: item,
                    html: btn.outerHTML,
                });
            })(downloadBtn);
        };

        if (chat.selectChat().room !== null && chat.isGroup) {
            let { groupMetadata } = chat,
                { subject, participants } = groupMetadata;

            let contacts = new MyArray();
            for (const { contact } of participants.getModelsArray()) {
                let {
                    id: { user },
                    name,
                    pushname,
                } = contact.serialize();
                contacts.push([pushname || name || user, user]);
            }

            // let { fileUrl, fileName } = CSVFile.createFile(subject, contacts),
            //     fname = exportType === "csv" ? `${fileName}.csv` : `${subject}.xlsx`;
            let btn = createDonwloadBtn(subject);

            if (!downloadMenu) {
                chatMenu.insertBefore(btn, chatMenu.firstChild);
            } else if (downloadMenu && e.target === downloadMenu) {
                if (await user.check()) {
                    return exportDataToFile(contacts, subject);
                }
            }
        }
    }
}

const listeners = new AppEvents();
export { AppEvents as default, listeners };
