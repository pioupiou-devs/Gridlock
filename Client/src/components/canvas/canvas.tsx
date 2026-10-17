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
import { defaultTileDefinitions } from "./tileDefinitions";

type CanvasProps = {
    resolution?: GridResolution;
    selectedToolId?: string;
    tiles?: GridTileMap;
};

const tileStyles: Record<string, TileStyleDefinition> = Object.fromEntries(
    defaultTileDefinitions.map((tile) => [tile.id, { id: tile.id, color: tile.color, accent: tile.accent }]),
);

function Canvas({ resolution = { columns: 16, rows: 16 }, selectedToolId = "road", tiles = {} }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const hoveredCellRef = useRef<GridCell | null>(null);
    const dragStartRef = useRef<GridCell | null>(null);
    const [tileMap, setTileMap] = useState<GridTileMap>(tiles);
    const normalizedResolution = useMemo(
        () => ({
            columns: Math.max(1, resolution.columns),
            rows: Math.max(1, resolution.rows),
        }),
        [resolution.columns, resolution.rows],
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
            );
        };

        const updateHoveredCell = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const hoveredCell = getCellFromPoint(
                event.clientX - rect.left,
                event.clientY - rect.top,
                rect.width,
                rect.height,
                normalizedResolution,
            );
            const current = hoveredCellRef.current;
            if (
                current?.column === hoveredCell?.column &&
                current?.row === hoveredCell?.row
            ) {
                return;
            }
            hoveredCellRef.current = hoveredCell;
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
            const rect = canvas.getBoundingClientRect();
            const currentCell = getCellFromPoint(
                event.clientX - rect.left,
                event.clientY - rect.top,
                rect.width,
                rect.height,
                normalizedResolution,
            );
            const origin = dragStartRef.current;
            if (!currentCell || !origin) {
                dragStartRef.current = null;
                return;
            }

            const lineCells = getCellsBetween(origin, currentCell);
            setTileMap((previous) => {
                const next = { ...previous };
                lineCells.forEach((cell) => {
                    next[getCellKey(cell)] = "road";
                });
                return next;
            });
            dragStartRef.current = null;
            render();
        };

        const handlePointerDown = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const cell = getCellFromPoint(
                event.clientX - rect.left,
                event.clientY - rect.top,
                rect.width,
                rect.height,
                normalizedResolution,
            );
            if (!cell) {
                return;
            }

            if (selectedToolId === "road") {
                dragStartRef.current = cell;
                return;
            }

            setTileMap((previous) => {
                const next = { ...previous };
                const key = getCellKey(cell);

                if (selectedToolId === "clear") {
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
    }, [normalizedResolution, selectedToolId, tileMap]);

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