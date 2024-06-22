/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/*
may work on it or may never
import { debounce } from "@shared/debounce";
import { getTheme, Theme } from "@utils/discord";
import { EXTENSION_BASE_URL } from "@utils/web-metadata";
import monacoHtmlLocal from "file://../../../browser/monacoWin.html?minify";
import monacoHtmlCdn from "file://../../../src/main/monacoWin.html?minify";

import { settings } from "./settings";


const tipsListeners = new Set<(tips: string) => void>();
const NOOP = () => { };
const NOOP_ASYNC = async () => { };

const setTipsDebounced = debounce((tips: string) => Promise.resolve(settings.store.CustomTips = tips));

export const editor = {
    get: (): Promise<string> => Promise.resolve(settings.store.CustomTips),
    set: async (tips: string) => {
        settings.store.CustomTips = tips;
        tipsListeners.forEach(l => l(tips));
    },
    addChangeListener(tb) {
        tipsListeners.add(tb);
    },
    addThemeChangeListener: NOOP,
    openFile: NOOP_ASYNC,
    async openEditor() {
        const features = `popup,width=${Math.min(window.innerWidth, 1000)},height=${Math.min(window.innerHeight, 1000)}`;
        const win = window.open("about:blank", "TipsEditor", features);
        if (!win) {
            alert("Failed to open TipEditor popup. Make sure to allow popups!");
            return;
        }

        win.baseUrl = EXTENSION_BASE_URL;
        win.setCss = setTipsDebounced;
        win.getCurrentCss = async () => Promise.resolve(settings.store.CustomTips);
        win.getTheme = () =>
            getTheme() === Theme.Light
                ? "vs-light"
                : "vs-dark";

        win.document.write(IS_EXTENSION ? monacoHtmlLocal : monacoHtmlCdn);
    },
};
*/
