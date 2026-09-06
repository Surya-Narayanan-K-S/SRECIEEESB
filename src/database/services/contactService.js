import { supabase } from "@/lib/supabase";

/**
 * Data access service for Contact Inquiries & Feedback
 */
export const contactService = {
  /**
   * Submit an inquiry message
   */
  async submitMessage(messageData) {
    const { data, error } = await supabase
      .from("contact_messages")
      .insert([messageData])
      .select();

    if (error) {
      console.warn("[contactService] Error submitting message:", error);
      throw error;
    }
    return data;
  },

  /**
   * Fetch messages for administrative inbox
   */
  async getMessages(limit = 50) {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
};
