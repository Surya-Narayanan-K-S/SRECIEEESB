import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const usePageContent = (pageKey: string) => {
  return useQuery<Record<string, string>>({
    queryKey: ["page_content", pageKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_content")
        .select("content_key, content_text")
        .eq("page_key", pageKey);

      if (error) {
        console.warn("page_content query failed (table might be missing in Supabase):", error.message);
        return {};
      }

      const contentMap: Record<string, string> = {};
      if (data) {
        data.forEach((row) => {
          contentMap[row.content_key] = row.content_text;
        });
      }
      return contentMap;
    }
  });
};
