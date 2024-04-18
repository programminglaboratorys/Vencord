import definePlugin from "@utils/types";
import { Devs } from "@utils/constants";
import { Logger } from "@utils/Logger";

const logger = new Logger("TabApi");

/**
 * The 'export default' keyword is used to export a single 'default' export from a module.
 * When importing this module, the imported value can be directly assigned to any name,
 * without the need to use curly braces and specify the name of the export.
 *
 * In this case, we're exporting the 'tabs' object as the default export from this module.
 * When other modules import this plugin, they can simply use 'import Tablist from "@/plugins/Tablist";'
 * and the 'tabs' object will be assigned to the 'Tablist' variable.
 */
export default definePlugin({
    name: "TabApi",
    description: "A plugin let's you create custom tabs for your Discord client.",
    authors: [Devs.iamme],
    patches: [
        {
            find: ".EXPRESSION_PICKER_CATEGORIES_A11Y_LABEL",
            replacement: [
                {
                    match: /\((\i),\{id:(\i)\.\i,"aria-controls":\i\.\i,"aria-selected":(\i)===\i\.ExpressionPickerViewType.\i,isActive:(\i)===\i\.ExpressionPickerViewType\.\i,viewType:(\i).ExpressionPickerViewType\.\i,children:"\i"\}\)/,//\]
                    replace: "$&,...Vencord.Api.Tablists.RenderButtons($1, $3, $5)"
                },
                {
                    match: /(\i)===\i\.ExpressionPickerViewType\.EMOJI\?\(0,\i\.jsx\)\((\i\.default),\{hasTabWrapper:!0,persistSearch:!0,channel:(\i),containerWidth:(\i),includeCreateEmojiButton:\i,emojiSize:null!=\i&&\i<\i\?(\i)\.EmojiSize\.MEDIUM:\i\.EmojiSize\.LARGE,pickerIntention:\i\.EmojiIntention\.CHAT,closePopout:(\i),onSelectEmoji:\i,ref:\i=>\{\$\.current=\i\}\}\):null/,
                    replace: "$&,...Vencord.Api.Tablists.TabPanels($1, $3)"
                }
            ]
        }
    ],
    start: () => {
        //let j = Vencord.Webpack.findModuleId("closeExpressionPicker:");
        //if (j) { Vencord.Api.Tablists.ExpressionModule = Vencord.Webpack.wreq(JSON.parse(j)); }
        //else { logger.debug("ExpressionModule hasn't been found"); }
        //logger.debug("ExpressionModule:", Vencord.Api.Tablists.ExpressionModule);
    }
});
