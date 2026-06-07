import { useApp } from "../context/AppContext";
import { Icons, Button } from "./Index";
import React from "react";

export default function BlastButton({ setOpen }: { setOpen: () => void }) {
    const app = useApp();

    const handleClick = () => {
        // setOpen();
        app.trigger("blast:start", {
            resolve: (_: boolean) => {
                if (_) setOpen();
            },
        });
    };

    return (
        <Button className="wf-blast-btn" onClick={handleClick}>
            BLAST! <Icons.Send />
        </Button>
    );
}
