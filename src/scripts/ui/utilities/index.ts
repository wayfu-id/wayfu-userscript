import React from "react";

type OnChangeProps = {
    onChange?: (e: { [k: string]: any }) => void;
    callback: React.Dispatch<React.SetStateAction<string | number | undefined>>;
};

// 1. We declare a generic T that must be either an Input or a Select element.
// 2. We set the return type to React.ChangeEventHandler<T>.
export function handleOnChange<T extends HTMLInputElement | HTMLSelectElement>({
    onChange,
    callback,
}: OnChangeProps): React.ChangeEventHandler<T> {
    return (e) => {
        let { id, value } = e.target;

        if (onChange && typeof onChange === "function") {
            onChange({ [id]: value });
        }

        callback(value);
    };
}

export function formatPrice(product: WAPI.Product): string {
    if (!product.priceAmount1000 || !product.currency) return "";
    const amount = Number(product.priceAmount1000) / 1000; // WA stores price * 1000
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: product.currency,
    }).format(amount);
}
