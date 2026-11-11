import { useCallback, useState } from "react";

export function useTimeControl(

) {
    const [isRunning, setRunning] = useState<boolean>(false);

    const handlePause = useCallback(() => {
        setRunning(() => false);
    }, []);

    const handlePlay = useCallback(() => {
        setRunning(() => true);
    }, []);


    return {
        state: {
            isRunning
        },
        actions: {
            handlePause,
            handlePlay
        }
    };
}