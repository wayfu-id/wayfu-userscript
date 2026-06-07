import { Icons } from "../../components/Index";
import { formatPrice } from "../../utilities/index";
import React from "react";

interface ProductCardProps {
    product: WAPI.Product;
    selected: boolean;
    onSelect: (product: WAPI.Product) => void;
}

export default function ProductCard({ product, selected, onSelect }: ProductCardProps) {
    const price = formatPrice(product);

    return (
        <button
            className={`wf-product-card${selected ? " selected" : ""}`}
            onClick={() => onSelect(product)}
            title={product.name}
            type="button">
            {/* image or placeholder */}
            <div className="wf-product-img">
                {product.imageCdnUrl ? (
                    <img src={product.imageCdnUrl} alt={product.name} />
                ) : (
                    <div className="wf-product-img-placeholder">
                        <Icons.Image />
                    </div>
                )}
                {selected && (
                    <div className="wf-product-selected-badge">
                        <Icons.Check />
                    </div>
                )}
            </div>

            {/* info */}
            <div className="wf-product-info">
                <span className="wf-product-name">{product.name}</span>
                {price && <span className="wf-product-price">{price}</span>}
            </div>
        </button>
    );
}
