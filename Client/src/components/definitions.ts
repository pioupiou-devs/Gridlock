export type ToolKind = 'road' | 'source' | 'goal' | 'clear' | 'generic';

export type ToolDefinition = {
  id: string;
  label: string;
  kind: ToolKind;
  description?: string;
};

export type TileKind = 'road' | 'source' | 'goal' | 'clear' | 'generic';

export type TileDefinition = {
  id: string;
  label: string;
  color: string;
  accent?: string;
};

export const resolveToolDefinition = (
  toolId: string,
  tools: ToolDefinition[] = [],
  fallbackTool?: ToolDefinition,
): ToolDefinition | undefined => {
  return tools.find((tool) => tool.id === toolId) ?? fallbackTool ?? tools[0];
};

export const resolveTileDefinition = (
  tileId: string,
  tiles: TileDefinition[] = [],
  fallbackTile?: TileDefinition,
): TileDefinition | undefined => {
  return tiles.find((tile) => tile.id === tileId) ?? fallbackTile ?? tiles[0];
};
