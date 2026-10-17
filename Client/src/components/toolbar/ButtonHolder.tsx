import ToolbarButton from "./ToolbarButton";
import type { ToolDefinition } from "./toolDefinitions";

type ButtonHolderProps = {
    tools: ToolDefinition[];
    activeToolId?: string;
    onSelectTool?: (toolId: string) => void;
};

function ButtonHolder({ tools, activeToolId, onSelectTool }: ButtonHolderProps) {
    return (
        <div className="button-holder">
            {tools.map((tool) => (
                <ToolbarButton
                    key={tool.id}
                    label={tool.label}
                    title={tool.description ?? tool.label}
                    selected={activeToolId === tool.id}
                    onClick={() => {
                        onSelectTool?.(tool.id);
                    }}
                />
            ))}
        </div>
    );
}

export default ButtonHolder;
