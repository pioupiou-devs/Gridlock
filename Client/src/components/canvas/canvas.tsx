import { useEffect, useMemo, useRef } from "react";
import "./canvas.css";
import {
    drawGrid,
    getCellFromPoint,
    getCellKey,
    getPaletteFromCanvas,
    type GridCell,
    type GridResolution,
} from "./canvasGrid";

type CanvasProps = {
    resolution?: GridResolution;
};

function Canvas({ resolution = { columns: 16, rows: 16 } }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const hoveredCellRef = useRef<GridCell | null>(null);
    const activeCellsRef = useRef<Set<string>>(new Set());
    const normalizedResolution = useMemo(
        () => ({
            columns: Math.max(1, resolution.columns),
            rows: Math.max(1, resolution.rows),
        }),
        [resolution.columns, resolution.rows],
    );

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
                activeCellsRef.current,
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

        const toggleClickedCell = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const clickedCell = getCellFromPoint(
                event.clientX - rect.left,
                event.clientY - rect.top,
                rect.width,
                rect.height,
                normalizedResolution,
            );
            if (!clickedCell) {
                return;
            }

            const key = getCellKey(clickedCell);
            const activeCells = activeCellsRef.current;
            if (activeCells.has(key)) {
                activeCells.delete(key);
            } else {
                activeCells.add(key);
            }
            render();
        };

        render();

        const resizeObserver = new ResizeObserver(render);
        resizeObserver.observe(canvas);
        canvas.addEventListener("mousemove", updateHoveredCell);
        canvas.addEventListener("mouseleave", clearHoveredCell);
        canvas.addEventListener("click", toggleClickedCell);

        return () => {
            resizeObserver.disconnect();
            canvas.removeEventListener("mousemove", updateHoveredCell);
            canvas.removeEventListener("mouseleave", clearHoveredCell);
            canvas.removeEventListener("click", toggleClickedCell);
        };
    }, [normalizedResolution]);

    return (
        <section className="canvas-panel">
            <div className="canvas-meta">
                <strong>Canvas</strong>
                <span className="placeholder-text">
                    Placeholder grid: {resolution.columns} x {resolution.rows}
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