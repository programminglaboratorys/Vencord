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
import { TooltipContainer } from "@webpack/common";
import { ReactNode } from "react";

// 2 gif
// 1 cat

export default definePlugin({
    name: "gifUnknwon",
    description: "display gif name on hover",
    authors: [Devs.Samwich],
    // authors: [Devs.iamme],
    patches: [{
        find: "\"handleCanPlay\",",
        replacement: {
            match: /(\(0,\i\.jsxs\)\(\i.Clickable.+null\]\}\))/,
            replace: " $self.renderGifTip($1,this.props.item.type,this.props)"
        }
    }
    ],
    renderGifTip(child: ReactNode, type: string | undefined, props) {
        if (!type) { // type !== "Category" && type !== "Favorites" && type !== "Trending"
            return <TooltipContainer text={props.item.url} className="tooltip">{child}</TooltipContainer>;
        }
    }
});
