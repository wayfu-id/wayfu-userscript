import CSVFile, { csvFile } from "../models/CSVFile";
import Queue, { queue } from "../models/Queue";
import { queryElm } from "../lib/Constant";
import { loop } from "../models/Interval";
import { report } from "../models/Reports";
import { modal } from "../models/Modals";
import { options } from "../models/Settings";
import { user } from "../models/Users";
import { message } from "../models/Messages";
import { validator } from "./Validators";
import { DOM } from "../lib/HtmlModifier";

/**
 * Check Current status to conclude current process will be started or not
 * @returns {Promise<boolean>}
 */
async function checkStatus() {
    if (queue.currentIndex !== 0 && !!queue.now) {
        return !(await modal.confirm(
            `Lanjutkan Proses dari data ke-${queue.currentIndex + 1}?`
        ))
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
        options.dateFormat !== "auto"
            ? options.dateFormat
            : csvFile.options.monthIndex || options.monthIndex;

    let isFormat = mIdx == 2;
    options.setOptions(
        Object.assign({}, csvFile.options, { monthIndex: mIdx, isFormat: isFormat })
    );
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

    // console.log(stat ? "Blasting..." : "Stoped.");
    return stat;
}

/**
 * Start sending process
 */
function startProcess() {
    const { linkElm, errModal, send } = queryElm;
    const printLink = (link) => {
        DOM.setElement(linkElm, { href: `https://${link}` });
        return true;
    };

    if (!loop.isRunning) loop.start(setStatus);
    if (loop.isRunning && !!queue.now) {
        let no = (queue.currentIndex += 1),
            data = queue.run();
        message.setData(data);
        if (printLink(message.link)) {
            setTimeout(() => {
                DOM.getElement(linkElm).click();
            }, 5e2);
            setTimeout(async () => {
                const err = DOM.getElement(errModal);
                let stat = "";
                if (err) {
                    stat = err.innerText.includes("OK")
                        ? (report.fail(data), "ERROR")
                        : (report.fail(data, 0), "FAILED");
                    err.click();
                } else {
                    const { useCaption: c, useImage: i, hasImage: h } = options;
                    const btn = DOM.getElement(send);

                    stat = btn ? (btn.click(), "SUCCESS") : "FAILED";

                    if (i && h && (c !== "caption" || stat === "SUCCESS")) {
                        stat = (await message.sendImg()) === true ? "SUCCESS" : "FAILED";
                    }

                    stat === "SUCCESS" ? report.success() : report.fail(data, 0);
                }
            }, 45e2);
        } else {
            modal.alert("If You see this ERROR, Contact Developer!");
            loop.stop(setStatus);
            return;
        }
        updateUI(no, message.phone);
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
function showReport() {
    if (queue.isEmpty) {
        DOM.setElement("#getFile", { value: "" });
        resetRecipient();
    }
    const btnDownload = (type) => {
        const { count, data } = report.createData(type);
        if (data.isEmpty) return count;

        const { fileUrl, fileName } = csvFile.export(type, data);
        const downloadIco = {
            viewBox: "0 0 512 512",
            fill: "currentColor",
            d: "M480 352h-133.5l-45.25 45.25C289.2 409.3 273.1 416 256 416s-33.16-6.656-45.25-18.75L165.5 352H32c-17.67 0-32 14.33-32 32v96c0 17.67 14.33 32 32 32h448c17.67 0 32-14.33 32-32v-96C512 366.3 497.7 352 480 352zM432 456c-13.2 0-24-10.8-24-24c0-13.2 10.8-24 24-24s24 10.8 24 24C456 445.2 445.2 456 432 456zM233.4 374.6C239.6 380.9 247.8 384 256 384s16.38-3.125 22.62-9.375l128-128c12.49-12.5 12.49-32.75 0-45.25c-12.5-12.5-32.76-12.5-45.25 0L288 274.8V32c0-17.67-14.33-32-32-32C238.3 0 224 14.33 224 32v242.8L150.6 201.4c-12.49-12.5-32.75-12.5-45.25 0c-12.49 12.5-12.49 32.75 0 45.25L233.4 374.6z",
        };
        const elm = {
            tag: "a",
            href: fileUrl,
            html: DOM.createSVGElement(downloadIco).outerHTML,
            download: `${fileName}`,
            classid: "wfu-export-csv",
            title: `Download "${fileName}"`,
        };

        return `${count} ` + DOM.createElement(elm).outerHTML;
    };
    let title = "[REPORT] Kirim Pesan Otomatis Selesai.",
        text = DOM.createListElement(
            [
                `SUKSES  = ${report.sukses}`,
                `GAGAL   = ${btnDownload("gagal")}`,
                `ERROR   = ${btnDownload("error")}`,
            ],
            "ul",
            { classid: "wfu-reports" }
        );
    modal.alert(text, title);
    if (!user.isPremium) {
        user.showAlert(!user.isTrial ? (DOM.getElement("#auto").click(), 4) : 3, true);
    }
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

export { checkStatus, loadRecipient, resetRecipient, reloadRecipient, startProcess };
