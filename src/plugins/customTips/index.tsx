/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin, { StartAt } from "@utils/types";

import { parse } from "./engine";
import { settings, settingsAboutComponent } from "./settings";

function random(TipsArray: Array<string | Array<string | JSX.Element> | JSX.Element>): string | Array<string | JSX.Element> | JSX.Element {
    if (!TipsArray) return "";
    return TipsArray[Math.floor(Math.random() * (TipsArray.length - 1))];
}


function processTips(type: "tips" | "events", TipsArray: Array<string | Array<string | JSX.Element> | JSX.Element>): Array<string | Array<string | JSX.Element> | JSX.Element> {
    if (!TipsArray) TipsArray = [];
    const CustomTips = (settings.store.CustomTips as string).trim().split("\n").map(t => parse(t.trim())) as Array<string | Array<string | JSX.Element> | JSX.Element>;
    if (type === "tips") {
        return settings.store.OnlyCustom && CustomTips.length !== 0 ? CustomTips : [...TipsArray, ...CustomTips];
    } else {
        return settings.store.OnlyCustomEvents && CustomTips.length !== 0 ? CustomTips : [...TipsArray, ...CustomTips];
    }
}


export default definePlugin({
    name: "CustomTips",
    description: "append custom tips",
    authors: [],
    settings: settings,
    settingsAboutComponent: settingsAboutComponent,
    patches: [
        {
            find: "this,\"_loadingText\",function()",
            replacement: {
                match: /(let (\i)=(\[(.*?)\];))/,
                replace: "$1 $2=$self.processTips(\"tips\",$2); return $self.random($2);" // let e=[...]; e=processTips("tips",e); return random(e);
            }
        },
        {
            find: "this,\"_eventLoadingText\",function()",
            replacement: {
                match: /(let (\i)=(\i\.\i\.getLoadingTips\(\)));/,
                replace: "let $2=$self.processTips(\"events\",$3);" // let e=proccessEventTips("events",C.default.getLoadingTips());
            },
            predicate: () => settings.store.replaceEvents
        }
    ],
    processTips: processTips,
    random: random,
    startAt: StartAt.Init
});


