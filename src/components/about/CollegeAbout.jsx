import { useState } from "react";
import { BookOpen, Trophy, Target, Building, Sparkles, GraduationCap, MapPin } from "lucide-react";
import srecLogo from "@/assets/srec-logo.png";
import srecCampus from "@/assets/srec-campus.png";
import { motion, AnimatePresence } from "framer-motion";
const features = [
    {
        id: "campus",
        icon: Building,
        title: "Established Campus",
        desc: "A lush 45-acre green campus equipped with state-of-the-art infrastructure, a massive central library, and high-tech modern laboratories.",
        stat: "45 Acres",
        color: "from-emerald-500 to-teal-600",
        glow: "shadow-emerald-500/10 border-emerald-100 bg-emerald-50 text-emerald-600"
    },
    {
        id: "vision",
        icon: Target,
        title: "Visionary Goals",
        desc: "Committed to producing world-class engineers through quality education, applied research, and an industry-oriented curriculum bridging the technology gap.",
        stat: "Global Standards",
        color: "from-blue-600 to-indigo-600",
        glow: "shadow-blue-500/10 border-blue-100 bg-blue-50 text-blue-600"
    },
    {
        id: "academic",
        icon: BookOpen,
        title: "Academic Excellence",
        desc: "Offering a wide range of NBA accredited undergraduate and postgraduate programs across advanced engineering disciplines.",
        stat: "15+ Programs",
        color: "from-purple-500 to-violet-600",
        glow: "shadow-purple-500/10 border-purple-100 bg-purple-50 text-purple-600"
    },
    {
        id: "awards",
        icon: Trophy,
        title: "Awards & Recognition",
        desc: "Consistent top-tier national ranks for exceptional academic performance, robust placements, and cutting-edge research grants.",
        stat: "Top Rankings",
        color: "from-amber-500 to-orange-600",
        glow: "shadow-amber-500/10 border-amber-100 bg-amber-50 text-amber-600"
    },
];
const CollegeAbout = () => {
    const [hoveredFeature, setHoveredFeature] = useState("campus");
    const activeFeature = features.find(f => f.id === hoveredFeature) || features[0];
    return (<section id="college" className="py-8 sm:py-16 md:py-24 scroll-mt-24 relative overflow-hidden bg-slate-50/50">
      
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-white -skew-x-12 translate-x-32 -z-10"/>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-100/30 rounded-full blur-[120px] pointer-events-none -z-10"/>

      <div className="max-w-[1400px] mx-auto px-3.5 sm:px-6 md:px-12 relative z-10">
        
        {/* Header Title */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-3 sm:gap-6 mb-8 sm:mb-16 text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-[10px] sm:text-xs tracking-wider uppercase mb-2.5 sm:mb-4 shadow-sm">
              <GraduationCap size={13} className="animate-pulse"/>
              <span>Our Institution</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
              Sri Ramakrishna <br className="hidden sm:inline"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-heading">Engineering College</span>
            </h2>
          </div>
          <div className="max-w-md text-slate-600 leading-relaxed text-xs sm:text-sm md:text-base lg:text-right lg:pb-2">
            Established in 1994 by the <span className="font-bold text-slate-900">SNR Sons Charitable Trust</span>. SREC has grown into an eminent institution of international standards, empowering technical innovators.
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-5 lg:gap-12 items-center">
          
          {/* Left Column: Interactive Spotlight Showcase with Campus Image (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-stretch">
            <div className="relative aspect-square sm:aspect-[4/5] lg:aspect-square bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden group text-center min-h-[300px] sm:min-h-[440px]">
              
              {/* College Campus Background Image */}
              <motion.div key="campus-img" className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105" style={{ backgroundImage: `url(${srecCampus})` }}/>

              {/* Dark Gradient Overlay for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30 z-10 pointer-events-none"/>

              {/* Dynamic color glow overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${activeFeature.color} opacity-20 transition-all duration-700 pointer-events-none z-10`}/>

              {/* Card Content Overlay */}
              <div className="relative z-20 h-full p-4 sm:p-8 flex flex-col justify-between items-center text-center">
                
                {/* Floating SREC Logo Badge */}
                <div className="w-full flex justify-between items-center">
                  <div className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                    <Building size={11} className="text-cyan-400"/> SREC Campus
                  </div>
                  <div className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-400/40 text-cyan-300 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest">
                    Est. 1994
                  </div>
                </div>

                {/* SREC Crest Logo */}
                <div className="my-auto flex flex-col items-center">
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="mb-3 sm:mb-6 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/90 backdrop-blur-md border border-white shadow-2xl">
                    <img src={srecLogo} alt="SREC Emblem" className="h-16 sm:h-28 md:h-32 object-contain"/>
                  </motion.div>
                  
                  {/* Dynamic Active Stat */}
                  <div className="h-14 sm:h-20 w-full flex items-center justify-center relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div key={activeFeature.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-white font-heading font-black tracking-tight text-xl sm:text-4xl drop-shadow-md">
                          {activeFeature.stat}
                        </span>
                        <span className="text-cyan-300 uppercase tracking-widest text-[9px] sm:text-[10px] font-extrabold mt-0.5 sm:mt-1 flex items-center gap-1.5 drop-shadow">
                          <Sparkles size={10} className="fill-cyan-400 text-cyan-400 animate-spin-slow"/> {activeFeature.title}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Decorative Location Footer Tag */}
                <div className="w-full border-t border-white/15 pt-2.5 sm:pt-4 flex items-center justify-center gap-1.5 text-slate-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
                  <MapPin size={11} className="text-cyan-400"/> Coimbatore, TN, India
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Interactive Detail Stack (col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-2.5 sm:gap-4 text-left">
            {features.map((f) => {
            const isHovered = hoveredFeature === f.id;
            const Icon = f.icon;
            return (<div key={f.id} onMouseEnter={() => setHoveredFeature(f.id)} onClick={() => setHoveredFeature(f.id)} className={`p-4 sm:p-7 rounded-xl sm:rounded-3xl border transition-all duration-300 ease-out cursor-pointer flex gap-3.5 sm:gap-6 relative overflow-hidden ${isHovered
                    ? 'bg-white shadow-md border-slate-200 scale-[1.01] translate-x-0.5 sm:translate-x-1'
                    : 'bg-white/60 border-slate-200/60 hover:bg-white/90'}`}>
                  {/* Left border stripe on active item */}
                  <div className={`absolute left-0 top-0 bottom-0 w-[3px] sm:w-[4px] bg-gradient-to-b ${f.color} transition-transform duration-300 ${isHovered ? 'scale-y-100' : 'scale-y-0'}`}/>

                  <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 ${isHovered ? f.glow + ' shadow-md scale-105' : 'bg-slate-100 text-slate-500 border-slate-200/50'}`}>
                    <Icon size={18} className="sm:w-[22px] sm:h-[22px]"/>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`text-sm sm:text-lg font-bold mb-1 sm:mb-2 transition-colors duration-300 ${isHovered ? 'text-blue-600' : 'text-slate-800'}`}>
                      {f.title}
                    </h3>
                    <p className={`text-[11px] sm:text-sm leading-relaxed transition-all duration-300 ${isHovered ? 'text-slate-700' : 'text-slate-500'}`}>
                      {f.desc}
                    </p>
                  </div>
                </div>);
        })}
          </div>

        </div>

      </div>
    </section>);
};
export default CollegeAbout;
