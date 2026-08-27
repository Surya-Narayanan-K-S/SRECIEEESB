import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SocietyOfficeBearers from "@/components/societies/SocietyOfficeBearers";
import { ArrowLeft, GraduationCap, Sparkles, Users, Award, ArrowRight, ExternalLink, Building, Calendar, Globe2, Trophy, Crown, ChevronRight, } from "lucide-react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import srecCampus from "@/assets/srec-campus.png";
const SrecBranchPage = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("overview");
    // Listen to ?tab=office-bearers or #office-bearers in URL
    useEffect(() => {
        const tabParam = searchParams.get("tab")?.toLowerCase().trim();
        const hash = location.hash.toLowerCase().trim();
        if (tabParam === "office-bearers" ||
            tabParam === "office bearers" ||
            tabParam === "office_bearers" ||
            tabParam === "bearers" ||
            tabParam === "leadership" ||
            hash === "#office-bearers" ||
            hash === "#officebearers" ||
            hash === "#bearers" ||
            hash === "#leadership") {
            setActiveTab("office bearers");
            setTimeout(() => {
                const el = document.getElementById("branch-tabs-section");
                if (el)
                    el.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [searchParams, location.hash]);
    const scrollToTabs = (tabKey) => {
        setActiveTab(tabKey);
        setTimeout(() => {
            const el = document.getElementById("branch-tabs-section");
            if (el)
                el.scrollIntoView({ behavior: "smooth" });
        }, 50);
    };
    return (<div className="min-h-screen bg-[#000814] text-slate-100 selection:bg-[#002855] selection:text-white flex flex-col font-sans relative overflow-hidden">
      {/* Ambient Neon Flare Mesh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none -z-0">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]"/>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px]"/>
        <div className="absolute bottom-20 left-1/3 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]"/>
      </div>

      <Navbar />

      <main className="flex-1 w-full pt-8 md:pt-10 pb-24 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">

          <Link to="/societies" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 font-bold uppercase tracking-widest text-[10px] transition-colors mb-10">
            <ArrowLeft size={14}/> Back to Societies
          </Link>

          {/* HERO SECTION WITH COLLEGE CAMPUS OVERLAY */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mb-14 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#00142e]/90 via-[#000e24]/90 to-[#000814]/95 backdrop-blur-2xl p-8 md:p-16 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            {/* Campus Background Vignette */}
            <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none filter contrast-125" style={{ backgroundImage: `url(${srecCampus})` }}/>

            <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start lg:items-center justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[11px] font-black uppercase tracking-wider shadow-sm">
                    Flagship Student Branch • STB18421
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={13} className="text-amber-400"/>
                    <span>Sri Ramakrishna Engineering College</span>
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white mb-4 leading-tight">
                  IEEE SREC <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Student Branch</span>
                </h1>

                <p className="text-sm sm:text-base font-bold uppercase tracking-widest text-cyan-400 mb-6">
                  Advancing Technology for Humanity • SREC Student Branch Leadership &amp; Chapters
                </p>

                <div className="h-[2px] w-20 bg-gradient-to-r from-cyan-400 to-blue-500 mb-6"/>

                <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-3xl">
                  The <strong className="text-white">IEEE SREC Student Branch</strong> is one of the most vibrant and decorated student branches in IEEE Region 10 (Asia-Pacific) and the Madras Section. Established with the vision of fostering engineering excellence, research culture, and holistic leadership, our branch hosts international symposiums, hackathons, outreach drives, and specialized technical society chapters.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link to="/societies/office-bearers?society=srec" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:scale-[1.03] active:scale-95">
                    <Crown size={15} className="text-slate-950"/>
                    <span>Office Bearers Page</span>
                  </Link>
                  <Link to="/join" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:scale-[1.02]">
                    <span>Join SREC Branch</span>
                    <ArrowRight size={14}/>
                  </Link>
                  <Link to="/gallery" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition backdrop-blur-md">
                    <span>View Gallery</span>
                    <ExternalLink size={14}/>
                  </Link>
                </div>
              </div>

              {/* Quick Info Glass Tile */}
              <div className="w-full lg:w-[320px] shrink-0 rounded-2xl border border-cyan-500/30 bg-[#000814]/90 backdrop-blur-2xl p-7 shadow-xl">
                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-5">SREC Branch Metrics</p>
                <div className="space-y-5">
                  <div onClick={() => scrollToTabs("office bearers")} className="cursor-pointer group/card p-2 -m-2 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-black text-amber-400 group-hover/card:scale-105 transition-transform">Office Bearers</p>
                      <Crown size={20} className="text-amber-400"/>
                    </div>
                    <p className="text-xs text-slate-300 font-bold flex items-center gap-1 mt-0.5">
                      <span>View Branch Leadership</span>
                      <ChevronRight size={12} className="text-amber-400 group-hover/card:translate-x-1 transition-transform"/>
                    </p>
                  </div>
                  <div className="h-[1px] w-full bg-white/10"/>
                  <div>
                    <p className="text-3xl font-black text-white">450+</p>
                    <p className="text-xs text-slate-400 font-bold">Active Student &amp; Professional Members</p>
                  </div>
                  <div className="h-[1px] w-full bg-white/10"/>
                  <div>
                    <p className="text-3xl font-black text-cyan-400">8 Societies</p>
                    <p className="text-xs text-slate-400 font-bold">CS, CIS, ComSoc, EMBS, PELS, IMS, CAS, WIE</p>
                  </div>
                  <div className="h-[1px] w-full bg-white/10"/>
                  <div>
                    <p className="text-3xl font-black text-amber-400">30+ Awards</p>
                    <p className="text-xs text-slate-400 font-bold">IEEE Section &amp; Regional Recognitions</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* INTERACTIVE WORKSPACE TABS */}
          <div id="branch-tabs-section" className="flex items-center justify-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 bg-[#00122a]/80 backdrop-blur-2xl rounded-2xl border border-white/10 mb-8 sm:mb-12 shadow-inner w-fit mx-auto max-w-full">
            {[
            {
                id: "overview",
                label: "Branch Overview",
                icon: Sparkles,
                activeColor: "bg-blue-600 text-white shadow-blue-600/30",
                idleColor: "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/20",
                iconActive: "text-blue-100",
                iconIdle: "text-blue-400",
            },
            {
                id: "history",
                label: "Our Legacy",
                icon: Building,
                activeColor: "bg-indigo-600 text-white shadow-indigo-700/30",
                idleColor: "text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-400/20",
                iconActive: "text-indigo-200",
                iconIdle: "text-indigo-400",
            },
            {
                id: "initiatives",
                label: "Flagship Events",
                icon: Calendar,
                activeColor: "bg-teal-600 text-white shadow-teal-600/30",
                idleColor: "text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-400/20",
                iconActive: "text-teal-100",
                iconIdle: "text-teal-400",
            },
            {
                id: "awards",
                label: "Awards & Accolades",
                icon: Trophy,
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
            return (<button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} title={tab.label} className={`flex items-center justify-center gap-2 transition-all rounded-xl relative ${isBearer
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

              {activeTab === "office bearers" ? (<SocietyOfficeBearers societyName="IEEE SREC Student Branch"/>) : activeTab === "overview" ? (<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl">
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
                        Engineering Excellence at Sri Ramakrishna Engineering College
                      </h3>
                      <p className="text-slate-300 leading-relaxed font-normal mb-6">
                        The IEEE SREC Student Branch serves as the epicenter of technological learning, peer mentorship, and interdisciplinary collaboration on campus. Our branch seamlessly connects the Department of ECE, EEE, CSE, IT, BME, Mechanical, and Robotics to the global IEEE network.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition">
                          <GraduationCap className="text-cyan-400 mb-3" size={24}/>
                          <h4 className="font-bold text-white text-base mb-1">Skill Development</h4>
                          <p className="text-xs text-slate-400">
                            Industry-certified bootcamps in embedded systems, AI, VLSI, and cloud computing.
                          </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-400/40 transition">
                          <Globe2 className="text-indigo-400 mb-3" size={24}/>
                          <h4 className="font-bold text-white text-base mb-1">Global Networking</h4>
                          <p className="text-xs text-slate-400">
                            Direct mentorship from IEEE Senior Members, Fellows, and international student branches.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Callouts */}
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-br from-[#1a1300] via-[#0e1628] to-[#000814] text-white p-8 shadow-2xl backdrop-blur-2xl">
                      <Crown className="text-amber-400 mb-5" size={28}/>
                      <h3 className="font-bold text-white mb-2 text-lg">Branch Leadership</h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-6">
                        Meet our Student Branch Chairs, Secretaries, Faculty Counselors, and Executive Committee officers.
                      </p>
                      <button type="button" onClick={() => scrollToTabs("office bearers")} className="group flex items-center justify-between w-full pb-3 border-b border-white/20 text-xs font-black uppercase tracking-wider hover:border-amber-400 transition-colors text-amber-300 cursor-pointer">
                        <span>View Office Bearers</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                      </button>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#00142e] to-[#000814] text-white p-8 shadow-2xl backdrop-blur-2xl">
                      <Users className="text-cyan-400 mb-5" size={28}/>
                      <h3 className="font-bold text-white mb-2 text-lg">Join the SREC SB Family</h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-6">
                        Unlock full access to IEEE Xplore, technical society chapters, and project funding.
                      </p>
                      <Link to="/membership-registration" className="group flex items-center justify-between w-full pb-3 border-b border-white/20 text-xs font-black uppercase tracking-wider hover:border-cyan-400 transition-colors text-cyan-300">
                        <span>Register Online</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                      </Link>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-[#001026]/90 text-white p-8 shadow-2xl backdrop-blur-2xl">
                      <Building className="text-cyan-400 mb-5" size={28}/>
                      <h3 className="font-bold text-white mb-2 text-lg">Sri Ramakrishna Engg College</h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-4">
                        Vattamalaipalayam, N.G.G.O. Colony Post, Coimbatore, Tamil Nadu 641022.
                      </p>
                      <a href="https://www.srec.ac.in/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
                        <span>Visit SREC Main Portal</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>
                  </div>
                </div>) : activeTab === "history" ? (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                      Our Historic Journey &amp; Milestones
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      Since its inauguration, the IEEE SREC Student Branch has been an exemplary student chapter recognized by IEEE Madras Section and Region 10 for continuous member growth, technical innovation, and community outreach.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                      <p className="text-2xl font-black text-cyan-400 mb-1">Chapter Inception</p>
                      <h4 className="font-bold text-white text-sm mb-2">Founding Pillar</h4>
                      <p className="text-xs text-slate-400">Established to bridge classroom engineering with worldwide research paradigms.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                      <p className="text-2xl font-black text-indigo-400 mb-1">8 Society Expansions</p>
                      <h4 className="font-bold text-white text-sm mb-2">Specialized Chapters</h4>
                      <p className="text-xs text-slate-400">Grew into 8 dedicated technical societies and an active WIE Affinity Group.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                      <p className="text-2xl font-black text-amber-400 mb-1">Premier Recognition</p>
                      <h4 className="font-bold text-white text-sm mb-2">Exemplary Branch</h4>
                      <p className="text-xs text-slate-400">Repeatedly honored with Outstanding Student Branch and Student Branch Drive awards.</p>
                    </div>
                  </div>
                </div>) : activeTab === "initiatives" ? (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                      Flagship Annual Events &amp; Symposiums
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      Signature initiatives organized by IEEE SREC Student Branch:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition">
                      <Calendar className="text-cyan-400 mb-3" size={24}/>
                      <h4 className="font-bold text-white text-base mb-1">IEEE Day Celebrations</h4>
                      <p className="text-xs text-slate-400">Annual campus-wide technical competitions, project expos, and student drive.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-400/40 transition">
                      <Sparkles className="text-indigo-400 mb-3" size={24}/>
                      <h4 className="font-bold text-white text-base mb-1">IEEE Xtreme Programming</h4>
                      <p className="text-xs text-slate-400">Global 24-hour virtual competitive programming marathon hosted on campus.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-400/40 transition">
                      <Award className="text-purple-400 mb-3" size={24}/>
                      <h4 className="font-bold text-white text-base mb-1">Vision X Symposium</h4>
                      <p className="text-xs text-slate-400">Inter-college national technical symposium featuring paper presentations and hackathons.</p>
                    </div>
                  </div>
                </div>) : (
        /* AWARDS TAB */
        <div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                      Awards &amp; Prestigious Recognitions
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      Honoring excellence across IEEE Madras Section, IEEE Region 10, and global initiatives:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-4">
                      <Trophy className="text-amber-400 shrink-0 mt-1" size={24}/>
                      <div>
                        <h4 className="font-bold text-white text-base mb-1">Outstanding Student Branch Award</h4>
                        <p className="text-xs text-slate-400">Conferred by IEEE Madras Section for exemplary event organization and membership vitality.</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-4">
                      <Award className="text-cyan-400 shrink-0 mt-1" size={24}/>
                      <div>
                        <h4 className="font-bold text-white text-base mb-1">IEEE Region 10 Section Chapter Symposium</h4>
                        <p className="text-xs text-slate-400">Official delegation representation showcasing chapter best practices and student leadership.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link to="/awards" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition shadow-lg">
                      <span>View Complete Awards Gallery</span>
                      <ArrowRight size={14}/>
                    </Link>
                  </div>
                </div>)}
            </motion.div>
          </AnimatePresence>

        </div>
      </main>

      <Footer />
    </div>);
};
export default SrecBranchPage;
