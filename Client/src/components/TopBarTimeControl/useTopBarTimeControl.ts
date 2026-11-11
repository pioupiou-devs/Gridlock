import type { TopBarTimeControlProps } from "./TopBarTimeControl.types";
import { SPEED_DECIMALS } from "./TopBarTimeControl.utils";

export function useTopBarTimeControl({ isRunning, speed }: TopBarTimeControlProps) {
    const speedText = speed.toFixed(SPEED_DECIMALS);
    const playPauseLabel = isRunning ? "Pause" : "Play";

    return {
        state: {},
        computed: {
            speedText,
            playPauseLabel,
        },
        refs: {},
        actions: {},
    };
}
