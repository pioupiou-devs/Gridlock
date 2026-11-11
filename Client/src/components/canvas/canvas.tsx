import "./Canvas.css";
import type { CanvasProps } from "./Canvas.types";
import { useCanvas } from "./useCanvas";

export function Canvas({
    resolution,
    selectedToolId,
    tiles,
    toolDefinitions,
    tileDefinitions,
}: CanvasProps) {
    const { state, refs } = useCanvas({
        resolution,
        selectedToolId,
        tiles,
        toolDefinitions,
        tileDefinitions,
    });

    return (
        <section className="canvas-panel">
            <div className="canvas-meta">
                <strong>Canvas</strong>
                <span className="placeholder-text">
                    Placeholder grid: {state.normalizedResolution.columns} x {state.normalizedResolution.rows}
                </span>
            </div>
            <canvas
                ref={refs.canvasRef}
                className="grid-canvas"
                aria-label={`Grid canvas ${state.normalizedResolution.columns} by ${state.normalizedResolution.rows}`}
                role="img"
            />
        </section>
    );
}
