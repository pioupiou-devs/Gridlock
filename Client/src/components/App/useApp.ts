import { useState } from "react";
import { DEFAULT_SELECTED_TOOL_ID } from "./App.utils";

export function useApp() {
    const [selectedToolId, setSelectedToolId] = useState(DEFAULT_SELECTED_TOOL_ID);

    return {
        state: {
            selectedToolId,
        },
        computed: {},
        refs: {},
        actions: {
            setSelectedToolId,
        },
    };
}
