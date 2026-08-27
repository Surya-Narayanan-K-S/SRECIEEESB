import { motion } from "framer-motion";
const technologies = [
    "TensorFlow", "React Native", "PostgreSQL", "AWS Architect",
    "ROS (Robotics)", "Quantum Qiskit", "Docker", "Kubernetes",
    "Figma", "Node.js", "C++ System Design", "Cyber Defense",
    "Next.js", "Supabase", "Git Workflow", "Azure Cloud"
];
const TechStack = () => {
    return (<section className="py-10 md:py-12 bg-white border-y border-slate-200 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02] mix-blend-overlay pointer-events-none"></div>
      
      {/* Edge gradient masks for smooth fade out */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-6 mb-6">
        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-cyan-600 mb-2 text-center">Tech Stack & Frameworks</p>
        <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900 text-center tracking-tight">
          Tools We Master
        </h2>
      </div>

      <div className="flex w-[200%] md:w-[150%]">
        <motion.div animate={{ x: [0, -1035] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="flex whitespace-nowrap gap-6 w-full">
          {[...technologies, ...technologies].map((tech, index) => (<div key={index} className="px-8 py-4 bg-[#fafafa] border border-slate-200 shadow-sm text-slate-700 font-bold uppercase tracking-wider text-xs md:text-sm hover:border-[#0b3b8f] hover:bg-slate-900 hover:text-white transition-all duration-300 cursor-default">
              {tech}
            </div>))}
        </motion.div>
      </div>
      
      {/* Reverse Marquee */}
      <div className="flex w-[200%] md:w-[150%] mt-6 relative left-[-20%] md:left-[-10%]">
        <motion.div animate={{ x: [-1035, 0] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="flex whitespace-nowrap gap-6 w-full">
          {/* Shuffle the array slightly for the second row */}
          {[...technologies.reverse(), ...technologies].map((tech, index) => (<div key={`rev-${index}`} className="px-8 py-4 bg-white border border-slate-200 text-slate-500 font-black uppercase tracking-widest text-[10px] md:text-xs hover:border-cyan-500 hover:bg-cyan-50 hover:text-cyan-700 transition-all duration-300 cursor-default">
              {tech}
            </div>))}
        </motion.div>
      </div>

    </section>);
};
export default TechStack;
