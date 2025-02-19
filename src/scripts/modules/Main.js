import CSVFile, { csvFile } from "../models/CSVFile";
import Queue, { queue } from "../models/Queue";
import { svgData } from "../lib/Constant";
import { loop } from "../models/Interval";
import { report } from "../models/Reports";
import { modal } from "../models/Modals";
import { options } from "../models/Settings";
import { user } from "../models/Users";
import { message } from "../models/Messages";
import { validator } from "./Validators";
import { DOM } from "../lib/HtmlModifier";
import MyArray from "../models/MyArray";

/**
 * Check Current status to conclude current process will be started or not
 * @returns {Promise<boolean>}
 */
async function checkStatus() {
    if (queue.currentIndex !== 0 && !!queue.now) {
        return !(await modal.confirm(`Lanjutkan Proses dari data ke-${queue.currentIndex + 1}?`))
            ? (await modal.confirm("Proses ulang dari awal?"))
                ? (reloadRecipient(), false)
                : true
            : false;
    }
    const isValid = ((v) => {
        const props = {
            message: { rules: ["notEmpty"] },
            queue: { rules: ["notEmpty", "belowMax"] },
        };
        return v.validate(props);
    })(validator);

    validator.showError();
    return !isValid;
}

/**
 * Load the recepient data
 * @param {CSVFile} csvFile
 */
function loadRecipient(csvFile) {
    let mIdx =
        options.dateFormat !== "auto" ? options.dateFormat : csvFile.options.monthIndex || options.monthIndex;

    let isFormat = mIdx == 2;
    options.setOptions(Object.assign({}, csvFile.options, { monthIndex: mIdx, isFormat: isFormat }));
    queue.setData(csvFile.data);
    updateUI();
    // console.info(`Blast!: ${this.queue.size} Data Loaded`);
}

/**
 * Reloading recipients data
 */
function reloadRecipient() {
    queue.reload();
    updateUI();
}

/**
 * Reset recipients data, and delete current loaded CSV file
 */
function resetRecipient() {
    queue.reset();
    updateUI();
}

/**
 * Set current process status
 * @param {boolean} stat
 * @returns
 */
function setStatus(stat) {
    let stopIc =
            "M505.16405,19.29688c-1.176-5.4629-6.98736-11.26563-12.45106-12.4336C460.61647,0,435.46433,0,410.41962,0,307.2013,0,245.30155,55.20312,199.09162,128H94.88878c-16.29733,0-35.599,11.92383-42.88913,26.49805L2.57831,253.29688A28.39645,28.39645,0,0,0,.06231,264a24.008,24.008,0,0,0,24.00353,24H128.01866a96.00682,96.00682,0,0,1,96.01414,96V488a24.008,24.008,0,0,0,24.00353,24,28.54751,28.54751,0,0,0,10.7047-2.51562l98.747-49.40626c14.56074-7.28515,26.4746-26.56445,26.4746-42.84374V312.79688c72.58882-46.3125,128.01886-108.40626,128.01886-211.09376C512.07522,76.55273,512.07522,51.40234,505.16405,19.29688ZM384.05637,168a40,40,0,1,1,40.00589-40A40.02,40.02,0,0,1,384.05637,168ZM35.68474,352.06641C9.82742,377.91992-2.94985,442.59375.57606,511.41016c69.11565,3.55859,133.61147-9.35157,159.36527-35.10547,40.28913-40.2793,42.8774-93.98633,6.31147-130.54883C129.68687,309.19727,75.97,311.78516,35.68474,352.06641Zm81.63312,84.03125c-8.58525,8.584-30.08256,12.88672-53.11915,11.69922-1.174-22.93555,3.08444-44.49219,11.70289-53.10938,13.42776-13.42578,31.33079-14.28906,43.51813-2.10352C131.60707,404.77148,130.74562,422.67188,117.31786,436.09766Z",
        blastIc =
            "M505.12019,19.09375c-1.18945-5.53125-6.65819-11-12.207-12.1875C460.716,0,435.507,0,410.40747,0,307.17523,0,245.26909,55.20312,199.05238,128H94.83772c-16.34763.01562-35.55658,11.875-42.88664,26.48438L2.51562,253.29688A28.4,28.4,0,0,0,0,264a24.00867,24.00867,0,0,0,24.00582,24H127.81618l-22.47457,22.46875c-11.36521,11.36133-12.99607,32.25781,0,45.25L156.24582,406.625c11.15623,11.1875,32.15619,13.15625,45.27726,0l22.47457-22.46875V488a24.00867,24.00867,0,0,0,24.00581,24,28.55934,28.55934,0,0,0,10.707-2.51562l98.72834-49.39063c14.62888-7.29687,26.50776-26.5,26.50776-42.85937V312.79688c72.59753-46.3125,128.03493-108.40626,128.03493-211.09376C512.07526,76.5,512.07526,51.29688,505.12019,19.09375ZM384.04033,168A40,40,0,1,1,424.05,128,40.02322,40.02322,0,0,1,384.04033,168Z";

    DOM.setElements([{ elm: "#_blast-ico", props: { d: stat ? stopIc : blastIc } }]);
    if (!stat || !DOM.getElement(".progress-panel")) {
        modal.progressPanel(stat, interupt);
    }

    return stat;
}

/**
 * Start sending process
 */
async function startProcess() {
    const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));
    if (!loop.isRunning) loop.start(setStatus);
    if (loop.isRunning && !!queue.now) {
        let {
                useCaption: c,
                useAttc: i,
                hasAttc: h,
                msgAttc: { type: t },
            } = options,
            no = (queue.currentIndex += 1),
            data = queue.run(),
            messej = message.setData(data),
            stat = "";

        // message.setData(data);
        updateUI(no, messej.phone);

        await wait(5e2);
        stat = await (async (c) =>
            (c === "caption" || !(i && h) || t === "PDF"
                ? await messej.sendText()
                : await window.WAPI.openChat(messej.phone)) !== false
                ? "SUCCESS"
                : "ERROR")(c);

        await wait(1e2);
        if (stat === "SUCCESS") {
            stat = i && h ? ((await messej.sendImg()) ? "SUCCESS" : "FAILED") : stat;
        }

        await wait(4e2);
        switch (stat) {
            case "SUCCESS":
                report.success(data);
                break;
            case "FAILED":
                report.fail(data, 0);
                break;
            case "ERROR":
                report.fail(data);
                break;
        }

        await wait(35e2);
    } else {
        stopProcess();
    }
}

/**
 * Interupt current process
 */
async function interupt() {
    loop.break(setStatus);
    if (queue.now && (await modal.confirm("Stop Proses?"))) {
        stopProcess();
    } else {
        startProcess();
    }
}

/**
 * Stop current process
 */
function stopProcess() {
    if (!user.isPremium) {
        user.updateTrial("update");
    }
    loop.stop(setStatus);
    showReport();
}

/**
 * Show last porcess report
 */
async function showReport() {
    if (queue.isEmpty) {
        DOM.setElement("#getFile", { value: "" });
        resetRecipient();
    }
    /** @type {(type: "sukses" | "gagal" | "error") => string} */
    const btnDownload = (type) => {
        const { count, data } = report.createData(type),
            { downloadBtnSvg } = svgData;

        if (data.isEmpty) return count;

        const { fileName } = csvFile.export(type, data);
        const icon = DOM.createSVGElement(downloadBtnSvg, { viewBox: "0 0 512 512" });
        const btnWrap = DOM.createElement({
            tag: "a",
            title: `Download "${fileName}"`,
            classid: "wfu-export-csv",
            href: "#",
        });

        btnWrap.appendChild(icon);
        btnWrap.dataset.reportType = type;

        return `${count} ` + btnWrap.outerHTML;
    };
    let title = "[REPORT] Kirim Pesan Otomatis Selesai.";
    let text = DOM.createListElement(
        [
            `SUKSES  = ${btnDownload("sukses")}`,
            `GAGAL   = ${btnDownload("gagal")}`,
            `ERROR   = ${btnDownload("error")}`,
        ],
        "ul",
        { classid: "wfu-reports" }
    );
    modal.alert(text, title);
    if (await DOM.hasElement(".wfu-reports a[data-report-type]")) {
        let downloadBtn = DOM.getElement(".wfu-reports a[data-report-type]", true);
        /** @type {EventListener} */
        function download(e) {
            let elm = e.currentTarget || e.target,
                type = elm.dataset.reportType;
            let { data } = report.createData(type),
                { fileName } = csvFile.export(type, data);

            return exportDataToFile(data, fileName);
        }
        downloadBtn.forEach((el) => DOM.onEvent(el, "click", download));
    }
    if (!user.isPremium) {
        user.showAlert(!user.isTrial ? (DOM.getElement("#auto").click(), 4) : 3, true);
    }
    window.WAPI.Chat.clearAllDraft();
}

/**
 * Update current UI frequently
 * @param {number} index
 * @param {string|null} phone
 */
function updateUI(index = 0.5, phone = null) {
    let { size: num, isEmpty } = queue,
        display = isEmpty ? "none" : "inline-block",
        title = !isEmpty ? `Data: Loaded, ${num} Nomor` : "";

    DOM.setElements([
        { elm: "#_file-info", props: { title: title, style: `display:${display}` } },
        { elm: "span.curPhone", props: { text: `+${phone || ""}` } },
        { elm: "#_data-count", props: { text: num } },
    ]);
    if (isEmpty) {
        let mode = DOM.getElement("#_mode");
        if (mode.checked) mode.click();
        DOM.setElement(mode, { disabled: isEmpty });
    }
    showProgress(queue, index);
}

/**
 * Measure and Show current progress
 * @param {Queue} queue
 * @param {number} index
 */
function showProgress(queue, index) {
    let length = queue.long || 100,
        width = (index / length) * 100;
    if (index >= 1) {
        DOM.setElements([
            { elm: ".waBar", props: { title: `${index}/${length}` } },
            { elm: "span.curNumb", props: { text: `${index}/${length}` } },
        ]);
    }
    DOM.setElementStyle(".waBar", { width: `${width}%` });
}

/**
 * @param {MyArray} data
 * @param {string} title
 * @return {void}
 */
async function exportDataToFile(data, title) {
    /** @type {(classid: string | string[]) => HTMLElement} */
    const container = (classid) => {
        return DOM.createElement({ tag: "div", classid: classid });
    };
    /** @type {EventListener} */
    function changeType(e) {
        const { id, value } = e.currentTarget || e.target;
        if (id !== "fileType") return;
        options.setOption(id, value);
    }
    /** @type {EventListener} */
    function saveType(e) {
        const { id, checked } = e.currentTarget || e.target;
        if (id !== "set_fileType") return;
        let { fileType } = options;

        options.setOption("exportType", checked ? fileType : "ask");
    }

    /** @type {(id: string) => HTMLElement} */
    let innerModal = (id) => {
        const outer = container("wfu-options");

        const selectEl = ((id, { fileType }, { checksSvg }) => {
            const opt = ["csv", "xlsx"];
            const outer = container("row");
            const label = (() => {
                let outer = container("_label"),
                    inner = DOM.createLabelElement({ id, text: `Simpan file sebagai` });
                outer.appendChild(inner);
                return outer;
            })();
            const input = (() => {
                let outer = container("_input"),
                    inner = DOM.createLabelElement({ id, classid: "select" });
                let select = DOM.createSelectElement({ id }, opt, { change: changeType }),
                    ico = DOM.createSVGElement(checksSvg, { viewBox: "0 0 10 6" });

                select.value = fileType;
                inner.append(select, ico);
                outer.appendChild(inner);
                return outer;
            })();

            outer.append(label, input);
            return outer;
        })(id, options, svgData);

        const checksEl = ((id) => {
            const outer = container("row right");
            const check = DOM.createCheckElement(
                { id: `set_${id}`, classid: "_input checks" },
                { change: saveType }
            );
            const label = DOM.createLabelElement({
                id: `set_${id}`,
                classid: "_label",
                text: `Simpan pengaturan`,
            });

            outer.append(check, label);
            return outer;
        })(id);
        // console.log(outer, checksEl);
        outer.append(selectEl, checksEl);

        return outer;
    };

    let { fileUrl, fileName } = CSVFile.createFile(title, data),
        { exportType } = options;

    if (exportType === "ask") {
        if (!(await modal.confirm(innerModal("fileType"), `Download "${title}"`))) return;
        exportType = options.fileType;
    }

    return exportType === "xlsx"
        ? CSVFile.exportToXlsx(title, data)
        : DOM.createElement({ tag: "a", href: fileUrl, download: `${fileName}` }).click();
    //     return DOM.createElement({
    //         tag: "a",
    //         href: fileUrl,
    //         download: `${fileName}`,
    //     }).click();
    // } else {
    //     return CSVFile.exportToXlsx(title, data);
    // }
    // if (await modal.confirm(innerModal("fileType"), `Download "${title}"`)) {
    //     const { fileUrl, fileName } = CSVFile.createFile(title, data),
    //         { exportType } = options;
    //     if (exportType === "csv") {
    //         DOM.createElement({
    //             tag: "a",
    //             href: fileUrl,
    //             download: `${fileName}`,
    //         }).click();
    //     } else {
    //         CSVFile.exportToXlsx(title, data);
    //     }
    // }

    // return;
}

export { checkStatus, loadRecipient, resetRecipient, reloadRecipient, startProcess, exportDataToFile };
