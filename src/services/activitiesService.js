import { supabase } from "@/lib/supabase";

/**
 * Data access service for Branch Activities
 */
export const activitiesService = {
  /**
   * Fetch all activities ordered by serial number
   */
  async getAllActivities() {
    const { data, error } = await supabase
      .from("activities")
      .select("id, s_no, event, date, chief_guest, participants, image_url, description")
      .order("s_no", { ascending: true });

    if (error) {
      console.error("[activitiesService] Error fetching activities:", error);
      throw error;
    }
    return data || [];
  },

  /**
   * Fetch latest highlight activities for landing page
   */
  async getLatestHighlights(limit = 3) {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("s_no", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[activitiesService] Error fetching highlights:", error);
      throw error;
    }
    return data || [];
  },

  /**
   * Insert a new activity record
   */
  async createActivity(activityData) {
    const { data, error } = await supabase
      .from("activities")
      .insert([activityData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update an existing activity record
   */
  async updateActivity(id, activityData) {
    const { data, error } = await supabase
      .from("activities")
      .update(activityData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete an activity record
   */
  async deleteActivity(id) {
    const { error } = await supabase
      .from("activities")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  }
};
