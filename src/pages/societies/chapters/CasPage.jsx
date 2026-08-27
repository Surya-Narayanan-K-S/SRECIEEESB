import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SocietyOfficeBearers from "@/components/societies/SocietyOfficeBearers";
import { ArrowLeft, Cpu, Globe2, ExternalLink, BookOpen, ArrowRight, Layers, Award, Users, Calendar, Zap, GraduationCap, BadgePercent, CheckCircle2, HardDrive, Sparkles, Crown, } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
const CasPage = () => {
    const [activeTab, setActiveTab] = useState("overview");
    return (<div className="min-h-screen bg-[#000814] text-slate-100 selection:bg-[#003366] selection:text-white flex flex-col font-sans relative overflow-hidden">
      {/* Ambient Neon Flare Mesh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none -z-0">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]"/>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-[140px]"/>
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
                  <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu size={13} className="text-amber-400"/>
                    <span>Leading in Circuit Theory &amp; CAD</span>
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white mb-4 leading-tight">
                  IEEE Circuits and Systems Society <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">(CAS)</span>
                </h1>

                <p className="text-sm sm:text-base font-bold uppercase tracking-widest text-cyan-400 mb-6">
                  Pioneering VLSI Design, IC Tapeout, Semiconductor Systems &amp; Signal Processing at SREC
                </p>

                <div className="h-[2px] w-20 bg-gradient-to-r from-cyan-400 to-blue-500 mb-6"/>

                <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-3xl">
                  The <strong className="text-white">IEEE Circuits and Systems Society (CASS)</strong> is the leading organization that promotes the advancement of the theory, analysis, computer-aided design (CAD) and practical implementation of circuits, and the application of circuit theoretic techniques to systems and signal processing. Through more than 100 local chapters worldwide and our chapter at <strong className="text-white">SREC</strong>, CASS provides essential technical knowledge, semiconductor design tools, and exclusive member benefits.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link to="/societies/office-bearers?society=cas" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-[1.02]">
                    <Crown size={14}/>
                    <span>Office Bearers</span>
                  </Link>
                  <a href="https://ieee-cas.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition backdrop-blur-md">
                    <span>Global CAS</span>
                    <ExternalLink size={14}/>
                  </a>
                  <a href="https://www.ieee.org/membership-catalog/productdetail/showProductDetailPage.html?product=MEMCAS004" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-md">
                    <span>Join CASS</span>
                    <ArrowRight size={14}/>
                  </a>
                </div>
              </div>
              
              {/* Quick Info Glass Tile */}
              <div className="w-full lg:w-[320px] shrink-0 rounded-2xl border border-cyan-500/30 bg-[#000814]/90 backdrop-blur-2xl p-7 shadow-xl">
                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-5">Chapter Benchmarks</p>
                <div className="space-y-5">
                  <div>
                    <p className="text-3xl font-black text-white">100+</p>
                    <p className="text-xs text-slate-400 font-bold">Chapters Across the Globe</p>
                  </div>
                  <div className="h-[1px] w-full bg-white/10"/>
                  <div>
                    <p className="text-3xl font-black text-cyan-400">2TB</p>
                    <p className="text-xs text-slate-400 font-bold">Free IEEE DataPort Storage</p>
                  </div>
                  <div className="h-[1px] w-full bg-white/10"/>
                  <div>
                    <p className="text-3xl font-black text-blue-400">IEEE ISCAS</p>
                    <p className="text-xs text-slate-400 font-bold">Flagship Circuits Symposium</p>
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
                label: "Overview & Scope",
                icon: Sparkles,
                activeColor: "bg-blue-600 text-white shadow-blue-900/30",
                idleColor: "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/20",
                iconActive: "text-blue-200",
                iconIdle: "text-blue-400",
            },
            {
                id: "benefits",
                label: "Member Benefits",
                icon: Award,
                activeColor: "bg-teal-600 text-white shadow-teal-700/30",
                idleColor: "text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-400/20",
                iconActive: "text-teal-100",
                iconIdle: "text-teal-400",
            },
            {
                id: "pricing",
                label: "Annual Dues",
                icon: BadgePercent,
                activeColor: "bg-indigo-600 text-white shadow-indigo-700/30",
                idleColor: "text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-400/20",
                iconActive: "text-indigo-100",
                iconIdle: "text-indigo-400",
            },
            {
                id: "dataport",
                label: "DataPort (2TB)",
                icon: HardDrive,
                activeColor: "bg-purple-600 text-white shadow-purple-700/30",
                idleColor: "text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-400/20",
                iconActive: "text-purple-100",
                iconIdle: "text-purple-400",
            },
            {
                id: "students",
                label: "Student Perks",
                icon: GraduationCap,
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
                activeColor: "bg-[#002855] text-white shadow-blue-950/30 ring-2 ring-blue-500/30",
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
              <motion.div initial={{ scaleX: 0, opacity: 1 }} animate={{ scaleX: 1, opacity: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#003366] to-transparent mb-8 origin-center"/>

              {activeTab === "office bearers" && (<SocietyOfficeBearers societyName="IEEE Circuits and Systems Society (CAS)"/>)}

              {activeTab === "overview" && (<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl">
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
                        Advancing Microelectronics, ICs and Signal Processing
                      </h3>
                      <p className="text-slate-300 leading-relaxed font-normal mb-6">
                        The IEEE Circuits and Systems Society brings together researchers, scientists, and engineers involved in circuit design, computer-aided electronic automation, practical implementations, and signal processing.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-400/40 transition">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/40 flex items-center justify-center mb-3">
                            <Cpu size={20}/>
                          </div>
                          <h4 className="font-bold text-white text-base mb-1">VLSI &amp; Chip Design</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Analog, digital, and mixed-signal integrated circuit (IC) design flows, CAD synthesis, and tapeout.
                          </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-sky-400/40 transition">
                          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/40 flex items-center justify-center mb-3">
                            <Zap size={20}/>
                          </div>
                          <h4 className="font-bold text-white text-base mb-1">AI &amp; Neuromorphic Chips</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Hardware AI accelerators, neural network processing units (NPUs), and brain-inspired computing.
                          </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-rose-400/40 transition">
                          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-400/40 flex items-center justify-center mb-3">
                            <CheckCircle2 size={20}/>
                          </div>
                          <h4 className="font-bold text-white text-base mb-1">Bio-Circuits &amp; MedTech</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Bio-inspired computing, implantable electronic interfaces, and microfluidic sensor systems.
                          </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-400/40 transition">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 flex items-center justify-center mb-3">
                            <Layers size={20}/>
                          </div>
                          <h4 className="font-bold text-white text-base mb-1">DSP &amp; Signal Systems</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Digital signal processing hardware, matrix processing engines, and adaptive filter design.
                          </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center mb-3">
                            <HardDrive size={20}/>
                          </div>
                          <h4 className="font-bold text-white text-base mb-1">Power ICs &amp; Energy</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Low-power PMICs, DC-DC converter ICs, energy harvesting, and battery management systems.
                          </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-teal-400/40 transition">
                          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/40 flex items-center justify-center mb-3">
                            <Globe2 size={20}/>
                          </div>
                          <h4 className="font-bold text-white text-base mb-1">RFIC &amp; Wireless Systems</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Radio-frequency ICs, 5G/6G wireless transceivers, and high-speed chip-to-chip interconnects.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Callouts */}
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#00142e] to-[#000814] text-white p-8 shadow-2xl backdrop-blur-2xl">
                      <Users className="text-cyan-400 mb-5" size={28}/>
                      <h3 className="font-bold text-white mb-2 text-lg">Join CASS SREC Chapter</h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-6">
                        Gain access to discounted conference registrations, IEEE DataPort, and VLSI tapeout workshops.
                      </p>
                      <Link to="/join" className="group flex items-center justify-between w-full pb-3 border-b border-white/20 text-xs font-black uppercase tracking-wider hover:border-cyan-400 transition-colors text-cyan-300">
                        <span>Join Now</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                      </Link>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-[#001026]/90 text-white p-8 shadow-2xl backdrop-blur-2xl">
                      <BookOpen className="text-cyan-400 mb-5" size={28}/>
                      <h3 className="font-bold text-white mb-2 text-lg">IEEE TCAS I &amp; II</h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-4">
                        IEEE Transactions on Circuits and Systems I &amp; II — premier citation impact in microelectronics.
                      </p>
                      <a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8919" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
                        <span>Read TCAS on IEEE Xplore</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>
                  </div>
                </div>)}

              {activeTab === "benefits" && (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                      Exclusive IEEE CAS Membership Benefits
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      Joining the IEEE Circuits and Systems Society provides unmatched professional advantages:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-400/40 transition flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/40 flex items-center justify-center mb-4">
                          <HardDrive size={20}/>
                        </div>
                        <h4 className="font-bold text-white text-lg mb-2">FREE IEEE DataPort</h4>
                        <p className="text-slate-400 text-xs leading-relaxed font-normal mb-3">
                          Complimentary individual subscription ($480 value/year) with <strong className="text-white">2TB cloud storage</strong> for research datasets and open access uploads.
                        </p>
                      </div>
                    </div>

                    <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-sky-400/40 transition flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/40 flex items-center justify-center mb-4">
                          <BookOpen size={20}/>
                        </div>
                        <h4 className="font-bold text-white text-lg mb-2">IEEE CAS Magazine</h4>
                        <p className="text-slate-400 text-xs leading-relaxed font-normal mb-3">
                          Electronic access to the award-winning <em>IEEE Circuits and Systems Magazine</em>, covering tutorials and emerging hardware architectures.
                        </p>
                      </div>
                    </div>

                    <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center mb-4">
                          <Award size={20}/>
                        </div>
                        <h4 className="font-bold text-white text-lg mb-2">Conference Discounts</h4>
                        <p className="text-slate-400 text-xs leading-relaxed font-normal mb-3">
                          Member discounts to ISCAS, MWSCAS, BioCAS, and AICAS, plus eligibility for Society travel grants and fellowship awards.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>)}

              {activeTab === "pricing" && (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                      Society Annual Membership Dues &amp; Discounts
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      IEEE Circuits and Systems Society provides highly subsidized dues for students and developing nations:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-400/40 transition flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Regular</span>
                        <h4 className="font-serif text-2xl font-bold text-white mt-1 mb-2">Member / Affiliate</h4>
                        <p className="text-3xl font-black text-blue-400 mb-4">$23.00 <span className="text-xs font-normal text-slate-400 block mt-1">+ 18% GST ($4.14 tax) = $27.14 USD / year</span></p>
                        <p className="text-xs text-slate-400 leading-relaxed font-normal">
                          Standard annual Society dues with full voting rights, committee eligibility, and magazine access.
                        </p>
                      </div>
                    </div>

                    <div className="p-8 rounded-2xl bg-amber-500/10 border-2 border-amber-400/60 flex flex-col justify-between relative shadow-xl">
                      <span className="absolute -top-3 right-6 px-3 py-1 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
                        Best Value For SREC
                      </span>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">Student Rate</span>
                        <h4 className="font-serif text-2xl font-bold text-white mt-1 mb-2">Student Member</h4>
                        <p className="text-3xl font-black text-amber-400 mb-4">$11.00 <span className="text-xs font-normal text-slate-300 block mt-1">+ 18% GST ($1.98 tax) = $12.98 USD / year</span></p>
                        <p className="text-xs text-slate-300 leading-relaxed font-normal">
                          Over 50% discount for enrolled undergraduate and graduate students at Sri Ramakrishna Engineering College.
                        </p>
                      </div>
                    </div>

                    <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-400/40 transition flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                          <BadgePercent size={14}/> Developing Nation
                        </span>
                        <h4 className="font-serif text-2xl font-bold text-white mt-1 mb-2">50% Special Discount</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-normal mt-3">
                          A <strong className="text-white">50% discount</strong> is available on CASS dues for members in developing nations with Per Capita GDP under US $10,000.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>)}

              {activeTab === "dataport" && (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                      IEEE DataPort: 2TB Cloud Storage Included Free
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      Every IEEE Circuits and Systems Society member receives a complimentary individual subscription to <strong className="text-white">IEEE DataPort</strong> ($480 value/year).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-400/40 transition flex items-start gap-4">
                      <CheckCircle2 className="text-cyan-400 shrink-0 mt-1" size={24}/>
                      <div>
                        <h4 className="font-bold text-white text-base mb-1">Store &amp; Manage Up to 2TB</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-normal">
                          Upload research datasets, CAD models, simulation testbenches, and hardware verification scripts up to 2TB per dataset.
                        </p>
                      </div>
                    </div>

                    <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-sky-400/40 transition flex items-start gap-4">
                      <CheckCircle2 className="text-sky-400 shrink-0 mt-1" size={24}/>
                      <div>
                        <h4 className="font-bold text-white text-base mb-1">Open Access &amp; DOI Minting</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-normal">
                          Receive a dedicated DOI for your dataset to ensure maximum research citations and open-access reproducibility.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>)}

              {activeTab === "students" && (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                      Student &amp; Young Professional Initiatives
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      IEEE CASS empowers rising engineers through targeted grants, design competitions, and mentorship:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-400/40 transition">
                      <GraduationCap className="text-cyan-400 mb-3" size={24}/>
                      <h4 className="font-bold text-white text-base mb-1">Student Travel Grants</h4>
                      <p className="text-xs text-slate-400">
                        Funding assistance to present papers at flagship conferences including ISCAS and BioCAS.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-sky-400/40 transition">
                      <Globe2 className="text-sky-400 mb-3" size={24}/>
                      <h4 className="font-bold text-white text-base mb-1">Seasonal Schools</h4>
                      <p className="text-xs text-slate-400">
                        Intensive multi-day advanced technical schools on microchip design and AI accelerators.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition">
                      <Calendar className="text-amber-400 mb-3" size={24}/>
                      <h4 className="font-bold text-white text-base mb-1">Design Hackathons</h4>
                      <p className="text-xs text-slate-400">
                        Global hardware design challenges with cash prizes, FPGA devkits, and industry internships.
                      </p>
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
export default CasPage;
