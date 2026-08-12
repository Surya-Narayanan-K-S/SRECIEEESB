import { motion } from "framer-motion";
import { Cpu, Network, Shield, Microchip, Cloud, Bot, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const domains = [
  {
    title: "Artificial Intelligence",
    icon: Bot,
    color: "text-rose-500",
    bgHover: "hover:bg-rose-500/10",
    borderHover: "hover:border-rose-500/50",
    desc: "Machine Learning, Neural Networks, Cognitive Automation",
  },
  {
    title: "Quantum Computing",
    icon: Microchip,
    color: "text-cyan-500",
    bgHover: "hover:bg-cyan-500/10",
    borderHover: "hover:border-cyan-500/50",
    desc: "Quantum Algorithms, Error Correction, Cryptography",
  },
  {
    title: "Cyber Security",
    icon: Shield,
    color: "text-emerald-500",
    bgHover: "hover:bg-emerald-500/10",
    borderHover: "hover:border-emerald-500/50",
    desc: "Penetration Testing, Network Defense, Zero-Trust Architecture",
  },
  {
    title: "IoT & Robotics",
    icon: Cpu,
    color: "text-amber-500",
    bgHover: "hover:bg-amber-500/10",
    borderHover: "hover:border-amber-500/50",
    desc: "Autonomous Systems, Sensor Fusion, Embedded Design",
  },
  {
    title: "Cloud Architecture",
    icon: Cloud,
    color: "text-blue-500",
    bgHover: "hover:bg-blue-500/10",
    borderHover: "hover:border-blue-500/50",
    desc: "Distributed Systems, Serverless, Enterprise Infrastructure",
  },
  {
    title: "Telecommunications",
    icon: Network,
    color: "text-indigo-500",
    bgHover: "hover:bg-indigo-500/10",
    borderHover: "hover:border-indigo-500/50",
    desc: "5G/6G Networks, Optoelectronics, Signal Processing",
  },
];

const Research = () => {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
              Core Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0b3b8f] to-cyan-500">Domains</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg">
              Explore the critical fields of research our student chapters and technical societies actively investigate and develop through industrial collaborations.
            </p>
          </div>
          <Link to="/societies" className="shrink-0 flex items-center gap-2 font-bold text-sm text-[#0b3b8f] hover:text-cyan-600 border-b border-[#0b3b8f] pb-1 uppercase tracking-widest transition-colors mb-2">
            View All Societies <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              key={domain.title}
              className={`group flex flex-col justify-between p-8 border border-slate-200 bg-[#fafafa] cursor-crosshair transition-all duration-500 ${domain.bgHover} ${domain.borderHover}`}
            >
              <div className="flex justify-between items-start mb-12">
                <div className={`p-4 bg-white border border-slate-200 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12`}>
                   <domain.icon size={28} className={domain.color} />
                </div>
                <span className="text-slate-300 group-hover:text-slate-900 transition-colors">
                  <ArrowUpRight size={20} />
                </span>
              </div>
              
              <div>
                <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-slate-900 transition-colors">{domain.title}</h3>
                <p className="text-sm font-medium text-slate-500 group-hover:text-slate-600 transition-colors border-t border-slate-200 group-hover:border-slate-300 pt-4 mt-4">
                  {domain.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Research;
