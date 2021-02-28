import { useEffect, useState } from "react";

export const useWindowHeightAndWidth = () => {
    let windowInnerSize = [window.innerHeight, window.innerWidth];

    let [windowSize, setWindowSize] = useState(windowInnerSize);

    useEffect(() => {
        const changWindowSize = () => {
            setWindowSize([window.innerHeight, window.innerWidth]);
        }

        window.addEventListener('resize', changWindowSize);

        return () => window.removeEventListener('resize', changWindowSize);
    }, [])

    return windowSize;
}