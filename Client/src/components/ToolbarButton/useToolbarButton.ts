import type { ToolbarButtonProps } from "./ToolbarButton.types";
import {
    DEFAULT_SELECTED,
    TOOLBAR_BUTTON_CLASS,
    TOOLBAR_BUTTON_SELECTED_CLASS,
} from "./ToolbarButton.utils";

export function useToolbarButton({ label, title, selected = DEFAULT_SELECTED }: ToolbarButtonProps) {
    const computedTitle = title ?? label;
    const className = selected ? TOOLBAR_BUTTON_SELECTED_CLASS : TOOLBAR_BUTTON_CLASS;

    return {
        state: {},
        computed: {
            className,
            computedTitle,
            selected,
        },
        refs: {},
        actions: {},
    };
}
