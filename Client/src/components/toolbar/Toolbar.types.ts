import type { ToolDefinition } from "../definitions";

export type { ToolDefinition };

export type ToolbarProps = {
    activeToolId?: string;
    onSelectTool?: (toolId: string) => void;
    tools?: ToolDefinition[];
};
