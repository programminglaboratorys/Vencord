/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Link } from "@components/Link";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType, StartAt } from "@utils/types";
import { Text, TextArea, useEffect, useState } from "@webpack/common";

function settingsAboutComponent() {
    return (<Text>
        Add custom tips for your discord! planning to add custom variables later!
        if you want custom loading icon look <Link href="https://discord.com/channels/1015060230222131221/1028106818368589824/1223837351831277590">here</Link>
    </Text>);
}

function SettingsBoxComponent(props: { setting: string; placeholder: string; }) {
    const [inputValue, setInputValue] = useState(settings.store[props.setting]);

    useEffect(() => {
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

const settings = definePluginSettings({
    OnlyCustom: {
        type: OptionType.BOOLEAN,
        description: "only show the custom tips",
        default: false,
    },
    CustomTips: {
        type: OptionType.COMPONENT,
        description: "Custom Tips",
        default: "you can add Custom Tips in the customTips plugin settings!",
        component: settingsCustomTipsComponent,
    }
});



function processTips(TipsArray: Array<string | Array<string | object>>): Array<string | Array<string | object>> {
    let CustomTips: Array<string> = settings.store.CustomTips.trim().split("\n");
    return settings.store.OnlyCustom && CustomTips.length !== 0 ? CustomTips : [...TipsArray, ...CustomTips];
}



export default definePlugin({
    name: "customTips",
    description: "append custom tips",
    authors: [Devs.iamme],
    settings: settings,
    settingsAboutComponent: settingsAboutComponent,
    patches: [
        {
            find: "this,\"_loadingText\",function()",
            replacement: {
                match: /(let (\i)=(\[(.*?)\];))/,
                replace: "$1 $2=$self.processTips($2);" // let e=[...]; e=processTips(e);
            }
        }
    ],
    processTips: processTips,
    startAt: StartAt.Init
});
