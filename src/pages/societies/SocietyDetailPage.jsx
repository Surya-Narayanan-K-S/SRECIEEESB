import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SocietyOfficeBearers from "@/components/societies/SocietyOfficeBearers";
import { ArrowLeft, Loader2, Target, Calendar, Users, Layers, Sparkles, Crown, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// Helper function to map common IEEE societies to professional focus areas
const getFocusAreas = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("computer") || lower.includes("cs"))
        return ["Software Architecture", "Artificial Intelligence", "Cybersecurity", "Cloud Computing"];
    if (lower.includes("roboti") || lower.includes("ras"))
        return ["Autonomous Systems", "Machine Vision", "Control Theory", "Mechatronics"];
    if (lower.includes("power") || lower.includes("pes"))
        return ["Renewable Energy", "Smart Grid Infrastructure", "Power Electronics", "Sustainable Tech"];
    if (lower.includes("communic") || lower.includes("comsoc"))
        return ["5G/6G Networks", "Signal Processing", "IoT Ecosystems", "Telecommunications"];
    if (lower.includes("medic") || lower.includes("embs"))
        return ["Bioinformatics", "Medical Imaging", "Neural Engineering", "Biosensors"];
    if (lower.includes("women") || lower.includes("wie"))
        return ["Leadership Development", "Diversity in STEM", "Mentorship", "Career Advocacy"];
    if (lower.includes("computational") || lower.includes("cis"))
        return ["Deep Learning", "Fuzzy Logic", "Evolutionary Computation", "Neural Networks"];
    return ["Advanced Research & Development", "System Integration", "Applied Engineering", "Technological Innovation"];
};
const SocietyDetailPage = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("overview");
    const { data: society, isLoading } = useQuery({
        queryKey: ["society", id],
        queryFn: async () => {
            const isNum = !isNaN(Number(id));
            let query = supabase.from("societies").select("*");
            if (isNum) {
                query = query.eq("id", Number(id));
            }
            else {
                query = query.or(`short_code.ilike.${id},slug.ilike.${id}`);
            }
            const { data, error } = await query.single();
            if (error) {
                // fallback to query all and match slug
                const { data: allData } = await supabase.from("societies").select("*");
                const found = allData?.find(s => s.slug === id || s.short_code?.toLowerCase() === id?.toLowerCase());
                if (found)
                    return found;
                throw error;
            }
            return data;
        }
    });
    const focusAreas = society ? getFocusAreas(society.name) : [];
    return (<div className="min-h-screen bg-[#000814] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 flex flex-col font-sans relative overflow-hidden">
      {/* Ambient Neon Flare Mesh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none -z-0">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px]"/>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]"/>
        <div className="absolute bottom-20 left-1/3 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]"/>
      </div>

      <Navbar />

      <main className="flex-1 w-full pt-8 md:pt-10 pb-24 relative z-10">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">

          <Link to="/societies" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 font-bold uppercase tracking-widest text-[10px] transition-colors mb-12">
            <ArrowLeft size={14}/> Back to Societies
          </Link>

          {isLoading ? (<div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-400"/>
            </div>) : !society ? (<div className="text-center py-24 rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl">
              <h2 className="text-2xl font-serif font-bold text-white mb-4">Society Not Found</h2>
              <p className="text-slate-400">The requested society details could not be loaded.</p>
            </div>) : (<motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="space-y-12">
              {/* Header Box */}
              <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#00142e]/90 via-[#000e24]/90 to-[#000814]/95 backdrop-blur-2xl p-8 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.04] pointer-events-none">
                  <Layers size={220} className="text-cyan-400"/>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[11px] font-black uppercase tracking-wider mb-6">
                  <Sparkles size={13} className="text-cyan-400"/>
                  <span>Technical Society Chapter</span>
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white mb-6 max-w-4xl relative z-10 leading-tight">
                  {society.name}
                </h1>

                <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-3xl relative z-10 mb-6">
                  {society.description || "Advancing technology for humanity through dedicated focus, engineering excellence, and specialized research initiatives."}
                </p>

                <div className="relative z-10 flex flex-wrap items-center gap-3">
                  <Link to={`/societies/office-bearers?society=${society.slug || society.short_code || id}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-102">
                    <Crown size={14}/>
                    <span>View Dedicated Office Bearers Page</span>
                    <ExternalLink size={12}/>
                  </Link>
                </div>
              </div>

              {/* INTERACTIVE WORKSPACE TABS */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 bg-[#00122a]/80 backdrop-blur-2xl rounded-2xl border border-white/10 mb-8 sm:mb-12 shadow-inner w-fit mx-auto max-w-full">
                {[
                {
                    id: "overview",
                    label: "Overview",
                    icon: Sparkles,
                    activeColor: "bg-blue-600 text-white shadow-blue-600/30",
                    idleColor: "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/20",
                    iconActive: "text-blue-100",
                    iconIdle: "text-blue-400",
                },
                {
                    id: "initiatives",
                    label: "Initiatives",
                    icon: Target,
                    activeColor: "bg-teal-600 text-white shadow-teal-600/30",
                    idleColor: "text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-400/20",
                    iconActive: "text-teal-100",
                    iconIdle: "text-teal-400",
                },
                {
                    id: "workshops",
                    label: "Workshops",
                    icon: Layers,
                    activeColor: "bg-amber-600 text-white shadow-amber-600/30",
                    idleColor: "text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/20",
                    iconActive: "text-amber-100",
                    iconIdle: "text-amber-400",
                },
                {
                    id: "office bearers",
                    label: "Office Bearers",
                    isOfficeBearer: true,
                    icon: Crown,
                    activeColor: "bg-cyan-500 text-slate-950 shadow-cyan-950/30 ring-2 ring-cyan-400/30",
                    idleColor: "text-cyan-300 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 font-black",
                    iconActive: "text-slate-950",
                    iconIdle: "text-cyan-300",
                },
            ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const isBearer = tab.isOfficeBearer;
                return (<button key={tab.id} onClick={() => setActiveTab(tab.id)} title={tab.label} className={`flex items-center justify-center gap-2 transition-all rounded-xl relative ${isBearer
                        ? `px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs font-black uppercase tracking-wider ${isActive
                            ? tab.activeColor + " scale-[1.02] shadow-md"
                            : tab.idleColor}`
                        : `p-2.5 sm:px-4 sm:py-2.5 text-xs font-bold uppercase tracking-wider ${isActive
                            ? tab.activeColor + " scale-[1.02] shadow-md"
                            : tab.idleColor}`}`}>
                      <Icon size={16} className={isActive ? tab.iconActive : tab.iconIdle}/>
                      <span className={isBearer ? "inline" : "hidden sm:inline"}>
                        {tab.label}
                      </span>
                    </button>);
            })}
              </div>

              {/* TAB CONTENT WITH ANIMATED LOADING SWITCH */}
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 15, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10, filter: "blur(4px)" }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="mb-16 relative">
                  {/* Dynamic Loading Shimmer Pulse Bar */}
                  <motion.div initial={{ scaleX: 0, opacity: 1 }} animate={{ scaleX: 1, opacity: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-8 origin-center"/>

                  {activeTab === "office bearers" ? (<SocietyOfficeBearers societyName={society.name}/>) : (<div className="space-y-8">
                      {/* In-depth Explanation Section */}
                      <div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl relative">
                        <div className="grid lg:grid-cols-2 gap-12">

                          {/* Left Column: Scope and Details */}
                          <div>
                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">About the Society</h2>
                            <div className="h-[2px] w-12 bg-cyan-400 mb-6"></div>

                            <div className="text-slate-300 space-y-4 text-sm sm:text-base font-normal leading-relaxed">
                              <p>
                                The <strong className="text-white">{society.name}</strong> is dedicated to exploring the fundamental theories and practical applications within its specialized domain. As technology increasingly intersects with daily human life, this society serves as a critical bridge between academic research and industry implementation.
                              </p>
                              <p>
                                Members engage deeply with cutting-edge literature, collaborate on open-source hardware and software projects, and participate in intensive workshops designed to transform theoretical knowledge into tangible engineering solutions.
                              </p>
                              <p>
                                Whether you are aiming to publish groundbreaking research or simply want to build deployable systems, the society offers the resources, mentorship, and global network necessary to accelerate your technological footprint.
                              </p>
                            </div>
                          </div>

                          {/* Right Column: Focus Areas */}
                          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
                            <h3 className="text-lg font-bold tracking-tight text-white mb-6">Strategic Focus Areas</h3>
                            <ul className="space-y-4">
                              {focusAreas.map((area, idx) => (<li key={idx} className="flex items-start gap-3">
                                  <div className="mt-1.5 h-2 w-2 rounded-full bg-cyan-400 shrink-0"></div>
                                  <span className="text-slate-300 font-medium text-sm">{area}</span>
                                </li>))}
                            </ul>

                            <div className="mt-8 pt-6 border-t border-white/10">
                              <h3 className="text-xs font-bold tracking-widest uppercase text-cyan-400 mb-2">Core Objectives</h3>
                              <p className="text-slate-400 text-xs leading-relaxed">
                                To foster technological innovation and excellence for the benefit of humanity. We aim to connect professionals, share critical knowledge, and architect the systems of tomorrow safely and efficiently.
                              </p>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Grid Details (Actionable) */}
                      <div className="grid md:grid-cols-2 gap-8">

                        <div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-10 shadow-2xl hover:border-cyan-400/40 transition-colors">
                          <Calendar className="text-cyan-400 mb-6" size={32}/>
                          <h3 className="font-bold text-white text-xl mb-3 tracking-tight">Key Activities</h3>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            From regular symposiums and technical bootcamps to global networking events, our activities are heavily project-oriented and collaborative. Members routinely participate in hackathons, design challenges, and peer-reviewed publishing.
                          </p>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#00142e] to-[#000814] text-white p-8 md:p-10 shadow-2xl backdrop-blur-2xl">
                          <Users className="text-cyan-400 mb-6" size={32}/>
                          <h3 className="font-bold text-white text-xl mb-3 tracking-tight">Join {society.name}</h3>
                          <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Become a part of an elite network of engineers and researchers. Gain exclusive access to leading journals, technical libraries, and an unparalleled professional alumni network.
                          </p>
                          <Link to="/join" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-wider text-xs group">
                            <span>Submit Application</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                          </Link>
                        </div>
                      </div>
                    </div>)}
                </motion.div>
              </AnimatePresence>

            </motion.div>)}
        </div>
      </main>

      <Footer />
    </div>);
};
export default SocietyDetailPage;
