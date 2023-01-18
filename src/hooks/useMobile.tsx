import React, { useState, useEffect } from 'react';

export function useMobile() {
    const minNumber = 600
    const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : minNumber);
    const [isMobile, setIsMobile] = useState(false);

    const handleWindowSizeChange = () => setWidth(Number(window.innerWidth));

    //add a listenener to resize event, to get the screen size
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);

        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    useEffect(() => {
        setIsMobile(Boolean((width <= minNumber)));
    }, [width])

    return {
        isMobile
    };

}