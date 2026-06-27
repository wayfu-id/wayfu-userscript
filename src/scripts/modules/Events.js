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
import { check, getPDFPageThumb, isNumeric, titleCase, readBuffer, stringToBytes } from "../lib/Util";
import MyArray from "../models/MyArray";
import { loadRecipient, resetRecipient, checkStatus, startProcess, exportDataToFile } from "./Main";
import { hidden } from "ansi-colors";

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
        if (!(await user.check())) return;
        if (await checkStatus()) return;

        const { useAttc, hasAttc } = options,
            time = !useAttc && !hasAttc ? 55e2 : 6e3,
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

        options.setOption("useAttc", elm.checked);
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
    async imagePreview(e) {
        const elm = e.currentTarget || e.target,
            btn = elm.dataset.value,
            isPDF = check(stringToBytes("%PDF"));

        let imgFile = null,
            imgSrc = "",
            type = "";

        if (!btn) {
            imgFile = elm.files[0];

            let buffers = await readBuffer(imgFile, 0, 8),
                uint8array = new Uint8Array(buffers),
                maxSize = (isPDF(uint8array) ? 100 : 4) * Math.pow(1024, 2);

            if (imgFile && imgFile.size > maxSize) {
                modal.alert(`Ukuran lampiran: ${type}, tidak boleh lebih dari ${maxSize / Math.pow(1024, 2)}MB`);
                imgFile = null;
                elm.files = [];
            }

            type = imgFile ? (isPDF(uint8array) ? "PDF" : "Image") : "";
            imgSrc = imgFile ? (isPDF(uint8array) ? await getPDFPageThumb(imgFile) : URL.createObjectURL(imgFile)) : "";
        } else {
            elm.files = [];
            DOM.setElement(`#${btn}`, { value: "" });
        }

        DOM.setElement("#_img-output", {
            src: imgSrc,
        }).setElementStyle("#_deleteImg", {
            display: imgFile ? "block" : "none",
        });

        DOM.setElement("#_caption", {
            disabled: (imgFile && type === "PDF") || options.useCaption === "pesan",
            title:
                imgFile && type === "PDF"
                    ? "Caption tidak tersedia untuk lampiran: PDF"
                    : options.useCaption === "pesan"
                      ? "Caption menggunakan pesan"
                      : "",
        });

        message.setProperties({ msgAttc: { media: imgFile, type, sendAsHD: options.imageQuality == "hd" } });
        options.setOptions({
            hasAttc: !!imgFile,
            msgAttc: { media: imgFile, type, sendAsHD: options.imageQuality == "hd" },
        });
    }

    /**
     * Open and close panel toggle button
     * @param {Event} e Event
     */
    toggleApp(e) {
        const elm = e.currentTarget || e.target,
            // { active } = window.WAPI.WebClassesV2,
            a = elm.classList.toggle("active");

        const acdBody = ((e) => {
            let targetId = e.getAttribute("value") || e.dataset.target;

            return DOM.getElement(`#${targetId}`);
        })(elm);

        acdBody.style.height = acdBody.style.height ? null : `${acdBody.scrollHeight}px`;

        // elm.classList.toggle(active);

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
                                "[WARNING] Masukkan ulang CSV",
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
                            "Mengubah Pesan menjadi Caption akan menaikan potensi Banned dari WhatsApp. Apa Anda Yakin?",
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
            case "imageQuality":
                (async function (id, val) {
                    // console.log(id, val);
                    options.setOption(id, val);
                    // console.log(options);
                })(id, value);
                break;
        }
    }

    /**
     * ChangeLog listener
     * @deprecated
     * @param {Event} e Event
     */
    changeLog(e) {}

    /**
     * Checing current chat active
     * @param {Event} e Event
     */
    async checkChat(e) {
        const menuButton = await DOM.hasElement(`#main header .html-span button.html-button`);
        const chatMenu = menuButton.parentElement,
            outerMenu = chatMenu.parentElement;

        let chat = window.WAPI.Chat.getActive();
        if (!chat) {
            return;
        }
        chat = chat.getModel();
        if (!chat.isGroup) {
            return;
        }

        let { name, id, participants } = chat,
            contacts = new MyArray();

        participants.forEach(({ contact }) => {
            const { id, phoneNumber } = contact;
            let phone =
                phoneNumber ??
                ((id) => {
                    return ((id?.isLid?.() ? window.WAPI?.LidUtils?.getPhoneNumber?.(id) : id) || id).user;
                })(id);

            contacts.push([contact.pushname || contact.name || phone, phone]);
        });

        let btn = createDonwloadBtn(name);
        let container = outerMenu.parentElement;
        const downloadMenu = DOM.getElement("button[data-icon='download-alt']", container);
        if (!downloadMenu) {
            container.insertBefore(btn, outerMenu);
            container.style.display = "flex";
        } else if (downloadMenu && e.target === downloadMenu) {
            if (await user.check()) {
                return await exportDataToFile(contacts, name);
            }
        }
    }
}

/** @type {(filename: string) => HTMLElement} */
const createDonwloadBtn = (filename) => {
    const menuButton = DOM.getElement(`#main header .html-span button.html-button`),
        chatMenu = menuButton.parentElement,
        outerMenu = chatMenu.parentElement,
        svgElm = DOM.getElement("svg", menuButton);

    const createButtonEl = ((name) => {
        const outerSvg = svgElm.parentElement;
        const svgContainer = outerSvg.parentElement;
        const outContainer = svgContainer.parentElement;
        const innerButton = outContainer.parentElement;

        const svgBtn = DOM.createSVGElement(svgData.groupDownloadBtnSvg, {
            classid: svgElm.classList.value,
            height: "24",
            width: "24",
        });
        const svgOuter = DOM.createElement({
            tag: outerSvg.tagName.toLocaleLowerCase(),
            classid: outerSvg.classList.value,
            html: svgBtn.outerHTML,
        });
        const innerContainer = DOM.createElement({
            tag: svgContainer.tagName.toLocaleLowerCase(),
            classid: svgContainer.classList.value,
            html: svgOuter.outerHTML,
        });
        const outerContainer = DOM.createElement({
            tag: outContainer.tagName.toLocaleLowerCase(),
            classid: outContainer.classList.value,
            html: innerContainer.outerHTML,
        });
        const innerBtn = DOM.createElement({
            tag: innerButton.tagName.toLocaleLowerCase(),
            classid: innerButton.classList.value,
            html: outerContainer.outerHTML,
        });
        return DOM.createElement({
            tag: menuButton.tagName.toLocaleLowerCase(),
            classid: `${menuButton.classList.value}`,
            "data-testid": "download-alt",
            "data-icon": "download-alt",
            tabindex: "0",
            "data-tab": "6",
            "aria-disabled": false,
            title: `Download "${name}"`,
            "aria-label": `Download "${name}"`,
            "aria-expanded": "false",
            type: "button",
            html: innerBtn.outerHTML,
        });
    })(filename);

    return ((createButtonEl) => {
        let btn = DOM.createElement({
            tag: chatMenu.tagName.toLocaleLowerCase(),
            classid: `${chatMenu.classList.value} wfu-link`,
            html: createButtonEl.outerHTML,
        });

        return DOM.createElement({
            tag: outerMenu.tagName.toLocaleLowerCase(),
            classid: outerMenu.classList.value,
            html: btn.outerHTML,
        });
    })(createButtonEl);
};

const listeners = new AppEvents();
export { AppEvents as default, listeners };
