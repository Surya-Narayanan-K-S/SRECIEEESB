import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureCurrentVisitorTelemetry } from "@/utils/visitorTracker";

export function useVisitorTracker() {
  const location = useLocation();

  useEffect(() => {
    // Record page view on path change (internal telemetry)
    captureCurrentVisitorTelemetry(location.pathname);

    // Record page view in Google Analytics (G-5XHW1PLHGT) on production domains
    const isDevHost = typeof window !== "undefined" && /^(localhost|127\.0\.0\.1|192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(window.location.hostname);
    if (!isDevHost && typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("config", "G-5XHW1PLHGT", {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location.pathname, location.search]);
}

