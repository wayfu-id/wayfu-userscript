import { useApp } from "../../context/AppContext";
import { EmptyState, ProductSearch, ProductCard } from "./Index";
import { Button, Icons } from "../../components/Index";
import { formatPrice } from "../../utilities/index";
import { useAppEvent } from "../../hooks/AppHooks";
import React, { useState, useMemo } from "react";

interface ProductPickerProps {
    selected?: WAPI.Product | null;
    onSelect: (product: WAPI.Product | null) => void;
}

export default function ProductPicker({ selected, onSelect }: ProductPickerProps) {
    const app = useApp(),
        WAPI = app.WAPI,
        Profile = app.Client.Profile;

    const [query, setQuery] = useState("");
    const [isBusiness, setIsBusiness] = useState(() => !!Profile?.isBusiness);

    if (!Profile || !(Profile instanceof WAPI.ModelClass.BusinessContact)) {
        return <EmptyState isBusiness={isBusiness} />;
    }

    const [products, setProducts] = useState<WAPI.Product[]>(() => Profile?.Products ?? []);

    if (products.length === 0) {
        return <EmptyState isBusiness={isBusiness} />;
    }

    // re-read when user data changes (e.g. after server fetch)
    useAppEvent("user:save", () => {
        setProducts(Profile?.Products ?? []);
        setIsBusiness(!!Profile?.isBusiness);
    });

    // filter by search query
    const filtered = useMemo(() => {
        if (!query.trim()) return products;
        const q = query.toLowerCase();
        return products.filter((p) => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }, [products, query]);

    const handleSelect = (product: WAPI.Product) => {
        const next = selected?.id === product.id ? null : product;
        onSelect(next);
        app.trigger("message:attach_product", next);
    };

    const handleClear = () => {
        onSelect(null);
        app.trigger("message:attach_product", null);
    };

    return (
        <div className="wf-product-picker">
            {/* header row */}
            <div className="wf-product-header">
                <span className="wf-label">Produk ({products.length})</span>
                {selected && (
                    <Button
                        className="wf-product-clear"
                        onClick={handleClear}
                        type="button"
                        title="Hapus lampiran produk">
                        <Icons.Trash />
                    </Button>
                )}
            </div>

            {/* search — only show if more than 5 products */}
            {products.length >= 6 && <ProductSearch value={query} onChange={setQuery} />}

            {/* selected product summary */}
            {selected && (
                <div className="wf-product-selected-summary">
                    <Icons.Check />
                    <span>{selected.name}</span>
                    {formatPrice(selected) && (
                        <span className="wf-product-selected-price">{formatPrice(selected)}</span>
                    )}
                </div>
            )}

            {/* grid */}
            {filtered.length > 0 ? (
                <div className="wf-product-grid">
                    {filtered.map((p) => (
                        <ProductCard key={p.id} product={p} selected={selected?.id === p.id} onSelect={handleSelect} />
                    ))}
                </div>
            ) : (
                <div className="wf-product-no-results">Tidak ada produk yang cocok dengan &ldquo;{query}&rdquo;</div>
            )}
        </div>
    );
}
