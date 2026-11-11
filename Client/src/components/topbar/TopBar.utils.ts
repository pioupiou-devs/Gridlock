export const MIN_SPEED = 0.25;
export const MAX_SPEED = 4;
export const SPEED_STEP = 0.25;
export const DEFAULT_SPEED = 1;

export const clampSpeed = (value: number) => Math.min(MAX_SPEED, Math.max(MIN_SPEED, value));
