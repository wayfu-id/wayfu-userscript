import { useAppEvent } from "../hooks/AppHooks";
import { useApp } from "../context/AppContext";
import { Button, Icons } from "../components/Index";
import React, { useState } from "react";

// GroupFab.tsx — sits alongside MainButton in wf-fab-wrap area
export function GroupFab() {
    const app = useApp();
    const [groupInfo, setGroupInfo] = useState<WAPI.GroupChat | null>(null);

    useAppEvent("chat:active", (data) => {
        setGroupInfo(data?.isGroup ? (data as WAPI.GroupChat) : null);
    });

    if (!groupInfo) return null; // not a group — hidden

    const handleGrab = async () => {
        const { name, participants } = groupInfo;
        // collect contacts
        const contacts = participants.map(({ contact }) => {
            const { id, name, pushname, phoneNumber } = contact._serialized;
            return [pushname || name || id.user, phoneNumber || id.user];
        });

        app.trigger("modal:confirm", {
            title: `Download anggota "${name}"?`,
            message: `${contacts.length} kontak ditemukan.`,
            resolve: async (confirmed) => {
                if (!confirmed) return;
                // use existing export logic
                app.trigger("recipient:export", {
                    data: contacts,
                    title: name,
                });
            },
        });
    };

    return (
        <div className="wf-group-fab-wrap">
            <Button className="wf-group-fab" onClick={handleGrab} title={`Download anggota ${groupInfo.name}`}>
                <Icons.Download />
            </Button>
            <span className="wf-group-fab-badge">{groupInfo.participants.length}</span>
        </div>
    );
}
