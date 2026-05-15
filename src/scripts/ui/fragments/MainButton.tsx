import { Icons, Button } from "../components/Index";
import type { MainButtonProps } from "../Main";
import React from "react";

export default function MainButton({ open, setOpen }: MainButtonProps) {
    return (
        <Button
            className={`wf-fab${open ? " open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            title="WayFu - Easy Follow Up">
            {open ? <Icons.Close stroke="#fff" strokeWidth="2.5" size={20} /> : <Icons.Logo theme="dark" />}
        </Button>
    );
}
