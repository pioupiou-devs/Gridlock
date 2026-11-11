import { ToolbarButton } from "../ToolbarButton";
import type { ButtonHolderProps } from "./ButtonHolder.types";
import { useButtonHolder } from "./useButtonHolder";

export function ButtonHolder({ tools, activeToolId, onSelectTool }: ButtonHolderProps) {
    const { computed, actions } = useButtonHolder({ tools, activeToolId, onSelectTool });

    return (
        <div className="button-holder">
            {computed.hasTools && computed.tools.map((tool) => (
                <ToolbarButton
                    key={tool.id}
                    label={tool.label}
                    title={tool.description ?? tool.label}
                    selected={activeToolId === tool.id}
                    onClick={() => {
                        actions.handleSelectTool(tool.id);
                    }}
                />
            ))}
        </div>
    );
}
