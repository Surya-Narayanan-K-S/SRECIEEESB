import { supabase } from "@/lib/supabase";

/**
 * Enhanced Data Access Service for Event Reports & Photo Archives
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
   * Search event reports by title or society
   */
  async searchReports(keyword, society = "ALL") {
    let query = supabase.from("event_reports").select("*").order("id", { ascending: false });
    
    if (society && society !== "ALL") {
      query = query.eq("society", society);
    }

    if (keyword && keyword.trim()) {
      const k = keyword.trim();
      query = query.or(`title.ilike.%${k}%,description.ilike.%${k}%,society.ilike.%${k}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
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
  },

  /**
   * Update an existing event report
   */
  async updateReport(id, reportData) {
    const { data, error } = await supabase
      .from("event_reports")
      .update(reportData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete an event report
   */
  async deleteReport(id) {
    const { error } = await supabase
      .from("event_reports")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  }
};
