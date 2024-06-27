/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { MarkDownRules, PluginMarkDownRules } from "@api/Markdown";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { ASTNode } from "simple-markdown";
/*
                        const text = capture[2];
                        const nastCaps: SingleASTNode[][] = [];
                        for (let index = 0; index < capture[1].length; index++) {
                            const char = capture[2][index];
                            if (this.requiredFirstCharacters.includes(char)) {
                                const match = this.match(text.slice(index), state, "");
                                if (!match) continue;
                                match;
                                nastCaps.push(nastedParse(match, state));
                                break;
                            }
                        }
                            */
var styleMap = {
    "4": { color: "#be0000" },
    "c": { color: "#fe3f3f" },
    "6": { color: "#d9a334" },
    "e": { color: "#fefe3f" },
    "2": { color: "#00be00" },
    "a": { color: "#3ffe3f" },
    "b": { color: "#3ffefe" },
    "3": { color: "#00bebe" },
    "1": { color: "#0000be" },
    "9": { color: "#3f3ffe" },
    "d": { color: "#fe3ffe" },
    "5": { color: "#be00be" },
    "f": { color: "#ffffff" },
    "7": { color: "#bebebe" },
    "8": { color: "#3f3f3f" },
    "0": { color: "#000000" },
    "l": { fontWeight: "bold" },
    "n": { textDecoration: "underline" },
    "o": { fontStyle: "italic" },
    "m": { textDecoration: "line-through" },
};

export default definePlugin({
    name: "MinecraftFormatCodes",
    description: "Adds Minecraft Color Codes (and Format Codes) to markdown",
    authors: [Devs.iamme],
    dependencies: ["MarkdownAPI"],
    start() {
    },
    rules(r: MarkDownRules) {
        return {
            RULES: {
                ColorCodes: {
                    order: 25,
                    requiredFirstCharacters: ["$"],
                    match(source, state, prev) {
                        return /^\$([\w\d])([\d\w\W\D]+)\$r/.exec(source) || /^\$([\w\d])([\d\w\W\D]+)/.exec(source);
                    },
                    parse(capture, nastedParse, state) {
                        return {
                            code: capture[1],
                            content: capture[2],
                            nasted: nastedParse(capture[2], state)
                        };
                    },
                    react(node: { code: string, content: string, nasted: ASTNode; }, recurseOutput, state) {
                        const nas = recurseOutput(node.nasted, state);
                        console.log("typeof", typeof nas);
                        return <span style={styleMap[node.code]} key={state.key}>{nas}</span>;
                    }
                }
            },
            PROFILE_BIO_RULES: {
                codeBlock: r.RULES.codeBlock
            }
        } as PluginMarkDownRules;
    }
});
