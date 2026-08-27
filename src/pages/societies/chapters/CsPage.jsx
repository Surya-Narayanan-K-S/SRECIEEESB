import SocietyOfficeBearers from "@/components/societies/SocietyOfficeBearers";
import { ArrowLeft, Cpu, Globe2, ExternalLink, BookOpen, ArrowRight, Layers, Sparkles, Award, Users, Code2, Database, Building, GraduationCap, Calendar, Zap, Crown, } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
const CsPage = () => {
    const [activeTab, setActiveTab] = useState("overview");
    return (<div className="min-h-screen bg-[#000814] text-slate-100 selection:bg-[#ff5100] selection:text-white flex flex-col font-sans relative overflow-hidden">
      {/* Ambient Neon Flare Mesh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none -z-0">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[140px]"/>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]"/>
        <div className="absolute bottom-20 left-1/3 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px]"/>
      </div>

      <Navbar />

      <main className="flex-1 w-full pt-32 pb-24 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">

          <Link to="/societies" className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-400 font-bold uppercase tracking-widest text-[10px] transition-colors mb-10">
            <ArrowLeft size={14}/> Back to Societies
          </Link>

          {/* HERO SECTION */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} className="mb-14 rounded-3xl border border-orange-500/30 bg-gradient-to-br from-[#00142e]/90 via-[#000e24]/90 to-[#000814]/95 backdrop-blur-2xl p-8 md:p-16 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
              <Layers size={320} className="text-orange-500"/>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start lg:items-center justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 text-[11px] font-black uppercase tracking-wider">
                    Official Chapter • IEEE CS
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={13} className="text-amber-400"/>
                    <span>80th Anniversary (1946–2026)</span>
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white mb-4 leading-tight">
                  IEEE Computer Society <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">(CS)</span>
                </h1>

                <p className="text-sm sm:text-base font-bold uppercase tracking-widest text-orange-400 mb-6">
                  Empowering Computer Science and Engineering Professionals to Fuel Continued Advancement
                </p>

                <div className="h-[2px] w-20 bg-gradient-to-r from-orange-500 to-amber-400 mb-6"/>

                <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-3xl">
                  Engaging computer engineers, scientists, academia, and industry professionals from all areas of computing, the <strong className="text-white">IEEE Computer Society (CS)</strong> sets the standard for the education and engagement that fuels continued global technological advancement. Through conferences, publications, and programs, and by bringing together leaders at every career phase for dialogue and debate, IEEE CS empowers, shapes, and guides the future of computing.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link to="/societies/office-bearers?society=cs" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(255,81,0,0.4)] hover:scale-[1.02]">
                    <Crown size={14}/>
                    <span>Office Bearers</span>
                  </Link>
                  <a href="https://www.computer.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition backdrop-blur-md">
                    <span>Visit Global CS</span>
                    <ExternalLink size={14}/>
                  </a>
                  <a href="https://www.computer.org/about/year-in-review" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition backdrop-blur-md">
                    <span>2025 Review</span>
                    <BookOpen size={14}/>
                  </a>
                </div>
              </div>

              {/* Quick Stats Box */}
              <div className="w-full lg:w-[320px] shrink-0 rounded-2xl border border-orange-500/30 bg-[#000814]/90 backdrop-blur-2xl p-7 shadow-xl">
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-5">Global Benchmark</p>
                <div className="space-y-5">
                  <div>
                    <p className="text-3xl font-black text-white">80 Years</p>
                    <p className="text-xs text-slate-400 font-bold">1946–2026 Anniversary Legacy</p>
                  </div>
                  <div className="h-[1px] w-full bg-white/10"/>
                  <div>
                    <p className="text-3xl font-black text-[#ff5100]">Top 1</p>
                    <p className="text-xs text-slate-400 font-bold">Largest Global Computing Body</p>
                  </div>
                  <div className="h-[1px] w-full bg-white/10"/>
                  <div>
                    <p className="text-3xl font-black text-amber-400">200+</p>
                    <p className="text-xs text-slate-400 font-bold">Conferences &amp; CS Digital Library</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 80TH ANNIVERSARY SPECIAL CALLOUT BANNER */}
          <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 backdrop-blur-2xl p-8 md:p-12 shadow-xl mb-14">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-black text-[10px] uppercase tracking-widest mb-3 border border-amber-400/30">
                  <Award size={13}/>
                  <span>Celebrating 80 Years of Innovation (1946–2026)</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mb-2">
                  Eight Decades of Advancing Computing Theory &amp; Application
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                  In 2026, we honor our legacy through initiatives that connect our rich history with the promising future of our global community, recognizing generations of members whose dedication has driven global innovation.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 shrink-0">
                <a href="https://www.computer.org/about/80th-anniversary" target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-xl bg-[#ff5100] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#e04800] transition shadow-[0_0_15px_rgba(255,81,0,0.4)]">
                  <span>80th Message</span>
                </a>
                <a href="https://www.computer.org/about/cs-history" target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition backdrop-blur-md">
                  <span>CS History</span>
                </a>
              </div>
            </div>
          </div>

          {/* INTERACTIVE WORKSPACE TABS */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 bg-[#00122a]/80 backdrop-blur-2xl rounded-2xl border border-white/10 mb-8 sm:mb-12 shadow-inner w-fit mx-auto max-w-full">
            {[
            {
                id: "overview",
                label: "Overview & Pillars",
                icon: Sparkles,
                activeColor: "bg-blue-600 text-white shadow-blue-600/30",
                idleColor: "text-blue-700 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/60",
                iconActive: "text-blue-100",
                iconIdle: "text-blue-600",
            },
            {
                id: "anniversary",
                label: "80 Years Legacy",
                icon: Award,
                activeColor: "bg-amber-600 text-white shadow-amber-600/30",
                idleColor: "text-amber-700 bg-amber-50/80 hover:bg-amber-100 border border-amber-200/60",
                iconActive: "text-amber-100",
                iconIdle: "text-amber-600",
            },
            {
                id: "education",
                label: "Knowledge & Learning",
                icon: BookOpen,
                activeColor: "bg-indigo-600 text-white shadow-indigo-600/30",
                idleColor: "text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/60",
                iconActive: "text-indigo-100",
                iconIdle: "text-indigo-600",
            },
            {
                id: "community",
                label: "Career & Network",
                icon: Users,
                activeColor: "bg-teal-600 text-white shadow-teal-600/30",
                idleColor: "text-teal-700 bg-teal-50/80 hover:bg-teal-100 border border-teal-200/60",
                iconActive: "text-teal-100",
                iconIdle: "text-teal-600",
            },
            {
                id: "cra",
                label: "CRA Collaboration",
                icon: Layers,
                activeColor: "bg-purple-600 text-white shadow-purple-600/30",
                idleColor: "text-purple-700 bg-purple-50/80 hover:bg-purple-100 border border-purple-200/60",
                iconActive: "text-purple-100",
                iconIdle: "text-purple-600",
            },
            {
                id: "office bearers",
                label: "Office Bearers",
                isOfficeBearer: true,
                icon: Crown,
                activeColor: "bg-[#ff5100] text-white shadow-orange-950/30 ring-2 ring-orange-500/30",
                idleColor: "text-[#ff5100] bg-orange-50 hover:bg-orange-100/90 border border-orange-300 font-black",
                iconActive: "text-amber-200",
                iconIdle: "text-[#ff5100]",
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
              <motion.div initial={{ scaleX: 0, opacity: 1 }} animate={{ scaleX: 1, opacity: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#ff5100] to-transparent mb-8 origin-center"/>

              {activeTab === "office bearers" ? (<SocietyOfficeBearers societyName="IEEE Computer Society (CS)"/>) : activeTab === "overview" ? (<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl">
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
                        We Set the Standard for the Future
                      </h3>
                      <p className="text-slate-300 leading-relaxed font-normal mb-8">
                        By inspiring and connecting professionals from all areas of computing and at every career level, IEEE CS guides the future of its members and the greater industry, enabling new technological opportunities to better serve our world.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-400/40 transition-all">
                          <Cpu className="text-orange-400 mb-3" size={24}/>
                          <h4 className="font-bold text-white text-base mb-1">Architecture &amp; Cloud</h4>
                          <p className="text-xs text-slate-400">
                            Next-generation distributed computing, cloud architectures, and microprocessors.
                          </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-400/40 transition-all">
                          <Code2 className="text-blue-400 mb-3" size={24}/>
                          <h4 className="font-bold text-white text-base mb-1">Software Engineering</h4>
                          <p className="text-xs text-slate-400">
                            High-assurance systems, agile methodologies, and formal verification frameworks.
                          </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition-all">
                          <Database className="text-amber-400 mb-3" size={24}/>
                          <h4 className="font-bold text-white text-base mb-1">Data Science &amp; AI</h4>
                          <p className="text-xs text-slate-400">
                            Big data analytics, deep learning models, and ethical AI governance standards.
                          </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-400/40 transition-all">
                          <Zap className="text-purple-400 mb-3" size={24}/>
                          <h4 className="font-bold text-white text-base mb-1">Cybersecurity &amp; Cryptography</h4>
                          <p className="text-xs text-slate-400">
                            Zero-trust network architectures, blockchain technology, and post-quantum security.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Callouts */}
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#00142e] to-[#000814] text-white p-8 shadow-2xl backdrop-blur-2xl">
                      <Users className="text-orange-400 mb-5" size={28}/>
                      <h3 className="font-bold text-white mb-2 text-lg">Join IEEE CS at SREC</h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-6">
                        Engage with top peer programmers, software architects, and researcher networks.
                      </p>
                      <Link to="/join" className="group flex items-center justify-between w-full pb-3 border-b border-white/20 text-xs font-black uppercase tracking-wider hover:border-orange-400 transition-colors text-orange-300">
                        <span>Apply for Membership</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                      </Link>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-[#001026]/90 text-white p-8 shadow-2xl backdrop-blur-2xl">
                      <Globe2 className="text-orange-400 mb-5" size={28}/>
                      <h3 className="font-bold text-white mb-2 text-lg">IEEE CS Digital Library</h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-4">
                        Explore over 900k+ research papers, IEEE Computer Magazine, and conference proceedings.
                      </p>
                      <a href="https://www.computer.org/csdl/home" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1">
                        <span>Access CSDL Portal</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>
                  </div>
                </div>) : activeTab === "anniversary" ? (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                      Largest Global Community of Computer Scientists &amp; Engineers
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      IEEE CS is the trusted organization dedicated to engaging the engineers, scientists, academia, and industry professionals from across the globe driving continued advancements in computer science and technology.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <a href="https://www.computer.org/volunteering/society-leadership" target="_blank" rel="noopener noreferrer" className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-400/50 hover:bg-white/[0.06] transition">
                      <h4 className="font-bold text-white text-sm mb-1">Society Leadership</h4>
                      <p className="text-xs text-slate-400">Meet global officers &amp; Board of Governors.</p>
                    </a>

                    <a href="https://www.computer.org/about/executive-staff" target="_blank" rel="noopener noreferrer" className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-400/50 hover:bg-white/[0.06] transition">
                      <h4 className="font-bold text-white text-sm mb-1">Executive Staff</h4>
                      <p className="text-xs text-slate-400">Discover staff leading CS operations.</p>
                    </a>

                    <a href="https://www.computer.org/membership" target="_blank" rel="noopener noreferrer" className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-400/50 hover:bg-white/[0.06] transition">
                      <h4 className="font-bold text-white text-sm mb-1">Membership Benefits</h4>
                      <p className="text-xs text-slate-400">Unlock discounts, journals, and career tools.</p>
                    </a>

                    <a href="https://www.computer.org/about/society-representatives" target="_blank" rel="noopener noreferrer" className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-400/50 hover:bg-white/[0.06] transition">
                      <h4 className="font-bold text-white text-sm mb-1">Society Representatives</h4>
                      <p className="text-xs text-slate-400">Global representatives across sections.</p>
                    </a>

                    <a href="https://www.computer.org/about/vision" target="_blank" rel="noopener noreferrer" className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-400/50 hover:bg-white/[0.06] transition">
                      <h4 className="font-bold text-white text-sm mb-1">Vision &amp; Commitment</h4>
                      <p className="text-xs text-slate-400">Strategic goals advancing humanity.</p>
                    </a>

                    <a href="https://www.computer.org/about/cs-history/computer-society-presidents" target="_blank" rel="noopener noreferrer" className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-400/50 hover:bg-white/[0.06] transition">
                      <h4 className="font-bold text-white text-sm mb-1">Past Presidents</h4>
                      <p className="text-xs text-slate-400">Honor visionary past leaders of IEEE CS.</p>
                    </a>
                  </div>
                </div>) : activeTab === "education" ? (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                      Preeminent Society for Knowledge-Sharing &amp; Education
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      From conferences to publications, programs, and committees, IEEE CS creates the environment, resources, and tools to shape, impact, and celebrate the global computer science and technology community.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-orange-400/40 transition">
                      <div>
                        <Calendar className="text-orange-400 mb-3" size={24}/>
                        <h4 className="font-bold text-white text-base mb-1">Global Conferences</h4>
                        <p className="text-xs text-slate-400 mb-4">
                          Over 200+ annual sponsored conferences, workshops, and symposiums worldwide.
                        </p>
                      </div>
                      <a href="https://www.computer.org/conferences" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-orange-400 hover:underline flex items-center gap-1">
                        <span>Explore Conferences</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-orange-400/40 transition">
                      <div>
                        <BookOpen className="text-orange-400 mb-3" size={24}/>
                        <h4 className="font-bold text-white text-base mb-1">Publications &amp; Magazines</h4>
                        <p className="text-xs text-slate-400 mb-4">
                          Peer-reviewed journals including IEEE Transactions on Computers and IEEE Software.
                        </p>
                      </div>
                      <a href="https://www.computer.org/publications" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-orange-400 hover:underline flex items-center gap-1">
                        <span>View Publications</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-orange-400/40 transition">
                      <div>
                        <GraduationCap className="text-orange-400 mb-3" size={24}/>
                        <h4 className="font-bold text-white text-base mb-1">Education &amp; Standards</h4>
                        <p className="text-xs text-slate-400 mb-4">
                          Curriculum guidelines, certification programs, and global IEEE computing standards.
                        </p>
                      </div>
                      <a href="https://www.computer.org/education" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-orange-400 hover:underline flex items-center gap-1">
                        <span>Education Programs</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>
                  </div>
                </div>) : activeTab === "community" ? (<div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                      Learn How the Computer Society Accelerates Careers
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed font-normal">
                      Resources tailored for young professionals, industry practitioners, and women in computing at every stage of their professional journey.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-orange-400/40 transition">
                      <div>
                        <span className="px-2.5 py-1 rounded bg-orange-500/20 text-orange-300 text-[10px] font-black uppercase tracking-wider mb-3 inline-block border border-orange-400/30">
                          Young Professionals
                        </span>
                        <h4 className="font-bold text-white text-base mb-1">We Are the Future</h4>
                        <p className="text-xs text-slate-400 mb-4">
                          Webinar series and mentorship with Ramesh Nair, past Vice Chair of IEEE Young Professionals.
                        </p>
                      </div>
                      <a href="https://www.computer.org/about/learning-webinar-series#getting-involved" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-orange-400 hover:underline flex items-center gap-1">
                        <span>Watch Webinar Series</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-blue-400/40 transition">
                      <div>
                        <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider mb-3 inline-block border border-blue-400/30">
                          Career Launch
                        </span>
                        <h4 className="font-bold text-white text-base mb-1">Launch a Computing Career</h4>
                        <p className="text-xs text-slate-400 mb-4">
                          Curated toolkits, interview masterclasses, and roadmaps for early-career computer scientists.
                        </p>
                      </div>
                      <a href="https://www.computer.org/about/launch-computing-career" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1">
                        <span>Career Resources</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-emerald-400/40 transition">
                      <div>
                        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-3 inline-block border border-emerald-400/30">
                          Industry Practitioners
                        </span>
                        <h4 className="font-bold text-white text-base mb-1">Industry Professional Hub</h4>
                        <p className="text-xs text-slate-400 mb-4">
                          Bridging academia with enterprise software, cloud scalability, and corporate tech tools.
                        </p>
                      </div>
                      <a href="https://www.computer.org/about/industry-practitioners" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                        <span>Industry Portal</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-purple-400/40 transition">
                      <div>
                        <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-wider mb-3 inline-block border border-purple-400/30">
                          Diversity &amp; Inclusion
                        </span>
                        <h4 className="font-bold text-white text-base mb-1">Women in Computing</h4>
                        <p className="text-xs text-slate-400 mb-4">
                          Challenges and opportunities featured by Jill Gostin, Board of Governors IEEE Computer Society.
                        </p>
                      </div>
                      <a href="https://www.computer.org/about/learning-webinar-series#getting-involved" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-purple-400 hover:underline flex items-center gap-1">
                        <span>Access Webinar</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>
                  </div>
                </div>) : (
        /* CRA COLLABORATION TAB */
        <div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Building size={24} className="text-orange-400"/>
                    <h3 className="text-2xl font-serif font-bold text-white">
                      Collaborating With the Community: CRA Partnership
                    </h3>
                  </div>
                  <p className="text-slate-300 text-base leading-relaxed font-normal">
                    The IEEE Computer Society (CS) is dedicated to driving the future of computing by fostering excellence in the research community. Through our strategic partnership with the <strong className="text-white">Computing Research Association (CRA)</strong>, we unite the strengths of academia, industry, and government to address the most pressing challenges in the field. This collaboration provides a unified voice for computing research leadership and innovation.
                  </p>

                  <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-white text-base">Explore the CRA &amp; IEEE CS Strategic Alliance</h4>
                      <p className="text-xs text-slate-400">Read initiatives on computing policy, leadership, and research.</p>
                    </div>
                    <a href="https://www.computer.org/about/cra-partnership" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl bg-[#ff5100] hover:bg-[#e04800] text-white font-bold text-xs uppercase tracking-wider transition shadow-[0_0_15px_rgba(255,81,0,0.4)] shrink-0 flex items-center gap-1.5">
                      <span>Learn More</span>
                      <ExternalLink size={14}/>
                    </a>
                  </div>
                </div>)}
            </motion.div>
          </AnimatePresence>

        </div>
      </main>

      <Footer />
    </div>);
};
export default CsPage;
