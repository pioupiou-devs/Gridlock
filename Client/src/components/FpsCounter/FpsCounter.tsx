import type { FpsCounterProps } from "./FpsCounter.types";
import { useFpsCounter } from "./useFpsCounter";

export function FpsCounter({ fps }: FpsCounterProps) {
    const { state, computed } = useFpsCounter({ fps });

    return (
        <div className="fps-counter" aria-live="polite">
            <span className="counter-label">{computed.label}</span>
            <strong>{state.fps}</strong>
        </div>
    );
}
