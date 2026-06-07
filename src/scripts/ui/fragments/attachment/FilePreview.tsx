import { Icons, Button } from "../../components/Index";
import React from "react";

interface FilePreviewProps {
    url: string;
    isHd: boolean;
    isPdf: boolean;
    onRemove: () => void;
}

export default function FilePreview({ url, isHd, isPdf, onRemove }: FilePreviewProps) {
    const titleText = isPdf ? "Lampiran PDF" : `Kualitas Gambar: ${isHd ? "HD" : "Standard"}`,
        badgeText = isPdf ? "PDF" : isHd ? "HD" : "SD";

    return (
        <div className="wf-attach-preview">
            {url ? (
                <img src={url} alt="preview" />
            ) : (
                <div className="wf-attach-preview-loading">
                    <span>Memuat preview...</span>
                </div>
            )}
            <div className="wf-attach-badge" title={titleText}>
                {badgeText}
            </div>
            <Button className="wf-attach-preview-del" onClick={onRemove} type="button">
                <Icons.Close size={12} />
            </Button>
        </div>
    );
}
