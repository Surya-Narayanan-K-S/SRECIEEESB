import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SocietyOfficeBearers from "@/components/societies/SocietyOfficeBearers";
import { ArrowLeft, Radio, Network, Globe2, ExternalLink, ArrowRight, Layers, Sparkles, Users, Compass, Building, Headphones, ShieldCheck, Zap, Newspaper, Crown, } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
const ComsocPage = () => {
    const [activeTab, setActiveTab] = useState("overview");
    return (<div className="min-h-screen bg-[#000814] text-slate-100 selection:bg-[#005a9c] selection:text-white flex flex-col font-sans relative overflow-hidden">
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

          {/* HERO SECTION WITH ANIMATION */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mb-14 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#00142e]/90 via-[#000e24]/90 to-[#000814]/95 backdrop-blur-2xl p-8 md:p-16 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
              <Layers size={320} className="text-cyan-400"/>
            </div>
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start lg:items-center justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[11px] font-black uppercase tracking-wider">
                    Official Student Chapter • IEEE SREC
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={13} className="text-cyan-400"/>
                    <span>Your Global Network</span>
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white mb-4 leading-tight">
                  IEEE Communications Society <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">(ComSoc)</span>
                </h1>

                <p className="text-sm sm:text-base font-bold uppercase tracking-widest text-cyan-400 mb-6">
                  Advancing Communications &amp; Networking Technology for the Betterment of Humanity at SREC
                </p>

                <div className="h-[2px] w-20 bg-gradient-to-r from-cyan-400 to-blue-500 mb-6"/>

                <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-3xl">
                  We are <strong className="text-white">ComSoc</strong>, the IEEE Communications Society. With a presence in more than 140 countries around the globe, tens of thousands of members are driving innovation and shaping the future by developing higher industry standards and changing the way the world communicates. At <strong className="text-white">SREC</strong>, our student chapter empowers students through 5G/6G research, wireless testbeds, RF labs, and global networking opportunities.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link to="/societies/office-bearers?society=comsoc" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(2,132,199,0.4)] hover:scale-[1.02]">
                    <Crown size={14}/>
                    <span>Office Bearers</span>
                  </Link>
                  <a href="https://www.comsoc.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition backdrop-blur-md">
                    <span>Global ComSoc</span>
                    <ExternalLink size={14}/>
                  </a>
                  <a href="https://www.comsoc.org/about/staff-listing" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition backdrop-blur-md">
                    <span>Staff Directory</span>
                    <Users size={14}/>
                  </a>
                </div>
              </div>

              {/* Quick Info Glass Tile */}
              <div className="w-full lg:w-[320px] shrink-0 rounded-2xl border border-cyan-500/30 bg-[#000814]/90 backdrop-blur-2xl p-7 shadow-xl">
                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-5">Chapter Benchmarks</p>
                <div className="space-y-5">
                  <div>
                    <p className="text-3xl font-black text-white">140+</p>
                    <p className="text-xs text-slate-400 font-bold">Countries Worldwide</p>
                  </div>
                  <div className="h-[1px] w-full bg-white/10"/>
                  <div>
                    <p className="text-3xl font-black text-cyan-400">5G / 6G</p>
                    <p className="text-xs text-slate-400 font-bold">Cutting-Edge Telephony</p>
                  </div>
                  <div className="h-[1px] w-full bg-white/10"/>
                  <div>
                    <p className="text-3xl font-black text-blue-400">IEEE GLOBECOM</p>
                    <p className="text-xs text-slate-400 font-bold">Flagship Global Congress</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* INTERACTIVE WORKSPACE TABS */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 bg-[#00122a]/80 backdrop-blur-2xl rounded-2xl border border-white/10 mb-8 sm:mb-12 shadow-inner w-fit mx-auto max-w-full">
            {[
            {
                id: "overview",
                label: "Overview & Mission",
                icon: Globe2,
                activeColor: "bg-blue-600 text-white shadow-blue-600/30",
                idleColor: "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/20",
                iconActive: "text-blue-100",
                iconIdle: "text-blue-400",
            },
            {
                id: "history",
                label: "History & Evolution",
                icon: Network,
                activeColor: "bg-indigo-600 text-white shadow-indigo-600/30",
                idleColor: "text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-400/20",
                iconActive: "text-indigo-100",
                iconIdle: "text-indigo-400",
            },
            {
                id: "governance",
                label: "Board & Leadership",
                icon: Building,
                activeColor: "bg-teal-600 text-white shadow-teal-600/30",
                idleColor: "text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-400/20",
                iconActive: "text-teal-100",
                iconIdle: "text-teal-400",
            },
            {
                id: "news",
                label: "News & Podcasts",
                icon: Headphones,
                activeColor: "bg-purple-600 text-white shadow-purple-600/30",
                idleColor: "text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-400/20",
                iconActive: "text-purple-100",
                iconIdle: "text-purple-400",
            },
            {
                id: "corporate",
                label: "Brand & Corporate",
                icon: ShieldCheck,
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
                activeColor: "bg-[#005a9c] text-white shadow-blue-950/30 ring-2 ring-blue-500/30",
                idleColor: "text-cyan-300 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 font-black",
                iconActive: "text-amber-300",
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
              <motion.div initial={{ scaleX: 0, opacity: 1 }} animate={{ scaleX: 1, opacity: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#005a9c] to-transparent mb-8 origin-center"/>

              {activeTab === "office bearers" && (<SocietyOfficeBearers societyName="IEEE Communications Society (ComSoc)"/>)}

              {activeTab === "overview" && (<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl">
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
                        United by a Shared Purpose
                      </h3>
                      <p className="text-slate-300 leading-relaxed font-normal mb-6">
                        Our mission is to advance communications and networking technology for the betterment of humanity. We foster technological innovation, nurture high industry standards, and deliver world-class educational publications.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-400/40 transition">
                          <Radio className="text-cyan-400 mb-3" size={24}/>
                          <h4 className="font-bold text-white text-base mb-1">Wireless &amp; 5G/6G Networks</h4>
                          <p className="text-xs text-slate-400">
                            Next-gen cellular architectures, MIMO antenna systems, and terahertz communications.
                          </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition">
                          <Network className="text-cyan-400 mb-3" size={24}/>
                          <h4 className="font-bold text-white text-base mb-1">Optical &amp; Satellite Comm</h4>
                          <p className="text-xs text-slate-400">
                            Free-space optical links, LEO satellite constellations, and deep space telemetry.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Callouts */}
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#00142e] to-[#000814] text-white p-8 shadow-2xl backdrop-blur-2xl">
                      <Users className="text-cyan-400 mb-5" size={28}/>
                      <h3 className="font-bold text-white mb-2 text-lg">Join IEEE ComSoc at SREC</h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-6">
                        Become part of our specialized telecom cohort and participate in global standards work.
                      </p>
                      <Link to="/join" className="group flex items-center justify-between w-full pb-3 border-b border-white/20 text-xs font-black uppercase tracking-wider hover:border-cyan-400 transition-colors text-cyan-300">
                        <span>Join Society Today</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                      </Link>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-[#001026]/90 text-white p-8 shadow-2xl backdrop-blur-2xl">
                      <Headphones className="text-cyan-400 mb-5" size={28}/>
                      <h3 className="font-bold text-white mb-2 text-lg">ComSoc Podcasts</h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-4">
                        Listen to interviews with global pioneers in telecom, fiber optics, and wireless communication.
                      </p>
                      <a href="https://www.comsoc.org/about/podcasts" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
                        <span>Listen to Episodes</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>
                  </div>
                </div>)}

              {activeTab === "history" && (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                      A Legacy of Pioneering Communications
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      The IEEE Communications Society was originally founded in 1952 as the IRE Professional Group on Communication Systems (PGCS). Over the decades, it has evolved into a global titan guiding cellular breakthroughs from 1G to 6G, fiber-optic standards, and interplanetary communication protocols.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-400/40 transition">
                      <p className="text-2xl font-black text-blue-400 mb-1">1952</p>
                      <h4 className="font-bold text-white text-sm mb-2">IRE PGCS Inception</h4>
                      <p className="text-xs text-slate-400">Founded by radio engineers seeking international standardization in communication systems.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition">
                      <p className="text-2xl font-black text-cyan-400 mb-1">1972</p>
                      <h4 className="font-bold text-white text-sm mb-2">Transition to ComSoc</h4>
                      <p className="text-xs text-slate-400">Officially rebranded into the IEEE Communications Society to represent digital networks.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-400/40 transition">
                      <p className="text-2xl font-black text-emerald-400 mb-1">2026+</p>
                      <h4 className="font-bold text-white text-sm mb-2">6G &amp; Quantum Comms</h4>
                      <p className="text-xs text-slate-400">Leading global research in sub-terahertz connectivity, intelligent surfaces, and quantum routing.</p>
                    </div>
                  </div>
                </div>)}

              {activeTab === "governance" && (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                      Board of Governors &amp; Global Leadership
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      The IEEE Communications Society is guided by an elected Board of Governors (BoG) dedicated to strategic stewardship, academic rigor, and professional development:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-400/40 transition">
                      <ShieldCheck className="text-cyan-400 mb-3" size={24}/>
                      <h4 className="font-bold text-white text-base mb-1">Board of Governors</h4>
                      <p className="text-xs text-slate-400 mb-4">Elected global leaders setting strategic directives and financial governance.</p>
                      <a href="https://www.comsoc.org/about/board-governors" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
                        <span>View BoG Directory</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition">
                      <Users className="text-cyan-400 mb-3" size={24}/>
                      <h4 className="font-bold text-white text-base mb-1">Society Staff</h4>
                      <p className="text-xs text-slate-400 mb-4">Dedicated operational teams supporting membership, conferences, and publications.</p>
                      <a href="https://www.comsoc.org/about/staff-listing" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
                        <span>Meet Staff</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-400/40 transition">
                      <Compass className="text-blue-400 mb-3" size={24}/>
                      <h4 className="font-bold text-white text-base mb-1">Nominations &amp; Elections</h4>
                      <p className="text-xs text-slate-400 mb-4">Democratic governance allowing members to vote for Society officers annually.</p>
                      <a href="https://www.comsoc.org/about/nominations-elections" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1">
                        <span>Election Procedures</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>
                  </div>
                </div>)}

              {activeTab === "news" && (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                      Society News, Media &amp; Podcasts
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      Stay informed with the latest communications breakthroughs, global press releases, and expert interviews:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-blue-400/40 transition">
                      <div>
                        <Newspaper className="text-blue-400 mb-4" size={28}/>
                        <h4 className="font-bold text-white text-lg mb-2">ComSoc News Central</h4>
                        <p className="text-slate-400 text-xs leading-relaxed font-normal mb-4">
                          Official announcements, conference highlights, paper awards, and industry partnerships.
                        </p>
                      </div>
                      <a href="https://www.comsoc.org/about/news" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1">
                        <span>Read Latest News</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>

                    <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-cyan-400/40 transition">
                      <div>
                        <Headphones className="text-cyan-400 mb-4" size={28}/>
                        <h4 className="font-bold text-white text-lg mb-2">Official Podcast Series</h4>
                        <p className="text-slate-400 text-xs leading-relaxed font-normal mb-4">
                          Thought leaders discuss 6G research, cybersecurity in telecom, AI in networks, and career journeys.
                        </p>
                      </div>
                      <a href="https://www.comsoc.org/about/podcasts" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
                        <span>Browse Podcasts</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>
                  </div>
                </div>)}

              {activeTab === "corporate" && (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                      Corporate Partnerships &amp; Brand Experience
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      Collaborate with IEEE ComSoc through institutional sponsorships, exhibits, and standardized brand toolkits:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-400/40 transition">
                      <Building className="text-blue-400 mb-3" size={24}/>
                      <h4 className="font-bold text-white text-base mb-1">Corporate Program</h4>
                      <p className="text-xs text-slate-400 mb-4">Empowering telecom companies to connect directly with global engineering talent.</p>
                      <a href="https://www.comsoc.org/about/corporate-program" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1">
                        <span>Corporate Details</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition">
                      <Zap className="text-cyan-400 mb-3" size={24}/>
                      <h4 className="font-bold text-white text-base mb-1">Brand Guidelines</h4>
                      <p className="text-xs text-slate-400 mb-4">Logos, templates, color palettes, and presentation styles for authorized chapter use.</p>
                      <a href="https://www.comsoc.org/about/brand-experience-advertising-sponsorship" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
                        <span>Brand Assets</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-400/40 transition">
                      <Globe2 className="text-emerald-400 mb-3" size={24}/>
                      <h4 className="font-bold text-white text-base mb-1">Global Chapters Portal</h4>
                      <p className="text-xs text-slate-400 mb-4">Coordinate joint meetings, cross-national student hackathons, and speaker exchanges.</p>
                      <a href="https://www.comsoc.org/about/contact-us" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                        <span>Contact Portal</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>
                  </div>
                </div>)}
            </motion.div>
          </AnimatePresence>

        </div>
      </main>

      <Footer />
    </div>);
};
export default ComsocPage;
