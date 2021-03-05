import { useEffect, useState } from "react";

export const usePosXAndPosY = () => {
    let windowPosition = [window.pageXOffset, window.pageYOffset];

    let [windowPos, setWindowPos] = useState(windowPosition);

    useEffect(() => {
        const changWindowPos = () => {
            setWindowPos([window.pageXOffset, window.pageYOffset]);
        }

        window.addEventListener('scroll', changWindowPos);

        return () => window.removeEventListener('scroll', changWindowPos);
    }, [])

    return windowPos;
}