import React from "react";
interface LogoProps {
    theme: "light" | "dark";
}

interface IconProps {
    size?: number;
    stroke?: string;
    strokeWidth?: string;
}

// const React = unsafeWindow.require("React");

const Icons = {
    LogoBW: () => (
        <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                d="M84 3c1 0 2 1 3 1 7 3 13 8 19 13 5 5 10 12 13 19 3 7 4 15 4 23 0 6 0 11-2 16-1 5-3 10-5 14l8 31-32-8c-4 3-9 4-14 6-4 1-9 1-14 1-6 0-11 0-16-2l2-5c1 1 2 1 3 1 3 1 7 1 11 1 2 0 4 0 6 0 3-1 5-1 7-2 2 0 4-1 7-2 2-1 4-1 6-3l1-1 3 1 22 6-6-22 0-2 1-2c1-2 2-4 3-7 1-2 2-4 2-6 1-3 1-5 2-7 0-3 0-5 0-8 0-3 0-7-1-11-1-3-2-6-3-10-2-3-3-6-5-9-2-3-4-6-7-8-2-3-5-5-8-7-3-2-6-3-9-5-1 0-1 0-1 0V3zM55 71c-1-2-3-3-4-5-3-3-6-6-9-10-17-20 4-40 20-51-6 1-12 2-19 5-13 4-25 14-30 30-1 1-1 1-1 2-4 16-3 29 2 39 5 13 15 22 22 26l19-36zm7-1c-5-5-10-10-16-17-20-25 33-51 33-51-15-5-61-1-72 38-13 45 20 70 31 74l24-44z"
                fill="white"
            />
        </svg>
    ),
    Logo: ({ theme }: LogoProps) => {
        let isDark = theme === "dark";
        return (
            <svg
                viewBox="0 0 128 128"
                fillRule="evenodd"
                fill={!isDark ? "currentcolor" : "white"}
                xmlns="http://www.w3.org/2000/svg">
                <path
                    className={!isDark ? "fill-(--wf-green)" : "fill-white"}
                    d="M84 3c1,0 2,1 3,1 7,3 13,8 19,13 5,5 10,12 13,19 3,7 4,15 4,23 0,6 0,11 -2,16 -1,5 -3,10 -5,14l8 31 -32 -8c-4,3 -9,4 -14,6 -4,1 -9,1 -14,1l0 0c-6,0 -11,0 -16,-2l2 -5c1,1 2,1 3,1 3,1 7,1 11,1 2,0 4,0 6,0 3,-1 5,-1 7,-2 2,0 4,-1 7,-2 2,-1 4,-1 6,-3l1 -1 3 1 22 6 -6 -22 0 -2 1 -2c1,-2 2,-4 3,-7 1,-2 2,-4 2,-6 1,-3 1,-5 2,-7 0,-3 0,-5 0,-8 0,-3 0,-7 -1,-11 -1,-3 -2,-6 -3,-10l0 0c-2,-3 -3,-6 -5,-9 -2,-3 -4,-6 -7,-8 -2,-3 -5,-5 -8,-7 -3,-2 -6,-3 -9,-5l0 0c-1,0 -1,0 -1,0l0 -6zm-29 68c-1,-2 -3,-3 -4,-5 -3,-3 -6,-6 -9,-10 -17,-20 4,-40 20,-51 -6,1 -12,2 -19,5 -13,4 -25,14 -30,30 -1,1 -1,1 -1,2 -4,16 -3,29 2,39 5,13 15,22 22,26l19 -36zm7 -1c-5,-5 -10,-10 -16,-17 -20,-25 33,-51 33,-51 -15,-5 -61,-1 -72,38 -13,45 20,70 31,74l24 -44z"
                />
                <path
                    className={!isDark ? "fill-(--wf-green)" : "fill-white"}
                    d="M93 126l-1 0c0,0 0,0 0,1 -5,1 -9,1 -14,1l0 0c-5,0 -10,-1 -15,-2l1 0 0 0c5,0 10,0 14,-2 5,-1 10,-3 14,-5l12 3c-3,2 -7,3 -11,4l0 0zm-14 -116l0 -4c0,0 -2,1 -6,3 -11,7 -34,22 -31,38 2,-19 37,-37 37,-37z"
                />
                <path
                    fillRule="nonzero"
                    className={!isDark ? "fill-(--wf-green)" : "fill-white"}
                    d="M62 84l0 -8 -24 44c-9,-2 -32,-19 -34,-50 -2,35 25,55 34,58l24 -44z"
                />
            </svg>
        );
    },
    Close: ({ size, stroke, strokeWidth }: IconProps) => (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke={stroke ?? "currentcolor"}
            strokeWidth={strokeWidth ?? "2"}
            strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    ),
    Sun: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
        </svg>
    ),
    Moon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
    ),
    Msg: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
    ),
    Image: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    ),
    Settings: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
    ),
    Send: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
    ),
    Upload: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="16 16 12 12 8 16" />
            <line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
        </svg>
    ),
    File: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
        </svg>
    ),
    Trash: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
        </svg>
    ),
    Palette: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="13.5" cy="6.5" r="1" />
            <circle cx="17.5" cy="10.5" r="1" />
            <circle cx="8.5" cy="7.5" r="1" />
            <circle cx="6.5" cy="12.5" r="1" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
    ),
    Zap: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    ),
    Calendar: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    ),
    User: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
    Download: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="8 17 12 21 16 17" />
            <line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29" />
        </svg>
    ),
    Hash: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="9" x2="20" y2="9" />
            <line x1="4" y1="15" x2="20" y2="15" />
            <line x1="10" y1="3" x2="8" y2="21" />
            <line x1="16" y1="3" x2="14" y2="21" />
        </svg>
    ),
    WaIcon: () => (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.523 5.847L0 24l6.302-1.506A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.994 16.524c-.248.699-1.458 1.373-2.006 1.427-.548.054-1.025.271-3.452-.72-2.916-1.183-4.759-4.17-4.903-4.361-.143-.191-1.171-1.555-1.171-2.963 0-1.407.737-2.099.998-2.386.261-.287.569-.359.759-.359h.546c.175 0 .415-.066.648.496.248.595.843 2.052.916 2.202.073.15.12.327.024.524-.095.197-.143.319-.287.491-.143.173-.301.385-.431.518-.143.143-.292.298-.125.585.167.287.742 1.224 1.594 1.982 1.095.978 2.018 1.28 2.305 1.423.287.143.455.12.622-.072.167-.191.716-.836.907-1.123.191-.287.382-.239.646-.143.263.095 1.672.789 1.959.932.287.143.479.215.548.334.07.12.07.696-.178 1.396z" />
        </svg>
    ),
    Pause: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
    ),
    Stop: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <rect x="4" y="4" width="16" height="16" rx="2" />
        </svg>
    ),
    Check: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
    Info: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    ),
    Warning: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
    Chart: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
    ),
};

export default Icons;
