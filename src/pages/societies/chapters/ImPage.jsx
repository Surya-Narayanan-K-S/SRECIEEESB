import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SocietyOfficeBearers from "@/components/societies/SocietyOfficeBearers";
import { ArrowLeft, Gauge, Activity, Users, Network, ArrowRight, BookOpen, Layers, ExternalLink, Award, FileText, Compass, Building, Sparkles, Crown, } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
const ImPage = () => {
    const [activeTab, setActiveTab] = useState("overview");
    return (<div className="min-h-screen bg-[#000814] text-slate-100 selection:bg-[#c05621] selection:text-white flex flex-col font-sans relative overflow-hidden">
      {/* Ambient Neon Flare Mesh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none -z-0">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[140px]"/>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[140px]"/>
        <div className="absolute bottom-20 left-1/3 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[140px]"/>
      </div>

      <Navbar />

      <main className="flex-1 w-full pt-8 md:pt-10 pb-24 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">

          <Link to="/societies" className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 font-bold uppercase tracking-widest text-[10px] transition-colors mb-10">
            <ArrowLeft size={14}/> Back to Societies
          </Link>

          {/* HERO SECTION WITH ANIMATION */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mb-14 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-[#00142e]/90 via-[#000e24]/90 to-[#000814]/95 backdrop-blur-2xl p-8 md:p-16 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
              <Layers size={320} className="text-amber-500"/>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start lg:items-center justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-black uppercase tracking-wider">
                    Official Student Chapter • IEEE SREC
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                    <Gauge size={13} className="text-amber-400"/>
                    <span>Forefront of Measurement Innovation</span>
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white mb-4 leading-tight">
                  IEEE Instrumentation &amp; Measurement Society <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">(IMS)</span>
                </h1>

                <p className="text-sm sm:text-base font-bold uppercase tracking-widest text-amber-400 mb-6">
                  Pioneering Advancements in Instrumentation, Metrology &amp; Precision Sensors at SREC
                </p>

                <div className="h-[2px] w-20 bg-gradient-to-r from-amber-400 to-orange-500 mb-6"/>

                <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-3xl">
                  The <strong className="text-white">IEEE Instrumentation &amp; Measurement Society (IMS)</strong> is dedicated to the development and use of electrical and electronic instruments and equipment to measure, monitor, and record physical phenomena. With scientific, literary, and educational concerns, our student branch chapter at <strong className="text-white">SREC</strong> fosters a vibrant community dedicated to precision sensing, data acquisition, and international technological excellence.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link to="/societies/office-bearers?society=im" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:scale-[1.02]">
                    <Crown size={14}/>
                    <span>Office Bearers</span>
                  </Link>
                  <a href="https://ieee-ims.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition backdrop-blur-md">
                    <span>Global IMS</span>
                    <ExternalLink size={14}/>
                  </a>
                  <a href="https://ieee-ims.org/about/about-ims/society-officers" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition backdrop-blur-md">
                    <span>Society Officers</span>
                    <Users size={14}/>
                  </a>
                </div>
              </div>

              {/* Quick Info Glass Tile */}
              <div className="w-full lg:w-[320px] shrink-0 rounded-2xl border border-amber-500/30 bg-[#000814]/90 backdrop-blur-2xl p-7 shadow-xl">
                <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-5">Global IMS Benchmark</p>
                <div className="space-y-5">
                  <div>
                    <p className="text-3xl font-black text-white">3,900+</p>
                    <p className="text-xs text-slate-400 font-bold">Active Global Members</p>
                  </div>
                  <div className="h-[1px] w-full bg-white/10"/>
                  <div>
                    <p className="text-3xl font-black text-amber-400">16+ / yr</p>
                    <p className="text-xs text-slate-400 font-bold">International Conferences &amp; Symposia</p>
                  </div>
                  <div className="h-[1px] w-full bg-white/10"/>
                  <div>
                    <p className="text-3xl font-black text-orange-400">75+ Years</p>
                    <p className="text-xs text-slate-400 font-bold">Years of Measurement Excellence</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* DUAL SPOTLIGHT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} className="rounded-3xl border border-white/10 bg-[#001026]/90 p-8 md:p-10 shadow-2xl backdrop-blur-2xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center mb-5">
                <Compass size={24}/>
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-3">Technical Leadership</h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                Our members pioneer advancements in instrumentation, metrology, physical sensor telemetry, and measurement science for profound global and industrial impact.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} className="rounded-3xl border border-white/10 bg-[#001026]/90 p-8 md:p-10 shadow-2xl backdrop-blur-2xl">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-400/30 flex items-center justify-center mb-5">
                <Users size={24}/>
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-3">Community &amp; Collaboration</h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                We foster a vibrant, international community dedicated to education, professional growth, mentorship, and knowledge exchange across academia and industry.
              </p>
            </motion.div>
          </div>

          {/* INTERACTIVE WORKSPACE TABS */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 bg-[#00122a]/80 backdrop-blur-2xl rounded-2xl border border-white/10 mb-8 sm:mb-12 shadow-inner w-fit mx-auto max-w-full">
            {[
            {
                id: "overview",
                label: "Overview & Mission",
                icon: Sparkles,
                activeColor: "bg-amber-600 text-white shadow-amber-700/30",
                idleColor: "text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/20",
                iconActive: "text-amber-100",
                iconIdle: "text-amber-400",
            },
            {
                id: "pillars",
                label: "Strategic Objectives",
                icon: Gauge,
                activeColor: "bg-orange-600 text-white shadow-orange-600/30",
                idleColor: "text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-400/20",
                iconActive: "text-orange-100",
                iconIdle: "text-orange-400",
            },
            {
                id: "leadership",
                label: "Who We Are",
                icon: Users,
                activeColor: "bg-teal-600 text-white shadow-teal-600/30",
                idleColor: "text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-400/20",
                iconActive: "text-teal-100",
                iconIdle: "text-teal-400",
            },
            {
                id: "governance",
                label: "Governing Docs",
                icon: FileText,
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
                activeColor: "bg-[#c05621] text-white shadow-amber-950/30 ring-2 ring-amber-500/30",
                idleColor: "text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 font-black",
                iconActive: "text-amber-200",
                iconIdle: "text-amber-300",
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
              <motion.div initial={{ scaleX: 0, opacity: 1 }} animate={{ scaleX: 1, opacity: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#c05621] to-transparent mb-8 origin-center"/>

              {activeTab === "office bearers" && (<SocietyOfficeBearers societyName="IEEE Instrumentation and Measurement Society (IMS)"/>)}

              {activeTab === "overview" && (<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl">
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
                        About the IEEE Instrumentation &amp; Measurement Society
                      </h3>
                      <p className="text-slate-300 leading-relaxed font-normal mb-6">
                        The IEEE Instrumentation &amp; Measurement Society is dedicated to the development and use of electrical and electronic instruments and equipment to measure, monitor and/or record physical phenomena.
                      </p>
                      <p className="text-slate-300 leading-relaxed font-normal mb-8">
                        With scientific, literary, and educational concerns, the Society seeks to promote a high level of technical excellence by encouraging close cooperation and exchange of information among its members. It sponsors and supports conferences and publications, and through its committees, responds to the needs of the membership.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition">
                          <Gauge className="text-amber-400 mb-3" size={24}/>
                          <h4 className="font-bold text-white text-base mb-1">Precision Metrology</h4>
                          <p className="text-xs text-slate-400">
                            Calibration standards, smart sensors, and physical measurement uncertainty analysis.
                          </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-400/40 transition">
                          <Activity className="text-orange-400 mb-3" size={24}/>
                          <h4 className="font-bold text-white text-base mb-1">Data Acquisition (DAQ)</h4>
                          <p className="text-xs text-slate-400">
                            High-speed sampling, digital signal processing, and automated measurement benches.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Callouts */}
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#00142e] to-[#000814] text-white p-8 shadow-2xl backdrop-blur-2xl">
                      <Users className="text-amber-400 mb-5" size={28}/>
                      <h3 className="font-bold text-white mb-2 text-lg">Join IEEE IMS at SREC</h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-6">
                        Add the Instrumentation &amp; Measurement Society to your IEEE Membership for journals and lab competitions.
                      </p>
                      <Link to="/join" className="group flex items-center justify-between w-full pb-3 border-b border-white/20 text-xs font-black uppercase tracking-wider hover:border-amber-400 transition-colors text-amber-300">
                        <span>Join Society Today</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                      </Link>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-[#001026]/90 text-white p-8 shadow-2xl backdrop-blur-2xl">
                      <BookOpen className="text-amber-400 mb-5" size={28}/>
                      <h3 className="font-bold text-white mb-2 text-lg">IEEE TIM Journal</h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-4">
                        IEEE Transactions on Instrumentation &amp; Measurement — world-leading metrology papers.
                      </p>
                      <a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=19" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
                        <span>Explore TIM on Xplore</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>
                  </div>
                </div>)}

              {activeTab === "pillars" && (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                      Strategic Objectives &amp; Mission Commitments
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      The IEEE Instrumentation &amp; Measurement Society actively drives the following core pillars:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition flex flex-col justify-between">
                      <div>
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center font-bold text-xs mb-4">
                          1
                        </div>
                        <h4 className="font-bold text-white text-lg mb-2">Comprehensive Services</h4>
                        <p className="text-slate-400 text-xs leading-relaxed font-normal">
                          Provide the most comprehensive and high-quality services to our members, academic researchers, and related industry professionals.
                        </p>
                      </div>
                    </div>

                    <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-400/40 transition flex flex-col justify-between">
                      <div>
                        <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-400/40 flex items-center justify-center font-bold text-xs mb-4">
                          2
                        </div>
                        <h4 className="font-bold text-white text-lg mb-2">Professional Incubator</h4>
                        <p className="text-slate-400 text-xs leading-relaxed font-normal">
                          Serve as the professional incubator for the growth of all members, with dedicated mentorship pathways for young professionals and students.
                        </p>
                      </div>
                    </div>

                    <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-yellow-400/40 transition flex flex-col justify-between">
                      <div>
                        <div className="w-8 h-8 rounded-xl bg-yellow-500/20 text-yellow-300 border border-yellow-400/40 flex items-center justify-center font-bold text-xs mb-4">
                          3
                        </div>
                        <h4 className="font-bold text-white text-lg mb-2">Technological Frontier</h4>
                        <p className="text-slate-400 text-xs leading-relaxed font-normal">
                          Be at the forefront of future I&amp;M fundamental, technological, and application advances across smart factories, medical systems, and robotics.
                        </p>
                      </div>
                    </div>

                    <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-400/40 transition flex flex-col justify-between">
                      <div>
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center font-bold text-xs mb-4">
                          4
                        </div>
                        <h4 className="font-bold text-white text-lg mb-2">Measurement Education</h4>
                        <p className="text-slate-400 text-xs leading-relaxed font-normal">
                          Provide world-class education, Distinguished Lecturer programs, tutorials, and curriculum benchmarks in instrumentation and measurement.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>)}

              {activeTab === "leadership" && (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                      Who We Are: Society Leadership &amp; Governance
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      Meet the global leaders, officers, and committee directors steering the IEEE Instrumentation &amp; Measurement Society worldwide:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <a href="https://ieee-ims.org/about/about-ims/society-officers" target="_blank" rel="noopener noreferrer" className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition flex flex-col justify-between">
                      <div>
                        <Users className="text-amber-400 mb-3" size={22}/>
                        <h4 className="font-bold text-white text-sm mb-1">Our Officers</h4>
                        <p className="text-xs text-slate-400">Executive leadership and elected officers.</p>
                      </div>
                      <span className="text-[11px] font-bold text-amber-400 mt-4 flex items-center gap-1">
                        View Directory <ArrowRight size={11}/>
                      </span>
                    </a>

                    <a href="https://ieee-ims.org/about/about-ims/current-members-at-large" target="_blank" rel="noopener noreferrer" className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition flex flex-col justify-between">
                      <div>
                        <Award className="text-orange-400 mb-3" size={22}/>
                        <h4 className="font-bold text-white text-sm mb-1">Members-at-Large</h4>
                        <p className="text-xs text-slate-400">Administrative Committee members.</p>
                      </div>
                      <span className="text-[11px] font-bold text-orange-400 mt-4 flex items-center gap-1">
                        View AdCom <ArrowRight size={11}/>
                      </span>
                    </a>

                    <a href="https://ieee-ims.org/about/about-ims/representatives-liaisons" target="_blank" rel="noopener noreferrer" className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition flex flex-col justify-between">
                      <div>
                        <Network className="text-yellow-400 mb-3" size={22}/>
                        <h4 className="font-bold text-white text-sm mb-1">Representatives &amp; Liaisons</h4>
                        <p className="text-xs text-slate-400">Cross-society delegates &amp; liaisons.</p>
                      </div>
                      <span className="text-[11px] font-bold text-yellow-400 mt-4 flex items-center gap-1">
                        View Liaisons <ArrowRight size={11}/>
                      </span>
                    </a>

                    <a href="https://ieee-ims.org/about/ieee-ims/council-memberships" target="_blank" rel="noopener noreferrer" className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition flex flex-col justify-between">
                      <div>
                        <Building className="text-blue-400 mb-3" size={22}/>
                        <h4 className="font-bold text-white text-sm mb-1">Council Memberships</h4>
                        <p className="text-xs text-slate-400">IEEE technical council affiliations.</p>
                      </div>
                      <span className="text-[11px] font-bold text-blue-400 mt-4 flex items-center gap-1">
                        View Councils <ArrowRight size={11}/>
                      </span>
                    </a>
                  </div>
                </div>)}

              {activeTab === "governance" && (
        /* GOVERNING DOCUMENTS TAB */
        <div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-6">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">
                      Governing Documents &amp; Strategic Roadmaps
                    </h3>
                    <p className="text-slate-300 text-sm font-normal leading-relaxed mb-6">
                      Official charters and strategic plans guiding IEEE Instrumentation &amp; Measurement Society operations:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <FileText size={18} className="text-amber-400"/>
                          <h4 className="font-bold text-white text-sm">IMS Constitution</h4>
                        </div>
                        <p className="text-xs text-slate-400">Adopted: January 2021</p>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                        Official Charter
                      </span>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <FileText size={18} className="text-amber-400"/>
                          <h4 className="font-bold text-white text-sm">IMS Bylaws</h4>
                        </div>
                        <p className="text-xs text-slate-400">Adopted: August 2022</p>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                        Operating Bylaws
                      </span>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <FileText size={18} className="text-orange-400"/>
                          <h4 className="font-bold text-white text-sm">IMS Society Handbook</h4>
                        </div>
                        <p className="text-xs text-slate-400">Edition: July 2026</p>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-orange-500/20 text-orange-300 border border-orange-400/30">
                        Handbook 2026
                      </span>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <FileText size={18} className="text-emerald-400"/>
                          <h4 className="font-bold text-white text-sm">IMS Strategic Plan</h4>
                        </div>
                        <p className="text-xs text-slate-400">Edition: May 2026</p>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        Strategic 2026
                      </span>
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
export default ImPage;
