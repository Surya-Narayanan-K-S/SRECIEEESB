import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Compass, Calendar, Trophy, ShieldCheck, Zap, Globe, Users, ArrowUpRight } from "lucide-react";
import img1 from "@/assets/IMG20251015134912.jpg";
import { usePageContent } from "@/hooks/useContent";
import { Link } from "react-router-dom";

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
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
      <section id="home" className="relative w-full min-h-[100svh] flex flex-col justify-center overflow-hidden bg-[#000814] selection:bg-cyan-500 selection:text-black">
        {/* Background Image Carousel with Ultra-Deep Cinematic Overlays */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.08, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(12px)", transition: { duration: 1.5 } }}
              transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${images[currentIndex % images.length]})` }}
            />
          </AnimatePresence>

          {/* Multi-layered cinematic gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#000814]/95 via-[#000d20]/80 to-[#000814] z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,8,20,0.85)_100%)] z-10 pointer-events-none" />
          
          {/* Ambient Cosmic Aurora Mesh Flares */}
          <div className="absolute top-1/4 -left-24 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-cyan-500/20 rounded-full blur-[140px] pointer-events-none z-10 animate-blob" />
          <div className="absolute bottom-1/4 right-0 w-96 sm:w-[550px] h-96 sm:h-[550px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none z-10 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none z-10 animate-blob animation-delay-4000" />
        </div>

        {/* Main Hero Content Container */}
        <div className="relative z-20 w-full h-full flex flex-col xl:flex-row items-center xl:justify-between max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 pt-36 sm:pt-44 xl:pt-48 pb-12 sm:pb-16 gap-10">
          
          {/* Left Column: Brand, Headline, Value Props & Actions */}
          <div className="flex flex-col items-center xl:items-start text-center xl:text-left xl:w-[56%] w-full justify-center">
            
            {/* Live Status Telemetry Chip */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl mb-5 shadow-[0_0_25px_rgba(0,210,255,0.2)] hover:border-cyan-400/60 transition-colors"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
              </span>
              <span className="text-[11px] sm:text-xs font-black text-cyan-300 uppercase tracking-widest font-mono">
                IEEE STUDENT BRANCH • STB32131
              </span>
              <span className="w-px h-3 bg-white/20" />
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                REGION 10
              </span>
            </motion.div>

            {/* Main Headline */}
            <div className="overflow-hidden mb-4 w-full">
              <motion.h1
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-6xl md:text-7xl xl:text-[6.2rem] font-black text-white tracking-tight leading-[1.04] font-heading"
              >
                {content?.hero_title || "Pioneering Innovation"}
                <span className="block bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300 bg-clip-text text-transparent italic drop-shadow-[0_4px_30px_rgba(0,210,255,0.45)] mt-1">
                  For Humanity
                </span>
              </motion.h1>
            </div>

            {/* Glowing Accent Line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.55 }}
              className="h-[3px] w-24 sm:w-36 bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent my-3 origin-left xl:self-start self-center rounded-full shadow-[0_0_15px_rgba(0,210,255,0.6)]"
            />

            {/* Subtitle Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-xl font-normal"
            >
              {content?.hero_desc || "Empowering engineers, researchers, and tech pioneers at Sri Ramakrishna Engineering College to create global impact through research, symposiums, hackathons, and technical leadership."}
            </motion.p>

            {/* Dual CTA Button Cluster */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.85 }}
              className="flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-xs sm:max-w-md xl:max-w-none xl:w-auto"
            >
              <Link
                to="/about"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 text-slate-950 font-black text-xs sm:text-sm tracking-widest uppercase shadow-[0_0_35px_rgba(0,210,255,0.5)] hover:shadow-[0_0_50px_rgba(0,210,255,0.75)] hover:scale-[1.03] transition-all duration-300 active:scale-95 group cursor-pointer"
              >
                <span>Explore Branch</span>
                <ArrowRight size={17} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>

              <Link
                to="/membership-registration"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 backdrop-blur-xl active:scale-95 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,210,255,0.25)] cursor-pointer"
              >
                <Sparkles size={16} className="text-amber-400 animate-pulse" />
                <span>Join IEEE SREC</span>
              </Link>
            </motion.div>

            {/* Micro Badge Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.0 }}
              className="flex flex-wrap items-center justify-center xl:justify-start gap-4 sm:gap-6 mt-8 pt-6 border-t border-white/10 text-xs font-semibold text-slate-400"
            >
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>24+ Years Legacy</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Users size={16} className="text-cyan-400" />
                <span>500+ Active Members</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Globe size={16} className="text-amber-400" />
                <span>8 Technical Chapters</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive 3D Holographic Portal Card */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col w-full xl:w-[42%] bg-gradient-to-b from-[#00142e]/90 via-[#000d20]/95 to-[#000814]/98 backdrop-blur-2xl border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(0,210,255,0.2)] relative overflow-hidden group shrink-0"
          >
            {/* Ambient Corner Aura */}
            <div className="absolute -top-16 -right-16 w-52 h-52 bg-cyan-500/25 rounded-full blur-3xl group-hover:bg-cyan-500/40 transition-all duration-700 pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-blue-600/25 rounded-full blur-3xl group-hover:bg-blue-600/40 transition-all duration-700 pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-5">
              {/* Header Box */}
              <div className="flex items-start justify-between">
                <div className="text-left">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs tracking-wider uppercase border border-cyan-400/40 mb-2 shadow-[0_0_15px_rgba(0,210,255,0.25)]">
                    <Sparkles size={13} className="animate-pulse text-amber-400" />
                    Official Portal Hub
                  </span>
                  <h3 className="text-2xl font-heading font-black text-white tracking-tight">
                    IEEE SREC Ecosystem
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5 font-mono">
                    School Code: 41347756 • Branch: 61491
                  </p>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-inner">
                  <Zap size={20} className="animate-bounce" />
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-cyan-500/40 via-white/20 to-transparent" />

              {/* 4-Stat Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { value: "500+", label: "Members", color: "text-cyan-300" },
                  { value: "50+", label: "Events/Yr", color: "text-sky-300" },
                  { value: "12+", label: "Awards", color: "text-amber-300" },
                  { value: "8", label: "Societies", color: "text-emerald-300" }
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="py-3 px-2 rounded-2xl bg-[#000814]/90 border border-cyan-500/30 backdrop-blur-md text-center shadow-lg hover:border-cyan-400/70 hover:scale-105 transition-all flex flex-col items-center justify-center"
                  >
                    <p className={`text-xl sm:text-2xl font-black ${stat.color} tracking-tight leading-none mb-1 font-heading`}>
                      {stat.value}
                    </p>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider leading-tight">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-cyan-500/40" />

              {/* Quick Jump Action Links */}
              <div className="flex flex-col gap-2.5 text-left">
                {/* AECTSD 2027 International Conference */}
                <a
                  href="http://aectsd2027.srecieee.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-cyan-500/20 border border-amber-400/50 hover:border-amber-300 transition-all duration-300 group/item hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 group-hover/item:scale-110 transition-transform shrink-0">
                      <Sparkles size={18} className="animate-pulse text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-black text-white flex items-center gap-2 truncate">
                        <span>AECTSD 2027</span>
                        <span className="bg-amber-400 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded uppercase leading-none">
                          CONFERENCE
                        </span>
                      </p>
                      <p className="text-[11px] text-amber-200/90 font-medium truncate">
                        International Research Conclave
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-amber-300 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-transform shrink-0" />
                </a>

                {/* Technical Societies */}
                <Link
                  to="/societies"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-cyan-400/40 transition-all duration-300 group/item hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 group-hover/item:scale-110 transition-transform shrink-0">
                      <Compass size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-white">Technical Chapters</p>
                      <p className="text-[11px] text-slate-400 truncate">CS, WIE, PELS, CIS, ComSoc & more</p>
                    </div>
                  </div>
                  <ArrowRight size={15} className="text-slate-400 group-hover/item:text-cyan-300 group-hover/item:translate-x-1 transition-all shrink-0" />
                </Link>

                {/* Student Digital ID Card */}
                <Link
                  to="/student-login"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-cyan-400/40 transition-all duration-300 group/item hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-300 group-hover/item:scale-110 transition-transform shrink-0">
                      <Trophy size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-white">Student Member Portal</p>
                      <p className="text-[11px] text-slate-400 truncate">Digital IEEE Membership ID Card</p>
                    </div>
                  </div>
                  <ArrowRight size={15} className="text-slate-400 group-hover/item:text-cyan-300 group-hover/item:translate-x-1 transition-all shrink-0" />
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    );
};

export default Hero;
