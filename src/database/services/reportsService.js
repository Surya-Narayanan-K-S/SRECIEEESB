import { supabase } from "@/lib/supabase";

/**
 * Data access service for Event Reports & Photo Archives
 */
export const reportsService = {
  /**
   * Fetch all event reports ordered by ID descending
   */
  async getAllReports() {
    const { data, error } = await supabase
      .from("event_reports")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("[reportsService] Error fetching event reports:", error);
      throw error;
    }
    return data || [];
  },

  /**
   * Fetch a single event report by ID
   */
  async getReportById(id) {
    const { data, error } = await supabase
      .from("event_reports")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Create a new event report
   */
  async createReport(reportData) {
    const { data, error } = await supabase
      .from("event_reports")
      .insert([reportData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
