import {
    ChevronDown,
    ChevronUp,
    Pause,
    Play,
    Square,
} from "lucide-react";
import { useState } from "react";

const minSpeed = 0.25;
const maxSpeed = 4;
const speedStep = 0.25;

const clampSpeed = (value: number) => Math.min(maxSpeed, Math.max(minSpeed, value));

function TimeControl() {
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState(1);

    const togglePlayPause = () => {
        setIsRunning((previous) => {
            const next = !previous;
            console.log(next ? "Play clicked" : "Pause clicked");
            return next;
        });
    };

    const stop = () => {
        setIsRunning(false);
        setSpeed(1);
        console.log("Stop clicked");
    };

    const speedUp = () => {
        setSpeed((previous) => {
            const next = clampSpeed(previous + speedStep);
            console.log("Speed up clicked", next);
            return next;
        });
    };

    const speedDown = () => {
        setSpeed((previous) => {
            const next = clampSpeed(previous - speedStep);
            console.log("Speed down clicked", next);
            return next;
        });
    };

    return (
        <div className="time-control" aria-label="time controls">
            <button
                type="button"
                className="control-btn"
                onClick={speedDown}
                title="Speed down"
                aria-label="Speed down"
            >
                <ChevronDown size={16} />
            </button>

            <button
                type="button"
                className="control-btn"
                onClick={togglePlayPause}
                title={isRunning ? "Pause" : "Play"}
                aria-label={isRunning ? "Pause" : "Play"}
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
                onClick={speedUp}
                title="Speed up"
                aria-label="Speed up"
            >
                <ChevronUp size={16} />
            </button>

            <span className="speed-display" title={`Speed multiplier: ${speed.toFixed(2)}x`}>
                x{speed.toFixed(2)}
            </span>
        </div>
    );
}

export default TimeControl;
