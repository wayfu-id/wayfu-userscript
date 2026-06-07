import { Icons } from "../../components/Index";
import React from "react";

type ProductSearchProps = { value: string; onChange: (v: string) => void };

export default function ProductSearch({ value, onChange }: ProductSearchProps) {
    return (
        <div className="wf-product-search-wrap">
            <span className="wf-product-search-icon">
                <Icons.Hash />
            </span>
            <input
                className="wf-product-search"
                type="text"
                placeholder="Cari produk..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {value && (
                <button
                    className="wf-product-search-clear"
                    onClick={() => onChange("")}
                    type="button"
                    aria-label="Clear search">
                    <Icons.Close size={12} />
                </button>
            )}
        </div>
    );
}
