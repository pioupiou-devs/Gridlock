import type { ToolDefinition } from "../Toolbar/Toolbar.types";
import type { GridResolution, GridTileMap } from "./CanvasGrid";
import type { TileDefinition } from "./TileDefinitions";

export type CanvasProps = {
    resolution?: GridResolution;
    selectedToolId?: string;
    tiles?: GridTileMap;
    toolDefinitions?: ToolDefinition[];
    tileDefinitions?: TileDefinition[];
};
