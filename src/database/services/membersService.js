import { supabase } from "@/lib/supabase";

/**
 * Enhanced Data Access Service for Student Members & Portal Auth
 */
export const membersService = {
  /**
   * Find member by email, roll number, or IEEE ID
   */
  async findMember({ email, rollNumber, ieeeId }) {
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
   * Fetch all student members with optional filtering and pagination
   */
  async getAllStudentMembers({ search = "", department = "ALL", status = "ALL", limit = 500, offset = 0 } = {}) {
    let query = supabase
      .from("student_members")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (department && department !== "ALL") {
      query = query.eq("department", department);
    }

    if (status && status !== "ALL") {
      query = query.eq("membership_status", status);
    }

    if (search && search.trim()) {
      const s = search.trim();
      query = query.or(`first_name.ilike.%${s}%,last_name.ilike.%${s}%,roll_number.ilike.%${s}%,email.ilike.%${s}%,ieee_id.ilike.%${s}%`);
    }

    const { data, error, count } = await query;
    if (error) {
      console.error("[membersService] Error fetching student members:", error);
      throw error;
    }

    return { members: data || [], totalCount: count || 0 };
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
  },

  /**
   * Assign or update IEEE Membership ID
   */
  async updateIeeeId(id, ieeeId) {
    const { data, error } = await supabase
      .from("student_members")
      .update({ ieee_id: ieeeId.trim(), updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update membership status (ACTIVE, INACTIVE, PENDING, ALUMNI)
   */
  async updateMemberStatus(id, status) {
    const { data, error } = await supabase
      .from("student_members")
      .update({ membership_status: status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a student member record
   */
  async deleteMember(id) {
    const { error } = await supabase
      .from("student_members")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },

  /**
   * Batch update members
   */
  async batchUpdateMembers(ids, updates) {
    const { data, error } = await supabase
      .from("student_members")
      .update(updates)
      .in("id", ids)
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Fetch member statistics (totals, active, pending IEEE IDs)
   */
  async getMemberStats() {
    const { data, error } = await supabase
      .from("student_members")
      .select("id, department, ieee_id, membership_status");

    if (error) {
      console.error("[membersService] Error fetching member stats:", error);
      return { total: 0, active: 0, withIeeeId: 0, departmentBreakdown: {} };
    }

    const total = data?.length || 0;
    const active = data?.filter(m => m.membership_status === "ACTIVE" || !m.membership_status).length || 0;
    const withIeeeId = data?.filter(m => m.ieee_id && m.ieee_id !== "PENDING").length || 0;
    
    const departmentBreakdown = {};
    data?.forEach(m => {
      const dept = m.department || "Other";
      departmentBreakdown[dept] = (departmentBreakdown[dept] || 0) + 1;
    });

    return { total, active, withIeeeId, departmentBreakdown };
  }
};
