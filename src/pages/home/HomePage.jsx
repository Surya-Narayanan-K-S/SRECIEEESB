import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Sparkles, Users, X, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Benefits from "@/components/home/Benefits";
import Highlights from "@/components/home/Highlights";
import CollegeAbout from "@/components/about/CollegeAbout";
import Societies from "@/components/societies/Societies";
import Footer from "@/components/layout/Footer";
import TechStack from "@/components/home/TechStack";
import Testimonials from "@/components/home/Testimonials";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// Subtle Parallax Block for moving objects effect
const MovingParallaxBackdrop = () => {
  const { scrollYProgress } = useScroll();
  const yOffset = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#fafafa]">
      <motion.div style={{ y: yOffset }} className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-[20%] -left-[10%] text-[20vw] font-serif font-black whitespace-nowrap leading-none text-slate-900 tracking-tighter mix-blend-multiply">
          INNOVATION
        </div>
        <div className="absolute top-[60%] -right-[5%] text-[15vw] font-serif font-black whitespace-nowrap leading-none text-slate-900 tracking-tighter mix-blend-multiply">
          EXCELLENCE
        </div>
      </motion.div>
    </div>
  );
};

const FadeInSection = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Check if arriving from inauguration and has not already redirected in this session
  const isAutoTourParam = searchParams.get("inaugurated") === "true" || searchParams.get("auto_tour") === "true";
  const hasAlreadyRedirected = typeof window !== "undefined" && sessionStorage.getItem("ieee_inauguration_redirected") === "true";
  const isAutoTour = isAutoTourParam && !hasAlreadyRedirected;

  const [showBanner, setShowBanner] = useState(isAutoTour);
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    if (!isAutoTour || !showBanner) return;

    // Clean URL so refresh won't re-trigger
    if (typeof window !== "undefined") {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("ieee_inauguration_redirected", "true");
          }
          navigate("/office-bearers");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAutoTour, showBanner, navigate]);

  return (
    <div className="min-h-screen relative selection:bg-slate-900 selection:text-white font-sans text-slate-800 bg-[#fafafa]">
      <MovingParallaxBackdrop />

      {/* Inauguration Ceremony Auto Tour Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-2xl bg-slate-950/95 text-white backdrop-blur-2xl border-2 border-amber-400/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(245,158,11,0.3)] p-3.5 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-amber-300">
                  🎉 IEEE SREC Inauguration 2026–2027 Live!
                </div>
                <div className="text-xs font-semibold text-slate-200">
                  Opening Office Bearers page in <span className="text-amber-400 font-black font-mono">{secondsLeft}s</span>...
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/office-bearers")}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1 hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                <span>View Now</span>
                <ChevronRight size={14} />
              </button>

              <button
                onClick={() => setShowBanner(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition cursor-pointer text-xs"
                title="Stay on Home"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />

      <main className="w-full relative pb-0 z-0">
        {/* Full Bleed Hero */}
        <Hero />

        {/* Content Wrapper */}
        <div className="relative z-10 w-full bg-white border-t border-slate-200">
          {/* Unified Bento Grid Highlights & Legacy */}
          <div className="border-b border-slate-200 bg-[#fafafa]">
            <FadeInSection>
              <Benefits />
            </FadeInSection>
          </div>

          <div className="border-t border-slate-200 bg-white">
            <div className="max-w-[1400px] mx-auto px-6 py-2 md:py-3">
              <FadeInSection>
                <Highlights />
              </FadeInSection>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-[#fafafa]">
            <div className="max-w-[1400px] mx-auto px-6 py-4 md:py-6">
              <FadeInSection>
                <CollegeAbout />
              </FadeInSection>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white">
            <div className="py-2 md:py-3">
              <FadeInSection>
                <Societies />
              </FadeInSection>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-[#fafafa]">
            <FadeInSection>
              <TechStack />
            </FadeInSection>
          </div>

          <div className="border-t border-slate-200 bg-white">
            <FadeInSection>
              <Testimonials />
            </FadeInSection>
          </div>

          {/* Contact IEEE Desk CTA */}
          <div className="border-t border-slate-200 bg-white">
            <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-16 text-center">
              <FadeInSection>
                <div className="max-w-2xl mx-auto flex flex-col items-center">
                  <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
                    Have Questions about IEEE SREC?
                  </h2>
                  <p className="text-slate-600 text-base md:text-lg mb-6 leading-relaxed">
                    Connect directly with our branch counselors, chairpersons, and society leads.
                  </p>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#002855] text-white font-bold text-sm hover:bg-[#003875] transition-all shadow-lg active:scale-95"
                  >
                    Contact Student Branch Desk
                  </a>
                </div>
              </FadeInSection>
            </div>
          </div>
        </div>
      </main>

      <div className="relative z-40 bg-slate-900 text-white border-t border-slate-800">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
