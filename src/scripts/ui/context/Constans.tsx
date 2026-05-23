import { Icons } from "../components/Index";
import type { OptionItem } from "../components/InputSelect";
import React from "react";

export type SettingType = "range" | "select";

type RangeType = {
    min: number;
    max: number;
    step: number;
    defaultValue: number;
};

export interface Setting<T extends SettingType> {
    label: string;
    id: string;
    icon: React.JSX.Element;
    type: T;
    items: T extends "range" ? RangeType : OptionItem[];
    title?: string;
    beta?: boolean;
    value?: string | number;
    onChange?: { [k: string]: any };
}

// ── Type guards ───────────────────────────────────────────────────────────────

export function isRangeSetting(s: Setting<SettingType>): s is Setting<"range"> {
    return s.type === "range";
}

export function isSelectSetting(s: Setting<SettingType>): s is Setting<"select"> {
    return s.type === "select";
}

// ── Union alias (convenient shorthand) ────────────────────────────────────────

export type AnySetting = Setting<"range"> | Setting<"select">;

interface Settings {
    [k: string]: AnySetting[];
}

const Settings: Settings = {
    Pesan: [
        {
            label: "Caption",
            id: "useCaption",
            icon: <Icons.Msg />,
            beta: true,
            type: "select",
            items: [
                { key: "caption", label: "Caption" },
                { key: "pesan", label: "Message" },
            ],
        },
        {
            label: "Image Quality",
            id: "imageQuality",
            icon: <Icons.Image />,
            beta: true,
            type: "select",
            items: [
                { key: "Standard", label: "Standard" },
                { key: "HD", label: "HD" },
            ],
        },
        {
            label: "Recipients",
            id: "maxQueue",
            icon: <Icons.Zap />,
            type: "range",
            items: {
                min: 50,
                max: 1000,
                step: 10,
                defaultValue: 500,
            },
        },
    ],
    Oriflame: [
        {
            label: "BP Target",
            id: "targetBp",
            icon: <Icons.Zap />,
            type: "range",
            items: {
                min: 100,
                max: 300,
                step: 5,
                defaultValue: 100,
            },
        },
        {
            label: "Date Format",
            id: "dateFormat",
            icon: <Icons.Calendar />,
            type: "select",
            items: [
                { key: "auto", label: "Automatic" },
                { key: "0", label: "MM/DD/YYYY" },
                { key: "1", label: "DD/MM/YYYY" },
                { key: "2", label: "YYYY/MM/DD" },
            ],
        },
    ],
    Output: [
        {
            label: "Export Type",
            id: "exportType",
            icon: <Icons.Download />,
            beta: true,
            type: "select",
            items: [
                { key: "ask", label: "Always Ask" },
                { key: "csv", label: "CSV (.csv)" },
                { key: "xlsx", label: "Excel (.xlsx)" },
            ],
        },
    ],
};

export type TabDetail = {
    id: string;
    icon: React.JSX.Element;
    label: string;
};

const tabs: TabDetail[] = [
    {
        id: "msg",
        icon: <Icons.Msg />,
        label: "Pesan",
    },
    {
        id: "attach",
        icon: <Icons.Image />,
        label: "Lampiran",
    },
    {
        id: "settings",
        icon: <Icons.Settings />,
        label: "Opsi",
    },
];

const KEYWORDS = [
    { label: "NAMA", type: "normal" },
    { label: "F_NAMA", type: "normal" },
    { label: "PHONE", type: "normal" },
    { label: "DATA_1", type: "data" },
    { label: "DATA_2", type: "data" },
    { label: "DATA_3", type: "data" },
];

const socials = ["facebook", "ig", "wa"];

export { KEYWORDS, tabs, socials, Settings };
