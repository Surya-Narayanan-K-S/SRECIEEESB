import { motion } from "framer-motion";
import { Cpu, Sparkles } from "lucide-react";

const technologies = [
    "TensorFlow", "React Native", "PostgreSQL", "AWS Cloud",
    "ROS 2 (Robotics)", "Quantum Qiskit", "Docker", "Kubernetes",
    "Figma UI/UX", "Node.js", "C++ Embedded", "Cyber Defense",
    "Next.js", "Supabase", "Git & GitHub", "Azure Cloud"
];

const reversedTech = [...technologies].reverse();

const TechStack = () => {
    return (
      <section className="py-12 md:py-16 bg-white border-y border-slate-200/80 overflow-hidden relative">
        {/* Edge gradient masks for smooth fade out */}
        <div className="absolute top-0 left-0 w-24 sm:w-40 h-full bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-24 sm:w-40 h-full bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-700 font-bold text-xs uppercase tracking-widest mb-3">
            <Sparkles size={12} className="text-cyan-600 animate-pulse" />
            <span>Tech Stack & Domains</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-black text-slate-900 tracking-tight">
            Tools & Frameworks We Master
          </h2>
        </div>

        {/* Row 1: Forward Marquee */}
        <div className="flex overflow-hidden py-1">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap gap-4 shrink-0"
          >
            {[...technologies, ...technologies].map((tech, index) => (
              <div
                key={`tech-fwd-${index}`}
                className="px-6 py-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs text-slate-800 font-bold uppercase tracking-wider text-xs md:text-sm hover:border-blue-600 hover:bg-slate-900 hover:text-white transition-all duration-300 cursor-default hover:scale-105"
              >
                {tech}
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Row 2: Reverse Marquee */}
        <div className="flex overflow-hidden py-1 mt-3">
          <motion.div
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap gap-4 shrink-0"
          >
            {[...reversedTech, ...reversedTech].map((tech, index) => (
              <div
                key={`tech-rev-${index}`}
                className="px-6 py-2.5 rounded-2xl bg-white border border-slate-200/90 text-slate-600 font-extrabold uppercase tracking-widest text-[11px] md:text-xs hover:border-cyan-500 hover:bg-cyan-50 hover:text-cyan-800 transition-all duration-300 cursor-default hover:scale-105 shadow-xs"
              >
                {tech}
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    );
};

export default TechStack;
