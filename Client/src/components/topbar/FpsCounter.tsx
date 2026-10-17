import { useEffect, useState } from "react";

function FpsCounter() {
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

    return (
        <div className="fps-counter" aria-live="polite">
            <span className="counter-label">FPS</span>
            <strong>{fps}</strong>
        </div>
    );
}

export default FpsCounter;
