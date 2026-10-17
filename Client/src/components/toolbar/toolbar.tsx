import ButtonHolder from "./ButtonHolder";
import "./toolbar.css";
import { defaultTools } from "./toolDefinitions";

type ToolbarProps = {
    activeToolId?: string;
    onSelectTool?: (toolId: string) => void;
};

const dynamicButtonPlaceholders = [
    { id: 'tool-a', label: 'Tool A', description: 'Backend-defined action placeholder' },
    { id: 'tool-b', label: 'Tool B', description: 'Backend-defined action placeholder' },
];

function Toolbar({ activeToolId, onSelectTool }: ToolbarProps) {
    return (
        <div className="toolbar-wrap">
            <footer className="toolbar">
                <div className="toolbar-section">
                    <strong>Tools</strong>
                    <ButtonHolder
                        tools={defaultTools}
                        activeToolId={activeToolId}
                        onSelectTool={onSelectTool}
                    />
                </div>
                <div className="toolbar-section">
                    <strong>Dynamic</strong>
                    <ButtonHolder
                        tools={dynamicButtonPlaceholders}
                        activeToolId={activeToolId}
                        onSelectTool={onSelectTool}
                    />
                </div>
            </footer>
        </div>
    );
}

export default Toolbar;