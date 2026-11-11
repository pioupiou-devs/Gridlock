import { resolveToolDefinition, type ToolDefinition } from "../definitions";

export const defaultTools: ToolDefinition[] = [
    { id: "road", label: "Road", kind: "road", description: "Draw a straight road segment between two cells." },
    { id: "source", label: "Source", kind: "source", description: "Place a source tile." },
    { id: "goal", label: "Goal", kind: "goal", description: "Place a goal tile." },
    { id: "clear", label: "Clear", kind: "clear", description: "Clear a cell or selection." },
];

export const dynamicButtonPlaceholders: ToolDefinition[] = [
    { id: "tool-a", label: "Tool A", kind: "generic", description: "Backend-defined action placeholder" },
    { id: "tool-b", label: "Tool B", kind: "generic", description: "Backend-defined action placeholder" },
];

export const getToolById = (toolId: string, tools: ToolDefinition[] = defaultTools) =>
    resolveToolDefinition(toolId, tools, tools[0]);
