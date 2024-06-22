/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findByPropsLazy } from "@webpack";
import { React } from "@webpack/common";

export const regex = /^\${([\w.]+)(\(([\w\d()+]+)?\)([\w.]+)?)?}/i;
const KbdStyles = findByPropsLazy("key", "combo");
const KeyCom = findByPropsLazy("KeyCombo");

function processKeys(keys: string) {
    const keysArray = keys.toLowerCase().split("+");
    return (<div className={KbdStyles.combo} style={{ display: "inline-flex" }}>
        {keysArray.map(key => <kbd className={KbdStyles.key}>{key}</kbd>)}
    </div>); // "keybind_e40c16"
}
// object, attrs. callable
export const rules = { // <string, [() => any, Array<string>, boolean|undefined]>

    // those don't work because when discord starts early those veriables aren't initialized yet.
    // lol spent 5 hours creating this engine, welp will be useful on other things ig,
    // you can add other rules if you want example of a role [()=>{"love": "love you too!"}, ["love"]]
    // callable is if the function takes arguments (takes one argument for now)

    // "user": [() => UserStore.getCurrentUser(), ["name", "username", "discriminator", "id"]],
    // "current_channel": [() => SelectedChannelStore.getChannelId(), ["name", "id"]],
    // "current_guild": [() => SelectedGuildStore.getGuildId(), ["name", "id"]],
    // "guild_count": [() => GuildStore.getGuildCount(), []],
    // "channel": [(id: string) => ChannelStore.getChannel(id), ["name", "id", "lastPinTimestamp", "topic_"], true],
    // "guild": [(id: string) => GuildStore.getGuild(id), ["name", "id", "joinedAt", "description", "ownerId", "rulesChannelId"], true],
    "key": [(keys: string) => processKeys(keys), [], true],
};


export function processMatch(match: RegExpExecArray): string | JSX.Element {
    const ruleName = match[1].split(".")[0];
    const rule = rules[ruleName];
    if (!rule) return match[0];
    const [fn, attrs, callable]: [(...args: any) => any, Array<string>, boolean | undefined] = rule;
    if (callable) {
        const args = match[3];
        if (!args) return match[0];
        const obj = fn(args);
        const fields = match[4]?.split(".").slice(1);
        return obj && fields && fields.length !== 0 && attrs.includes(fields[0]) ? obj[fields[0]] : obj;
    } else {
        const obj = fn();
        const fields = match[1]?.split(".").slice(1);
        return obj && fields && fields.length !== 0 && attrs.includes(fields[0]) ? obj[fields[0]] : obj; // only supports one field sadly, too much work to support multiple (and make user sure users don't access sensitive fields)
    }
}

function appendToOutput(output: Array<string | JSX.Element>, object: string | JSX.Element) { // don't focuse on this... by DESIGN HORRORS 101
    if (typeof output[output.length - 1] === "string" && typeof object === "string") {
        output[Math.max(output.length - 1, 0)] += object as string;
    } else {
        output.push(object);
    }
}

export function parse(text: string): Array<string | JSX.Element> {
    const output: Array<string | JSX.Element> = [];
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === "$") {
            const match = regex.exec(text.slice(i));
            if (match) {
                i += match[0].length - 1;
                appendToOutput(output, processMatch(match));
            } else {
                appendToOutput(output, char);
            }
        } else {
            appendToOutput(output, char);
        }
    }
    console.log(output);
    return output;
}
