/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Constants, RestAPI } from "@webpack/common";
import { Guild, Role } from "discord-types/general";

export async function createRole(guild: Guild, role?: Role) {
    if (!role) throw new Error("No guild or role provided");
    await RestAPI.post({
        url: Constants.Endpoints.GUILD_ROLES(guild.id),
        body: {
            name: role.name,
            color: role.color,
            permissions: role.permissions.toString(),
            mentionable: role.mentionable,
            unicodeEmoji: role.unicodeEmoji,
            hoist: role.hoist
        }
    });
}
