import type { ButtonHolderProps } from "./ButtonHolder.types";
import { HAS_TOOLS_THRESHOLD } from "./ButtonHolder.utils";

export function useButtonHolder({ tools, onSelectTool }: ButtonHolderProps) {
    const handleSelectTool = (toolId: string) => {
        onSelectTool(toolId);
    };

    return {
        state: {},
        computed: {
            tools,
            hasTools: tools.length > HAS_TOOLS_THRESHOLD,
        },
        refs: {},
        actions: {
            handleSelectTool,
        },
    };
}
