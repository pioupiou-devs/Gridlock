import { resolveTileDefinition, type TileDefinition, type TileKind } from '../definitions';

export type { TileDefinition, TileKind };

export const defaultTileDefinitions: TileDefinition[] = [
  { id: 'road', label: 'Road', color: '#fbbf24', accent: '#f59e0b' },
  { id: 'source', label: 'Source', color: '#34d399', accent: '#10b981' },
  { id: 'goal', label: 'Goal', color: '#60a5fa', accent: '#3b82f6' },
  { id: 'clear', label: 'Empty', color: 'transparent', accent: 'transparent' },
];

export const getTileDefinition = (
  tileId: string,
  tiles: TileDefinition[] = defaultTileDefinitions,
) => resolveTileDefinition(tileId, tiles, tiles[3]);
