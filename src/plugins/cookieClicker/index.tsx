/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";

import { definePluginSettings } from "@api/Settings";
import { addTab, removeTab, TabPanelComponent } from "@api/Tablists";
import { Devs } from "@utils/constants";
import { Logger } from "@utils/Logger";
import definePlugin, { OptionType } from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { Button, Text } from "@webpack/common";

const cachedAudios: { [key: string]: HTMLAudioElement; } = {};

function playSound(url: string) {
    if (cachedAudios[url]) {
        cachedAudios[url].currentTime = 0;
        cachedAudios[url].play();
        return;
    }
    var a = new Audio(url);
    a.play();
    cachedAudios[url] = a;
}

const logger = new Logger("cookieClicker");
const textClasses = findByPropsLazy("defaultColor");

interface IGame {
    cookies: number;
    leftover: number;
    cookiePerSecond: number;
    cookiePerClick: number;
    cookiePerClickUpgradePrice: number;
    cookiePerSecondUpgradePrice: number;
    cookiePerSecondUpgradePriceMultiplier: number;
    cookiePerClickUpgradePriceMultiplier: number;
    collectCookie: (ev: React.MouseEvent<HTMLButtonElement>) => void;
    updateCookiesCounter: () => void;
    upgradeClick: (ev: React.MouseEvent<HTMLButtonElement>) => void;
    upgradeClicksPerSecond: (ev: React.MouseEvent<HTMLButtonElement>) => void;
    save: () => void;
    reset: () => void;
}

let defaultGame: object | IGame;

defaultGame = {
    cookies: 0,
    cookiePerSecond: 0.0,
    cookiePerClick: 1,
    leftover: 0.0,
    cookiePerSecondUpgradePrice: 10,
    cookiePerClickUpgradePrice: 100,
    cookiePerSecondUpgradePriceMultiplier: 1.2,
    cookiePerClickUpgradePriceMultiplier: 1.2,
    collectCookie: (ev: React.MouseEvent<HTMLButtonElement>) => logger.error("collectCookie function is not implemented yet"),
    updateCookiesCounter: () => logger.error("updateCookiesCounter function is not implemented yet"),
    upgradeClick: (ev: React.MouseEvent<HTMLButtonElement>) => logger.error("upgradeClick function is not implemented yet"),
    upgradeClicksPerSecond: (ev: React.MouseEvent<HTMLButtonElement>) => logger.error("upgradeClicksPerSecond function is not implemented yet"),
    save: () => logger.error("save function is not implemented yet")
};

let Game: IGame = { ...defaultGame } as IGame;

const clickSound1: string = "https://raw.githubusercontent.com/programminglaboratorys/resources/main/Vencord.cookieClicker/click1.mp3";
const clickSound2: string = "https://raw.githubusercontent.com/programminglaboratorys/resources/main/Vencord.cookieClicker/click2.mp3";
const clickSound3: string = "https://raw.githubusercontent.com/programminglaboratorys/resources/main/Vencord.cookieClicker/click3.mp3";
const clickSound4: string = "https://raw.githubusercontent.com/programminglaboratorys/resources/main/Vencord.cookieClicker/click4.mp3";
const upgradeSound: string = "https://raw.githubusercontent.com/programminglaboratorys/resources/main/Vencord.cookieClicker/bought.mp3";
const collectSound: string = "https://raw.githubusercontent.com/programminglaboratorys/resources/main/Vencord.cookieClicker/collected.mp3";

function updateCookiesCounter() {
    const cookiesText = document.getElementById("cookie-title");
    if (cookiesText) {
        cookiesText.innerHTML = "Cookies " + Game.cookies;
    }
    const cpsTitle = document.getElementById("cookie-per-second-title");
    if (cpsTitle) {
        cpsTitle.innerHTML = "per second: " + Game.cookiePerSecond;
    }
}

function popupText(event: React.MouseEvent<HTMLButtonElement>, text: string) {

    const id = "text-popup-" + Math.random().toString().slice(2);

    // Create a new paragraph element
    var paragraph = document.createElement("p");
    paragraph.textContent = text;
    paragraph.style.opacity = "1";
    paragraph.style.left = event.clientX + "px";
    paragraph.style.top = event.clientY - 30 + "px";
    paragraph.id = id;
    paragraph["aria-label"] = "text-popup";

    paragraph.classList.add("text-popup", textClasses["defaultColor"], textClasses["heading-lg/normal"]);
    paragraph.addEventListener("click", function (event) {
        event.preventDefault();
    });

    // Append the paragraph to the body
    document.body.appendChild(paragraph);
    const element = paragraph;

    const fadeOut = setInterval(function () {
        if (!element.style.opacity) {
            element.style.opacity = "1";
        }
        const opacity = parseFloat(element.style.opacity);
        if (opacity > 0) {
            element.style.opacity = (opacity - 0.01).toFixed(2);
            paragraph.style.top = parseInt(paragraph.style.top.slice(0, -2)) - 1 + "px";
        } else {
            clearInterval(fadeOut);
            if (element.parentNode) element.parentNode.removeChild(element);
        }
    }, 50);
};


function goldenCookie() {
    var cookie = document.createElement("div");
    cookie.classList.add("cookie");
    cookie.style.left = `${Math.max(Math.random() * window.innerWidth, 200)}px`;
    cookie.style.top = `${Math.max(Math.random() * window.innerHeight, 200)}px`;
    cookie.addEventListener("click", (ev: any) => {
        const cookiesToAdd = Math.floor(Math.max(Math.random() * (Math.sqrt(Game.cookies) + 1), Math.random() * 100));
        Game.cookies += cookiesToAdd;
        ev?.preventDefault();
        setTimeout(() => {
            playSound(collectSound);
        }, 0);
        popupText(ev, `+${cookiesToAdd} COOKIES`);
        if (cookie.parentNode) cookie.parentNode.removeChild(cookie);
        /*
        const numStars = Math.floor(Math.random() * ((2 + 1))) + 3;s
        let lastStar: HTMLDivElement | null = null;
        for (let i = 0; i < numStars; i++) {
            const star = document.createElement("div");
            star.classList.add("star");
            star.style.opacity = "1";
            let x = 0;
            let y = 0;
            if (!lastStar) {
                x = Math.round(parseInt(cookie.style.left.slice(0, -2)) + Math.random() * 70 - 5);;
                y = Math.round(parseInt(cookie.style.top.slice(0, -2)) + Math.random() * 70 - 5);
            }
            else if (lastStar) {
                x = Math.round(parseInt(cookie.style.left.slice(0, -2)) + Math.random() * 30 + 5);
                y = Math.round(parseInt(cookie.style.top.slice(0, -2)) + Math.random() * 30 + 5);
            }

            star.style.left = `${x}px`;
            star.style.top = `${y}px`;
            lastStar = star;
            document.body.appendChild(star);
            const fadeOut = function () {
                const opacity = parseFloat(star.style.opacity);
                if (opacity > 0) {
                    star.style.opacity = (opacity - 0.002).toFixed(3);
                } else {
                    star.remove();
                    return;
                }
                requestAnimationFrame(fadeOut);
            };
            setTimeout(() => requestAnimationFrame(fadeOut), 0);
        }*/
    });
    document.body.appendChild(cookie);
}

const collectCookie = (ev: React.MouseEvent<HTMLButtonElement>) => {
    Game.cookies += Game.cookiePerClick;
    popupText(ev, `+${Game.cookiePerClick}`);
    setTimeout(() => playSound([clickSound1, clickSound2, clickSound3, clickSound4][(Math.floor(Math.random() * 3))]), 0);
    updateCookiesCounter();
};

const upgradeButtonWrapper = (ev: React.MouseEvent<HTMLButtonElement>, callback: (ev: React.MouseEvent<HTMLButtonElement>) => void, idPrice: string | null) => {
    if (idPrice !== null && Game[idPrice]) {
        if (Game.cookies >= Game[idPrice]) {
            setTimeout(() => playSound(upgradeSound), 0);
            popupText(ev, `-${Game[idPrice]}`);
            Game.cookies -= Game[idPrice];
            const multiplier = Game[idPrice + "Multiplier"];
            Game[idPrice] = Math.round(Game[idPrice] * multiplier);
            Game[idPrice + "Multiplier"] = Math.max(parseFloat((Game[idPrice + "Multiplier"] - 0.002).toFixed(3)), 1.002);
            callback(ev);
            updateCookiesCounter();
        }
    }
};


const upgradeClicksPerSecond = (ev: React.MouseEvent<HTMLButtonElement>) => {
    Game.cookiePerSecond = parseFloat((Game.cookiePerSecond + 0.1).toFixed(1));
    logger.debug("upgraded clicks per second ", Game.cookiePerSecond);
    updateCookiesCounter();
    const upgradeClickPerSecondButton = document.getElementById("upgrade-clicks-per-second-button");
    if (upgradeClickPerSecondButton) {
        upgradeClickPerSecondButton.innerHTML = `CpS $${Game.cookiePerSecondUpgradePrice}`;
    }
};

const upgradeClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    Game.cookiePerClick += 1;
    logger.debug("upgraded click ", Game.cookiePerClick);
    updateCookiesCounter();
    const upgradeClickButton = document.getElementById("upgrade-click-button");
    if (upgradeClickButton) {
        upgradeClickButton.innerHTML = `CpC $${Game.cookiePerClickUpgradePrice}`;
    }
};

function giveCookiesPerSecond() {
    Game.leftover += Game.cookiePerSecond;
    if (Math.floor(Game.leftover)) {
        Game.cookies += Math.floor(Game.leftover);
        Game.leftover = parseFloat((Game.leftover - Math.floor(Game.leftover)).toFixed(1));
    }
    updateCookiesCounter();
    if (settings.store.allowGoldenCookie && Math.floor(Math.random() * 10000) === 0) { // 1000 is the chance
        //const randomGoldenCookie = Math.floor(Math.random() * goldenPopupChance); // 1
        //if (randomGoldenCookie === 0) {
        goldenCookie();
        //}
    }
    setTimeout(giveCookiesPerSecond, 1000);
}

// Mi4wNTJ8fDE3MTI0NTI2NTg5OTE7MTcxMjQ1MjM3ODY4MjsxNzEyNzI2MTA5NjI3O01jU3BhZ2hldHRpO2t2eHV1OzAsMSwwLDAsMCwwLDB8MTExMTExMDExMDAxMDEwMDAxMDEwMTEwMDAxfDEyNDgyODUyLjM5NzMyMzc4NzsxMjc5ODYzMC4zOTczMjcwNjI7ODkzOzI7MjE4NTs0NzswOzA7MjU7MDswOzA7MDswOzA7MjswOzA7MDswOzA7MDs7MDswOzA7MDswOzA7MDstMTstMTstMTstMTstMTswOzA7MDswOzc1OzA7MDstMTstMTsxNzEyNDUyMzc4NjgxOzA7MDs7NDE7MDswOzY2NC44OzUwOzA7MDt8MzIsMzIsMjc3OTU2LDAsLDAsMzI7MTksMTksMTQ2NzY4MCwwLCwwLDE5OzcsNywxMTY0Mzc2LDAsLDAsNzswLDAsMCwwLCwwLDA7MiwyLDk4NTU2NDYsMCwwLDAsTmFOOzAsMCwwLDAsLDAsMDswLDAsMCwwLCwwLDA7MCwwLDAsMCwsMCwwOzAsMCwwLDAsLDAsMDswLDAsMCwwLCwwLDA7MCwwLDAsMCwsMCwwOzAsMCwwLDAsLDAsMDswLDAsMCwwLCwwLDA7MCwwLDAsMCwsMCwwOzAsMCwwLDAsLDAsMDswLDAsMCwwLCwwLDA7MCwwLDAsMCwsMCwwOzAsMCwwLDAsLDAsMDswLDAsMCwwLCwwLDA7MCwwLDAsMCwsMCwwO3wxMTExMTAxMDAwMDAwMDExMTEwMDEwMTAwMDEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAxMDEwMTAxMDEwMDAxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMTAxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwfDExMTEwMDAwMDAwMDAwMDAxMTEwMDAwMDAwMDAwMDEwMDAxMTAwMDAxMDAxMDAxMDAwMDAwMDAwMDAwMDAwMDAwMDAxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDB8fA%3D%3D%21END%21
function CookiePanelComponent(props: TabPanelComponent) {
    return (
        <div style={{ color: "white" }}>
            <span className={"cookies-counter"} id="cookie-title">Cookies {Game.cookies}</span>
            <span className={"cookie-per-second"} id="cookie-per-second-title">per second {Game.cookiePerSecond}</span>
            <Button onClick={collectCookie} className="cookie-button"></Button>
            <div className="upgrades-panel">
                <Button onClick={(ev) => upgradeButtonWrapper(ev, upgradeClicksPerSecond, "cookiePerSecondUpgradePrice")} className="upgrade-button" id="upgrade-clicks-per-second-button">{`CpS $${Game.cookiePerSecondUpgradePrice}`}</Button>
                <Button onClick={(ev) => upgradeButtonWrapper(ev, upgradeClick, "cookiePerClickUpgradePrice")} className="upgrade-button" id="upgrade-click-button">{`CpC $${Game.cookiePerClickUpgradePrice}`}</Button>
                <Button onClick={(ev) => { save(); popupText(ev, "saved"); }} className="upgrade-button">save</Button>
            </div>
        </div>);
}

const save = () => {
    settings.store.Game = JSON.parse(JSON.stringify(Game));
};
const reset = () => {
    Game = Object.assign({}, defaultGame) as IGame;
    save();
    init();
};

function autoSaver() {
    save();
    //logger.debug("saved");
    setTimeout(autoSaver, 5000);
}

function init() {
    Game = Object.assign({}, Game, defaultGame, settings.store.Game);
    Game.collectCookie = collectCookie;
    Game.updateCookiesCounter = updateCookiesCounter;
    Game.upgradeClick = upgradeClick;
    Game.upgradeClicksPerSecond = upgradeClicksPerSecond;
    Game.save = save;
    Game.reset = reset;
    Game = window.Game = Game;
}

function StatusComponent(props) {
    settings.store.Game ??= Game;
    return (<div>
        <Text>cookies: {Game.cookies}</Text>
        <Text>cookies per second: {Game.cookiePerSecond}</Text>
        <Text>cookies per click: {Game.cookiePerClick}</Text>
    </div>);
}

const settings = definePluginSettings({
    allowGoldenCookie: {
        type: OptionType.BOOLEAN,
        description: "Allow golden cookies to popup",
        default: true
    },
    Game: {
        type: OptionType.COMPONENT,
        description: "status",
        component: StatusComponent
    },
    save: {
        type: OptionType.COMPONENT,
        description: "save",
        component: () => (<Button onClick={(ev) => { save(); }} className="upgrade-button">save</Button>)
    },
    reset: {
        type: OptionType.COMPONENT,
        description: "reset",
        component: () => (<Button onClick={(ev) => { reset(); }} className="upgrade-button" > reset</Button >)
    }
});

export default definePlugin({
    name: "cookieClicker",
    description: "cookie clicker in discord! just open the tab list and click on the cookie",
    authors: [Devs.iamme],
    dependencies: ["TabApi"],
    settings: settings,
    start: async () => {
        // addTab("better", "Betters", (props: TabPanelComponent) => (<div>hello</div>), false);
        logger.info("<[ Here to cheat or debug? ]>");
        addTab("cookie", "Cookie", CookiePanelComponent, false);
        init();
        giveCookiesPerSecond();
        autoSaver();
    },

    stop: async () => {
        removeTab("cookie");
        Game.save();
    }
});
