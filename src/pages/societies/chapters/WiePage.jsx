import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SocietyOfficeBearers from "@/components/societies/SocietyOfficeBearers";
import { ArrowLeft, Target, Users, Compass, Sparkles, ExternalLink, HelpCircle, Palette, Shield, Layers, Award, ArrowRight, Heart, Globe2, Crown, } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
const WiePage = () => {
    const [activeTab, setActiveTab] = useState("overview");
    return (<div className="min-h-screen bg-[#000814] text-slate-100 selection:bg-[#78237b] selection:text-white flex flex-col font-sans relative overflow-hidden">
      {/* Ambient Neon Flare Mesh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none -z-0">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]"/>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[140px]"/>
        <div className="absolute bottom-20 left-1/3 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[140px]"/>
      </div>

      <Navbar />

      <main className="flex-1 w-full pt-8 md:pt-10 pb-24 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          
          <Link to="/societies" className="inline-flex items-center gap-2 text-slate-400 hover:text-purple-400 font-bold uppercase tracking-widest text-[10px] transition-colors mb-10">
            <ArrowLeft size={14}/> Back to Societies
          </Link>

          {/* HERO SECTION */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mb-14 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-[#00142e]/90 via-[#000e24]/90 to-[#000814]/95 backdrop-blur-2xl p-8 md:p-16 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
              <Layers size={320} className="text-purple-500"/>
            </div>
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start lg:items-center justify-between">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-[11px] font-black uppercase tracking-wider mb-5">
                  <Sparkles size={13} className="text-purple-400"/>
                  <span>Official IEEE Affinity Group</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white mb-6 leading-tight">
                  IEEE Women in Engineering <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">(WIE)</span>
                </h1>

                <div className="h-[2px] w-20 bg-gradient-to-r from-purple-400 to-pink-500 mb-6"/>

                <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-3xl">
                  <strong className="text-white">IEEE Women in Engineering (WIE)</strong> is a global network of IEEE members and volunteers dedicated to promoting women engineers and scientists and inspiring girls around the world to follow their academic interests in a career in engineering and science.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link to="/societies/office-bearers?society=wie" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-[1.02]">
                    <Crown size={14}/>
                    <span>Office Bearers</span>
                  </Link>
                  <a href="https://wie.ieee.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition backdrop-blur-md">
                    <span>Global WIE</span>
                    <ExternalLink size={14}/>
                  </a>
                  <a href="https://ieee.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition backdrop-blur-md">
                    <span>About IEEE</span>
                    <Globe2 size={14}/>
                  </a>
                </div>
              </div>
              
              {/* Quick Info Glass Tile */}
              <div className="w-full lg:w-[320px] shrink-0 rounded-2xl border border-purple-500/30 bg-[#000814]/90 backdrop-blur-2xl p-7 shadow-xl">
                <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-5">Chapter Impact</p>
                <div className="space-y-5">
                  <div>
                    <p className="text-3xl font-black text-white">120+</p>
                    <p className="text-xs text-slate-400 font-bold">Active Student &amp; Professional Members</p>
                  </div>
                  <div className="h-[1px] w-full bg-white/10"/>
                  <div>
                    <p className="text-3xl font-black text-purple-400">15+</p>
                    <p className="text-xs text-slate-400 font-bold">Annual STEM &amp; Leadership Programs</p>
                  </div>
                  <div className="h-[1px] w-full bg-white/10"/>
                  <div>
                    <p className="text-3xl font-black text-pink-400">100%</p>
                    <p className="text-xs text-slate-400 font-bold">Inclusive Engineering Advocacy</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* MISSION & VISION HIGHLIGHT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} className="rounded-3xl border border-white/10 bg-[#001026]/90 p-8 shadow-2xl backdrop-blur-2xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-400/30 flex items-center justify-center mb-5">
                <Target size={24}/>
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">The WIE Mission</h3>
              <p className="text-slate-300 text-sm leading-relaxed font-normal">
                To inspire women and girls worldwide in STEM fields, fostering technological innovation and excellence for the benefit of humanity.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} className="rounded-3xl border border-white/10 bg-[#001026]/90 p-8 shadow-2xl backdrop-blur-2xl">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-400/30 flex items-center justify-center mb-5">
                <Compass size={24}/>
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">The WIE Vision</h3>
              <p className="text-slate-300 text-sm leading-relaxed font-normal">
                To be globally recognized for its contributions in broadening and inspiring participation in STEM fields.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} className="rounded-3xl border border-white/10 bg-[#001026]/90 p-8 shadow-2xl backdrop-blur-2xl">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center mb-5">
                <Globe2 size={24}/>
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">About IEEE</h3>
              <p className="text-slate-300 text-sm leading-relaxed font-normal">
                <a href="https://ieee.org/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 font-bold hover:underline">IEEE</a> is the world’s largest technical professional organization dedicated to advancing technology for the benefit of humanity.
              </p>
            </motion.div>
          </div>

          {/* INTERACTIVE WORKSPACE TABS */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 bg-[#00122a]/80 backdrop-blur-2xl rounded-2xl border border-white/10 mb-8 sm:mb-12 shadow-inner w-fit mx-auto max-w-full">
            {[
            {
                id: "overview",
                label: "Overview & About",
                icon: Sparkles,
                activeColor: "bg-purple-700 text-white shadow-purple-900/30",
                idleColor: "text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-400/20",
                iconActive: "text-purple-200",
                iconIdle: "text-purple-400",
            },
            {
                id: "governance",
                label: "Governance & Brand",
                icon: Shield,
                activeColor: "bg-indigo-600 text-white shadow-indigo-700/30",
                idleColor: "text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-400/20",
                iconActive: "text-indigo-200",
                iconIdle: "text-indigo-400",
            },
            {
                id: "initiatives",
                label: "Key Functions & Goals",
                icon: Target,
                activeColor: "bg-pink-600 text-white shadow-pink-600/30",
                idleColor: "text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-400/20",
                iconActive: "text-pink-200",
                iconIdle: "text-pink-400",
            },
            {
                id: "faqs",
                label: "FAQs",
                icon: HelpCircle,
                activeColor: "bg-teal-600 text-white shadow-teal-700/30",
                idleColor: "text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-400/20",
                iconActive: "text-teal-200",
                iconIdle: "text-teal-400",
            },
            {
                id: "office bearers",
                label: "Office Bearers",
                isOfficeBearer: true,
                icon: Crown,
                activeColor: "bg-[#78237b] text-white shadow-purple-950/30 ring-2 ring-purple-500/30",
                idleColor: "text-purple-300 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 font-black",
                iconActive: "text-amber-300",
                iconIdle: "text-purple-300",
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
              <motion.div initial={{ scaleX: 0, opacity: 1 }} animate={{ scaleX: 1, opacity: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#78237b] to-transparent mb-8 origin-center"/>

              {activeTab === "office bearers" ? (<SocietyOfficeBearers societyName="IEEE Women in Engineering (WIE)"/>) : activeTab === "overview" ? (<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl">
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
                        About IEEE Women in Engineering
                      </h3>
                      <p className="text-slate-300 leading-relaxed font-normal mb-6">
                        IEEE Women in Engineering (WIE) envisions a vibrant community of IEEE women and men innovating the world of tomorrow. Our affinity group at Sri Ramakrishna Engineering College facilitates the recruitment and retention of women in STEM programs while supporting their educational and professional growth.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                        <a href="https://wie.ieee.org/about/#5e90682ad929c4a14" target="_blank" rel="noopener noreferrer" className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-400/40 transition group">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-white text-sm group-hover:text-purple-300 transition">
                              IEEE WIE Functions
                            </span>
                            <ExternalLink size={14} className="text-purple-400 group-hover:translate-x-0.5 transition-transform"/>
                          </div>
                          <p className="text-xs text-slate-400">
                            Explore the core pillars and operational functions governing WIE groups globally.
                          </p>
                        </a>

                        <a href="https://wie.ieee.org/about/#913d8d3bc00f92b96" target="_blank" rel="noopener noreferrer" className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-pink-400/40 transition group">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-white text-sm group-hover:text-pink-300 transition">
                              IEEE WIE Strives To
                            </span>
                            <ExternalLink size={14} className="text-pink-400 group-hover:translate-x-0.5 transition-transform"/>
                          </div>
                          <p className="text-xs text-slate-400">
                            Discover our strategic commitments toward diversity, mentorship, and inclusion in technology.
                          </p>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Callouts */}
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#00142e] to-[#000814] text-white p-8 shadow-2xl backdrop-blur-2xl">
                      <Users className="text-purple-400 mb-5" size={28}/>
                      <h3 className="font-bold text-white mb-2 text-lg">Join the WIE Community</h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-6">
                        Become part of a supportive network of women engineers, leaders, and scientists at SREC.
                      </p>
                      <Link to="/join" className="group flex items-center justify-between w-full pb-3 border-b border-white/20 text-xs font-black uppercase tracking-wider hover:border-purple-400 transition-colors text-purple-300">
                        <span>Submit Membership Form</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                      </Link>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-[#001026]/90 text-white p-8 shadow-2xl backdrop-blur-2xl">
                      <Heart className="text-pink-400 mb-5" size={28}/>
                      <h3 className="font-bold text-white mb-2 text-lg">WIE Affinity Chapter</h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-4">
                        Recognized student chapter under IEEE Madras Section empowering future tech innovators.
                      </p>
                      <a href="https://wie.ieee.org/about/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-purple-400 hover:underline flex items-center gap-1">
                        <span>Read Global WIE Charter</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>
                  </div>
                </div>) : activeTab === "governance" ? (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Governance Card */}
                  <div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-10 shadow-2xl flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-400/30 flex items-center justify-center mb-4">
                        <Shield size={20}/>
                      </div>
                      <h3 className="text-xl font-bold font-serif text-white mb-3">Governance</h3>
                      <p className="text-slate-300 text-sm leading-relaxed font-normal mb-6">
                        The IEEE Women in Engineering Committee (WIEC) is a committee of the IEEE Member and Geographic Activities (MGA) Board, reporting through the MGA Member Engagement and Life Cycle Committee (MELCC).
                      </p>
                    </div>
                    <a href="https://wie.ieee.org/about/governance/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition hover:underline">
                      <span>Read More</span>
                      <ExternalLink size={13}/>
                    </a>
                  </div>

                  {/* WIE Committee Card */}
                  <div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-10 shadow-2xl flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 flex items-center justify-center mb-4">
                        <Users size={20}/>
                      </div>
                      <h3 className="text-xl font-bold font-serif text-white mb-3">WIE Committee</h3>
                      <p className="text-slate-300 text-sm leading-relaxed font-normal mb-6">
                        The IEEE Women in Engineering Committee (WIEC) is a committee of the IEEE Member and Geographic Activities (MGA) Board, reporting through the MGA Member Engagement and Life Cycle Committee (MELCC).
                      </p>
                    </div>
                    <a href="https://wie.ieee.org/about/wie-committee/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition hover:underline">
                      <span>Read More</span>
                      <ExternalLink size={13}/>
                    </a>
                  </div>

                  {/* IEEE WIE Brand Card */}
                  <div className="md:col-span-2 rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-400/30 flex items-center justify-center mb-4">
                        <Palette size={20}/>
                      </div>
                      <h3 className="text-xl font-bold font-serif text-white mb-2">IEEE WIE Brand</h3>
                      <p className="text-slate-300 text-sm leading-relaxed font-normal max-w-3xl">
                        In order to maximize the ability for the IEEE Women in Engineering (WIE) brand to effectively reach all audiences, we must ensure that all materials maintain a consistent “look” and feel across digital and print collateral.
                      </p>
                    </div>
                    <a href="https://wie.ieee.org/about/ieee-wie-brand/" target="_blank" rel="noopener noreferrer" className="shrink-0 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md">
                      <span>Read Brand Guidelines</span>
                    </a>
                  </div>
                </div>) : activeTab === "initiatives" ? (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 shadow-2xl">
                    <Award size={28} className="text-purple-400 mb-4"/>
                    <h4 className="font-serif text-xl font-bold text-white mb-2">STAR Program Mentorship</h4>
                    <p className="text-slate-300 text-sm leading-relaxed font-normal">
                      Student-Teacher and Research Engineer/Scientist (STAR) program encouraging high school girls to discover STEM opportunities.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 shadow-2xl">
                    <Sparkles size={28} className="text-pink-400 mb-4"/>
                    <h4 className="font-serif text-xl font-bold text-white mb-2">International Women's Day Summit</h4>
                    <p className="text-slate-300 text-sm leading-relaxed font-normal">
                      Annual flagship symposium bringing distinguished women leaders in aerospace, VLSI, AI, and biomedical engineering.
                    </p>
                  </div>
                </div>) : (
        /* FAQs TAB */
        <div className="rounded-3xl border border-white/10 bg-[#001026]/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <HelpCircle size={24} className="text-purple-400"/>
                    <h3 className="text-2xl font-serif font-bold text-white">
                      Frequently Asked Questions (FAQs)
                    </h3>
                  </div>
                  <p className="text-slate-300 text-sm font-normal leading-relaxed mb-8">
                    Got a question about WIE? Find answers to common questions regarding membership, society affiliations, leadership grants, and awards below.
                  </p>

                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                      <h5 className="font-bold text-white text-sm mb-1">Who can join IEEE Women in Engineering?</h5>
                      <p className="text-xs text-slate-400 font-normal leading-relaxed">
                        IEEE WIE membership is open to all IEEE members regardless of gender. Both students and professionals passionate about advocating for women in STEM are welcome.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                      <h5 className="font-bold text-white text-sm mb-1">What benefits do WIE student members receive?</h5>
                      <p className="text-xs text-slate-400 font-normal leading-relaxed">
                        Access to IEEE WIE Magazine, leadership travel grants, discounted registration for global WIE International Leadership Summits (ILS), and mentorship networks.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <a href="https://wie.ieee.org/about/faqs/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md">
                      <span>View All Global WIE FAQs</span>
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
export default WiePage;
