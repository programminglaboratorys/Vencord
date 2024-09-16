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

interface Status { connectionStatus: string; connectionStatusText: string; }

export default definePlugin({
    name: "pingping",
    description: "display ping instead of \"Voice Connected\" message",
    authors: [Devs.iamme],
    patches: [
        {
            find: ".rtcConnectionStatusConnecting,",
            replacement: {
                match: /=(\i.\i.getStatus\(\i,\i\))/,
                replace: "=$self.status($1,this.props)"
            }
        }
    ],
    status(condefault: Status, { state, lastPing }: { state: string; lastPing: number | null; }): Status {
        if (state === "RTC_CONNECTED" && lastPing) {
            return { connectionStatus: condefault.connectionStatus, connectionStatusText: ` ${lastPing} ms` };
        }
        return condefault;
    }
});
