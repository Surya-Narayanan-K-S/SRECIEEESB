import { supabase } from "@/lib/supabase";

/**
 * Data access service for Student Branch & Society Office Bearers
 */
export const officeBearersService = {
  /**
   * Fetch office bearers for a specific year or all years
   */
  async getOfficeBearersByYear(year = null) {
    let query = supabase.from("office_bearers").select("*");
    if (year) {
      query = query.eq("year", year);
    }
    const { data, error } = await query.order("priority", { ascending: true, nullsFirst: false });

    if (error) {
      console.error("[officeBearersService] Error fetching office bearers:", error);
      throw error;
    }
    return data || [];
  },

  /**
   * Fetch society-specific office bearers
   */
  async getSocietyBearers(societyKey) {
    const table = `${societyKey}_office_bearers`;
    const { data, error } = await supabase.from(table).select("*");

    if (error) {
      console.warn(`[officeBearersService] Table ${table} not found or query failed:`, error.message);
      return [];
    }
    return data || [];
  },

  /**
   * Fetch society-specific executive members
   */
  async getSocietyExecutiveMembers(societyKey) {
    const table = `${societyKey}_executive_members`;
    const { data, error } = await supabase.from(table).select("*");

    if (error) {
      console.warn(`[officeBearersService] Table ${table} not found or query failed:`, error.message);
      return [];
    }
    return data || [];
  },

  /**
   * Resolve image URL from storage bucket or return string
   */
  resolveImageUrl(path, bucket = "office_bearers") {
    if (!path || typeof path !== "string") return "";
    const clean = path.trim();
    if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("data:")) {
      return clean;
    }
    const safe = clean.startsWith("/") ? clean.slice(1) : clean;
    const { data } = supabase.storage.from(bucket).getPublicUrl(safe);
    return data?.publicUrl || clean;
  }
};
