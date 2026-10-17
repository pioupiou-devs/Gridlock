import ButtonHolder from "./ButtonHolder";
import "./toolbar.css";
import { defaultTools, type ToolDefinition } from "./toolDefinitions";

type ToolbarProps = {
    activeToolId?: string;
    onSelectTool?: (toolId: string) => void;
    tools?: ToolDefinition[];
};

const dynamicButtonPlaceholders: ToolDefinition[] = [
    { id: 'tool-a', label: 'Tool A', kind: 'generic', description: 'Backend-defined action placeholder' },
    { id: 'tool-b', label: 'Tool B', kind: 'generic', description: 'Backend-defined action placeholder' },
];

function Toolbar({ activeToolId, onSelectTool, tools = defaultTools }: ToolbarProps) {
    return (
        <div className="toolbar-wrap">
            <footer className="toolbar">
                <div className="toolbar-section">
                    <strong>Tools</strong>
                    <ButtonHolder
                        tools={tools}
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