import definePlugin from "@utils/types";
import { Devs } from "@utils/constants";
import { useEffect, useMemo, Button } from "@webpack/common";
import { Channel } from "discord-types/general";
import { Logger } from "@utils/Logger";

const logger = new Logger("TabApi");

export interface IExpressionModule {
    closeExpressionPicker: (tab) => void;
    openExpressionPicker: (tab, module) => void;
    setSearchQuery: (query: string) => void;
    setExpressionPickerView: (tab: string) => void;
    toggleExpressionPicker: (e, t) => void; // idk
    toggleMultiExpressionPicker: (ee) => void;
    useExpressionPickerStore: (e, n) => void;//(e=t.getState,n=Object.is)=> {…};
}

export let ExpressionModule: IExpressionModule | null = null;

export interface TabButtonComponent extends JSX.Element {
    id: string;
    "aria-controls": string;
    "aria-selected": boolean;
    isActive: boolean;
    viewType: string;
    children: string | JSX.Element;
    autoFocus: boolean;
    [k: string]: any;
}

export interface ExpressionMate {
    CHAT_INPUT_BUTTON_CLASSNAME: "expression-picker-chat-input-button";
    expressionPickerViewType: { EMOJI: "emoji", GIF: "gif", STICKER: "sticker", SOUNDBOARD: "soundboard"; };
    expressionPickerWidths: { MIN: "min", MAX: "max"; };
    MIN_EXPRESSION_PICKER_WIDTH: number; // 498
}
export interface TabPanelComponent { currentSelectedTab: string; channel: Channel; }




function RenderTabPanel(props: { children: string; tab: string; channel: any; selected: string; }) {
    console.log("props", props);
    const tab = props.tab.toLowerCase();
    return (<div id={tab + "-picker-tab-panel"} role="tabpanel" aria-labelledby={tab + "-picker-tab"} className="container__1e477"><div className="header_aac16f"><div className="flex_f18b02 horizontal__4848b justifyStart__6f8c8 alignCenter__9c6ed noWrap__5c413" style={{ flex: "1 1 auto", color: "rgb(255, 255, 255)", textAlign: "center" }}>{props.children}</div></div></div>);
}
// "loadingIndicator__924a4"

export interface TabPanelManager {
    [id: string]: { tab: string | JSX.Element, Component: (props: TabPanelComponent) => JSX.Element; autoFocus: boolean | undefined; };
}


export function addTab(id: string, tab: string, Component: (props: TabPanelComponent) => JSX.Element, autoFocus: boolean | undefined): TabPanelManager {
    tabs[id] = { tab: tab, Component: Component, autoFocus: autoFocus };
    return tabs;
}

export function removeTab(id: string): TabPanelManager {
    delete tabs[id];
    return tabs;
}

const tabs: TabPanelManager = {} as TabPanelManager;

export function* RenderButtons(TabButtonComponent: TabButtonComponent, currentSelectedTab: string, expressionMate: ExpressionMate) {
    for (const tab in tabs) {
        /* tslint:disable */
        // @ts-ignore
        yield (<TabButtonComponent id={tab + "-picker-tab"} aria-controls={tab + "-picker-tab-panel"} aria-selected={currentSelectedTab === tab} isActive={currentSelectedTab === tab} viewType={tab}>{tabs[tab].tab}</TabButtonComponent>);
    }
}
export function* TabPanels(currentSelectedTab: string, channel: Channel) {
    for (const tab in tabs) {
        if (tab !== currentSelectedTab) { continue; }
        let PanelComponent: (props: TabPanelComponent) => JSX.Element = tabs[tab].Component;
        /* tslint:disable */
        // @ts-ignore
        yield (<PanelComponent currentSelectedTab={currentSelectedTab} channel={channel} />);
    }
}
