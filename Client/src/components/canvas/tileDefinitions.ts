export type TileKind = 'road' | 'source' | 'goal' | 'clear' | 'generic';

export type TileDefinition = {
  id: TileKind | string;
  label: string;
  color: string;
  accent?: string;
};

export const defaultTileDefinitions: TileDefinition[] = [
  { id: 'road', label: 'Road', color: '#fbbf24', accent: '#f59e0b' },
  { id: 'source', label: 'Source', color: '#34d399', accent: '#10b981' },
  { id: 'goal', label: 'Goal', color: '#60a5fa', accent: '#3b82f6' },
  { id: 'clear', label: 'Empty', color: 'transparent', accent: 'transparent' },
];

export const getTileDefinition = (tileId: string) =>
  defaultTileDefinitions.find((tile) => tile.id === tileId) ?? defaultTileDefinitions[3];
