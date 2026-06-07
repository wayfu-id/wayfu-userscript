import { useApp } from "../context/AppContext";
import { useAppEvent } from "../hooks/AppHooks";
import { Settings } from "../context/Constans";
import { SettingGroup, UserInfo } from "./settings/Index";
import React, { useState } from "react";

const ConstructSetting = (userType: "umum" | "oriflame") => {
    const full = { ...Settings };
    if (userType !== "oriflame") {
        const { Oriflame, ...rest } = full;
        return rest;
    }
    return full;
};

export default function SettingTab() {
    const app = useApp(),
        appSettings = app ? app.Settings : undefined,
        userType = app?.Client?.UserData?.type || appSettings?.userType || "umum";

    const [setting, setSetting] = useState(ConstructSetting(userType));

    useAppEvent("user:save", () => {
        const { UserData } = app.Client,
            userType = UserData?.type ?? "umum";

        setSetting(ConstructSetting(userType));
    });

    const handleChanges = (value: { [k: string]: any }) => {
        app?.trigger("setting:sets", value);
    };

    return (
        <>
            <UserInfo />
            {Object.entries(setting).map(([groupLabel, items]) => {
                items = items.map((i) => {
                    if (appSettings && appSettings.defaultProp.hasOwnProperty(i.id)) {
                        i.value = appSettings[i.id];
                        i.onChange = handleChanges;
                    }
                    return i;
                });

                return <SettingGroup key={groupLabel} label={groupLabel} items={items} />;
            })}
        </>
    );
}
