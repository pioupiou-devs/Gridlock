import type { FpsCounterProps } from "./FpsCounter.types";
import { FPS_LABEL } from "./FpsCounter.utils";

export function useFpsCounter({ fps }: FpsCounterProps) {
    return {
        state: {
            fps,
        },
        computed: {
            label: FPS_LABEL,
        },
        refs: {},
        actions: {},
    };
}
