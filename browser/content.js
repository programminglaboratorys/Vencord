if (typeof browser === "undefined") {
    var browser = chrome;
}

const style = document.createElement("link");
style.type = "text/css";
style.rel = "stylesheet";
style.href = browser.runtime.getURL("dist/Vencord.css");

document.addEventListener(
    "DOMContentLoaded",
    () => {
        document.documentElement.append(style);
        window.postMessage({
            type: "vencord:meta",
            meta: {
                EXTENSION_VERSION: browser.runtime.getManifest().version,
                EXTENSION_BASE_URL: browser.runtime.getURL(""),
            },
        });
    },
    { once: true }
);

async function fetchRequest(rq, callback) {
    try {
        const response = await fetch(rq.url, rq.request);
        callback(response);
    } catch (err) {
        callback({ error: err.message });
        console.error("Vencord extension error:", err);
    }
}

browser.runtime.onMessageExternal.addListener(async function (
    message,
    sender,
    sendResponse
) {
    switch (message.cmd) {
        case "request":
            await fetchRequest(message.data, sendResponse);
            return;
        default:
            sendResponse({ error: "Unknown command" });
    }
});
