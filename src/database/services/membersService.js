import { supabase } from "@/lib/supabase";

/**
 * Data access service for Student Members & Portal Auth
 */
export const membersService = {
  /**
   * Find member by email, roll number, or IEEE ID
   */
  async findMember({ email, rollNumber, ieeeId }) {
    let query = supabase.from("student_members").select("*");

    if (email) {
      const { data } = await supabase
        .from("student_members")
        .select("*")
        .ilike("email", email.trim().toLowerCase())
        .maybeSingle();
      if (data) return data;
    }

    if (rollNumber) {
      const { data } = await supabase
        .from("student_members")
        .select("*")
        .ilike("roll_number", rollNumber.trim().toUpperCase())
        .maybeSingle();
      if (data) return data;
    }

    if (ieeeId) {
      const { data } = await supabase
        .from("student_members")
        .select("*")
        .eq("ieee_id", ieeeId.trim())
        .maybeSingle();
      if (data) return data;
    }

    // Fallback: Check in ieee_member_directory
    if (rollNumber) {
      const { data } = await supabase
        .from("ieee_member_directory")
        .select("*")
        .ilike("roll_number", rollNumber.trim().toUpperCase())
        .maybeSingle();
      if (data) return data;
    }

    return null;
  },

  /**
   * Register a new student membership application
   */
  async registerMember(memberData) {
    const { data, error } = await supabase
      .from("student_members")
      .insert([memberData])
      .select()
      .single();

    if (error) {
      console.error("[membersService] Error registering member:", error);
      throw error;
    }
    return data;
  },

  /**
   * Update student member profile details
   */
  async updateMember(id, updates) {
    const { data, error } = await supabase
      .from("student_members")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
