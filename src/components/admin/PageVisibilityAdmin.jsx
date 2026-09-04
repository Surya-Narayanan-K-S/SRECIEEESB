import React, { useState } from "react";
import { usePageVisibility } from "@/hooks/usePageVisibility";
import {
  Eye,
  EyeOff,
  Globe,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  Sparkles,
  RefreshCw,
  Search,
  Lock,
  Unlock,
  SlidersHorizontal
} from "lucide-react";
import { toast } from "sonner";

export const PageVisibilityAdmin = () => {
  const {
    allPages,
    hiddenPages,
    togglePageVisibility,
    loading,
    refreshVisibility,
  } = usePageVisibility();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isUpdating, setIsUpdating] = useState(null);

  const categories = ["all", ...new Set(allPages.map((p) => p.category))];

  const filteredPages = allPages.filter((p) => {
    const matchesSearch =
      p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleToggle = async (path, label) => {
    setIsUpdating(path);
    const wasHidden = hiddenPages.includes(path);
    const res = await togglePageVisibility(path);
    setIsUpdating(null);

    if (res.success) {
      if (wasHidden) {
        toast.success(`"${label}" is now VISIBLE across the website and navbar.`);
      } else {
        toast.warning(`"${label}" is now HIDDEN from the website and navbar.`);
      }
    } else {
      toast.error("Failed to update page visibility in database.");
    }
  };

  const handleUnhideAll = async () => {
    if (!confirm("Are you sure you want to make ALL pages visible?")) return;
    for (const path of hiddenPages) {
      await togglePageVisibility(path);
    }
    toast.success("All pages are now visible!");
  };

  return (
    <div className="space-y-6 text-white">
      {/* ── Top Header Banner ── */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#001026] via-[#001a3d] to-[#002b66] border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              <Eye size={22} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                Page Visibility &amp; Navigation Control
              </h2>
              <p className="text-xs text-cyan-300/80 font-medium">
                Instantly toggle and hide entire pages or links from the website navbar and routing
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-auto flex-wrap">
          <button
            type="button"
            onClick={refreshVisibility}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>

          {hiddenPages.length > 0 && (
            <button
              type="button"
              onClick={handleUnhideAll}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Unlock size={13} />
              <span>Unhide All Pages ({hiddenPages.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Stats Summary Badges ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#001026] border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Configured Pages</p>
            <p className="text-2xl font-black text-white mt-1">{allPages.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Layers size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#001026] border border-emerald-500/20 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Live Visible Pages</p>
            <p className="text-2xl font-black text-emerald-300 mt-1">{allPages.length - hiddenPages.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Eye size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#001026] border border-amber-500/20 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">Hidden Pages</p>
            <p className="text-2xl font-black text-amber-300 mt-1">{hiddenPages.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <EyeOff size={20} />
          </div>
        </div>
      </div>

      {/* ── Filters & Search Bar ── */}
      <div className="p-4 rounded-2xl bg-[#001026] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pages by name or route..."
            className="w-full pl-9 pr-4 py-2 bg-[#000814] border border-white/15 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Pages Grid / Table ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredPages.map((page) => {
          const isHidden = hiddenPages.includes(page.path);
          const isProcessing = isUpdating === page.path;

          return (
            <div
              key={page.path}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                isHidden
                  ? "bg-[#0c121e]/90 border-amber-500/30 opacity-75 shadow-inner"
                  : "bg-[#001026] border-white/10 hover:border-cyan-500/40 shadow-md"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                    isHidden
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      : "bg-cyan-500/10 text-cyan-300 border-cyan-400/30 shadow-xs"
                  }`}
                >
                  {isHidden ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-extrabold text-white truncate">
                      {page.label}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono text-cyan-300">
                      {page.path}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[9px] font-bold text-slate-300 uppercase">
                      {page.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {page.desc}
                  </p>
                </div>
              </div>

              {/* Action Switch & Preview */}
              <div className="flex items-center gap-2.5 shrink-0">
                <a
                  href={page.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-all"
                  title="Preview page in new tab"
                >
                  <ExternalLink size={14} />
                </a>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleToggle(page.path, page.label)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                    isHidden
                      ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40"
                      : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20"
                  }`}
                >
                  {isProcessing ? (
                    <RefreshCw size={13} className="animate-spin" />
                  ) : isHidden ? (
                    <>
                      <EyeOff size={13} />
                      <span>Hidden</span>
                    </>
                  ) : (
                    <>
                      <Eye size={13} />
                      <span>Visible</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PageVisibilityAdmin;
