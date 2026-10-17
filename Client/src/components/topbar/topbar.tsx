import "./topbar.css";
import FpsCounter from "./FpsCounter";
import TimeControl from "./TimeControl";

function Topbar() {
    return (
        <header className="topbar">
            <div className="topbar-main">
                <TimeControl />
                <div className="score-placeholder">
                    <span>Score</span>
                    <strong>0</strong>
                </div>
            </div>
            <FpsCounter />
        </header>
    );
}

export default Topbar;