/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ChannelStore, GuildStore, SelectedChannelStore, SelectedGuildStore, UserStore } from "@webpack/common";

export const regex = /^\${([\w.]+)(\(([\w\d()]+)?\)([\w.]+)?)?}/i;

export const rules = { // <string, [() => any, Array<string>, boolean|undefined]>
    "user": [() => UserStore.getCurrentUser(), ["name", "username", "discriminator", "id"]],
    "current_channel": [() => SelectedChannelStore.getChannelId(), ["name", "id"]],
    "current_guild": [() => SelectedGuildStore.getGuildId(), ["name", "id"]],
    "guild_count": [() => GuildStore.getGuildCount(), []],
    "channel": [(id: string) => ChannelStore.getChannel(id), ["name", "id", "lastPinTimestamp", "topic_"], true],
    "guild": [(id: string) => GuildStore.getGuild(id), ["name", "id", "joinedAt", "description", "ownerId", "rulesChannelId"], true],
};


export function processMatch(match: RegExpExecArray) {
    const ruleName = match[1].split(".")[0];
    const rule = rules[ruleName];
    if (!rule) return match[0];
    const [fn, attrs, callable]: [(...args: any) => any, Array<string>, boolean | undefined] = rule;
    if (callable) {
        const args = match[3];
        if (!args) return match[0];
        const obj = fn(args);
        if (obj == null) {
            return obj;
        }
        const fields = match[4]?.split(".").slice(1);
        return fields && fields.length !== 0 && attrs.includes(fields[0]) ? obj[fields[0]] : obj?.toString();
    } else {
        const obj = fn();
        const fields = match[1]?.split(".").slice(1);
        return fields && fields.length !== 0 && attrs.includes(fields[0]) ? obj[fields[0]] : obj?.toString(); // only supports one field sadly, too much work to support multiple (and make user sure users don't access sensitive fields)
    }
}


export function parse(text: string) {
    let output = "";
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === "$") {
            const match = regex.exec(text.slice(i));
            if (match) {
                i += match[0].length - 1;
                output += processMatch(match);
            } else {
                output += char;
            }
        } else {
            output += char;
        }
    }
    return output;
}
