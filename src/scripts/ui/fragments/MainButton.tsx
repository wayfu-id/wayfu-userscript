import { Icons, Button } from "../components/Index";
import React, { useState, useRef } from "react";
import { useAppEvents } from "../hooks/AppHooks";
import { useApp } from "../context/AppContext";

import type { MainButtonProps } from "../Main";
import type { BlastState } from "../../events";

const DEFAULT_STATE: BlastState = {
    running: false,
    index: 0,
    total: 0,
    phone: "",
    done: false,
};

const CIRCUMFERENCE = 2 * Math.PI * 30; // r=30

const ButtonIcon = ({ open }: { open: boolean }) => {
    return <>{open ? <Icons.Close /> : <Icons.Logo theme="dark" />}</>;
};

export default function MainButton({ open, setOpen }: MainButtonProps) {
    const app = useApp();
    const [blast, setBlast] = useState<BlastState>(DEFAULT_STATE);
    const [hovered, setHovered] = useState(false);
    const [btnIcon, setBtnIcon] = useState<React.JSX.Element>(<ButtonIcon open={open} />);
    const hideTimer = useRef<NodeJS.Timeout | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const pct = blast.total > 0 ? blast.index / blast.total : 0;
    const offset = CIRCUMFERENCE * (1 - pct);
    const isIdle = !blast.running && !blast.done;
    const ringColor = blast.done ? "#1c8ebd]" : "#009a4b";

    useAppEvents({
        "blast:progress": (data: { index: number; total: number; phone: string }) => {
            setBtnIcon(<Icons.Pause />);
            setBlast({ running: true, done: false, ...data });
        },
        "blast:done": (_) => {
            setBtnIcon(<Icons.Check />);
            setBlast((prev) => ({ ...prev, running: false, done: true }));
            setTimeout(() => {
                setBtnIcon(<ButtonIcon open={open} />);
            }, 5e3); // keep check icon for a moment before allowing open state change
        },
        "recipient:reset": () => {
            setBlast(DEFAULT_STATE);
        },
    });

    const handleMouseEnter = () => {
        if (hideTimer.current) clearTimeout(hideTimer.current);
        setHovered(true);
    };

    const handleMouseLeave = () => {
        hideTimer.current = setTimeout(() => setHovered(false), 300);
    };

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
        setOpen();
        setBtnIcon(() => ButtonIcon({ open: !open })); // toggle icon immediately on click for better UX, state will sync on next blast event or panel open/close
    };

    let fabLabel = open ? "Close Panel" : "Open Panel";
    if (blast.running || blast.done) {
        fabLabel = blast.running ? "Pause Process" : fabLabel;
        fabLabel = blast.done ? "Process Complete" : fabLabel;
    }

    return (
        <div className="wf-fab-wrap" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {(blast.running || blast.done) && (
                <svg className="wf-fab-ring" viewBox="0 0 66 66" aria-hidden="true">
                    <circle className="wf-fab-ring-track" cx="33" cy="33" r="30" />
                    <circle
                        className={`wf-fab-ring-prog`}
                        cx="33"
                        cy="33"
                        r="30"
                        style={{
                            stroke: ringColor, // dynamic color
                            strokeDasharray: CIRCUMFERENCE, // constant but needed inline
                            strokeDashoffset: offset, // dynamic — MUST be inline
                        }}
                    />
                </svg>
            )}

            <Button className={`wf-fab${open && isIdle ? " open" : ""}`} onClick={handleClick} title={fabLabel}>
                {btnIcon}
            </Button>

            {(blast.running || blast.done) && hovered && (
                <div ref={tooltipRef} className="wf-fab-tooltip" role="status">
                    <div className="wf-fab-tt-label">{blast.done ? "Blast complete" : "Sending to"}</div>
                    {!blast.done && <div className="wf-fab-tt-phone">{blast.phone}</div>}
                    <div className="wf-fab-tt-count">
                        {blast.index} <span>/ {blast.total}</span>
                    </div>
                    <div className="wf-fab-tt-bar">
                        <div
                            className="wf-fab-tt-fill"
                            style={{
                                width: `${Math.round(pct * 100)}%`,
                                background: ringColor,
                            }}
                        />
                    </div>
                    {blast.done && <div className="wf-fab-tt-done">Tap to view report</div>}
                </div>
            )}
        </div>
    );
}
