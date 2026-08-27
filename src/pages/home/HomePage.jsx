import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Benefits from "@/components/home/Benefits";
import Highlights from "@/components/home/Highlights";
import CollegeAbout from "@/components/about/CollegeAbout";
import Societies from "@/components/societies/Societies";
import Footer from "@/components/layout/Footer";
import ChatBot from "@/components/modals/ChatBot";
import { Bot, Sparkles } from "lucide-react";
import TechStack from "@/components/home/TechStack";
import Testimonials from "@/components/home/Testimonials";
import { motion, useScroll, useTransform } from "framer-motion";
// Subtle Parallax Block for moving objects effect requested
const MovingParallaxBackdrop = () => {
    const { scrollYProgress } = useScroll();
    const yOffset = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
    return (<div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#fafafa]">
      <motion.div style={{ y: yOffset }} className="absolute inset-0 opacity-[0.02]">
        {/* Abstract large typography acting as moving background objects */}
        <div className="absolute top-[20%] -left-[10%] text-[20vw] font-serif font-black whitespace-nowrap leading-none text-slate-900 tracking-tighter mix-blend-multiply">
          INNOVATION
        </div>
        <div className="absolute top-[60%] -right-[5%] text-[15vw] font-serif font-black whitespace-nowrap leading-none text-slate-900 tracking-tighter mix-blend-multiply">
          EXCELLENCE
        </div>
      </motion.div>
    </div>);
};
const FadeInSection = ({ children, delay = 0 }) => (<motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}>
    {children}
  </motion.div>);
const Index = () => {
    return (<div className="min-h-screen relative selection:bg-slate-900 selection:text-white font-sans text-slate-800 bg-[#fafafa]">
      <MovingParallaxBackdrop />
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

          <div className="border-t border-slate-200 bg-white">
            <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-16 text-center">
              <FadeInSection>
                <div className="max-w-2xl mx-auto flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center mb-6 border border-cyan-100 shadow-sm animate-bounce">
                    <Bot size={32} className="text-[#00629b]"/>
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
                    Have Questions about IEEE SREC?
                  </h2>
                  <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                    Our AI-powered assistant, <strong>Nexus</strong>, is ready to answer all your queries in real-time. Click the floating bot icon in the bottom right corner to ask!
                  </p>
                  <button onClick={() => {
            const btn = document.querySelector('[title="Toggle Assistant"]');
            if (btn)
                btn.click();
        }} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-[#00629b] transition-all shadow-md group">
                    Ask Nexus AI
                    <Sparkles size={16} className="text-yellow-300 group-hover:rotate-12 transition-transform"/>
                  </button>
                </div>
              </FadeInSection>
            </div>
          </div>
          
        </div>
      </main>

      <div className="relative z-40 bg-slate-900 text-white border-t border-slate-800">
        <Footer />
      </div>

      <ChatBot />
    </div>);
};
export default Index;
