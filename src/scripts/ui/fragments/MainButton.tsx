import { Icons, Button } from "../components/Index";
import React, { useState, useEffect, useRef } from "react";

import type { MainButtonProps } from "../Main";
import type { BlastState } from "../../events";

const DEFAULT_STATE: BlastState = {
    running: false,
    index: 0,
    total: 0,
    phone: "",
    done: false,
};

// export default function MainButton({ open, setOpen, app }: MainButtonProps) {
//     return (
//         <Button className={`wf-fab${open ? " open" : ""}`} onClick={setOpen} title="WayFu - Easy Follow Up">
//             {open ? <Icons.Close stroke="#fff" strokeWidth="2.5" size={20} /> : <Icons.Logo theme="dark" />}
//         </Button>
//     );
// }

const CIRCUMFERENCE = 2 * Math.PI * 30; // r=30

export default function MainButton({ open, setOpen, app }: MainButtonProps) {
    const [blast, setBlast] = useState<BlastState>(DEFAULT_STATE);
    const [hovered, setHovered] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!app) return;

        const onProgress = (data: { index: number; total: number; phone: string }) => {
            setBlast({ running: true, done: false, ...data });
        };

        const onDone = () => {
            setBlast((prev) => ({ ...prev, running: false, done: true }));
        };

        const onReset = () => setBlast(DEFAULT_STATE);

        app.on("blast:progress", onProgress);
        app.on("blast:done", onDone);
        app.on("recipient:reset", onReset);

        return () => {
            app.remove("blast:progress", onProgress);
            app.remove("blast:done", onDone);
            app.remove("recipient:reset", onReset);
        };
    }, [app]);

    const pct = blast.total > 0 ? blast.index / blast.total : 0;
    const offset = CIRCUMFERENCE * (1 - pct);
    const isIdle = !blast.running && !blast.done;
    const ringColor = blast.done ? "#1c8ebd]" : "#009a4b";

    const handleClick = () => {
        if (blast.running) {
            app?.trigger("modal:confirm", {
                title: "Stop current blast?",
                message: `${blast.index} of ${blast.total} messages sent. You can resume or start over.`,
                resolve: (stop: boolean) => {
                    if (stop) app?.trigger("blast:stop");
                },
            });
            return;
        }
        setOpen((v) => !v);
    };

    let fabLabel = open ? "Close Panel" : "Open Panel";
    if (blast.running || blast.done) {
        fabLabel = blast.running ? "Pause Process" : fabLabel;
        fabLabel = blast.done ? "Process Complete" : fabLabel;
    }

    let strokeClasses = `[stroke-dasharray:2,5] [stroke-dashoffset:${offset}] stroke-[${ringColor}]`;
    return (
        <div className="wf-fab-wrap" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            {(blast.running || blast.done) && (
                <svg className="wf-fab-ring" viewBox="0 0 66 66" aria-hidden="true">
                    <circle className="wf-fab-ring-track" cx="33" cy="33" r="30" />
                    <circle className={`wf-fab-ring-prog ${strokeClasses}`} cx="33" cy="33" r="30" />
                </svg>
            )}

            <Button className={`wf-fab${open && isIdle ? " open" : ""}`} onClick={handleClick} title={fabLabel}>
                {blast.running ? (
                    <Icons.Pause />
                ) : blast.done ? (
                    <Icons.Check />
                ) : open ? (
                    <Icons.Close />
                ) : (
                    <Icons.Logo theme="dark" />
                )}
            </Button>

            {(blast.running || blast.done) && hovered && (
                <div ref={tooltipRef} className="wf-fab-tooltip" role="status">
                    <div className="wf-fab-tt-label">{blast.done ? "Blast complete" : "Sending to"}</div>
                    {!blast.done && <div className="wf-fab-tt-phone">{blast.phone}</div>}
                    <div className="wf-fab-tt-count">
                        {blast.index} <span>/ {blast.total}</span>
                    </div>
                    <div className="wf-fab-tt-bar">
                        <div className={`wf-fab-tt-fill width-[${Math.round(pct * 100)}%] bg-[${ringColor}]`} />
                    </div>
                    {blast.done && <div className="wf-fab-tt-done">Tap to view report</div>}
                </div>
            )}
        </div>
    );
}
