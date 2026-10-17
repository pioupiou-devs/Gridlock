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
            <button type="button" className="control-btn" onClick={togglePlayPause}>
                {isRunning ? "Pause" : "Play"}
            </button>
            <button type="button" className="control-btn" onClick={speedDown}>
                Speed -
            </button>
            <button type="button" className="control-btn" onClick={speedUp}>
                Speed +
            </button>
            <span className="speed-display">x{speed.toFixed(2)}</span>
        </div>
    );
}

export default TimeControl;
