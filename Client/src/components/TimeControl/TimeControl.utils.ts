export const DEFAULT_SPEED = 1;
export const DEFAULT_FRAME = 0;

export function calculateFrameDiff(firstFrame: number, secondFrame: number) {
    return secondFrame - firstFrame;
}

export function formatSpeed(speed: number) {
    const factor = Math.pow(10, 2);
    const formattedSpeed = Math.round(speed * factor) / factor;
    return "X " + formattedSpeed;
}