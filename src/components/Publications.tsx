import { motion } from "framer-motion";
import { BookMarked, Download, ExternalLink, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

const publications = [
  {
    title: "Optimizing Neural Pathways in BCI Applications",
    authors: "Dr. A. Sharma, K. Patel, S. Raj",
    journal: "IEEE Transactions on Biomedical Engineering",
    year: "2025",
    type: "Journal",
    highlight: true,
  },
  {
    title: "Quantum Error Correction via Topological Codes",
    authors: "M. Singh, V. Kumar",
    journal: "International Conference on Quantum Dynamics",
    year: "2024",
    type: "Conference",
    highlight: false,
  },
  {
    title: "Zero-Trust Architecture in Decentralized IoT Grids",
    authors: "R. Desai, C. Fernandez",
    journal: "IEEE Internet of Things Journal",
    year: "2024",
    type: "Journal",
    highlight: false,
  },
];

const Publications = () => {
  return (
    <section className="py-24 bg-[#0a0f1c] relative text-white border-y border-slate-800">
      {/* Background Graphic */}
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10 flex flex-col lg:flex-row gap-16 items-center">
        
        {/* Left Side: Sticky Intro */}
        <div className="w-full lg:w-1/3 space-y-8">
          <BookMarked size={48} className="text-cyan-500 mb-6" strokeWidth={1.5} />
          <h2 className="text-4xl md:text-5xl font-serif font-black tracking-tighter leading-tight">
            Pioneering
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Research
            </span>
          </h2>
          <p className="text-slate-400 font-medium leading-relaxed">
            Our members consistently publish high-impact papers across top-tier international IEEE journals and conferences, pushing the boundaries of what is technically possible.
          </p>
          <div className="pt-4 space-y-4">
            <Link to="/reports" className="group flex items-center justify-between w-full p-4 border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-cyan-500 transition-all">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">View Full Archive</span>
              <ArrowRight size={16} className="text-cyan-400 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Side: Publication Stack */}
        <div className="w-full lg:w-2/3 grid gap-6">
          {publications.map((pub, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15 }}
              viewport={{ once: true }}
              className={`group relative p-8 border transition-all duration-500 overflow-hidden ${
                pub.highlight 
                  ? "bg-slate-900 border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.2)]" 
                  : "bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800"
              }`}
            >
              {/* Highlight Ribbon */}
              {pub.highlight && (
                <div className="absolute top-4 right-4 text-yellow-400 floating-animation opacity-80">
                  <Star size={20} className="fill-yellow-400" />
                </div>
              )}

              <div className="flex gap-3 mb-6">
                <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest ${
                  pub.type === 'Journal' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {pub.type}
                </span>
                <span className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] font-bold tracking-widest">
                  {pub.year}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-cyan-300 transition-colors">
                {pub.title}
              </h3>
              
              <p className="text-sm font-medium text-slate-400 mb-6">
                <span className="text-slate-300">Authors:</span> {pub.authors}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-slate-800 group-hover:border-slate-700 transition-colors">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 max-w-[70%] truncate">
                  {pub.journal}
                </p>
                <div className="flex gap-4">
                   <button className="text-slate-400 hover:text-white transition-colors" title="Download PDF">
                     <Download size={18} />
                   </button>
                   <button className="text-slate-400 hover:text-cyan-400 transition-colors" title="External Link">
                     <ExternalLink size={18} />
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Publications;
