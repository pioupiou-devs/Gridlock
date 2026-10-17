import { useEffect, useMemo, useRef, useState } from "react";
import "./canvas.css";
import {
    drawGrid,
    getCellFromPoint,
    getCellKey,
    getCellsBetween,
    getPaletteFromCanvas,
    type GridCell,
    type GridResolution,
    type GridTileMap,
    type TileStyleDefinition,
} from "./canvasGrid";
import { defaultTileDefinitions, type TileDefinition } from "./tileDefinitions";
import { defaultTools, type ToolDefinition } from "../toolbar/toolDefinitions";

type CanvasProps = {
    resolution?: GridResolution;
    selectedToolId?: string;
    tiles?: GridTileMap;
    toolDefinitions?: ToolDefinition[];
    tileDefinitions?: TileDefinition[];
};

function Canvas({
    resolution = { columns: 16, rows: 16 },
    selectedToolId = "road",
    tiles = {},
    toolDefinitions = [],
    tileDefinitions = defaultTileDefinitions,
}: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const hoveredCellRef = useRef<GridCell | null>(null);
    const dragStartRef = useRef<GridCell | null>(null);
    const dragPreviewRef = useRef<GridCell[]>([]);
    const [tileMap, setTileMap] = useState<GridTileMap>(tiles);
    const normalizedResolution = useMemo(
        () => ({
            columns: Math.max(1, resolution.columns),
            rows: Math.max(1, resolution.rows),
        }),
        [resolution.columns, resolution.rows],
    );
    const resolvedToolDefinitions = useMemo(
        () => (toolDefinitions.length > 0 ? toolDefinitions : defaultTools),
        [toolDefinitions],
    );
    const roadToolId = useMemo(
        () => resolvedToolDefinitions.find((tool) => tool.kind === "road" || tool.id === "road")?.id ?? "road",
        [resolvedToolDefinitions],
    );
    const clearToolId = useMemo(
        () => resolvedToolDefinitions.find((tool) => tool.kind === "clear" || tool.id === "clear")?.id ?? "clear",
        [resolvedToolDefinitions],
    );
    const isRoadToolActive = selectedToolId === roadToolId;
    const isClearToolActive = selectedToolId === clearToolId;
    const resolvedTileDefinitions = useMemo(
        () => tileDefinitions.length > 0 ? tileDefinitions : defaultTileDefinitions,
        [tileDefinitions],
    );
    const tileStyles = useMemo<Record<string, TileStyleDefinition>>(
        () => Object.fromEntries(
            resolvedTileDefinitions.map((tile) => [tile.id, {
                id: tile.id,
                color: tile.color,
                accent: tile.accent,
            }]),
        ),
        [resolvedTileDefinitions],
    );
    const roadTileId = useMemo(
        () => resolvedTileDefinitions.some((tile) => tile.id === "road") ? "road" : resolvedTileDefinitions[0]?.id ?? "road",
        [resolvedTileDefinitions],
    );

    useEffect(() => {
        setTileMap((current) => ({ ...current, ...tiles }));
    }, [tiles]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const render = () => {
            const context = canvas.getContext("2d");
            if (!context) {
                return;
            }

            const rect = canvas.getBoundingClientRect();
            const width = Math.floor(rect.width);
            const height = Math.floor(rect.height);
            if (width <= 0 || height <= 0) {
                return;
            }

            const devicePixelRatio = window.devicePixelRatio || 1;
            canvas.width = Math.max(1, Math.floor(width * devicePixelRatio));
            canvas.height = Math.max(1, Math.floor(height * devicePixelRatio));

            context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
            drawGrid(
                context,
                width,
                height,
                normalizedResolution,
                getPaletteFromCanvas(canvas),
                hoveredCellRef.current,
                tileMap,
                tileStyles,
                dragPreviewRef.current,
            );
        };

        const getCellAtPointer = (event: MouseEvent): GridCell | null => {
            const rect = canvas.getBoundingClientRect();
            return getCellFromPoint(
                event.clientX - rect.left,
                event.clientY - rect.top,
                rect.width,
                rect.height,
                normalizedResolution,
            );
        };

        const updateHoveredCell = (event: MouseEvent) => {
            const hoveredCell = getCellAtPointer(event);
            const current = hoveredCellRef.current;
            if (
                current?.column === hoveredCell?.column &&
                current?.row === hoveredCell?.row
            ) {
                if (isRoadToolActive && dragStartRef.current) {
                    const nextPreview = getCellsBetween(dragStartRef.current, hoveredCell ?? dragStartRef.current);
                    const samePreview = nextPreview.length === dragPreviewRef.current.length &&
                        nextPreview.every((cell, index) => cell.column === dragPreviewRef.current[index]?.column && cell.row === dragPreviewRef.current[index]?.row);
                    if (!samePreview) {
                        dragPreviewRef.current = nextPreview;
                        render();
                    }
                }
                return;
            }
            hoveredCellRef.current = hoveredCell;
            if (isRoadToolActive && dragStartRef.current) {
                dragPreviewRef.current = getCellsBetween(dragStartRef.current, hoveredCell ?? dragStartRef.current);
            }
            render();
        };

        const clearHoveredCell = () => {
            if (!hoveredCellRef.current) {
                return;
            }
            hoveredCellRef.current = null;
            render();
        };

        const completeRoadDrawing = (event: MouseEvent) => {
            const origin = dragStartRef.current;
            const currentCell = getCellAtPointer(event);

            if (!origin) {
                dragPreviewRef.current = [];
                return;
            }

            const lineCells = currentCell ? getCellsBetween(origin, currentCell) : [origin];
            setTileMap((previous) => {
                const next = { ...previous };
                lineCells.forEach((cell) => {
                    next[getCellKey(cell)] = roadTileId;
                });
                return next;
            });
            dragStartRef.current = null;
            dragPreviewRef.current = [];
            render();
        };

        const handlePointerDown = (event: MouseEvent) => {
            const cell = getCellAtPointer(event);
            if (!cell) {
                return;
            }

            if (isRoadToolActive) {
                dragStartRef.current = cell;
                dragPreviewRef.current = [cell];
                render();
                return;
            }

            setTileMap((previous) => {
                const next = { ...previous };
                const key = getCellKey(cell);

                if (isClearToolActive) {
                    delete next[key];
                    return next;
                }

                next[key] = selectedToolId;
                return next;
            });
        };

        render();

        const resizeObserver = new ResizeObserver(render);
        resizeObserver.observe(canvas);
        canvas.addEventListener("mousemove", updateHoveredCell);
        canvas.addEventListener("mouseleave", clearHoveredCell);
        canvas.addEventListener("mousedown", handlePointerDown);
        canvas.addEventListener("mouseup", completeRoadDrawing);

        return () => {
            resizeObserver.disconnect();
            canvas.removeEventListener("mousemove", updateHoveredCell);
            canvas.removeEventListener("mouseleave", clearHoveredCell);
            canvas.removeEventListener("mousedown", handlePointerDown);
            canvas.removeEventListener("mouseup", completeRoadDrawing);
        };
    }, [normalizedResolution, roadTileId, selectedToolId, tileMap, tileStyles]);

    return (
        <section className="canvas-panel">
            <div className="canvas-meta">
                <strong>Canvas</strong>
                <span className="placeholder-text">
                    Placeholder grid: {normalizedResolution.columns} x {normalizedResolution.rows}
                </span>
            </div>
            <canvas
                ref={canvasRef}
                className="grid-canvas"
                aria-label={`Grid canvas ${normalizedResolution.columns} by ${normalizedResolution.rows}`}
                role="img"
            />
        </section>
    );
}

export default Canvas;