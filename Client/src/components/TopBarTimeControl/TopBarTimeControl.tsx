import { ChevronDown, ChevronUp, Pause, Play, Square } from "lucide-react";
import type { TopBarTimeControlProps } from "./TopBarTimeControl.types";
import { useTopBarTimeControl } from "./useTopBarTimeControl";

export function TopBarTimeControl({
    isRunning,
    speed,
    onTogglePlayPause,
    onStop,
    onSpeedUp,
    onSpeedDown,
}: TopBarTimeControlProps) {
    const { computed } = useTopBarTimeControl({
        isRunning,
        speed,
        onTogglePlayPause,
        onStop,
        onSpeedUp,
        onSpeedDown,
    });

    return (
        <div className="time-control" aria-label="time controls">
            <button
                type="button"
                className="control-btn"
                onClick={onSpeedDown}
                title="Speed down"
                aria-label="Speed down"
            >
                <ChevronDown size={16} />
            </button>

            <button
                type="button"
                className="control-btn"
                onClick={onTogglePlayPause}
                title={computed.playPauseLabel}
                aria-label={computed.playPauseLabel}
            >
                {isRunning ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <button
                type="button"
                className="control-btn"
                onClick={onStop}
                title="Stop"
                aria-label="Stop"
            >
                <Square size={16} />
            </button>

            <button
                type="button"
                className="control-btn"
                onClick={onSpeedUp}
                title="Speed up"
                aria-label="Speed up"
            >
                <ChevronUp size={16} />
            </button>

            <span className="speed-display" title={`Speed multiplier: ${computed.speedText}x`}>
                x{computed.speedText}
            </span>
        </div>
    );
}
