import type { ToolbarProps } from "./Toolbar.types";
import { useToolbar } from "./useToolbar";
import { ButtonHolder } from "../ButtonHolder";
import "./Toolbar.css";

export function Toolbar({ activeToolId, onSelectTool, tools }: ToolbarProps) {
    const { computed, actions } = useToolbar({ activeToolId, onSelectTool, tools });

    return (
        <div className="toolbar-wrap">
            <footer className="toolbar">
                <div className="toolbar-section">
                    <strong>Tools</strong>
                    <ButtonHolder
                        tools={computed.tools}
                        activeToolId={activeToolId}
                        onSelectTool={actions.handleSelectTool}
                    />
                </div>
                <div className="toolbar-section">
                    <strong>Dynamic</strong>
                    <ButtonHolder
                        tools={computed.dynamicButtonPlaceholders}
                        activeToolId={activeToolId}
                        onSelectTool={actions.handleSelectTool}
                    />
                </div>
            </footer>
        </div>
    );
}
