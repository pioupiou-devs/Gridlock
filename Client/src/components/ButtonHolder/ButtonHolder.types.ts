import type { ToolDefinition } from "../Toolbar/Toolbar.types";

export type ButtonHolderProps = {
    tools: ToolDefinition[];
    activeToolId?: string;
    onSelectTool: (toolId: string) => void;
};
