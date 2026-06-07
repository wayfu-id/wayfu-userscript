import { Icons } from "../../components/Index";
import React from "react";

export default function EmptyState({ isBusiness }: { isBusiness: boolean }) {
    return (
        <div className="wf-product-empty">
            <div className="wf-product-empty-icon">{isBusiness ? <Icons.Hash /> : <Icons.WaIcon />}</div>
            <p className="wf-product-empty-title">{isBusiness ? "Tidak ada produk" : "Bukan akun bisnis"}</p>
            <p className="wf-product-empty-sub">
                {isBusiness
                    ? "Tambahkan produk di WhatsApp Business terlebih dahulu."
                    : "Fitur ini hanya tersedia untuk akun WhatsApp Business."}
            </p>
        </div>
    );
}
