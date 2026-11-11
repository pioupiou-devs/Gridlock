import { ChevronDown, ChevronUp, Pause, Play, Square } from "lucide-react";
import { Timer } from "./TimeControl.types";
import { useTimeControl } from "./useTimeControl";

export function TimeControl({ speed, isRunning }: Timer) {

    const { state, actions } = useTimeControl();

    return (
        <div className="time-control" aria-label="time controls">
            <button
                type="button"
                className="control-btn"
                //onClick={speedDown}
                title="Speed down"
                aria-label="Speed down"
            >
                <ChevronDown size={16} />
            </button>

            <button
                type="button"
                className="control-btn"
                onClick={state.isRunning ? actions.handlePause : actions.handlePlay}
                title={state.isRunning ? "Pause" : "Play"}
                aria-label={state.isRunning ? "Pause" : "Play"}
            >
                {isRunning ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <button
                type="button"
                className="control-btn"
                onClick={stop}
                title="Stop"
                aria-label="Stop"
            >
                <Square size={16} />
            </button>

            <button
                type="button"
                className="control-btn"
                //onClick={speedUp}
                title="Speed up"
                aria-label="Speed up"
            >
                <ChevronUp size={16} />
            </button>

            <span className="speed-display" title={`Speed multiplier: ${speed.toFixed(2)}x`}>
                x{speed.toFixed(2)}
            </span>
        </div>
    )

}