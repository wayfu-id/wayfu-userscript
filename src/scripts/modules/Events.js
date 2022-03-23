import MyDate from "../models/MyDate";
import { options } from "../models/Settings";
import { modal } from "../models/Modals";
import { report } from "../models/Reports";
import { loop } from "../models/Interval";
import { queue } from "../models/Queue";
import { user } from "../models/Users";
import { changes } from "../models/Changeslog";
import { DOM } from "../lib/DOM";
import { dateFormat, isNumeric } from "../lib/Util";
import {
    loadRecipient,
    resetRecipient,
    checkStatus,
    startProcess,
    initMessage,
} from "./Main";

class AppEvents {
    constructor() {}
    async runTasks(e) {
        const { autoMode, useImage } = options;
        if (await checkStatus()) return;

        let time = !autoMode ? 10 : !useImage ? 55e2 : 6e3;
        let fn = () => {
            return startProcess();
        };

        initMessage();
        report.reset(autoMode);
        loop.set(time, fn);
        startProcess();
    }
    tabMenu(e) {
        const elm = e.currentTarget || e.target,
            menuName = elm.value,
            tabs = DOM.getElement("#panelBody .menus", true);
        DOM.setElements([
            {
                elm: tabs,
                props: {
                    removeClass: "active",
                },
            },
            {
                elm: elm,
                props: {
                    addClass: "active",
                },
            },
        ]).setElementsStyle([
            {
                elm: "#panelBody .menu-content",
                props: {
                    display: "none",
                },
            },
            {
                elm: `#${menuName}`,
                props: {
                    display: "block",
                },
            },
        ]);

        options.setOption("activeTab", Array.from(tabs).indexOf(elm));
    }
    async autoMode(e) {
        const imgs = DOM.getElement("#useImage"),
            elm = e.currentTarget || e.target;

        if (elm.checked) elm.checked = await user.check();
        if (imgs.checked) imgs.click();

        options.setOption("autoMode", elm.checked);
    }
    async useImage(e) {
        const useCapt = options.useCaption === "caption",
            elm = e.currentTarget || e.target,
            mode = DOM.getElement("#_mode");

        if (elm.checked) {
            elm.checked = await user.check();
            mode.checked = elm.checked;
        }

        const chk = useCapt ? !elm.checked : true,
            title = useCapt ? "" : "Caption menggunakan pesan",
            captId = elm.dataset.captId;

        DOM.setElements([
            {
                elm: `#${elm.value}`,
                props: { disabled: !elm.checked },
            },
            {
                elm: `#${captId}`,
                props: { disabled: chk, title: title },
            },
            {
                elm: "#useCaption",
                props: { disabled: !elm.checked },
            },
        ]);

        options.setOptions({
            autoMode: mode.checked,
            useImage: elm.checked,
        });
    }
    loadData(e) {
        const elm = e.currentTarget || e.target,
            reader = new FileReader();

        reader.onload = (f) => {
            let lines = f.currentTarget.result.split(/\r\n|\r|\n/);
            loadRecipient(lines);
        };
        resetRecipient();
        reader.readAsText(elm.files[0]);
    }
    imagePreview(e) {
        const elm = e.currentTarget || e.target,
            btn = elm.dataset.value,
            mByte = Math.pow(1024, 2),
            maxSize = 4 * mByte;

        let imgFile = null;

        if (!btn) {
            imgFile = elm.files[0];
            if (imgFile && imgFile.size > maxSize) {
                modal.alert("Ukuran gambar tidak boleh lebih dari 4MB");
                imgFile = null;
            }
        } else {
            DOM.setElement(`#${btn}`, {
                value: "",
            });
        }

        DOM.setElement("#_img-output", {
            src: imgFile ? URL.createObjectURL(imgFile) : "",
        }).setElementStyle("#_deleteImg", {
            display: imgFile ? "block" : "none",
        });

        options.setOptions({ hasImage: !!imgFile, imageFile: imgFile });
    }
    toggleApp(e) {
        const elm = e.currentTarget || e.target,
            id = elm.getAttribute("value"),
            acdBody = DOM.getElement(`#${id}`),
            a = elm.classList.toggle("active");

        acdBody.style.height = acdBody.style.height ? null : `${acdBody.scrollHeight}px`;

        options.setOption("openPanel", a);
    }
    inputRange(e) {
        const elm = e.currentTarget || e.target,
            { id, value } = elm;
        DOM.setElements([
            {
                elm: elm,
                props: {
                    max: id === "maxQueue" ? options.queueLimit : options.bpLimit,
                },
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
    inputChecks(e) {
        const elm = e.currentTarget || e.target,
            { id, value } = elm;
        options.setOption(id, value);
    }
    inputSelects(e) {
        const elm = e.currentTarget || e.target,
            { id, value } = elm;
        switch (id) {
            case "themeColor":
                (function (id, val) {
                    DOM.setElementStyle("#wayfuPanel", {
                        backgroundColor: val,
                    });

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
                        options.setOptions({
                            isFormat: false,
                            dateFormat: val,
                        });
                        const files = DOM.getElement("#getFile");
                        if (!queue.isEmpty || files.value !== "") {
                            DOM.setElement(files, {
                                value: "",
                            });
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

            DOM.createElement({
                tag: "span",
                text: title,
                append: items,
            });

            DOM.createListElement("ul", e.content, {
                append: items,
            });
        });
        // console.log(container);
        modal.alert(container, "Detail Pembaruan.");
    }
}

const listeners = new AppEvents();
export { AppEvents as default, listeners };
