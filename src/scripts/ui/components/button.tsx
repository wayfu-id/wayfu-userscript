import React from "react";
interface ButtonProps extends React.PropsWithChildren, React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function Button({ type, title, className, onClick, children }: ButtonProps) {
    return (
        <button className={className} onClick={onClick} type={type ?? "button"} title={title}>
            {children}
        </button>
    );
}
