/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { CheckedTextInput } from "@components/CheckedTextInput";
import { ModalContent, ModalHeader, ModalRoot, openModalLazy } from "@utils/modal";
import { Forms, GuildStore, PermissionsBits, PermissionStore, React, Tooltip, UserStore } from "@webpack/common";
import { Role } from "discord-types/general";

import { createRole } from "./api";


const getFontSize = (s: string) => {
    // [18, 18, 16, 16, 14, 12, 10]
    const sizes = [20, 20, 18, 18, 16, 14, 12];
    return sizes[s.length] ?? 4;
};

function getGuildCandidates() {
    const meId = UserStore.getCurrentUser().id;

    return Object.values(GuildStore.getGuilds()).filter(g => {
        const canCreate = g.ownerId === meId ||
            (PermissionStore.getGuildPermissions(g) & PermissionsBits.MANAGE_ROLES) === PermissionsBits.MANAGE_ROLES;
        if (!canCreate) return false;
        return g;
    }).sort((a, b) => a.name.localeCompare(b.name));
}


function CloneModal({ role }: { role: Role; }) {
    const [isCloning, setIsCloning] = React.useState(false);
    const [name, setName] = React.useState(role.name);

    const [x, invalidateMemo] = React.useReducer(x => x + 1, 0);

    const guilds = React.useMemo(() => getGuildCandidates(), [role.id, x]);

    return (
        <>
            <Forms.FormTitle>Custom Name</Forms.FormTitle>
            <CheckedTextInput
                value={name}
                onChange={v => {
                    role.name = v;
                    setName(v);
                }}
                validate={v =>
                    (v.length > 1 && v.length < 100)
                    || "Name must be between 1 and 100 characters and only contain alphanumeric characters"
                }
            />
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1em",
                padding: "1em 0.5em",
                justifyContent: "center",
                alignItems: "center"
            }}>
                {guilds.map(g => (
                    <Tooltip text={g.name}>
                        {({ onMouseLeave, onMouseEnter }) => (
                            <div
                                onMouseLeave={onMouseLeave}
                                onMouseEnter={onMouseEnter}
                                role="button"
                                aria-label={"Clone to " + g.name}
                                aria-disabled={isCloning}
                                style={{
                                    borderRadius: "50%",
                                    backgroundColor: "var(--background-secondary)",
                                    display: "inline-flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "4em",
                                    height: "4em",
                                    cursor: isCloning ? "not-allowed" : "pointer",
                                    filter: isCloning ? "brightness(50%)" : "none"
                                }}
                                onClick={isCloning ? void 0 : async () => {
                                    setIsCloning(true);
                                    await createRole(g, role);
                                    setIsCloning(false);
                                }}
                            >
                                {g.icon ? (
                                    <img
                                        aria-hidden
                                        style={{
                                            borderRadius: "50%",
                                            width: "100%",
                                            height: "100%",
                                        }}
                                        src={g.getIconURL(512, true)}
                                        alt={g.name}
                                    />
                                ) : (
                                    <Forms.FormText
                                        style={{
                                            fontSize: getFontSize(g.acronym),
                                            width: "100%",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            textAlign: "center",
                                            cursor: isCloning ? "not-allowed" : "pointer",
                                        }}
                                    >
                                        {g.acronym}
                                    </Forms.FormText>
                                )}
                            </div>
                        )}
                    </Tooltip>
                ))}
            </div>
        </>
    );
}

export function openModal(role: Role) {
    return openModalLazy(async () => {
        return modalProps => (<ModalRoot {...modalProps}>
            <ModalHeader>
                <Forms.FormText>Clone Role</Forms.FormText>
            </ModalHeader>
            <ModalContent>
                <CloneModal role={role} />
            </ModalContent>
        </ModalRoot>);
    });

}
