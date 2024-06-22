/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Link } from "@components/Link";
import { ModalContent, ModalHeader, ModalRoot, ModalSize, openModalLazy } from "@utils/modal";
import { OptionType } from "@utils/types";
import { Button, Forms, Text, TextArea, useMemo, useState } from "@webpack/common";


function EditorModal() {
    return openModalLazy(async () => {
        return modalProps => (<ModalRoot {...modalProps} size={ModalSize.LARGE}>
            <ModalHeader>
                <Forms.FormText>Tips Editor</Forms.FormText>
            </ModalHeader>
            <ModalContent>
                <SettingsBoxComponent setting="CustomTips" placeholder="Custom Tips (type every tip in a new line)"></SettingsBoxComponent>
            </ModalContent>
        </ModalRoot>);
    });
}

export function settingsAboutComponent() {
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
        style={{ width: "100%", height: "100%" }}
    >
    </TextArea>;
}

export const settings = definePluginSettings({
    OnlyCustom: {
        type: OptionType.BOOLEAN,
        description: "Only show the custom tips",
        default: false
    },
    replaceEvents: {
        description: "Replace Event Quotes too",
        type: OptionType.BOOLEAN,
        default: false
    },
    OnlyCustomEvents: {
        type: OptionType.BOOLEAN,
        description: "Only show the custom tips",
        default: false
    },
    CustomTips: {
        type: OptionType.COMPONENT,
        description: "Custom Tips",
        default: "you can add Custom Tips in the customTips plugin settings!",
        component: () => <Button color={Button.Colors.BRAND} size={Button.Sizes.LARGE} onClick={EditorModal} >Custom Tips editor</Button>
    }
});
