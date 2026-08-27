import { useState, useEffect } from "react";
export function useCountUp(end, duration = 2000) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let startTime = null;
        let animationFrame;
        const animate = (timestamp) => {
            if (!startTime)
                startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            // Easing function (easeOutExpo)
            const easeOut = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
            setCount(Math.floor(end * easeOut));
            if (percentage < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };
        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);
    return count;
}
