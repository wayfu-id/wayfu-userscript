import MyDate from "../models/MyDate";
import { Debug } from "./Debug";
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
import { dateFormat, isNumeric } from "../lib/Util";
import MyArray from "../models/MyArray";
import { loadRecipient, resetRecipient, checkStatus, startProcess } from "./Main";

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
            tabs = DOM.getElement("#panelBody .menus", true);

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
                elm: "#panelBody .menu-content",
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
            form = DOM.getElement("#panelBody textarea", true),
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
        const { id, value, innerText } = e.target || e.currentTarget,
            key = id === "message" ? "Message" : "Caption",
            props = {};

        props[`input${key}`] = value || innerText;
        message.setProperties(props);
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
            id = elm.getAttribute("value"),
            acdBody = DOM.getElement(`#${id}`),
            a = elm.classList.toggle("active");

        acdBody.style.height = acdBody.style.height ? null : `${acdBody.scrollHeight}px`;

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
        }
    }

    /**
     * ChangeLog listener
     * @param {Event} e Event
     */
    changeLog(e) {
        const container = DOM.createElement({
                tag: "div",
                classid: "wfu-changelog",
                style: "overflow-y:scroll",
            }),
            changelog = changes.Log.slice(0, 5);

        changelog.forEach((e, i) => {
            let date = dateFormat(new MyDate(e.date), 1),
                title = `${i == 0 ? "WayFu" + " - " : ""}Version: ${e.version} (${date})`,
                items = DOM.createElement({
                    tag: "div",
                    classid: "wfu-changelog-items",
                    append: container,
                });

            DOM.createElement({ tag: "span", text: title, append: items });
            DOM.createListElement(e.content, "ul", { append: items });
        });
        // console.log(container);
        modal.alert(container, "Detail Pembaruan.");
    }

    /**
     * Checing current chat active
     * @param {Event} e Event
     */
    async checkChat(e) {
        const { chatHeader, menu, menuDefault, item, button } = window.WAPI.WebClassesV2,
            chatMenu = DOM.getElement(`.${chatHeader} .${menu}.${menuDefault}`),
            downloadMenu = DOM.getElement("span[data-icon='download-alt']", chatMenu);

        const createDonwloadBtn = (data) => {
            const downloadBtn = (({ fileName }) => {
                let ico = DOM.createSVGElement({
                    size: "24 24",
                    fill: "currentColor",
                    d: [
                        "M18.948 11.112C18.511 7.67 15.563 5 12.004 5c-2.756 0-5.15 1.611-6.243 4.15-2.148.642-3.757 2.67-3.757 4.85 0 2.757 2.243 5 5 5h1v-2h-1c-1.654 0-3-1.346-3-3 0-1.404 1.199-2.757 2.673-3.016l.581-.102.192-.558C8.153 8.273 9.898 7 12.004 7c2.757 0 5 2.243 5 5v1h1c1.103 0 2 .897 2 2s-.897 2-2 2h-2v2h2c2.206 0 4-1.794 4-4a4.008 4.008 0 0 0-3.056-3.888z",
                        "M13.004 14v-4h-2v4h-3l4 5 4-5z",
                    ],
                });

                return DOM.createElement({
                    tag: "span",
                    title: `Download "${fileName}"`,
                    "data-testid": "download-alt",
                    "data-icon": "download-alt",
                    classid: "wfu-link",
                    html: ico.outerHTML,
                });
            })(data);

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

            let data = CSVFile.createFile(subject, contacts),
                btn = createDonwloadBtn(data);

            if (!downloadMenu) {
                chatMenu.insertBefore(btn, chatMenu.firstChild);
            } else if (downloadMenu && e.target === downloadMenu) {
                if (await user.check()) {
                    let { fileUrl, fileName } = data;
                    DOM.createElement({
                        tag: "a",
                        href: fileUrl,
                        download: `${fileName}`,
                    }).click();
                }
            }
        }
    }
}

const listeners = new AppEvents();
export { AppEvents as default, listeners };
