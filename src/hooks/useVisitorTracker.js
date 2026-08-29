import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureCurrentVisitorTelemetry } from "@/utils/visitorTracker";

export function useVisitorTracker() {
  const location = useLocation();

  useEffect(() => {
    // Record page view on path change (internal telemetry)
    captureCurrentVisitorTelemetry(location.pathname);

    // Record page view in Google Analytics (G-5XHW1PLHGT)
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("config", "G-5XHW1PLHGT", {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location.pathname, location.search]);
}

