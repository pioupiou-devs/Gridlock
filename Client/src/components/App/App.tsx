import { SignalRProvider } from "../../context/SignalRContext";
import { TopBar } from "../TopBar";
import { Toolbar } from "../Toolbar";
import { defaultTools } from "../Toolbar/Toolbar.utils";
import type { AppProps } from "./App.types";
import { useApp } from "./useApp";
import "../App.css";

export function App(_: AppProps) {
    const { state, actions } = useApp();

    return (
        <SignalRProvider>
            <div className="app-shell">
                <TopBar />
                {/* <div className="canvas-zone">
                    <Canvas
                        resolution={{ columns: 32, rows: 18 }}
                        selectedToolId={state.selectedToolId}
                        toolDefinitions={defaultTools}
                        tileDefinitions={defaultTileDefinitions}
                    />
                </div> */}
                <Toolbar
                    activeToolId={state.selectedToolId}
                    onSelectTool={actions.setSelectedToolId}
                    tools={defaultTools}
                />
            </div>
        </SignalRProvider>
    );
}
