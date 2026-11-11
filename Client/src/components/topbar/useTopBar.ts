import { useCallback, useContext, useEffect, useState } from "react";
import { SignalRContext } from "../../context/SignalRContext";
import { clampSpeed, DEFAULT_SPEED, SPEED_STEP } from "./TopBar.utils";

export function useTopBar() {
    const context = useContext(SignalRContext);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState(DEFAULT_SPEED);
    const [fps, setFps] = useState(0);

    useEffect(() => {
        let frameCount = 0;
        let lastFrameTime = performance.now();
        let animationFrameId = 0;

        const tick = (now: number) => {
            frameCount += 1;
            const elapsed = now - lastFrameTime;
            if (elapsed >= 500) {
                setFps(Math.round((frameCount * 1000) / elapsed));
                frameCount = 0;
                lastFrameTime = now;
            }
            animationFrameId = window.requestAnimationFrame(tick);
        };

        animationFrameId = window.requestAnimationFrame(tick);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const togglePlayPause = useCallback(() => {
        setIsRunning((previous) => {
            const next = !previous;
            console.log(next ? "Play clicked" : "Pause clicked");
            return next;
        });
    }, []);

    const stop = useCallback(() => {
        setIsRunning(false);
        setSpeed(DEFAULT_SPEED);
        console.log("Stop clicked");
    }, []);

    const speedUp = useCallback(() => {
        setSpeed((previous) => {
            const next = clampSpeed(previous + SPEED_STEP);
            console.log("Speed up clicked", next);
            return next;
        });
    }, []);

    const speedDown = useCallback(() => {
        setSpeed((previous) => {
            const next = clampSpeed(previous - SPEED_STEP);
            console.log("Speed down clicked", next);
            return next;
        });
    }, []);

    return {
        state: {
            isRunning,
            speed,
            fps,
            isConnected: context?.isConnected ?? false,
        },
        computed: {},
        refs: {},
        actions: {
            togglePlayPause,
            stop,
            speedUp,
            speedDown,
        },
    };
}
