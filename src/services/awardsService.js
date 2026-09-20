import { supabase } from "@/lib/supabase";

/**
 * Data access service for Branch Honors & Awards
 */
export const awardsService = {
  /**
   * Fetch all awards ordered by year descending
   */
  async getAllAwards() {
    const { data, error } = await supabase
      .from("awards")
      .select("*")
      .order("year", { ascending: false });

    if (error) {
      console.error("[awardsService] Error fetching awards:", error);
      throw error;
    }
    return data || [];
  },

  /**
   * Insert a new award entry
   */
  async createAward(awardData) {
    const { data, error } = await supabase
      .from("awards")
      .insert([awardData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
