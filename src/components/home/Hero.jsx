import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Compass, Calendar, Trophy } from "lucide-react";
import img1 from "@/assets/IMG20251015134912.jpg";
import { usePageContent } from "@/hooks/useContent";
// Scan local gallery folders for high-quality background images
const bgModules = import.meta.glob("../../assets/gallery/ieee/*.{jpg,jpeg,png,JPG,JPEG}", {
    eager: true,
});
const selectedHeroBgs = [
    "VISION X GROUP PHOTO 29.08.2025-ENHANCED.png",
    "1.IEEE Day 2023 Event group photo.jpg",
    "3. IEEE Student Branch Inaguration on Advancing Technology for Humanity - group photo on 01.09.2023.jpg",
    "IEEE Day 1.jpg",
    "IEEE Day 2.jpg",
    "IMG_1836.JPG",
    "IMG_1948.JPG"
];
const parsedBgUrls = Object.entries(bgModules)
    .filter(([path]) => {
    const fileName = path.split("/").pop() || "";
    return selectedHeroBgs.includes(fileName);
})
    .map(([_, module]) => module.default);
const images = parsedBgUrls.length > 0 ? parsedBgUrls : [img1];
const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { data: content } = usePageContent("landing");
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1));
        }, 6000);
        return () => clearInterval(interval);
    }, []);
    return (<section id="home" className="relative w-full min-h-[100svh] flex flex-col justify-center overflow-hidden bg-[#000a18] selection:bg-cyan-500 selection:text-black">

         {/* Background Image Carousel */}
         <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
            <AnimatePresence mode="popLayout">
               <motion.div key={currentIndex} initial={{ opacity: 0, scale: 1.08, filter: "blur(10px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 1.5 } }} transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${images[currentIndex % images.length]})` }}/>
            </AnimatePresence>
            {/* Multi-layered gradient overlays — clear content contrast on mobile & desktop */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#000814]/90 via-[#000d20]/75 to-[#000814]/95 z-10 pointer-events-none"/>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,8,20,0.65)_100%)] z-10 pointer-events-none"/>
            {/* Ambient colorful neon light flares */}
            <div className="absolute top-1/4 -left-20 w-80 sm:w-96 h-80 sm:h-96 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none z-10"/>
            <div className="absolute bottom-1/4 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none z-10"/>
         </div>

         {/* Main Hero Container */}
         <div className="relative z-20 w-full h-full flex flex-col xl:flex-row items-center xl:justify-between max-w-[1400px] mx-auto px-4 sm:px-8 xl:px-12 pt-44 sm:pt-48 xl:pt-56 pb-12 sm:pb-16">
            {/* Content Column */}
            <div className="flex flex-col items-center xl:items-start text-center xl:text-left xl:w-[58%] w-full justify-center h-full xl:h-auto pb-4 sm:pb-6">
               
               {/* Live Institutional Badge */}
               <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 backdrop-blur-md mb-4 shadow-[0_0_20px_rgba(0,210,255,0.15)]">
                  <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-cyan-300 uppercase tracking-widest">
                     IEEE Student Branch • STB32131
                  </span>
               </motion.div>

               {/* Main Headline */}
               <div className="overflow-hidden mb-3 w-full">
                  <motion.h1 initial={{ y: "100%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }} className="text-[2.3rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[6.5rem] font-extrabold text-white tracking-tight leading-[1.08] font-heading">
                     {content?.hero_title || "Pioneering Innovation"}
                     <span className="block bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300 bg-clip-text text-transparent italic drop-shadow-[0_4px_24px_rgba(0,210,255,0.4)] mt-0.5">
                        For Humanity
                     </span>
                  </motion.h1>
               </div>

               {/* Accent line */}
               <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ duration: 1.2, delay: 0.6 }} className="h-[2.5px] w-20 sm:w-32 bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent my-3 sm:my-4 origin-left xl:self-start self-center rounded-full"/>

               {/* Description */}
               <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.75 }} className="text-slate-200/90 text-xs sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 max-w-xl font-normal">
                  {content?.hero_desc || "Empowering engineers, researchers, and tech pioneers at Sri Ramakrishna Engineering College to create sustainable impact through advanced technology research and leadership."}
               </motion.p>

               {/* CTA Buttons */}
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.9 }} className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-md xl:max-w-none xl:w-auto">
                  <a href="/about" className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-slate-950 font-black text-xs sm:text-sm tracking-widest uppercase shadow-[0_0_30px_rgba(0,210,255,0.45)] hover:shadow-[0_0_45px_rgba(0,210,255,0.65)] hover:scale-[1.02] transition-all duration-300 active:scale-95 group">
                     Explore Branch
                     <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                  </a>
                  <a href="/membership-registration" className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 backdrop-blur-md active:scale-95 hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(255,255,255,0.15)]">
                     Join IEEE
                  </a>
               </motion.div>
            </div>

            {/* Floating Glass Dashboard Card */}
            <motion.div initial={{ opacity: 0, x: 50, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col w-full xl:w-[40%] bg-gradient-to-b from-[#001633]/90 via-[#001026]/90 to-[#000a18]/95 backdrop-blur-2xl border border-cyan-500/35 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,10,25,0.85)] relative overflow-hidden group shrink-0 mt-10 xl:mt-0">
               <div className="absolute -top-12 -right-12 w-44 h-44 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-all duration-700 pointer-events-none"/>
               <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/30 transition-all duration-700 pointer-events-none"/>

               <div className="relative z-10 flex flex-col gap-5">
                  <div className="text-left">
                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold text-xs tracking-wider uppercase border border-cyan-500/30 mb-3 shadow-[0_0_15px_rgba(0,210,255,0.2)]">
                        <Sparkles size={12} className="animate-pulse"/>
                        Explore. Experiment. Evolve.
                     </span>
                     <h3 className="text-2xl font-heading font-bold text-white tracking-tight">IEEE SREC Portal</h3>
                     <p className="text-slate-400 text-xs mt-1 font-mono">College Code: 41347756 | Branch: 61491</p>
                  </div>

                  <div className="h-[1px] w-full bg-white/10"/>

                  {/* Single Row Stats Box */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                     {[
            { value: "500+", label: "Student Members" },
            { value: "50+", label: "Annual Events" },
            { value: "12+", label: "National Awards" },
            { value: "7", label: "Special Societies" }
        ].map((stat, i) => (<div key={i} className="py-3 px-1.5 rounded-2xl bg-[#000a18]/90 border border-cyan-500/30 backdrop-blur-md text-center shadow-lg hover:border-cyan-400/60 transition-all flex flex-col items-center justify-center min-w-0">
                           <p className="text-xl sm:text-2xl font-black text-cyan-300 tracking-tight leading-none mb-1 font-heading truncate w-full">
                              {stat.value}
                           </p>
                           <p className="text-[9px] sm:text-[10px] font-bold text-slate-200 uppercase tracking-wider leading-tight w-full">
                              {stat.label}
                           </p>
                        </div>))}
                  </div>

                  <div className="h-[1px] w-full bg-white/10"/>

                  <div className="flex flex-col gap-3 text-left">
                     <a href="http://aectsd2027.srecieee.org/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/35 hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400 transition-all duration-300 group/item">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 group-hover/item:scale-110 transition-transform">
                              <Sparkles size={20} className="animate-pulse text-cyan-400"/>
                           </div>
                           <div>
                              <p className="text-sm font-bold text-white flex items-center gap-1.5">
                                 AECTSD 2027
                                 <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase leading-none animate-bounce">NEW</span>
                              </p>
                              <p className="text-xs text-cyan-200/80 font-medium">International Conference</p>
                           </div>
                        </div>
                        <ArrowRight size={16} className="text-cyan-300 group-hover/item:translate-x-1 group-hover/item:text-white transition-all"/>
                     </a>

                     <a href="/societies" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group/item">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-300 group-hover/item:scale-105 transition-transform">
                              <Compass size={20}/>
                           </div>
                           <div>
                              <p className="text-sm font-semibold text-white">Technical Societies</p>
                              <p className="text-xs text-slate-400">12+ Special Interest Groups</p>
                           </div>
                        </div>
                        <ArrowRight size={16} className="text-slate-400 group-hover/item:translate-x-1 group-hover/item:text-white transition-all"/>
                     </a>

                     <a href="/activities" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group/item">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 group-hover/item:scale-105 transition-transform">
                              <Calendar size={20}/>
                           </div>
                           <div>
                              <p className="text-sm font-semibold text-white">Branch Activities</p>
                              <p className="text-xs text-slate-400">Workshops, Hackathons & Seminars</p>
                           </div>
                        </div>
                        <ArrowRight size={16} className="text-slate-400 group-hover/item:translate-x-1 group-hover/item:text-white transition-all"/>
                     </a>

                     <a href="/awards" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group/item">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300 group-hover/item:scale-105 transition-transform">
                              <Trophy size={20}/>
                           </div>
                           <div>
                              <p className="text-sm font-semibold text-white">Achievements & Awards</p>
                              <p className="text-xs text-slate-400">Recognitions & Benchmarks</p>
                           </div>
                        </div>
                        <ArrowRight size={16} className="text-slate-400 group-hover/item:translate-x-1 group-hover/item:text-white transition-all"/>
                     </a>
                  </div>
               </div>
            </motion.div>
         </div>
      </section>);
};
export default Hero;
