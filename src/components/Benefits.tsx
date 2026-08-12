import { Globe, Target, Code, Rocket, ArrowRight, Cpu, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCountUp } from "@/hooks/useCountUp";

const AnimatedNumber = ({ value, suffix = "+" }: { value: number; suffix?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const count = useCountUp(isVisible ? value : 0, 2000);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className="font-serif">
      {count}{suffix}
    </span>
  );
};

const Benefits = () => {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-blue-50/40 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-50/30 rounded-full blur-[120px] pointer-events-none translate-x-1/3 translate-y-1/3 -z-10" />
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          
          {/* Left Column: Introduction and Mini Stats */}
          <div className="lg:col-span-5 flex flex-col justify-between text-left">
             <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs tracking-wider uppercase mb-6 shadow-sm">
                   <Cpu size={12} className="animate-pulse" />
                   Why Join Us
                </span>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                   Unlock Your <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-serif">True Potential</span>
                </h2>
                <p className="text-slate-600 text-base md:text-lg mb-8 leading-relaxed max-w-lg">
                   IEEE SREC is more than a student branch—it's a global launchpad. We equip you with the technical capability, leadership experience, and peer network required to excel in today's tech landscape.
                </p>
             </div>

             {/* Mini Stats Bento Row */}
             <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col justify-center">
                   <span className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-1">
                      <AnimatedNumber value={24} />
                   </span>
                   <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Years Legacy</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col justify-center">
                   <span className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-1">
                      <AnimatedNumber value={500} />
                   </span>
                   <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Members</span>
                </div>
             </div>

             <div>
                <a href="https://www.ieee.org/membership/join/index.html" target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center justify-center gap-4 px-8 py-4 rounded-full bg-slate-900 hover:bg-blue-600 text-white font-bold uppercase tracking-[0.1em] transition-all duration-300 overflow-hidden shadow-lg hover:shadow-blue-500/25 active:scale-95 border border-slate-800 hover:border-blue-600 w-full sm:w-auto">
                   <span className="relative z-10 flex items-center pr-4 border-r border-white/20">Become a Member</span>
                   <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                </a>
             </div>
          </div>

          {/* Right Column: Dynamic Bento Grid of Value Cards */}
          <div className="lg:col-span-7 grid md:grid-cols-2 gap-6 items-stretch">
             
             {/* Card 1: Global Network (Dark Blue Theme) */}
             <div className="group relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#002855] to-[#001530] text-white flex flex-col justify-between min-h-[260px] shadow-lg hover:shadow-blue-900/10 hover:scale-[1.02] transition-all duration-500 border border-[#003875]/30">
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all duration-500 pointer-events-none" />
                <div className="flex justify-between items-start">
                   <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-blue-300">
                      <Globe size={24} />
                   </div>
                   <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-blue-200 border border-white/10 tracking-widest uppercase">Global</span>
                </div>
                <div className="mt-8">
                   <span className="text-3xl font-extrabold text-blue-300 block mb-1">
                      <AnimatedNumber value={400} suffix="K+" />
                   </span>
                   <h3 className="text-xl font-bold text-white mb-2">Global Network</h3>
                   <p className="text-white/60 text-xs leading-relaxed">
                      Connect with thousands of technical professionals, engineers, and researchers worldwide.
                   </p>
                </div>
             </div>

             {/* Card 2: Leadership & Outreach (White Glass Theme) */}
             <div className="group relative overflow-hidden rounded-3xl p-8 bg-white border border-slate-100 flex flex-col justify-between min-h-[260px] shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-500">
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all duration-500 pointer-events-none" />
                <div className="flex justify-between items-start">
                   <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700">
                      <Target size={24} />
                   </div>
                   <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-100 tracking-widest uppercase">Impact</span>
                </div>
                <div className="mt-8">
                   <span className="text-3xl font-extrabold text-slate-800 block mb-1">
                      <AnimatedNumber value={2000} />
                   </span>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">Leadership & Outreach</h3>
                   <p className="text-slate-500 text-xs leading-relaxed">
                      Develop core leadership and collaboration skills by managing massive branch events and STEM initiatives.
                   </p>
                </div>
             </div>

             {/* Card 3: Technical Excellence (White Glass Theme) */}
             <div className="group relative overflow-hidden rounded-3xl p-8 bg-white border border-slate-100 flex flex-col justify-between min-h-[260px] shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-500">
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-500 pointer-events-none" />
                <div className="flex justify-between items-start">
                   <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700">
                      <Code size={24} />
                   </div>
                   <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-100 tracking-widest uppercase">Coding</span>
                </div>
                <div className="mt-8">
                   <span className="text-3xl font-extrabold text-slate-800 block mb-1">
                      <AnimatedNumber value={500} suffix="+" />
                   </span>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">Technical Excellence</h3>
                   <p className="text-slate-500 text-xs leading-relaxed">
                      Gain access to exclusive technical hands-on workshops, hackathons, and IEEE Xtreme challenges.
                   </p>
                </div>
             </div>

             {/* Card 4: Research & Growth (Dark Blue Theme) */}
             <div className="group relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#002855] to-[#001530] text-white flex flex-col justify-between min-h-[260px] shadow-lg hover:shadow-blue-900/10 hover:scale-[1.02] transition-all duration-500 border border-[#003875]/30">
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all duration-500 pointer-events-none" />
                <div className="flex justify-between items-start">
                   <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-blue-300">
                      <Rocket size={24} />
                   </div>
                   <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-blue-200 border border-white/10 tracking-widest uppercase">Career</span>
                </div>
                <div className="mt-8">
                   <span className="text-3xl font-extrabold text-blue-300 block mb-1">
                      <AnimatedNumber value={95} suffix="%" />
                   </span>
                   <h3 className="text-xl font-bold text-white mb-2">Research & Placement</h3>
                   <p className="text-white/60 text-xs leading-relaxed">
                      Collaborate on papers and publications while preparing for top placement campaigns in global giants.
                   </p>
                </div>
             </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Benefits;
