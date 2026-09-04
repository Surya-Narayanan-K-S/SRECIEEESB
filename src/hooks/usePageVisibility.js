import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const CACHE_KEY = "ieee_hidden_pages";

export const ALL_CONFIGURABLE_PAGES = [
  { path: "/about", label: "About Us", category: "General", desc: "Branch vision, history & milestones" },
  { path: "/societies", label: "Societies & Chapters", category: "Academics", desc: "8 specialized technical chapters" },
  { path: "/societies/office-bearers", label: "Society Chapter Leaders", category: "Leadership", desc: "Society executive directory" },
  { path: "/activities", label: "Activities & Events", category: "Events", desc: "Workshops, hackathons & seminars" },
  { path: "/reports", label: "Event & Congress Reports", category: "Reports", desc: "Official activity documentation" },
  { path: "/office-bearers", label: "Main SB Office Bearers", category: "Leadership", desc: "Student Branch executive council" },
  { path: "/past-bearers", label: "Past Office Bearers", category: "Leadership", desc: "Alumni leadership records" },
  { path: "/team", label: "Executive Team Roster", category: "Leadership", desc: "Full executive committee roster" },
  { path: "/gallery", label: "Photo Gallery", category: "Media", desc: "Event photo archives & memories" },
  { path: "/awards", label: "Awards & Recognitions", category: "Accolades", desc: "Accolades, honors & grants" },
  { path: "/annual-plans", label: "Annual Plans & Roadmap", category: "Planning", desc: "Annual activity schedules" },
  { path: "/funding", label: "Funding Requests", category: "Finance", desc: "Funding requests & financial support" },
  { path: "/document", label: "Official SB PDF Handbook", category: "Documents", desc: "In-app PDF reader & guidebook" },
  { path: "/membership-registration", label: "Membership Registration", category: "Members", desc: "New member enrollment form" },
  { path: "/student-login", label: "Student Portal Login", category: "Members", desc: "Member dashboard & digital ID" },
  { path: "/contact", label: "Contact Us", category: "General", desc: "Get in touch & location info" },
];

export const usePageVisibility = () => {
  const [hiddenPages, setHiddenPages] = useState(() => {
    try {
      const saved = localStorage.getItem(CACHE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(true);

  // Fetch from Supabase
  const loadVisibility = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("page_content")
        .select("content_text")
        .eq("page_key", "page_visibility")
        .eq("content_key", "hidden_pages")
        .maybeSingle();

      if (data && data.content_text) {
        const parsed = JSON.parse(data.content_text);
        if (Array.isArray(parsed)) {
          setHiddenPages(parsed);
          localStorage.setItem(CACHE_KEY, JSON.stringify(parsed));
        }
      }
    } catch (err) {
      console.warn("Could not load page visibility config:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVisibility();

    // Listen for cross-tab updates
    const bc = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("ieee_page_visibility") : null;
    if (bc) {
      bc.onmessage = (msg) => {
        if (msg.data?.type === "PAGE_VISIBILITY_UPDATED" && Array.isArray(msg.data.hiddenPages)) {
          setHiddenPages(msg.data.hiddenPages);
          localStorage.setItem(CACHE_KEY, JSON.stringify(msg.data.hiddenPages));
        }
      };
    }

    return () => {
      if (bc) bc.close();
    };
  }, [loadVisibility]);

  // Helper check
  const isPageHidden = useCallback(
    (path) => {
      if (!path || path === "/") return false;
      return hiddenPages.some((p) => p === path || (p !== "/" && path.startsWith(p)));
    },
    [hiddenPages]
  );

  // Update in DB
  const togglePageVisibility = async (path) => {
    const isCurrentlyHidden = hiddenPages.includes(path);
    const updated = isCurrentlyHidden
      ? hiddenPages.filter((p) => p !== path)
      : [...hiddenPages, path];

    setHiddenPages(updated);
    localStorage.setItem(CACHE_KEY, JSON.stringify(updated));

    // Broadcast across open tabs
    if (typeof BroadcastChannel !== "undefined") {
      const bc = new BroadcastChannel("ieee_page_visibility");
      bc.postMessage({ type: "PAGE_VISIBILITY_UPDATED", hiddenPages: updated });
      bc.close();
    }

    try {
      // Upsert to supabase page_content table
      const { error } = await supabase.from("page_content").upsert(
        {
          page_key: "page_visibility",
          content_key: "hidden_pages",
          content_text: JSON.stringify(updated),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "page_key,content_key" }
      );

      if (error) {
        // Fallback delete + insert if onConflict isn't configured
        await supabase
          .from("page_content")
          .delete()
          .match({ page_key: "page_visibility", content_key: "hidden_pages" });
        await supabase.from("page_content").insert([
          {
            page_key: "page_visibility",
            content_key: "hidden_pages",
            content_text: JSON.stringify(updated),
          },
        ]);
      }
      return { success: true, hiddenPages: updated };
    } catch (err) {
      console.error("Error saving page visibility:", err);
      return { success: false, error: err };
    }
  };

  return {
    hiddenPages,
    isPageHidden,
    togglePageVisibility,
    loading,
    allPages: ALL_CONFIGURABLE_PAGES,
    refreshVisibility: loadVisibility,
  };
};

export default usePageVisibility;
