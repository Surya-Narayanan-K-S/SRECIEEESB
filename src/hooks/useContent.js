import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
export const usePageContent = (pageKey) => {
    return useQuery({
        queryKey: ["page_content", pageKey],
        queryFn: async () => {
            // Query both page_contents and page_content tables in parallel
            try {
                const { data: data1 } = await supabase
                    .from("page_contents")
                    .select("content_key, content_text")
                    .in("page_key", [pageKey, "global", "common"]);
                if (data1 && data1.length > 0) {
                    const contentMap = {};
                    data1.forEach((row) => {
                        if (row.content_key)
                            contentMap[row.content_key] = row.content_text;
                    });
                    return contentMap;
                }
            }
            catch {
                // Fallback to page_content
            }
            try {
                const { data: data2 } = await supabase
                    .from("page_content")
                    .select("content_key, content_text")
                    .eq("page_key", pageKey);
                const contentMap = {};
                if (data2) {
                    data2.forEach((row) => {
                        if (row.content_key)
                            contentMap[row.content_key] = row.content_text;
                    });
                }
                return contentMap;
            }
            catch {
                return {};
            }
        },
        staleTime: 1000 * 60 * 5, // 5 min cache
    });
};
