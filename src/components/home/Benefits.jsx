import { Globe, Target, Code, Rocket, ArrowRight, Cpu, Sparkles, Award, Users, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";
import { Link } from "react-router-dom";

const AnimatedNumber = ({ value, suffix = "+" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);
    const count = useCountUp(isVisible ? value : 0, 2000);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => observer.disconnect();
    }, []);
    return (
      <span ref={ref} className="font-heading font-black">
        {count}{suffix}
      </span>
    );
};

const Benefits = () => {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
        {/* Ambient background light orbs */}
        <div className="absolute top-1/4 left-0 w-[550px] h-[550px] bg-cyan-200/20 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-300/15 rounded-full blur-[140px] pointer-events-none translate-x-1/3 translate-y-1/3 -z-10" />
        
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            
            {/* Left Column: Introduction & Interactive Stat Pills */}
            <div className="lg:col-span-5 flex flex-col justify-between text-left">
               <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-800 font-extrabold text-xs tracking-widest uppercase mb-5 shadow-xs">
                     <Sparkles size={13} className="text-cyan-600 animate-pulse" />
                     <span>Why Join IEEE SREC</span>
                  </div>
                  <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                     Unlock Your <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-cyan-600 to-teal-500 font-heading">
                        True Potential
                     </span>
                  </h2>
                  <p className="text-slate-600 text-base md:text-lg mb-8 leading-relaxed max-w-lg font-normal">
                     IEEE SREC is more than a student branch—it's a high-performance launchpad. We equip you with hands-on technical mastery, international leadership experience, and an elite alumni network.
                  </p>
               </div>

               {/* Mini Stats Bento Row */}
               <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white border-2 border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-cyan-300/50 transition-all flex flex-col justify-center">
                     <span className="text-3xl md:text-4xl font-black text-slate-900 mb-1">
                        <AnimatedNumber value={24} suffix="+" />
                     </span>
                     <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Years Legacy</span>
                  </div>
                  <div className="bg-white border-2 border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-cyan-300/50 transition-all flex flex-col justify-center">
                     <span className="text-3xl md:text-4xl font-black text-slate-900 mb-1">
                        <AnimatedNumber value={500} suffix="+" />
                     </span>
                     <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Members</span>
                  </div>
               </div>

               <div>
                  <Link
                    to="/membership-registration"
                    className="group relative inline-flex items-center justify-center gap-4 px-8 py-4 rounded-full bg-slate-950 hover:bg-blue-600 text-white font-black text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-xl hover:shadow-blue-500/30 active:scale-95 border border-slate-800 hover:border-blue-500 w-full sm:w-auto cursor-pointer"
                  >
                     <span className="relative z-10 flex items-center pr-4 border-r border-white/20">Become a Member</span>
                     <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1.5 transition-transform" />
                  </Link>
               </div>
            </div>

            {/* Right Column: 4 Dynamic Bento Cards with Modern Glow */}
            <div className="lg:col-span-7 grid md:grid-cols-2 gap-6 items-stretch">
               
               {/* Card 1: Global Network (Deep Cyber Blue) */}
               <motion.div
                 whileHover={{ y: -6, scale: 1.01 }}
                 transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                 className="group relative overflow-hidden rounded-3xl p-7 bg-gradient-to-br from-[#00142e] via-[#001026] to-[#000814] text-white flex flex-col justify-between min-h-[270px] shadow-xl hover:shadow-cyan-500/20 border-2 border-cyan-500/35"
               >
                  <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl group-hover:bg-cyan-500/35 transition-all duration-500 pointer-events-none" />
                  <div className="flex justify-between items-start">
                     <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-cyan-300 shadow-inner">
                        <Globe size={24} />
                     </div>
                     <span className="text-[10px] font-black px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 tracking-widest uppercase">
                        Worldwide
                     </span>
                  </div>
                  <div className="mt-6">
                     <span className="text-3xl sm:text-4xl font-black text-cyan-300 block mb-1">
                        <AnimatedNumber value={400} suffix="K+" />
                     </span>
                     <h3 className="text-xl font-heading font-extrabold text-white mb-2">Global Network</h3>
                     <p className="text-slate-300 text-xs leading-relaxed">
                        Connect directly with technical professionals, researchers, and global engineering innovators across IEEE Region 10 and beyond.
                     </p>
                  </div>
               </motion.div>

               {/* Card 2: Leadership & Events (Modern White Glass) */}
               <motion.div
                 whileHover={{ y: -6, scale: 1.01 }}
                 transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                 className="group relative overflow-hidden rounded-3xl p-7 bg-white border-2 border-slate-200/90 flex flex-col justify-between min-h-[270px] shadow-sm hover:shadow-xl hover:border-indigo-400/50 transition-all duration-300"
               >
                  <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500 pointer-events-none" />
                  <div className="flex justify-between items-start">
                     <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                        <Target size={24} />
                     </div>
                     <span className="text-[10px] font-black px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 tracking-widest uppercase">
                        Impact
                     </span>
                  </div>
                  <div className="mt-6">
                     <span className="text-3xl sm:text-4xl font-black text-slate-900 block mb-1">
                        <AnimatedNumber value={2000} suffix="+" />
                     </span>
                     <h3 className="text-xl font-heading font-extrabold text-slate-900 mb-2">Leadership & Outreach</h3>
                     <p className="text-slate-600 text-xs leading-relaxed">
                        Develop supreme leadership and governance skills by organizing large-scale international symposiums and flagship conclaves.
                     </p>
                  </div>
               </motion.div>

               {/* Card 3: Technical Excellence (Modern White Glass) */}
               <motion.div
                 whileHover={{ y: -6, scale: 1.01 }}
                 transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                 className="group relative overflow-hidden rounded-3xl p-7 bg-white border-2 border-slate-200/90 flex flex-col justify-between min-h-[270px] shadow-sm hover:shadow-xl hover:border-emerald-400/50 transition-all duration-300"
               >
                  <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500 pointer-events-none" />
                  <div className="flex justify-between items-start">
                     <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                        <Code size={24} />
                     </div>
                     <span className="text-[10px] font-black px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 tracking-widest uppercase">
                        Coding &amp; AI
                     </span>
                  </div>
                  <div className="mt-6">
                     <span className="text-3xl sm:text-4xl font-black text-slate-900 block mb-1">
                        <AnimatedNumber value={50} suffix="+" />
                     </span>
                     <h3 className="text-xl font-heading font-extrabold text-slate-900 mb-2">Technical Mastery</h3>
                     <p className="text-slate-600 text-xs leading-relaxed">
                        Access hands-on masterclasses in Machine Learning, Cloud Architecture, Embedded Robotics, and IEEE Xtreme Coding Competitions.
                     </p>
                  </div>
               </motion.div>

               {/* Card 4: Research & Placements (Deep Cyber Blue) */}
               <motion.div
                 whileHover={{ y: -6, scale: 1.01 }}
                 transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                 className="group relative overflow-hidden rounded-3xl p-7 bg-gradient-to-br from-[#00142e] via-[#001026] to-[#000814] text-white flex flex-col justify-between min-h-[270px] shadow-xl hover:shadow-blue-500/20 border-2 border-cyan-500/35"
               >
                  <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/35 transition-all duration-500 pointer-events-none" />
                  <div className="flex justify-between items-start">
                     <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 shadow-inner">
                        <Rocket size={24} />
                     </div>
                     <span className="text-[10px] font-black px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 tracking-widest uppercase">
                        Career
                     </span>
                  </div>
                  <div className="mt-6">
                     <span className="text-3xl sm:text-4xl font-black text-amber-300 block mb-1">
                        <AnimatedNumber value={96} suffix="%" />
                     </span>
                     <h3 className="text-xl font-heading font-extrabold text-white mb-2">Research &amp; Placement</h3>
                     <p className="text-slate-300 text-xs leading-relaxed">
                        Publish research in IEEE Xplore Digital Library and prepare for premier placements in top multinational technology enterprises.
                     </p>
                  </div>
               </motion.div>

            </div>

          </div>
        </div>
      </section>
    );
};

export default Benefits;
