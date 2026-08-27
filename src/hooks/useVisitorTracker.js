import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureCurrentVisitorTelemetry } from "@/utils/visitorTracker";

export function useVisitorTracker() {
  const location = useLocation();

  useEffect(() => {
    // Record page view on path change
    captureCurrentVisitorTelemetry(location.pathname);
  }, [location.pathname]);
}
