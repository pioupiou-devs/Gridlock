export type TopBarTimeControlProps = {
    isRunning: boolean;
    speed: number;
    onTogglePlayPause: () => void;
    onStop: () => void;
    onSpeedUp: () => void;
    onSpeedDown: () => void;
};
