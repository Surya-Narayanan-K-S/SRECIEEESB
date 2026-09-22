import { supabase } from "@/lib/supabase";

/**
 * Enhanced Data Access Service for Branch Honors & Awards
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
  },

  /**
   * Update an existing award entry
   */
  async updateAward(id, awardData) {
    const { data, error } = await supabase
      .from("awards")
      .update(awardData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete an award entry
   */
  async deleteAward(id) {
    const { error } = await supabase
      .from("awards")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },

  /**
   * Fetch awards filtered by category or keyword
   */
  async getAwardsByCategory(category) {
    let query = supabase.from("awards").select("*").order("year", { ascending: false });
    if (category && category !== "ALL") {
      query = query.eq("category", category);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }
};
