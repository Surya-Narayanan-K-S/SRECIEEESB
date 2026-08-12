import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  CalendarDays,
  Users,
  Search,
  Filter,
  UserRound,
  ArrowUpDown,
  X,
  BarChart3,
  Star,
  Activity
} from "lucide-react";

type ActivityItem = {
  id: number;
  s_no?: number;
  event: string;
  date?: string;
  chief_guest?: string;
  participants?: string;
  image_url?: string | null;
};

const fallbackImage = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop";

const getValidImageUrl = (url?: string | null) => {
  if (!url || !url.trim()) return fallbackImage;
  const target = url.trim();
  
  if (target.includes("drive.google.com")) {
    const match = target.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match?.[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return fallbackImage;
  }
  
  if (target.startsWith("http://") || target.startsWith("https://")) {
    return target;
  }
  
  const { data } = supabase.storage.from("activities").getPublicUrl(target);
  return data?.publicUrl || fallbackImage;
};

const parseYearFromDate = (dateStr?: string) => {
  if (!dateStr) return "Unknown";
  const years = dateStr.match(/\b(19|20)\d{2}\b/g);
  return years && years.length > 0 ? years[years.length - 1] : "Unknown";
};

const getParticipantCount = (participants?: string) => {
  if (!participants) return 0;
  const match = participants.match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const StatsGraphicModule = ({ activities }: { activities: ActivityItem[] }) => {
  const chartData = useMemo(() => {
     const counts: Record<string, number> = {};
     activities.forEach(a => {
        const y = parseYearFromDate(a.date);
        if(y !== "Unknown") counts[y] = (counts[y] || 0) + 1;
     });
     return Object.entries(counts).sort((a,b) => Number(a[0]) - Number(b[0])).slice(-5); 
  }, [activities]);

  const max = Math.max(...chartData.map(d => d[1]), 1);

  return (
     <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2 text-slate-700 font-bold text-xs tracking-wide">
             <BarChart3 className="h-4 w-4 text-blue-500" /> Event Activity Trend
           </div>
        </div>
        <div className="flex items-end justify-between h-20 gap-2 pt-2">
           {chartData.map(([year, count]) => (
              <div key={year} className="flex flex-col items-center gap-1.5 w-full relative group">
                 <div className="absolute -top-6 bg-slate-800 text-white text-[9px] rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                   {count} Events
                 </div>
                 <div className="w-full bg-slate-200/60 rounded-md overflow-hidden flex items-end h-full">
                    <motion.div 
                       initial={{ height: 0 }}
                       animate={{ height: `${(count / max) * 100}%` }}
                       transition={{ duration: 0.7, ease: "easeOut" }}
                       className="w-full bg-blue-600 group-hover:bg-blue-500 transition-colors"
                    />
                 </div>
                 <span className="text-[10px] font-bold text-slate-400">{year}</span>
              </div>
           ))}
        </div>
     </div>
  );
};

const ActivityCard = ({ item, onClick }: { item: ActivityItem; onClick: () => void }) => {
  const resolvedImage = getValidImageUrl(item.image_url);
  const [imgSrc, setImgSrc] = useState(resolvedImage);
  const participantCount = getParticipantCount(item.participants);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer flex flex-col h-[340px] group text-left"
    >
      <div className="relative h-44 w-full bg-slate-100 border-b border-slate-55 shrink-0">
        <img 
          src={imgSrc} 
          alt={item.event}
          className="w-full h-full object-cover transition-opacity duration-550 group-hover:opacity-95" 
          onError={() => setImgSrc(fallbackImage)}
        />
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur text-slate-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider border border-slate-100/50">
          {parseYearFromDate(item.date)}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-slate-800 text-[15px] leading-snug line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
          {item.event}
        </h3>
        <div className="space-y-2 mb-auto text-[13px] text-slate-550">
           <div className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-slate-400 shrink-0" /> <span className="truncate">{item.date || "TBD"}</span></div>
           <div className="flex items-center gap-2"><UserRound className="h-3.5 w-3.5 text-slate-400 shrink-0" /> <span className="truncate">{item.chief_guest || "No Guest Provided"}</span></div>
        </div>
        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
           <div className="flex items-center gap-1.5 font-bold text-slate-700">
             <Users className="h-3.5 w-3.5 text-blue-500" /> {participantCount}
           </div>
           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">#{item.s_no || item.id}</span>
        </div>
      </div>
    </div>
  );
};

const ActivitiesPage = () => {
  const [selectedYear, setSelectedYear] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "s_no" | "participants" | "event">("latest");
  const [selectedModalItem, setSelectedModalItem] = useState<ActivityItem | null>(null);

  useEffect(() => {
    if (selectedModalItem) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedModalItem]);

  const { data: activities = [], isLoading, isError, error } = useQuery<ActivityItem[]>({
    queryKey: ["activities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("id, s_no, event, date, chief_guest, participants, image_url")
        .order("s_no", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(activities.map((item) => parseYearFromDate(item.date))))
      .filter((year) => year !== "Unknown")
      .sort((a, b) => Number(b) - Number(a));
    return ["All", ...uniqueYears];
  }, [activities]);

  const filteredActivities = useMemo(() => {
    const result = activities.filter((item) => {
      const itemYear = parseYearFromDate(item.date);
      const matchesYear = selectedYear === "All" || itemYear === selectedYear;
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        item.event?.toLowerCase().includes(search) ||
        item.chief_guest?.toLowerCase().includes(search) ||
        item.participants?.toLowerCase().includes(search) ||
        item.date?.toLowerCase().includes(search);
      return matchesYear && matchesSearch;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "event") return a.event.localeCompare(b.event);
      if (sortBy === "participants") return getParticipantCount(b.participants) - getParticipantCount(a.participants);
      if (sortBy === "s_no") return (a.s_no || 0) - (b.s_no || 0);

      const yearA = Number(parseYearFromDate(a.date)) || 0;
      const yearB = Number(parseYearFromDate(b.date)) || 0;

      if (sortBy === "oldest") {
        if (yearA !== yearB) return yearA - yearB;
        return (a.s_no || 0) - (b.s_no || 0);
      }
      if (yearA !== yearB) return yearB - yearA;
      return (b.s_no || 0) - (a.s_no || 0);
    });
  }, [activities, selectedYear, searchTerm, sortBy]);

  const totalParticipants = useMemo(() => filteredActivities.reduce((sum, item) => sum + getParticipantCount(item.participants), 0), [filteredActivities]);

  const featuredActivity = useMemo(() => {
    if (!filteredActivities.length) return null;
    return [...filteredActivities].sort((a, b) => getParticipantCount(b.participants) - getParticipantCount(a.participants))[0];
  }, [filteredActivities]);

  const groupedActivities = useMemo(() => {
    if (sortBy === "participants" || sortBy === "event" || sortBy === "s_no") {
      return { "Directory Results": filteredActivities };
    }
    const groups: Record<string, typeof filteredActivities> = {};
    filteredActivities.forEach((item) => {
      const year = parseYearFromDate(item.date);
      if (!groups[year]) groups[year] = [];
      groups[year].push(item);
    });
    return groups;
  }, [filteredActivities, sortBy]);

  const groupKeys = useMemo(() => {
     const keys = Object.keys(groupedActivities);
     if (keys.length === 1 && keys[0] === "Directory Results") return keys;
     return keys.sort((a, b) => {
        if (sortBy === "oldest") return Number(a) - Number(b);
        return Number(b) - Number(a); 
     });
  }, [groupedActivities, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      

      <main className="flex-1 max-w-[1400px] mx-auto px-6 md:px-12 py-8 w-full">
         <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
            
            {/* LEFT COLUMN: Sticky Filter & Analytics Sidebar */}
            <aside className="lg:col-span-4 lg:sticky lg:top-48 flex flex-col gap-6 text-left">
               <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs tracking-wider uppercase mb-4 shadow-sm">
                     <Activity size={12} className="animate-pulse" />
                     Event Archive
                  </span>
                  <h1 className="text-4xl font-serif font-black text-slate-900 mb-2 leading-tight">Event Directory</h1>
                  <p className="text-slate-505 text-sm leading-relaxed mb-4">
                     Log and analyze official technical programs, seminars, and organizational activities.
                  </p>
               </div>

               {/* Metric Cards Row */}
               <div className="grid grid-cols-2 gap-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><CalendarDays className="h-3 w-3" /> Operations</p>
                    <p className="text-2xl font-black text-slate-800">{activities.length}</p>
                  </div>
                  <div className="border-l border-slate-100 pl-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Users className="h-3 w-3" /> Reach</p>
                    <p className="text-2xl font-black text-slate-800">{totalParticipants}</p>
                  </div>
               </div>

               {/* Filters Panel */}
               <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
                  
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                       type="text"
                       placeholder="Search events, guests..."
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-905 placeholder-slate-400 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>

                  {/* Year selector */}
                  <div className="relative">
                     <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                     <select
                       aria-label="Filter by year"
                       value={selectedYear}
                       onChange={(e) => setSelectedYear(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-8 text-sm text-slate-700 outline-none cursor-pointer focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                     >
                       {years.map(y => <option key={y} value={y}>{y === "All" ? "Filter: All Years" : `Year: ${y}`}</option>)}
                     </select>
                  </div>

                  {/* Sort selector */}
                  <div className="relative">
                     <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                     <select
                       aria-label="Sort activities"
                       value={sortBy}
                       onChange={(e) => setSortBy(e.target.value as "latest" | "oldest" | "s_no" | "participants" | "event")}
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-8 text-sm text-slate-700 outline-none cursor-pointer focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                     >
                       <option value="latest">Sort: Latest</option>
                       <option value="oldest">Sort: Oldest</option>
                       <option value="participants">Sort: Highest Reach</option>
                       <option value="event">Sort: Name (A-Z)</option>
                       <option value="s_no">Sort: Record ID</option>
                     </select>
                  </div>

                  {/* Clear Button */}
                  {(searchTerm || selectedYear !== "All" || sortBy !== "latest") && (
                    <button
                      onClick={() => { setSelectedYear("All"); setSearchTerm(""); setSortBy("latest"); }}
                      className="w-full py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-100 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-sm font-bold"
                    >
                      <X className="h-4 w-4" /> Clear All Filters
                    </button>
                  )}
               </div>

               {/* Chart Trends Module */}
               {activities.length > 0 && <StatsGraphicModule activities={activities} />}

            </aside>

            {/* RIGHT COLUMN: Event Card Feed */}
            <div className="lg:col-span-8 flex flex-col gap-6 text-left">
               
               {/* Featured Highlight Card */}
               {featuredActivity && (
                 <div 
                   onClick={() => setSelectedModalItem(featuredActivity)}
                   className="bg-white border border-slate-100 hover:border-blue-300 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer shadow-sm hover:shadow-md transition-all relative overflow-hidden text-left"
                 >
                   <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600"></div>
                   
                   <div className="flex-1 pl-2">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-2 flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 fill-blue-500 text-blue-500" /> Featured Event
                     </span>
                     <h2 className="text-xl font-serif font-bold text-slate-800 mb-2">
                       {featuredActivity.event}
                     </h2>
                     <p className="text-slate-500 text-xs mt-1">
                        Chief Guest: {featuredActivity.chief_guest || "No Guest Provided"}
                     </p>
                   </div>
                   
                   <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8 text-xs shrink-0 w-full md:w-auto">
                      <div className="flex flex-col">
                         <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Reach</span>
                         <span className="font-extrabold text-slate-800 text-base">{getParticipantCount(featuredActivity.participants)}</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Date</span>
                         <span className="font-extrabold text-slate-800 text-base">{featuredActivity.date || "-"}</span>
                      </div>
                   </div>
                 </div>
               )}

               {/* Grid Feed Section */}
               {isLoading && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {[...Array(6)].map((_, i) => (
                     <div key={i} className="bg-white border border-slate-100 rounded-2xl h-[340px] animate-pulse flex flex-col overflow-hidden shadow-sm">
                       <div className="h-44 bg-slate-100 border-b shrink-0" />
                       <div className="p-5 flex flex-col flex-1">
                         <div className="h-4 w-3/4 bg-slate-100 rounded mb-4" />
                         <div className="h-3.5 w-1/2 bg-slate-100 rounded mb-2" />
                         <div className="h-3.5 w-2/3 bg-slate-100 rounded mb-auto" />
                       </div>
                     </div>
                   ))}
                 </div>
               )}

               {isError && (
                 <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center">
                   <h3 className="text-sm font-bold text-red-800">Unable to establish records connection</h3>
                   <p className="mt-1 text-xs text-red-600">{(error as Error)?.message || "Verify your connection parameters."}</p>
                 </div>
               )}

               {!isLoading && !isError && filteredActivities.length === 0 && (
                 <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm flex flex-col items-center">
                   <div className="w-12 h-12 bg-slate-50 flex items-center justify-center rounded-full mb-4 border border-slate-100">
                     <Search className="h-5 w-5 text-slate-400" />
                   </div>
                   <h3 className="text-base font-bold text-slate-800">No records found</h3>
                   <p className="text-xs text-slate-500 mt-1 max-w-sm mb-6">
                     There are no matching activities mapped to your current filter constraints.
                   </p>
                 </div>
               )}

               {!isLoading && !isError && filteredActivities.length > 0 && (
                 <div className="flex flex-col gap-10">
                   {groupKeys.map((yearKey) => (
                     <div key={yearKey}>
                       <div className="flex items-center gap-4 mb-6">
                         <h2 className="text-xl font-serif font-black text-slate-800">{yearKey}</h2>
                         <div className="h-px bg-slate-200 flex-1"></div>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {groupedActivities[yearKey].map((item) => (
                           <ActivityCard 
                             key={item.id} 
                             item={item} 
                             onClick={() => setSelectedModalItem(item)} 
                           />
                         ))}
                       </div>
                     </div>
                   ))}
                 </div>
               )}

            </div>

         </div>
      </main>
      
      <Footer />

      {/* Detail Overlay Modal */}
      <AnimatePresence>
        {selectedModalItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedModalItem(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200]"
            />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-2xl max-h-full overflow-y-auto pointer-events-auto"
              >
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col w-full text-left">
                  <div className="relative h-64 bg-slate-100 border-b border-slate-150">
                     <img 
                       src={getValidImageUrl(selectedModalItem.image_url)} 
                       alt={selectedModalItem.event}
                       className="absolute inset-0 w-full h-full object-cover" 
                     />
                     <button 
                        aria-label="Close modal"
                        onClick={() => setSelectedModalItem(null)} 
                        className="absolute top-4 right-4 text-slate-800 bg-white/90 backdrop-blur hover:bg-white p-2 rounded-full border border-slate-200 transition shadow-sm pointer-events-auto"
                     >
                        <X className="h-4 w-4" />
                     </button>
                  </div>
                  
                  <div className="p-6 md:p-8 flex flex-col bg-white">
                     <div className="flex items-center justify-between mb-4">
                        <span className="bg-slate-55 text-slate-550 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-slate-200/80">
                          Record ID: {selectedModalItem.s_no || selectedModalItem.id}
                        </span>
                     </div>
                     
                     <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-900 leading-snug mb-6">
                        {selectedModalItem.event}
                     </h2>
                     
                     <div className="space-y-0.5 text-sm">
                       <div className="grid grid-cols-[140px_1fr] items-baseline border-b border-slate-100 py-3">
                         <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Organized</span>
                         <span className="text-slate-800 font-bold">{selectedModalItem.date || "-"}</span>
                       </div>
                       <div className="grid grid-cols-[140px_1fr] items-baseline border-b border-slate-100 py-3">
                         <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Chief Guest</span>
                         <span className="text-slate-800 font-bold">{selectedModalItem.chief_guest || "-"}</span>
                       </div>
                       <div className="grid grid-cols-[140px_1fr] items-baseline py-3">
                         <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Registrations</span>
                         <span className="text-slate-800 font-bold">{getParticipantCount(selectedModalItem.participants)} Participants</span>
                       </div>
                     </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivitiesPage;