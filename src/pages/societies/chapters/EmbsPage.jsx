import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SocietyOfficeBearers from "@/components/societies/SocietyOfficeBearers";
import { ArrowLeft, Activity, Heart, ExternalLink, Layers, Cpu, Radio, Sparkles, Stethoscope, Dna, Globe2, Newspaper, ArrowRight, Zap, Crown, } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
const EmbsPage = () => {
    const [activeTab, setActiveTab] = useState("overview");
    return (<div className="min-h-screen bg-[#000814] text-slate-100 selection:bg-[#008272] selection:text-white flex flex-col font-sans relative overflow-hidden">
      {/* Ambient Neon Flare Mesh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none -z-0">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[140px]"/>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px]"/>
        <div className="absolute bottom-20 left-1/3 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px]"/>
      </div>

      <Navbar />

      <main className="flex-1 w-full pt-8 md:pt-10 pb-24 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          
          <Link to="/societies" className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-400 font-bold uppercase tracking-widest text-[10px] transition-colors mb-10">
            <ArrowLeft size={14}/> Back to Societies
          </Link>

          {/* HERO SECTION */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} className="mb-14 rounded-3xl border border-teal-500/30 bg-gradient-to-br from-[#00142e]/90 via-[#000e24]/90 to-[#000814]/95 backdrop-blur-2xl p-8 md:p-16 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
              <Layers size={320} className="text-teal-400"/>
            </div>
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start lg:items-center justify-between">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-[11px] font-black uppercase tracking-wider mb-5">
                  <Activity size={13} className="text-teal-400"/>
                  <span>Engineering Medicine &amp; Biology Society</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white mb-4 leading-tight">
                  IEEE Engineering in Medicine and Biology <span className="bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">(EMBS)</span>
                </h1>

                <p className="text-sm sm:text-base font-bold uppercase tracking-widest text-teal-400 mb-6">
                  Your global connection to the world of biomedical engineering.
                </p>

                <div className="h-[2px] w-20 bg-gradient-to-r from-teal-400 to-emerald-400 mb-6"/>

                <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-3xl">
                  <strong className="text-white">IEEE EMBS</strong> is the world’s largest international society of biomedical engineers. With 12,000+ members in 97 countries, we bridge the clinical world and engineering theory to pioneer medical diagnostics, healthcare robotics, genomics, implantable therapeutics, and wearable biosensors.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link to="/societies/office-bearers?society=embs" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(5,150,105,0.4)] hover:scale-[1.02]">
                    <Crown size={14}/>
                    <span>Office Bearers</span>
                  </Link>
                  <a href="https://www.embs.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition backdrop-blur-md">
                    <span>Global EMBS</span>
                    <ExternalLink size={14}/>
                  </a>
                  <a href="https://www.embs.org/pulse/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition backdrop-blur-md">
                    <span>Pulse Device Journal</span>
                    <ExternalLink size={14}/>
                  </a>
                </div>
              </div>

              {/* Quick Info Glass Tile */}
              <div className="w-full lg:w-[320px] shrink-0 rounded-2xl border border-teal-500/30 bg-[#000814]/90 backdrop-blur-2xl p-7 shadow-xl">
                <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-5">Chapter Benchmarks</p>
                <div className="space-y-5">
                  <div>
                    <p className="text-3xl font-black text-white">12,000+</p>
                    <p className="text-xs text-slate-400 font-bold">Biomedical Members in 97 Countries</p>
                  </div>
                  <div className="h-[1px] w-full bg-white/10"/>
                  <div>
                    <p className="text-3xl font-black text-teal-400">#1 Society</p>
                    <p className="text-xs text-slate-400 font-bold">Global Bioengineering Authority</p>
                  </div>
                  <div className="h-[1px] w-full bg-white/10"/>
                  <div>
                    <p className="text-3xl font-black text-emerald-400">IEEE EMBC</p>
                    <p className="text-xs text-slate-400 font-bold">Flagship Annual Conference</p>
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
                label: "Overview & Impact",
                icon: Sparkles,
                activeColor: "bg-teal-600 text-white shadow-teal-600/30",
                idleColor: "text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-400/20",
                iconActive: "text-teal-100",
                iconIdle: "text-teal-400",
            },
            {
                id: "field of interest",
                label: "Field of Interest",
                icon: Activity,
                activeColor: "bg-emerald-600 text-white shadow-emerald-600/30",
                idleColor: "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/20",
                iconActive: "text-emerald-100",
                iconIdle: "text-emerald-400",
            },
            {
                id: "pillars",
                label: "Core Pillars & Focus",
                icon: Layers,
                activeColor: "bg-blue-600 text-white shadow-blue-600/30",
                idleColor: "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/20",
                iconActive: "text-blue-100",
                iconIdle: "text-blue-400",
            },
            {
                id: "newsletters",
                label: "Newsletters & Media",
                icon: Newspaper,
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
                activeColor: "bg-[#008272] text-white shadow-teal-950/30 ring-2 ring-teal-500/30",
                idleColor: "text-teal-300 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/40 font-black",
                iconActive: "text-amber-300",
                iconIdle: "text-teal-300",
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
              <motion.div initial={{ scaleX: 0, opacity: 1 }} animate={{ scaleX: 1, opacity: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#008272] to-transparent mb-8 origin-center"/>

              {activeTab === "office bearers" && (<SocietyOfficeBearers societyName="IEEE Engineering in Medicine & Biology Society (EMBS)"/>)}

              {activeTab === "overview" && (<div className="space-y-12">
                  {/* What our members do */}
                  <div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl">
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
                      What IEEE EMBS Members Do
                    </h3>
                    <p className="text-slate-300 leading-relaxed font-normal mb-8">
                      Our members design the electrical circuits that make a pacemaker run, create the software that reads an MRI, and help develop the wireless technologies that allow patients and doctors to communicate over long distances. They’re interested in bioinformatics, biotechnology, clinical engineering, information technology, instrumentation and measurement, micro and nanotechnology, radiology, and robots. They are researchers and educators, technicians, and clinicians—biomedical engineers are the link between science and life science, creating innovations in healthcare technology for the benefit of all humanity.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-teal-400/40 transition flex flex-col justify-between">
                        <div>
                          <Heart className="text-teal-400 mb-3" size={24}/>
                          <h4 className="font-bold text-white text-sm mb-1">Pacemakers &amp; Implants</h4>
                          <p className="text-xs text-slate-400">
                            Design electrical circuits and bio-power architectures that power life-saving cardiac pacemakers.
                          </p>
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-400/40 transition flex flex-col justify-between">
                        <div>
                          <Cpu className="text-emerald-400 mb-3" size={24}/>
                          <h4 className="font-bold text-white text-sm mb-1">MRI &amp; Medical Software</h4>
                          <p className="text-xs text-slate-400">
                            Build advanced algorithms and neural processing pipelines that interpret high-resolution MRI and CT scans.
                          </p>
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition flex flex-col justify-between">
                        <div>
                          <Radio className="text-cyan-400 mb-3" size={24}/>
                          <h4 className="font-bold text-white text-sm mb-1">Wireless Telehealth</h4>
                          <p className="text-xs text-slate-400">
                            Develop wireless body area networks and telemetry allowing real-time clinical diagnostics across distances.
                          </p>
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-400/40 transition flex flex-col justify-between">
                        <div>
                          <Dna className="text-purple-400 mb-3" size={24}/>
                          <h4 className="font-bold text-white text-sm mb-1">Nanotech &amp; Robotics</h4>
                          <p className="text-xs text-slate-400">
                            Pioneer surgical robots, micro-sensors, synthetic biological systems, and biomaterials for precision care.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Callouts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#00142e] to-[#000814] text-white p-8 shadow-2xl backdrop-blur-2xl flex flex-col justify-between">
                      <div>
                        <Stethoscope className="text-teal-400 mb-5" size={28}/>
                        <h3 className="font-bold text-white mb-2 text-xl">Join the EMBS Network</h3>
                        <p className="text-slate-400 text-xs leading-relaxed mb-6">
                          Connect with leading biomedical engineering faculty, clinical researchers, and international practitioners at SREC.
                        </p>
                      </div>
                      <Link to="/join" className="group flex items-center justify-between w-full pb-3 border-b border-white/20 text-xs font-black uppercase tracking-wider hover:border-teal-400 transition-colors text-teal-300">
                        <span>Submit Membership Form</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                      </Link>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-[#001026]/90 text-white p-8 shadow-2xl backdrop-blur-2xl flex flex-col justify-between">
                      <div>
                        <Globe2 className="text-teal-400 mb-5" size={28}/>
                        <h3 className="font-bold text-white mb-2 text-xl">Global Biomedical Hub</h3>
                        <p className="text-slate-400 text-xs leading-relaxed mb-6">
                          Access IEEE EMBS Electronic Library, premier medical journals, webinars, and annual biomedical conferences worldwide.
                        </p>
                      </div>
                      <a href="https://www.embs.org/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-teal-400 hover:underline flex items-center gap-1">
                        <span>Explore EMBS Global Portal</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>
                  </div>
                </div>)}

              {activeTab === "field of interest" && (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8">
                  <div>
                    <span className="px-3 py-1 bg-teal-500/20 border border-teal-400/40 text-teal-300 font-bold text-xs uppercase tracking-wider rounded-lg mb-3 inline-block">
                      Scope &amp; Domains
                    </span>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
                      Our Field of Interest: Engineering in Medicine and Biology
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      The EMBS field of interest is the development and application of engineering innovations to healthcare, medicine, and biology to provide effective solutions to biological, medical, and healthcare problems.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                    <p className="text-slate-300 text-sm leading-relaxed font-normal">
                      The field encompasses the development of mathematical theories, including data science, machine learning, artificial intelligence (AI), physical, biological, and chemical principles, computational models and algorithms, synthetic and systems biology, devices, and systems for clinical, industrial, and educational applications.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-amber-400/40 transition">
                      <Zap size={22} className="text-amber-400 mb-3"/>
                      <h4 className="font-bold text-white text-base mb-2">Computational &amp; Theoretical Models</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-normal">
                        Mathematical frameworks, machine learning, and AI models decoding genomic sequences and physiological signals.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-teal-400/40 transition">
                      <Activity size={22} className="text-teal-400 mb-3"/>
                      <h4 className="font-bold text-white text-base mb-2">Clinical &amp; Industrial Systems</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-normal">
                        Transforming research bench breakthroughs into certified medical devices, clinical telemetry, and hospital healthcare systems.
                      </p>
                    </div>
                  </div>
                </div>)}

              {activeTab === "pillars" && (<div className="space-y-8">
                  <div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl">
                    <h3 className="text-2xl font-serif font-bold text-white mb-3">
                      Core Technological Pillars of IEEE EMBS
                    </h3>
                    <p className="text-slate-300 text-sm font-normal leading-relaxed mb-8">
                      IEEE EMBS members are focused on the development and application of engineering concepts and methods to provide new solutions to biological, medical, and healthcare problems across 4 primary domains:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Pillar 1 */}
                      <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-teal-400/40 transition">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-xl bg-teal-500/25 text-teal-300 border border-teal-400/40 flex items-center justify-center font-bold text-xs">
                            1
                          </div>
                          <h4 className="font-bold text-white text-lg">Diagnostic Systems</h4>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed font-normal">
                          Biomedical imaging (MRI, CT, PET, Ultrasound), non-invasive biosensors, optical diagnostic devices, point-of-care pathology systems, and AI-driven disease detection.
                        </p>
                      </div>

                      {/* Pillar 2 */}
                      <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-400/40 transition">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 flex items-center justify-center font-bold text-xs">
                            2
                          </div>
                          <h4 className="font-bold text-white text-lg">Therapeutic Systems</h4>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed font-normal">
                          Implantable pacemakers and defibrillators, surgical robotics, neuroprosthetics, targeted drug delivery platforms, and laser therapeutic instruments.
                        </p>
                      </div>

                      {/* Pillar 3 */}
                      <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-400/40 transition">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-500/25 text-blue-300 border border-blue-400/40 flex items-center justify-center font-bold text-xs">
                            3
                          </div>
                          <h4 className="font-bold text-white text-lg">Healthcare &amp; Bioinformation Systems</h4>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed font-normal">
                          Clinical informatics, electronic health record (EHR) security, bioinformatics database processing, wireless body sensors, and telemedicine systems.
                        </p>
                      </div>

                      {/* Pillar 4 */}
                      <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-400/40 transition">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-xl bg-purple-500/25 text-purple-300 border border-purple-400/40 flex items-center justify-center font-bold text-xs">
                            4
                          </div>
                          <h4 className="font-bold text-white text-lg">Technologies &amp; Methodologies</h4>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed font-normal">
                          Micro and nanotechnology, cellular and tissue engineering, synthetic biology, neural engineering, and advanced computational mathematical modeling.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>)}

              {activeTab === "newsletters" && (
        /* NEWSLETTERS TAB */
        <div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Newspaper size={24} className="text-teal-400"/>
                    <h3 className="text-2xl font-serif font-bold text-white">
                      EMBS Newsletter Archives &amp; Publications
                    </h3>
                  </div>
                  <p className="text-slate-300 text-sm font-normal leading-relaxed mb-8">
                    View past news, breakthroughs, and international spotlights from the Engineering in Medicine and Biology Community and beyond.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-teal-400/40 transition flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-white text-base mb-2">Global EMBS Pulse Newsletter</h4>
                        <p className="text-xs text-slate-400 mb-4">
                          Monthly digests covering breakthrough clinical studies, bioengineering patents, and conferences.
                        </p>
                      </div>
                      <a href="https://www.embs.org/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-teal-400 hover:underline flex items-center gap-1">
                        <span>Read Online Archives</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-400/40 transition flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-white text-base mb-2">Transactions &amp; Journals</h4>
                        <p className="text-xs text-slate-400 mb-4">
                          IEEE Transactions on Biomedical Engineering (TBME) and IEEE Reviews in Biomedical Engineering.
                        </p>
                      </div>
                      <a href="https://www.embs.org/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                        <span>Explore Publications</span>
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
export default EmbsPage;
