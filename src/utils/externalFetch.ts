/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { IpcMainEvent } from "electron";


interface externalFetchResponseInit {
    ok: boolean;
    status: number;
    statusText: string;
    type: string;
    url: string;
    headers: { [k: string]: string; };
}

interface externalFetchResponse {
    body: string;
    init: externalFetchResponseInit;
}


export async function externalFetchWeb(_: IpcMainEvent, url: string, init?: RequestInit): Promise<externalFetchResponse> {
    // @ts-ignore
    const isChrome = typeof browser === "undefined";
    // @ts-ignore
    const browser = isChrome ? chrome : browser;

    return new Promise((resolve, reject) => {
        browser.runtime.sendMessage(isChrome ? "" : "vencord-firefox@vendicated.dev", {
            cmd: "request",
            data: {
                url: url,
                request: init
            }
        },
            async function (r: Response | { error: string; }) {
                if (!(r instanceof Response) && r?.error != null) {
                    reject(r.error);
                } else {
                    r = r as Response;
                    resolve({
                        body: (await r.text()),
                        init: {
                            ok: r.ok,
                            type: r.type,
                            status: r.status,
                            statusText: r.statusText,
                            url: r.url,
                            headers: Object.fromEntries(r.headers.entries()),
                        }
                    });
                }
            }
        );
    });
}


export async function externalFetchNative(_: IpcMainEvent, url: string, init?: RequestInit): Promise<externalFetchResponse> {
    console.log("[Native] Fetching", url, init);
    const r = await fetch(url, init);
    const out = {
        ok: r.ok,
        type: r.type,
        status: r.status,
        statusText: r.statusText,
        url: r.url,
        headers: Object.fromEntries(r.headers.entries()),
    };// Response
    console.log("[Native] Fetched", JSON.stringify(out));
    return {
        body: (await r.text()),
        init: out
    };
}


// TODO: FIND A WAY TO RUN IN WEB LEVEL
export async function externalFetch(url: string, init?: RequestInit): Promise<Response> {
    const extfetch = await (IS_EXTENSION ? externalFetchWeb : externalFetchNative)(url, init);
    if (extfetch instanceof Response) {
        return extfetch;
    }
    const rp = new Response(extfetch.body, extfetch.init);
    Object.defineProperties(rp, Object.fromEntries(
        Object.entries(extfetch.init).map(([k, v]) => [k, { value: v }])
    ));
    return rp;
}
