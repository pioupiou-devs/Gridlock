import type { TopBarProps } from "./TopBar.types";
import { useTopBar } from "./useTopBar";
import { FpsCounter } from "../FpsCounter";
import { TopBarTimeControl } from "../TopBarTimeControl";
import "./TopBar.css";

export function TopBar(_: TopBarProps) {
    const { state, actions } = useTopBar();

    return (
        <header className="topbar">
            <div className="topbar-main">
                <TopBarTimeControl
                    isRunning={state.isRunning}
                    speed={state.speed}
                    onTogglePlayPause={actions.togglePlayPause}
                    onStop={actions.stop}
                    onSpeedUp={actions.speedUp}
                    onSpeedDown={actions.speedDown}
                />
                <div className="score-placeholder">
                    <span>Score</span>
                    <strong>0</strong>
                </div>
            </div>
            <div>Status: {state.isConnected ? "🟢 Online" : "🔴 Disconnected"}</div>
            <FpsCounter fps={state.fps} />
        </header>
    );
}
