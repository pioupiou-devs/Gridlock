import type { ToolbarButtonProps } from "./ToolbarButton.types";
import { useToolbarButton } from "./useToolbarButton";

export function ToolbarButton({ label, onClick, title, selected }: ToolbarButtonProps) {
    const { computed } = useToolbarButton({ label, onClick, title, selected });

    return (
        <button
            type="button"
            className={computed.className}
            onClick={onClick}
            title={computed.computedTitle}
            aria-label={computed.computedTitle}
            aria-pressed={computed.selected}
        >
            {label}
        </button>
    );
}
