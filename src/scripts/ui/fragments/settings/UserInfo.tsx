import { useApp } from "../../context/AppContext";
import { Icons } from "../../components/Index";
import { useAppEvent } from "../../hooks/AppHooks";
import { setName } from "../../../utilities";
import React, { useState } from "react";

type Subscription = {
    isPremium: boolean;
    isTrial: boolean;
};

function UserBadge({ subscription }: { subscription: Subscription }) {
    const { isPremium, isTrial } = subscription;
    let color = isPremium || isTrial ? "premium" : "";
    return <span className={`wf-beta-badge ${color}`}>{isPremium ? "Premium" : isTrial ? "Trial" : "Free"}</span>;
}

export default function UserInfo() {
    const app = useApp(),
        { UserData, Subscription } = app.Client,
        Profile = app.Client.Profile as WAPI.BusinessContact | undefined;

    const [userName, setUserName] = useState(() => UserData?.name ?? Profile?.name ?? "—");
    const [userType, setUserType] = useState(() => UserData?.type ?? "—");
    const [attachType, setAttachType] = useState(() => app.Settings.attachType);
    const [isBusiness, setIsBusiness] = useState(() => !!Profile?.isBusiness);
    const [hasProducts, setHasProducts] = useState(() => (Profile?.Products?.length ?? 0) > 0);

    useAppEvent("user:save", () => {
        const { UserData } = app.Client;
        setUserName(UserData?.name ?? "—");
        setUserType(UserData?.type ?? "—");
    });

    useAppEvent("user:products_loaded", () => {
        const Profile = app.Client.Profile as WAPI.BusinessContact | undefined;
        setIsBusiness(!!Profile?.isBusiness);
        setHasProducts((Profile?.Products?.length ?? 0) > 0);
    });

    useAppEvent("setting:sets", () => {
        setAttachType(app.Settings.attachType);
    });

    const handleAttachTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as "file" | "product";
        setAttachType(value);
        app.trigger("setting:sets", { attachType: value });
        // clear whichever attachment is no longer active
        if (value === "file") app.trigger("message:attach_product", null);
        if (value === "product") app.trigger("message:attach", null);
    };

    const showAttachSelector = isBusiness && hasProducts;

    return (
        <div className="wf-setting-group wf-user-info">
            <div className="wf-settings-section-label">Data Pengguna</div>
            <div className="wf-setting-row">
                <span className="wf-setting-label">
                    <Icons.User /> {setName(`${userName}`, true)} <UserBadge subscription={Subscription} />
                </span>
                <span className="wf-setting-output w-auto">{setName(userType)}</span>
            </div>
            <div className="wf-setting-row">
                <span className="wf-setting-label">
                    <Icons.Image /> Attachment Type
                </span>
                <select
                    title="Attachment Type"
                    className="wf-setting-select"
                    value={attachType}
                    onChange={handleAttachTypeChange}>
                    <option value="file">File / Gambar</option>
                    {showAttachSelector && <option value="product">Produk</option>}
                </select>
            </div>
        </div>
    );
}
