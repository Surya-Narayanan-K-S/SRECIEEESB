import * as React from "react";
const MOBILE_BREAKPOINT = 1024;
export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(() => {
        if (typeof window !== "undefined") {
            const isTouchMobile = /android|iphone|ipad|ipod|mobile|silk|kindle/i.test(navigator.userAgent);
            return isTouchMobile || window.innerWidth < MOBILE_BREAKPOINT;
        }
        return false;
    });
    React.useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
        const onChange = () => {
            const isTouchMobile = /android|iphone|ipad|ipod|mobile|silk|kindle/i.test(navigator.userAgent);
            setIsMobile(isTouchMobile || window.innerWidth < MOBILE_BREAKPOINT);
        };
        mql.addEventListener("change", onChange);
        onChange();
        return () => mql.removeEventListener("change", onChange);
    }, []);
    return !!isMobile;
}
