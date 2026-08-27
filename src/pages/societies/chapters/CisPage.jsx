import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SocietyOfficeBearers from "@/components/societies/SocietyOfficeBearers";
import { ArrowLeft, Brain, Cpu, ExternalLink, BookOpen, ArrowRight, Layers, Sparkles, Users, Zap, Dna, ShieldCheck, Calendar, GraduationCap, Crown, } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
const CisPage = () => {
    const [activeTab, setActiveTab] = useState("overview");
    return (<div className="min-h-screen bg-[#000814] text-slate-100 selection:bg-[#4338ca] selection:text-white flex flex-col font-sans relative overflow-hidden">
      {/* Ambient Neon Flare Mesh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none -z-0">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]"/>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]"/>
        <div className="absolute bottom-20 left-1/3 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[140px]"/>
      </div>

      <Navbar />

      <main className="flex-1 w-full pt-32 pb-24 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">

          <Link to="/societies" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400 font-bold uppercase tracking-widest text-[10px] transition-colors mb-10">
            <ArrowLeft size={14}/> Back to Societies
          </Link>

          {/* HERO SECTION WITH ANIMATION */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mb-14 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-[#00142e]/90 via-[#000e24]/90 to-[#000814]/95 backdrop-blur-2xl p-8 md:p-16 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
              <Layers size={320} className="text-indigo-500"/>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start lg:items-center justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-[11px] font-black uppercase tracking-wider">
                    Official Student Chapter • IEEE SREC
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={13} className="text-purple-400"/>
                    <span>Where Nature Inspires Innovation</span>
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white mb-4 leading-tight">
                  IEEE Computational Intelligence Society <span className="bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text text-transparent">(CIS)</span>
                </h1>

                <p className="text-sm sm:text-base font-bold uppercase tracking-widest text-indigo-400 mb-6">
                  Pioneering Neural Networks, Fuzzy Systems &amp; Evolutionary AI at SREC
                </p>

                <div className="h-[2px] w-20 bg-gradient-to-r from-indigo-500 to-purple-400 mb-6"/>

                <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-3xl">
                  The <strong className="text-white">IEEE Computational Intelligence Society (CIS)</strong> is the global home of researchers, practitioners, and enthusiasts dedicated to the advancement of biologically and linguistically motivated computational paradigms. Focus areas encompass the theory, design, application, and development of computationally efficient intelligence across neural networks, fuzzy logic, deep learning, and evolutionary algorithms.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link to="/societies/office-bearers?society=cis" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:scale-[1.02]">
                    <Crown size={14}/>
                    <span>Office Bearers</span>
                  </Link>
                  <a href="https://cis.ieee.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition backdrop-blur-md">
                    <span>Global CIS</span>
                    <ExternalLink size={14}/>
                  </a>
                  <a href="https://cis.ieee.org/publications" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition backdrop-blur-md">
                    <span>Journals &amp; TAI</span>
                    <BookOpen size={14}/>
                  </a>
                </div>
              </div>

              {/* Quick Info Glass Tile */}
              <div className="w-full lg:w-[320px] shrink-0 rounded-2xl border border-indigo-500/30 bg-[#000814]/90 backdrop-blur-2xl p-7 shadow-xl">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-5">Chapter Benchmarks</p>
                <div className="space-y-5">
                  <div>
                    <p className="text-3xl font-black text-white">#1</p>
                    <p className="text-xs text-slate-400 font-bold">Leading Evolutionary Computation Body</p>
                  </div>
                  <div className="h-[1px] w-full bg-white/10"/>
                  <div>
                    <p className="text-3xl font-black text-indigo-400">120K+</p>
                    <p className="text-xs text-slate-400 font-bold">Global Citations in IEEE Xplore</p>
                  </div>
                  <div className="h-[1px] w-full bg-white/10"/>
                  <div>
                    <p className="text-3xl font-black text-purple-400">3 Pillars</p>
                    <p className="text-xs text-slate-400 font-bold">Neural, Fuzzy &amp; Evolutionary AI</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3 FUNDAMENTAL PILLARS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} className="rounded-3xl border border-white/10 bg-[#001026]/90 p-8 shadow-xl backdrop-blur-2xl">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center mb-5">
                <Brain size={24}/>
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">Neural Networks</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                Pioneering biologically-inspired architectures, deep representation learning, computer vision, and cognitive neural processing systems.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} className="rounded-3xl border border-white/10 bg-[#001026]/90 p-8 shadow-xl backdrop-blur-2xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300 flex items-center justify-center mb-5">
                <Zap size={24}/>
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">Fuzzy Systems</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                Harnessing human-like reasoning and linguistics to navigate ambiguity, uncertainty, and non-linear dynamic decision support in robotics.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} className="rounded-3xl border border-white/10 bg-[#001026]/90 p-8 shadow-xl backdrop-blur-2xl">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-400/30 text-pink-300 flex items-center justify-center mb-5">
                <Dna size={24}/>
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">Evolutionary Computation</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                Utilizing natural selection, genetic algorithms, and swarm optimization to solve hyper-dimensional engineering challenges.
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
                activeColor: "bg-indigo-600 text-white shadow-indigo-600/30",
                idleColor: "text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-400/20",
                iconActive: "text-indigo-100",
                iconIdle: "text-indigo-400",
            },
            {
                id: "pillars",
                label: "Technical Domains",
                icon: Brain,
                activeColor: "bg-purple-600 text-white shadow-purple-600/30",
                idleColor: "text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-400/20",
                iconActive: "text-purple-100",
                iconIdle: "text-purple-400",
            },
            {
                id: "benefits",
                label: "Member Benefits",
                icon: Zap,
                activeColor: "bg-amber-600 text-white shadow-amber-600/30",
                idleColor: "text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/20",
                iconActive: "text-amber-100",
                iconIdle: "text-amber-400",
            },
            {
                id: "publications",
                label: "Top Journals & Impact",
                icon: BookOpen,
                activeColor: "bg-teal-600 text-white shadow-teal-600/30",
                idleColor: "text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-400/20",
                iconActive: "text-teal-100",
                iconIdle: "text-teal-400",
            },
            {
                id: "ethics",
                label: "Ethical AI Standards",
                icon: ShieldCheck,
                activeColor: "bg-blue-600 text-white shadow-blue-600/30",
                idleColor: "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/20",
                iconActive: "text-blue-100",
                iconIdle: "text-blue-400",
            },
            {
                id: "office bearers",
                label: "Office Bearers",
                isOfficeBearer: true,
                icon: Crown,
                activeColor: "bg-[#4338ca] text-white shadow-indigo-950/30 ring-2 ring-indigo-500/30",
                idleColor: "text-indigo-300 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 font-black",
                iconActive: "text-amber-300",
                iconIdle: "text-indigo-300",
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
              <motion.div initial={{ scaleX: 0, opacity: 1 }} animate={{ scaleX: 1, opacity: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#4338ca] to-transparent mb-8 origin-center"/>

              {activeTab === "office bearers" && (<SocietyOfficeBearers societyName="IEEE Computational Intelligence Society (CIS)"/>)}

              {activeTab === "overview" && (<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl">
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
                        Computational Intelligence: The Science of Adaptive Systems
                      </h3>
                      <p className="text-slate-300 leading-relaxed font-normal mb-6">
                        The IEEE Computational Intelligence Society focuses on theoretical foundations and practical deployments of bio-inspired algorithms. Our SREC student chapter engages students in practical machine learning projects, automated robotics, and deep neural architectures.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-400/40 transition">
                          <Cpu className="text-indigo-400 mb-3" size={24}/>
                          <h4 className="font-bold text-white text-base mb-1">Deep Learning &amp; AI</h4>
                          <p className="text-xs text-slate-400">
                            Computer vision, natural language understanding, generative AI, and reinforcement learning.
                          </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-400/40 transition">
                          <ShieldCheck className="text-purple-400 mb-3" size={24}/>
                          <h4 className="font-bold text-white text-base mb-1">Autonomous Systems</h4>
                          <p className="text-xs text-slate-400">
                            Self-driving vehicles, smart grid management, and robotic motion optimization.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Callouts */}
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#00142e] to-[#000814] text-white p-8 shadow-2xl backdrop-blur-2xl">
                      <Users className="text-indigo-400 mb-5" size={28}/>
                      <h3 className="font-bold text-white mb-2 text-lg">Join CIS at SREC</h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-6">
                        Connect with global researchers, get travel grants to IEEE WCCI, and publish in top tier conferences.
                      </p>
                      <Link to="/join" className="group flex items-center justify-between w-full pb-3 border-b border-white/20 text-xs font-black uppercase tracking-wider hover:border-indigo-400 transition-colors text-indigo-300">
                        <span>Join Today</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                      </Link>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-[#001026]/90 text-white p-8 shadow-2xl backdrop-blur-2xl">
                      <BookOpen className="text-indigo-400 mb-5" size={28}/>
                      <h3 className="font-bold text-white mb-2 text-lg">CIS Resource Center</h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-4">
                        Access recorded tutorials, distinguished lectures, and code repositories from world authorities.
                      </p>
                      <a href="https://resourcecenter.cis.ieee.org/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1">
                        <span>Browse Resource Center</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>
                  </div>
                </div>)}

              {activeTab === "pillars" && (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                      Deep-Dive: The Three Fundamental Technical Pillars
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      How IEEE CIS advances the spectrum of computational intelligence:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-indigo-400/40 transition">
                      <div>
                        <Brain className="text-indigo-400 mb-4" size={28}/>
                        <h4 className="font-bold text-white text-lg mb-2">Neural Networks</h4>
                        <p className="text-slate-400 text-xs leading-relaxed font-normal">
                          Focuses on perceptual modeling, pattern classification, continuous representation learning, and edge hardware accelerators.
                        </p>
                      </div>
                    </div>

                    <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-purple-400/40 transition">
                      <div>
                        <Zap className="text-purple-400 mb-4" size={28}/>
                        <h4 className="font-bold text-white text-lg mb-2">Fuzzy Systems</h4>
                        <p className="text-slate-400 text-xs leading-relaxed font-normal">
                          Provides theoretical frameworks for computing with words, interpretable AI, industrial controllers, and multi-criteria decision making.
                        </p>
                      </div>
                    </div>

                    <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-pink-400/40 transition">
                      <div>
                        <Dna className="text-pink-400 mb-4" size={28}/>
                        <h4 className="font-bold text-white text-lg mb-2">Evolutionary Computation</h4>
                        <p className="text-slate-400 text-xs leading-relaxed font-normal">
                          Employs bio-inspired metaheuristics for combinatorial optimization, neural architecture search (NAS), and hyperparameter tuning.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>)}

              {activeTab === "benefits" && (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                      Membership Benefits &amp; Career Opportunities
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      What you gain when you join the IEEE Computational Intelligence Society:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-400/40 transition">
                      <GraduationCap className="text-indigo-400 mb-3" size={24}/>
                      <h4 className="font-bold text-white text-base mb-1">Travel Grants &amp; Scholarships</h4>
                      <p className="text-xs text-slate-400">
                        Substantial financial grants for student authors presenting papers at premier IEEE CIS conferences worldwide.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-400/40 transition">
                      <Calendar className="text-purple-400 mb-3" size={24}/>
                      <h4 className="font-bold text-white text-base mb-1">Global Competitions</h4>
                      <p className="text-xs text-slate-400">
                        Participate in CIS-sponsored AI competitions in game playing, automated theorem proving, and smart grids.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-pink-400/40 transition">
                      <BookOpen className="text-pink-400 mb-3" size={24}/>
                      <h4 className="font-bold text-white text-base mb-1">Digital Library Access</h4>
                      <p className="text-xs text-slate-400">
                        Full digital access to IEEE CIS Magazine, newsletter archives, and educational video repositories.
                      </p>
                    </div>
                  </div>
                </div>)}

              {activeTab === "publications" && (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                      Flagship Journals &amp; High Impact Publications
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      IEEE CIS publishes some of the highest impact factor journals in all of computer science:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-400/40 transition">
                      <h4 className="font-bold text-white text-base mb-1">IEEE Transactions on Neural Networks &amp; Learning Systems (TNNLS)</h4>
                      <p className="text-xs text-slate-400 font-medium">Premier journal covering deep learning algorithms, representation learning, and cognitive computing.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-400/40 transition">
                      <h4 className="font-bold text-white text-base mb-1">IEEE Transactions on Fuzzy Systems (TFS)</h4>
                      <p className="text-xs text-slate-400 font-medium">Leading journal addressing soft computing, approximate reasoning, and uncertainty modeling.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-pink-400/40 transition">
                      <h4 className="font-bold text-white text-base mb-1">IEEE Transactions on Evolutionary Computation (TEVC)</h4>
                      <p className="text-xs text-slate-400 font-medium">Top-tier venue for evolutionary algorithms, swarm intelligence, and nature-inspired optimization.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition">
                      <h4 className="font-bold text-white text-base mb-1">IEEE Transactions on Artificial Intelligence (TAI)</h4>
                      <p className="text-xs text-slate-400 font-medium">Cross-disciplinary journal focusing on applications of AI across medical, industrial, and societal domains.</p>
                    </div>
                  </div>
                </div>)}

              {activeTab === "ethics" && (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-6">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">
                      Ethical AI &amp; Human-Centric Computing Standards
                    </h3>
                    <p className="text-slate-300 text-sm font-normal leading-relaxed mb-6">
                      IEEE CIS actively develops guidelines and governance models to ensure AI systems are transparent, fair, explainable, and aligned with human values:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-400/40 transition">
                      <h4 className="font-bold text-white text-sm mb-1">Explainable AI (XAI)</h4>
                      <p className="text-xs text-slate-400">Creating models whose decisions can be interpreted and audited by human stakeholders.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-400/40 transition">
                      <h4 className="font-bold text-white text-sm mb-1">Fairness &amp; Bias Mitigation</h4>
                      <p className="text-xs text-slate-400">Mathematical approaches to detecting and eliminating demographic disparities in machine learning predictions.</p>
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
export default CisPage;
