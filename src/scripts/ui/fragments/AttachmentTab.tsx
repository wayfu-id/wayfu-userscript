import App from "../../App";
import { Icons, Button, ToggleSwitch } from "../components/Index";
import React, { useState } from "react";

export default function AttachmentTab({ app }: { app?: App }) {
    const [hasImg, setHasImg] = useState(false);
    const [imgEnabled, setImgEnabled] = useState(false);

    let handleEnableImage: React.ChangeEventHandler<HTMLInputElement, HTMLInputElement> | undefined = (e) => {
        setImgEnabled(e.target.checked);
        if (!e.target.checked) setHasImg(false);
    };

    return (
        <>
            <div className="wf-attach-toggle-row">
                <span className="wf-attach-toggle-label">Aktifkan Lampiran Gambar</span>
                <ToggleSwitch checked={imgEnabled} onChange={handleEnableImage} />
            </div>

            {imgEnabled && (
                <>
                    {hasImg ? (
                        <div className="wf-attach-preview">
                            <img
                                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='120'%3E%3Crect width='300' height='120' fill='%23009A4B' opacity='.15'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='14' fill='%23009A4B'%3Ewayfu-logo.png%3C/text%3E%3C/svg%3E"
                                alt="preview"
                            />
                            <Button className="wf-attach-preview-del" onClick={() => setHasImg(false)}>
                                <Icons.Close size={12} />
                            </Button>
                        </div>
                    ) : (
                        <div className="wf-attach-upload" onClick={() => setHasImg(true)}>
                            <Icons.Upload />
                            <p>
                                <strong>Klik untuk memilih</strong>
                                <br />
                                gambar / PDF (maks. 4MB)
                            </p>
                        </div>
                    )}
                    <div>
                        <div className="wf-label">Caption</div>
                        <input className="wf-caption-input" placeholder="Tulis caption di sini (opsional)…" />
                    </div>
                </>
            )}

            {!imgEnabled && (
                <div className="px-24 text-center text-[12px] text-(--wf-text-muted)">
                    Aktifkan toggle di atas untuk menambahkan lampiran gambar.
                </div>
            )}
        </>
    );
}
