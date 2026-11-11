import { defaultTools, dynamicButtonPlaceholders } from "./Toolbar.utils";
import type { ToolbarProps } from "./Toolbar.types";

export function useToolbar({ tools = defaultTools, onSelectTool }: ToolbarProps) {
    const handleSelectTool = (toolId: string) => {
        onSelectTool?.(toolId);
    };

    return {
        state: {},
        computed: {
            tools,
            dynamicButtonPlaceholders,
        },
        refs: {},
        actions: {
            handleSelectTool,
        },
    };
}
