/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "Cats",
    description: "use cat slash command to get a random cute cat image!",
    authors: [Devs.Ven],
    commands: [
        {
            name: "cat",
            description: "Send a random cute cat image",

            execute: async function cat() {
                // @ts-ignore
                const response = await VencordNative.externalFetch("https://api.thecatapi.com/v1/images/search");
                const data = await response.json();
                const catUrl = data?.[0]?.url;

                return {
                    content: catUrl ?? "failed to get cat :(",
                };
            }
        },
    ]
});
