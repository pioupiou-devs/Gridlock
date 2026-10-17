export type ToolKind = 'road' | 'source' | 'goal' | 'clear' | 'generic';

export type ToolDefinition = {
  id: string;
  label: string;
  kind: ToolKind;
  description?: string;
};

export const defaultTools: ToolDefinition[] = [
  { id: 'road', label: 'Road', kind: 'road', description: 'Draw a straight road segment between two cells.' },
  { id: 'source', label: 'Source', kind: 'source', description: 'Place a source tile.' },
  { id: 'goal', label: 'Goal', kind: 'goal', description: 'Place a goal tile.' },
  { id: 'clear', label: 'Clear', kind: 'clear', description: 'Clear a cell or selection.' },
];

export const getToolById = (toolId: string, tools: ToolDefinition[] = defaultTools) =>
  tools.find((tool) => tool.id === toolId) ?? tools[0];
