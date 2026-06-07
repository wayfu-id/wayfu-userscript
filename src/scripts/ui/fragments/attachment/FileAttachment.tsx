import { useApp } from "../../context/AppContext";
import { Icons } from "../../components/Index";
import { FilePreview } from "./Index";
import { getPdfFirstPageUrl } from "../../../utilities/DocumentUtils";
import React, { useState, useRef } from "react";

export default function FileAttachment() {
    const app = useApp(),
        { Settings } = app ?? { Settings: null };

    let isHD = Settings?.imageQuality === "HD" || false,
        attachFile: File | null = Settings?.attachFile ?? null,
        pdfFile = attachFile?.type === "application/pdf" || false,
        imgUrl = attachFile && !pdfFile ? URL.createObjectURL(attachFile) : "";

    const fileRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(attachFile);
    const [previewUrl, setPreview] = useState<string>(imgUrl);
    const [isPdf, setIsPdf] = useState(pdfFile);

    if (file && isPdf) {
        getPdfFirstPageUrl(file).then((url) => {
            setPreview(url);
        });
    }

    const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const picked = e.target.files?.[0];
        if (!picked) return;
        const isPdfFile = picked.type === "application/pdf",
            maxSize = (isPdfFile ? 100 : 4) * 1024 * 1024;

        if (picked.size > maxSize) {
            app.trigger("modal:alert", {
                type: "error",
                title: "File terlalu besar",
                message: `Ukuran file tidak boleh lebih dari *${isPdfFile ? 100 : 4}MB*.`,
            });
            if (fileRef.current) fileRef.current.value = "";
            return;
        }

        setFile(picked);
        setIsPdf(isPdfFile);
        if (isPdfFile) {
            setPreview(""); // clear while loading
            getPdfFirstPageUrl(picked).then((pageUrl) => {
                setPreview(pageUrl);
            });
        } else {
            setPreview(URL.createObjectURL(picked));
        }
        app.trigger("message:attach", picked);
    };

    const clearAttachment = () => {
        setFile(null);
        setPreview("");
        setIsPdf(false);
        app.trigger("message:attach", null);
        if (fileRef.current) fileRef.current.value = "";
    };

    const openPicker = () => fileRef.current?.click();

    return (
        <>
            <input
                ref={fileRef}
                type="file"
                title="Pilih gambar atau PDF"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFilePick}
                // reset value so onChange fires even if same file is picked
                onClick={(e) => (e.currentTarget.value = "")}
            />
            {!!file ? (
                <FilePreview isPdf={isPdf} isHd={isHD} url={previewUrl} onRemove={clearAttachment} />
            ) : (
                <div className="wf-attach-upload" onClick={openPicker}>
                    <Icons.Upload />
                    <p>
                        <strong>Klik untuk memilih</strong>
                        <br />
                        gambar / PDF (maks. 4MB)
                    </p>
                </div>
            )}
        </>
    );
}
