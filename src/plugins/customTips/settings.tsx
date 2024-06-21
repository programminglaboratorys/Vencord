/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";
import { Button } from "@webpack/common";

import { editor } from "./editor";


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
        component: () => <Button color={Button.Colors.BRAND} size={Button.Sizes.LARGE} onClick={() => editor.openEditor()} >Custom Tips editor</Button>
    }
});
