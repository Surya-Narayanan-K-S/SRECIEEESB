import { supabase } from "@/lib/supabase";

/**
 * Data access service for Dynamic Page Content & Launch Configuration
 */
export const contentService = {
  /**
   * Fetch page content map for a given page key
   */
  async getPageContent(pageKey) {
    const { data, error } = await supabase
      .from("page_content")
      .select("content_key, content_text")
      .eq("page_key", pageKey);

    if (error) {
      console.warn(`[contentService] Could not fetch content for ${pageKey}:`, error.message);
      return {};
    }

    const map = {};
    (data || []).forEach((row) => {
      map[row.content_key] = row.content_text;
    });
    return map;
  },

  /**
   * Upsert a key-value pair for page content
   */
  async updateContent(pageKey, contentKey, text) {
    const { data, error } = await supabase
      .from("page_content")
      .upsert(
        { page_key: pageKey, content_key: contentKey, content_text: String(text) },
        { onConflict: "page_key,content_key" }
      )
      .select();

    if (error) throw error;
    return data;
  }
};
