import { useEffect, useMemo, useRef, useState } from "react";
import { defaultTools } from "../Toolbar/Toolbar.utils";
import { DEFAULT_RESOLUTION, DEFAULT_SELECTED_TOOL_ID } from "./Canvas.utils";
import {
    drawGrid,
    getCellFromPoint,
    getCellKey,
    getCellsBetween,
    getPaletteFromCanvas,
    type GridCell,
    type GridTileMap,
    type TileStyleDefinition,
} from "./CanvasGrid";
import type { CanvasProps } from "./Canvas.types";
import { defaultTileDefinitions } from "./TileDefinitions";

export function useCanvas({
    resolution = DEFAULT_RESOLUTION,
    selectedToolId = DEFAULT_SELECTED_TOOL_ID,
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
        () => (tileDefinitions.length > 0 ? tileDefinitions : defaultTileDefinitions),
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
        () => (resolvedTileDefinitions.some((tile) => tile.id === "road") ? "road" : resolvedTileDefinitions[0]?.id ?? "road"),
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
    }, [isClearToolActive, isRoadToolActive, normalizedResolution, roadTileId, selectedToolId, tileMap, tileStyles]);

    return {
        state: {
            normalizedResolution,
        },
        computed: {},
        refs: {
            canvasRef,
        },
        actions: {},
    };
}
