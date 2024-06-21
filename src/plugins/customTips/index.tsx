/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Link } from "@components/Link";
import definePlugin, { StartAt } from "@utils/types";
import { Text, TextArea, useMemo, useState } from "@webpack/common";

import { parse } from "./engine";
import { settings } from "./settings";
function settingsAboutComponent() {
    return (<Text>
        Add custom tips for your discord! docs soon!
        if you want custom loading icon look <Link href="https://discord.com/channels/1015060230222131221/1028106818368589824/1223837351831277590">here</Link>
    </Text>);
}

function SettingsBoxComponent(props: { setting: string; placeholder: string; }) {
    const [inputValue, setInputValue] = useState(settings.store[props.setting]);

    useMemo(() => {
        settings.store[props.setting] = inputValue;
    }, [inputValue]);

    return <TextArea
        value={inputValue}
        placeholder={props.placeholder}
        onChange={setInputValue}
    >
    </TextArea>;
}

function settingsCustomTipsComponent() {
    return <SettingsBoxComponent setting="CustomTips" placeholder="Custom Tips (type every tip in a new line)"></SettingsBoxComponent>;
}

function random(TipsArray: Array<string | Array<string | object>>): string | Array<string | object> {
    if (!TipsArray) return "";
    return TipsArray[Math.floor(Math.random() * (TipsArray.length - 1))];
}


function processTips(type: "tips" | "events", TipsArray: Array<string | Array<string | object>>): Array<string | Array<string | object>> {
    if (!TipsArray) TipsArray = [];
    const CustomTips: Array<string> = (settings.store.CustomTips as string).trim().split("\n").map(t => parse(t.trim()));
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
                match: /(let (\i)=(\i\.default\.getLoadingTips\(\)));/,
                replace: "let $2=$self.processTips(\"events\",$3);" // let e=proccessEventTips("events",C.default.getLoadingTips());
            },
            predicate: () => settings.store.replaceEvents
        }
    ],
    processTips: processTips,
    random: random,
    startAt: StartAt.Init
});


