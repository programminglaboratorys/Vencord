/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

const cmd = /("[^"]+"|[^\s"]+)/gim;
class Executor {
    constructor(env) {
        this.env = env;
    }
    set(key, value) {
        this.env[key] = value;
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
    parse(args) {
        if (!args) return [];
        return args.map((arg) => {
            if (arg[0] === '"' && arg[arg.length - 1] === '"') {
                return arg.slice(1, arg.length - 1);
            } else if (arg[0] === "$") {
                const variable = arg.slice(1);
                return this.env[variable];
            }
            return arg;
        });
    }
}

class Interpreter {
    constructor(env) {
        this.env = env;
        this.executor = new Executor(env);
    }

    execute(command, args) {
        if (!command) return;
        if (!args) return;
        switch (command) {
            case "set":
                this.executor.set(args[0], args.slice(1));
                break;
            case "del":
                this.executor.del(args[0]);
                break;
            case "debug":
                this.executor.debug();
                break;
            case "echo":
                const fn = this.executor[command];
                if (!fn) return console.log(`Unknown command: ${command}`);
                fn(args);
                break;
            default:
                console.log(`Unknown command: ${command}`);
        }
    }

    interpret(string) {
        if (!string) return;
        const lines = string.split("\n");

        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            if (!line) continue;
            const args = line.match(cmd) || [];
            if (args[0] === "stop") break;
            this.execute(args[0], this.executor.parse(args.slice(1)));
        }
        return this.env;
    }
}
const code = `
echo hello world
set l 1
echo hello world
debug
del l
`;
const i = new Interpreter({});
i.interpret(code);
