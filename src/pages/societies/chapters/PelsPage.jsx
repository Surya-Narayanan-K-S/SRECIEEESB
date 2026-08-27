import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SocietyOfficeBearers from "@/components/societies/SocietyOfficeBearers";
import { ArrowLeft, Zap, BatteryCharging, Cpu, Globe2, ExternalLink, BookOpen, ArrowRight, Layers, Users, Sun, Car, Server, Building, GraduationCap, ShieldCheck, Headphones, Tv, Crown, Sparkles, } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
const PelsPage = () => {
    const [activeTab, setActiveTab] = useState("overview");
    return (<div className="min-h-screen bg-[#000814] text-slate-100 selection:bg-[#008542] selection:text-white flex flex-col font-sans relative overflow-hidden">
      {/* Ambient Neon Flare Mesh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none -z-0">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px]"/>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[140px]"/>
        <div className="absolute bottom-20 left-1/3 w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[140px]"/>
      </div>

      <Navbar />

      <main className="flex-1 w-full pt-8 md:pt-10 pb-24 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">

          <Link to="/societies" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 font-bold uppercase tracking-widest text-[10px] transition-colors mb-10">
            <ArrowLeft size={14}/> Back to Societies
          </Link>

          {/* HERO SECTION WITH ANIMATION */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mb-14 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#00142e]/90 via-[#000e24]/90 to-[#000814]/95 backdrop-blur-2xl p-8 md:p-16 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
              <Layers size={320} className="text-emerald-500"/>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start lg:items-center justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-black uppercase tracking-wider">
                    Official Student Chapter • IEEE SREC
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                    <Zap size={13} className="text-emerald-400"/>
                    <span>Powering a Sustainable Future</span>
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white mb-4 leading-tight">
                  IEEE Power Electronics Society <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">(PELS)</span>
                </h1>

                <p className="text-sm sm:text-base font-bold uppercase tracking-widest text-emerald-400 mb-6">
                  Advancing Power Conversion, EV Drives, Smart Grids &amp; Wide-Bandgap Semiconductors at SREC
                </p>

                <div className="h-[2px] w-20 bg-gradient-to-r from-emerald-400 to-teal-500 mb-6"/>

                <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-3xl">
                  The <strong className="text-white">IEEE Power Electronics Society (PELS)</strong> is one of the fastest growing technical societies of the IEEE. For over 35 years, PELS has facilitated and guided the development and innovation in power electronics technology across electronic components, circuit theory, control techniques, and electric vehicle drives. At <strong className="text-white">SREC</strong>, our chapter fosters hands-on converter hardware design and research in clean energy grids.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link to="/societies/office-bearers?society=pels" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-[1.02]">
                    <Crown size={14}/>
                    <span>Office Bearers</span>
                  </Link>
                  <a href="https://www.ieee-pels.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition backdrop-blur-md">
                    <span>Global PELS</span>
                    <ExternalLink size={14}/>
                  </a>
                  <a href="https://www.ieee-pels.org/about-pels/presidents-corner" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition backdrop-blur-md">
                    <span>President's Corner</span>
                    <ExternalLink size={14}/>
                  </a>
                </div>
              </div>

              {/* Quick Info Glass Tile */}
              <div className="w-full lg:w-[320px] shrink-0 rounded-2xl border border-emerald-500/30 bg-[#000814]/90 backdrop-blur-2xl p-7 shadow-xl">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-5">Global PELS Benchmark</p>
                <div className="space-y-5">
                  <div>
                    <p className="text-3xl font-black text-white">11 Sectors</p>
                    <p className="text-xs text-slate-400 font-bold">Key Application Sectors Worldwide</p>
                  </div>
                  <div className="h-[1px] w-full bg-white/10"/>
                  <div>
                    <p className="text-3xl font-black text-emerald-400">35+ Years</p>
                    <p className="text-xs text-slate-400 font-bold">Guiding Power Conversion Innovations</p>
                  </div>
                  <div className="h-[1px] w-full bg-white/10"/>
                  <div>
                    <p className="text-3xl font-black text-teal-400">Top Quartile</p>
                    <p className="text-xs text-slate-400 font-bold">IEEE Transactions on Power Electronics</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* PRESIDENT'S MESSAGE SPOTLIGHT WITH HOVER ANIMATION */}
          <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} className="mb-14 rounded-3xl border border-white/10 bg-[#001026]/90 p-8 md:p-12 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <GraduationCap size={40}/>
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">From the President's Desk</span>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mt-1 mb-3">
                  A Message from PELS President Johan Enslin
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                  "Dear IEEE PELS Colleagues, As we embark on a new year filled with opportunities, let's explore our ongoing journey of growth, innovation, and global engagement. Power electronics is at the heart of the worldwide transition to renewable energy, electrified transport, and data center efficiency. I invite our student members at SREC to lead this transformation."
                </p>
              </div>
            </div>
          </motion.div>

          {/* INTERACTIVE WORKSPACE TABS */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 bg-[#00122a]/80 backdrop-blur-2xl rounded-2xl border border-white/10 mb-8 sm:mb-12 shadow-inner w-fit mx-auto max-w-full">
            {[
            {
                id: "overview",
                label: "Overview & Mission",
                icon: Sparkles,
                activeColor: "bg-blue-600 text-white shadow-blue-600/30",
                idleColor: "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/20",
                iconActive: "text-blue-100",
                iconIdle: "text-blue-400",
            },
            {
                id: "field of interest",
                label: "Field of Interest",
                icon: Zap,
                activeColor: "bg-amber-600 text-white shadow-amber-600/30",
                idleColor: "text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/20",
                iconActive: "text-amber-100",
                iconIdle: "text-amber-400",
            },
            {
                id: "applications",
                label: "11 Application Sectors",
                icon: Layers,
                activeColor: "bg-teal-600 text-white shadow-teal-600/30",
                idleColor: "text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-400/20",
                iconActive: "text-teal-100",
                iconIdle: "text-teal-400",
            },
            {
                id: "publications",
                label: "Journals & Media",
                icon: BookOpen,
                activeColor: "bg-purple-600 text-white shadow-purple-600/30",
                idleColor: "text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-400/20",
                iconActive: "text-purple-100",
                iconIdle: "text-purple-400",
            },
            {
                id: "office bearers",
                label: "Office Bearers",
                isOfficeBearer: true,
                icon: Crown,
                activeColor: "bg-[#008542] text-white shadow-emerald-900/30 ring-2 ring-emerald-500/30",
                idleColor: "text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 font-black",
                iconActive: "text-emerald-200",
                iconIdle: "text-emerald-300",
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
              <motion.div initial={{ scaleX: 0, opacity: 1 }} animate={{ scaleX: 1, opacity: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#008542] to-transparent mb-8 origin-center"/>

              {activeTab === "office bearers" && (<SocietyOfficeBearers societyName="IEEE Power Electronics Society (PELS)"/>)}

              {activeTab === "overview" && (<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl">
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
                        Constitutional Mission &amp; Purpose
                      </h3>
                      <p className="text-slate-300 leading-relaxed font-normal mb-6">
                        The IEEE Power Electronics Society (PELS) upholds the vital task of advancing the development and application of power electronics systems, including power semiconductor devices, passive components, control methodologies, and packaging technologies.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-400/40 transition">
                          <BatteryCharging className="text-emerald-400 mb-3" size={24}/>
                          <h4 className="font-bold text-white text-base mb-1">EV Chargers &amp; Drives</h4>
                          <p className="text-xs text-slate-400">
                            Bidirectional onboard chargers, ultra-fast DC charging hubs, and motor drive inverters.
                          </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-teal-400/40 transition">
                          <Sun className="text-teal-400 mb-3" size={24}/>
                          <h4 className="font-bold text-white text-base mb-1">Renewable Energy Systems</h4>
                          <p className="text-xs text-slate-400">
                            Solar photovoltaic micro-inverters, wind turbine grid interfaces, and battery storage controllers.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Callouts */}
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#00142e] to-[#000814] text-white p-8 shadow-2xl backdrop-blur-2xl">
                      <Users className="text-emerald-400 mb-5" size={28}/>
                      <h3 className="font-bold text-white mb-2 text-lg">Join IEEE PELS at SREC</h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-6">
                        Engage in hardware lab hackathons, design wide-bandgap converter test benches, and attend ECCE/APEC conferences.
                      </p>
                      <Link to="/join" className="group flex items-center justify-between w-full pb-3 border-b border-white/20 text-xs font-black uppercase tracking-wider hover:border-emerald-400 transition-colors text-emerald-300">
                        <span>Join Society Today</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                      </Link>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-[#001026]/90 text-white p-8 shadow-2xl backdrop-blur-2xl">
                      <BookOpen className="text-emerald-400 mb-5" size={28}/>
                      <h3 className="font-bold text-white mb-2 text-lg">IEEE TPEL Journal</h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-4">
                        IEEE Transactions on Power Electronics — premier impact factor in electrical engineering.
                      </p>
                      <a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=63" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                        <span>Browse TPEL Papers</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>
                  </div>
                </div>)}

              {activeTab === "field of interest" && (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                      Constitutionally Defined Field of Interest
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      The Field of Interest of the IEEE Power Electronics Society encompasses the development and application of power electronics technology:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-400/40 transition flex items-start gap-4">
                      <Zap className="text-emerald-400 shrink-0 mt-1" size={24}/>
                      <div>
                        <h4 className="font-bold text-white text-base mb-1">Wide-Bandgap Semiconductors</h4>
                        <p className="text-xs text-slate-400 font-normal leading-relaxed">
                          Silicon Carbide (SiC) and Gallium Nitride (GaN) switching devices enabling higher frequencies and near-zero losses.
                        </p>
                      </div>
                    </div>

                    <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-teal-400/40 transition flex items-start gap-4">
                      <Cpu className="text-teal-400 shrink-0 mt-1" size={24}/>
                      <div>
                        <h4 className="font-bold text-white text-base mb-1">Digital Power Control</h4>
                        <p className="text-xs text-slate-400 font-normal leading-relaxed">
                          DSP and FPGA algorithms for real-time sensorless motor field-oriented control and grid synchronization.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>)}

              {activeTab === "applications" && (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                      11 Key Global Application Sectors
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      Power electronics powers modern industrial and consumer technology across 11 key application sectors:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[
                { title: "Aerospace & Defense", icon: Globe2, desc: "More-electric aircraft and space power systems." },
                { title: "Automotive & Transport", icon: Car, desc: "EV traction inverters and charging infrastructure." },
                { title: "Consumer & Smart Home", icon: Tv, desc: "High-efficiency appliances and USB-C PD power bricks." },
                { title: "Data Centers & Cloud", icon: Server, desc: "48V-to-point-of-load converters for AI GPU clusters." },
                { title: "Energy & Smart Grids", icon: Zap, desc: "HVDC transmission, FACTS, and solid-state transformers." },
                { title: "Industrial Automation", icon: Building, desc: "Variable frequency motor drives and robotics power." },
                { title: "Medical Devices", icon: ShieldCheck, desc: "Isolated power supplies for MRI, CT scanners and implants." },
                { title: "Renewable Generation", icon: Sun, desc: "Utility-scale solar inverters and wind converters." },
                { title: "Telecommunications", icon: Headphones, desc: "Uninterruptible power supplies (UPS) and telecom rectifiers." },
                { title: "Sensors & Actuators", icon: Cpu, desc: "Piezoelectric drives and MEMS power harvesting." },
                { title: "Marine & Subsea", icon: BatteryCharging, desc: "All-electric ships, underwater ROV power systems." },
            ].map((sector) => {
                const SectorIcon = sector.icon;
                return (<motion.div key={sector.title} whileHover={{ y: -3 }} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-400/40 transition flex flex-col justify-between">
                          <div>
                            <SectorIcon className="text-emerald-400 mb-3" size={22}/>
                            <h4 className="font-bold text-white text-sm mb-1">{sector.title}</h4>
                            <p className="text-xs text-slate-400">{sector.desc}</p>
                          </div>
                        </motion.div>);
            })}
                  </div>
                </div>)}

              {activeTab === "publications" && (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                      Journals, Magazines &amp; Digital Media
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      IEEE PELS publishes premier research journals and educational media in electrical power engineering:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-400/40 transition flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-white text-lg mb-2">IEEE TPEL</h4>
                        <p className="text-slate-400 text-xs leading-relaxed font-normal mb-4">
                          IEEE Transactions on Power Electronics — world's top-cited power electronics journal.
                        </p>
                      </div>
                      <a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=63" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                        <span>View on Xplore</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>

                    <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-400/40 transition flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-white text-lg mb-2">IEEE PEL Magazine</h4>
                        <p className="text-slate-400 text-xs leading-relaxed font-normal mb-4">
                          IEEE Power Electronics Magazine — tutorials, industry trends, and hardware breakthroughs.
                        </p>
                      </div>
                      <a href="https://www.ieee-pels.org/publications/power-electronics-magazine" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                        <span>Read Magazine</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>

                    <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-400/40 transition flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-white text-lg mb-2">IEEE JESTPE</h4>
                        <p className="text-slate-400 text-xs leading-relaxed font-normal mb-4">
                          IEEE Journal of Emerging and Selected Topics in Power Electronics.
                        </p>
                      </div>
                      <a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6245494" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-teal-400 hover:underline flex items-center gap-1">
                        <span>View JESTPE</span>
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
export default PelsPage;
