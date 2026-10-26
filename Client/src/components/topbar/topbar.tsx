import "./topbar.css";
import FpsCounter from "./FpsCounter";
import TimeControl from "./TimeControl";
import React, { useContext } from 'react';
import { SignalRContext } from '../../context/SignalRContext';

function Topbar() {
    const context = useContext(SignalRContext);

    return (
        <header className="topbar">
            <div className="topbar-main">
                <TimeControl />
                <div className="score-placeholder">
                    <span>Score</span>
                    <strong>0</strong>
                </div>
            </div>
            <div>Status: {context?.isConnected ? "🟢 Online" : "🔴 Disconnected"}</div>
            <FpsCounter />
        </header>
    );
}

export default Topbar;