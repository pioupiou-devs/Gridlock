export type GridResolution = {
    columns: number;
    rows: number;
};

export type GridCell = {
    column: number;
    row: number;
};

export type GridTileMap = Record<string, string>;

export type GridPalette = {
    background: string;
    line: string;
    hover: string;
    active: string;
};

export type TileStyleDefinition = {
    id: string;
    color: string;
    accent?: string;
};

const defaultPalette: GridPalette = {
    background: "#0f172a",
    line: "rgba(255, 255, 255, 0.14)",
    hover: "rgba(255, 255, 255, 0.16)",
    active: "rgba(99, 102, 241, 0.6)",
};

const readVar = (
    styles: CSSStyleDeclaration,
    name: string,
    fallback: string,
) => {
    const value = styles.getPropertyValue(name).trim();
    return value || fallback;
};

export const getPaletteFromCanvas = (canvas: HTMLCanvasElement): GridPalette => {
    const styles = getComputedStyle(canvas);
    return {
        background: readVar(styles, "--grid-canvas-background", defaultPalette.background),
        line: readVar(styles, "--grid-canvas-line", defaultPalette.line),
        hover: readVar(styles, "--grid-canvas-hover", defaultPalette.hover),
        active: readVar(styles, "--grid-canvas-active", defaultPalette.active),
    };
};

export const getCellKey = (cell: GridCell) => `${cell.column}:${cell.row}`;

export const getCellFromPoint = (
    x: number,
    y: number,
    width: number,
    height: number,
    resolution: GridResolution,
): GridCell | null => {
    if (width <= 0 || height <= 0) {
        return null;
    }

    const columns = Math.max(1, resolution.columns);
    const rows = Math.max(1, resolution.rows);
    const column = Math.floor((x / width) * columns);
    const row = Math.floor((y / height) * rows);

    if (column < 0 || row < 0 || column >= columns || row >= rows) {
        return null;
    }

    return { column, row };
};

export const getCellsBetween = (from: GridCell, to: GridCell): GridCell[] => {
    const dx = to.column - from.column;
    const dy = to.row - from.row;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));

    if (steps === 0) {
        return [from];
    }

    const cells: GridCell[] = [];

    for (let step = 0; step <= steps; step += 1) {
        const progress = step / steps;
        cells.push({
            column: Math.round(from.column + dx * progress),
            row: Math.round(from.row + dy * progress),
        });
    }

    return cells;
};

export const drawGrid = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    resolution: GridResolution,
    palette: GridPalette,
    hoveredCell: GridCell | null,
    tiles: GridTileMap,
    tileStyles: Record<string, TileStyleDefinition>,
) => {
    const columns = Math.max(1, resolution.columns);
    const rows = Math.max(1, resolution.rows);
    const cellWidth = width / columns;
    const cellHeight = height / rows;

    context.clearRect(0, 0, width, height);
    context.fillStyle = palette.background;
    context.fillRect(0, 0, width, height);

    Object.entries(tiles).forEach(([key, tileId]) => {
        const [columnValue, rowValue] = key.split(":");
        const column = Number(columnValue);
        const row = Number(rowValue);
        const tile = tileStyles[tileId];

        if (Number.isNaN(column) || Number.isNaN(row) || !tile) {
            return;
        }

        context.fillStyle = tile.color;
        context.fillRect(column * cellWidth, row * cellHeight, cellWidth, cellHeight);
    });

    if (hoveredCell) {
        context.fillStyle = palette.hover;
        context.fillRect(
            hoveredCell.column * cellWidth,
            hoveredCell.row * cellHeight,
            cellWidth,
            cellHeight,
        );
    }

    context.strokeStyle = palette.line;
    context.lineWidth = 1;

    for (let column = 0; column <= columns; column += 1) {
        const x = column * cellWidth;
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
    }

    for (let row = 0; row <= rows; row += 1) {
        const y = row * cellHeight;
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
    }
};
