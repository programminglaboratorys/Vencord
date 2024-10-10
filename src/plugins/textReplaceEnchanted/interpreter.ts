/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ChannelStore, GuildStore, SelectedChannelStore, SelectedGuildStore, UserStore } from "@webpack/common";

const cmdRegex = /("[^"]+"|[^\s"]+)/gim;
const variableRegex = /^[A-Za-z_]+/;
const expressionRegex = /^\${([\w.]+)(\(([$\w\d()+]+)?\)([\w.]+)?)?}/im;

const StatusCodes = {
    success: 0,
    invalidVariableName: 100
};

export const rules: { [k: string]: [(...args: any) => any, Array<string>, boolean | undefined]; } = {
    // lol spent 5 hours creating this engine.
    // you can add other rules if you want example of a role [()=>{"love": "love you too!"}, ["love"]]

    "user": [() => UserStore.getCurrentUser(), ["globalName", "username", "discriminator", "id"], false],
    "encode_url": [url => encodeURI(url), [], true],
    "current_channel": [() => ChannelStore.getChannel(SelectedChannelStore.getChannelId()), ["name", "id", "lastPinTimestamp", "topic_"], false],
    "current_guild": [() => GuildStore.getGuild(SelectedGuildStore.getGuildId()), ["name", "id", "joinedAt", "description", "ownerId", "rulesChannelId"], false],
    "guild_count": [() => GuildStore.getGuildCount(), [], false],
    "channel": [(id: string) => ChannelStore.getChannel(id), ["name", "id", "lastPinTimestamp", "topic_"], true],
    "guild": [(id: string) => GuildStore.getGuild(id), ["name", "id", "joinedAt", "description", "ownerId", "rulesChannelId"], true],
};

function processExpression(match: RegExpExecArray, env: Record<string, any> = {}): string {
    const ruleName = match[1].split(".")[0];
    const rule = rules[ruleName];
    if (!rule) return match[0];
    const [fn, attrs, requiresArguments]: [(...args: any) => any, Array<string>, boolean | undefined] = rule;
    if (requiresArguments) {
        let args = match[3];
        if (!args) return match[0];
        if (args.startsWith("$")) {
            const variableName = args.slice(1);
            args = env[variableName];
        }
        const obj = fn(args);
        const fields = match[4]?.split(".").slice(1);
        return obj && fields && fields.length !== 0 && attrs.includes(fields[0]) && obj[fields[0]] != null ? obj[fields[0]] : obj;
    } else {
        const obj = fn();
        const fields = match[1]?.split(".").slice(1);
        return obj && fields && fields.length !== 0 && attrs.includes(fields[0]) ? obj[fields[0]] : obj; // only supports one field sadly, too much work to support multiple (and make sure users don't access sensitive fields)
    }
}

class Executor {
    env: Record<string, any>;
    lastStatus: number;
    constructor(env: Record<string, any>) {
        this.env = env;
        this.lastStatus = -1;
    }
    set(key, value) {
        if (variableRegex.exec(key) !== null) {
            this.env[key] = value;
            return StatusCodes.success;
        }
        console.warn(`Invalid variable name: ${key}`);
        return StatusCodes.invalidVariableName;
    }
    echo(args) {
        console.log(args.join(" "));
    }
    del(key) {
        delete this.env[key];
    }
    debug() {
        console.log(JSON.stringify(this.env));
    }
    parse(args: string[]) {
        if (!args) return [];
        return args.map(arg => {
            if (arg.startsWith('"') && arg.endsWith('"')) {
                return arg.slice(1, -1);
            } else if (arg.startsWith("$")) {
                const variableName = arg.slice(1);
                let match: RegExpExecArray | null;
                if (variableName === "last_status") {
                    return String(this.lastStatus);
                } else if (variableRegex.exec(variableName) !== null) {
                    return this.env[variableName] ?? arg;
                } else if ((match = expressionRegex.exec(arg)) !== null) {
                    return processExpression(match, this.env);
                }
            }
            return arg;
        });
    }
}

export class Interpreter {
    executor: Executor;
    env: Record<string, any>;
    constructor(env: Record<string, any>) {
        this.env = env;
        this.executor = new Executor(env);
    }

    execute(command: string, args: Array<string>) {
        if (!command) return;
        if (!args) return;
        switch (command) {
            case "return":
                return;
            case "set":
                return this.executor.set(args[0], args.slice(1));
            case "del":
                return this.executor.del(args[0]);
            case "debug":
                this.executor.debug();
                break;
            case "echo":
                const fn = this.executor[command];
                if (!fn)
                    return console.log(
                        `Unknown command: ${command}. function not found`
                    );
                return Number(fn(args));
            default:
                console.error(`Unknown command: ${command}`);
                return 1;
        }
    }

    interpret(string: string) {
        if (!string) return this.env;
        const lines = string.split("\n");

        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            if (!line && line.startsWith("#")) continue;
            const args = line.match(cmdRegex) || [];
            if (!args[0]) continue;
            const parsedArgs = this.executor.parse(args.slice(1));
            args[0] === "return" && console.log("returns", parsedArgs);
            if (args[0] === "return") this.executor.set("results", parsedArgs[0]);
            this.executor.lastStatus = Number(this.execute(args[0], parsedArgs));
        }
        return this.env;
    }
}
/*
const code = `
echo hello world
set l 1
echo hello world
debug
del l
`;
const i = new Interpreter({});
i.interpret(code);
*/
