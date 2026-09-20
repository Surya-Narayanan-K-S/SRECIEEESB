import { supabase } from "@/lib/supabase";

/**
 * Data access service for Visitor Tracking & Analytics
 */
export const analyticsService = {
  /**
   * Log page visit telemetry
   */
  async logVisit(visitPayload) {
    try {
      const { data, error } = await supabase
        .from("visitor_tracking")
        .insert([visitPayload]);

      if (error) {
        console.warn("[analyticsService] Error recording visit:", error.message);
      }
      return data;
    } catch {
      // Ignore analytics logging errors to avoid blocking UI
      return null;
    }
  },

  /**
   * Fetch traffic overview
   */
  async getTrafficSummary() {
    const { data, error } = await supabase
      .from("visitor_tracking")
      .select("id, page_visited, visited_at, device_type, country")
      .order("visited_at", { ascending: false })
      .limit(100);

    if (error) throw error;
    return data || [];
  }
};
