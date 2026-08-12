import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Cpu, Radio, HeartPulse, Gauge, Loader2, Target, Network, Layers, Activity, ArrowRight, Award, Users, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import wieLogo from "@/assets/societies/WIE.jpg";
import embsLogo from "@/assets/societies/EMBS.jpg";
import csLogo from "@/assets/societies/CS.png";
import comsocLogo from "@/assets/societies/ComSoc.jpg";
import pelsLogo from "@/assets/societies/pels.png";
import srecLogo from "@/assets/srec-logo.png";
import cisLogo from "@/assets/societies/CIS.png";
import imlogo from "@/assets/societies/IM.jpg";

const logoMapping: Record<string, string> = {
  wie: wieLogo,
  embs: embsLogo,
  cs: csLogo,
  comsoc: comsocLogo,
  pels: pelsLogo,
  srec: srecLogo,
  cis: cisLogo,
  im: imlogo,
};

const internalSocietyLinks: Record<string, string> = {
  srec: "/societies/srec",
  wie: "/societies/wie",
  embs: "/societies/embs",
  cs: "/societies/cs",
  comsoc: "/societies/comsoc",
  pels: "/societies/pels",
  im: "/societies/im",
  cis: "/societies/cis",
};

const externalSocietyLinks: Record<string, string> = {
  srec: "https://www.ieee.org/",
  wie: "https://wie.ieee.org/about/",
  embs: "https://www.embs.org/about/",
  cs: "https://www.computer.org/about/",
  comsoc: "https://www.comsoc.org/about/",
  pels: "https://www.ieee-pels.org/about/",
  im: "https://ieee-ims.org/about/about-ims",
  cis: "https://cis.ieee.org/about/",
};

const designTokens = [
  { icon: Cpu, color: "from-blue-500 to-indigo-600", bg: "bg-slate-100 text-slate-900" },
  { icon: HeartPulse, color: "from-rose-500 to-pink-600", bg: "bg-rose-50 text-rose-600" },
  { icon: Radio, color: "from-amber-400 to-orange-500", bg: "bg-orange-50 text-orange-600" },
  { icon: Gauge, color: "from-emerald-400 to-teal-500", bg: "bg-emerald-50 text-emerald-600" },
  { icon: Network, color: "from-cyan-400 to-blue-500", bg: "bg-slate-100 text-slate-550" },
  { icon: Target, color: "from-purple-500 to-violet-600", bg: "bg-purple-50 text-purple-600" },
  { icon: Layers, color: "from-fuchsia-400 to-pink-500", bg: "bg-fuchsia-50 text-fuchsia-600" },
  { icon: Activity, color: "from-lime-400 to-green-500", bg: "bg-lime-50 text-lime-600" },
];

const getSlugForSociety = (name: string, id: number) => {
  const n = name.toLowerCase();
  if (n.includes("srec")) return "srec";
  if (/\bwie\b/.test(n) || n.includes("women")) return "wie";
  if (/\bembs\b/.test(n) || n.includes("medicine")) return "embs";
  if (/\bcs\b/.test(n) || n.includes("computer")) return "cs";
  if (/\bcomsoc\b/.test(n) || n.includes("communication")) return "comsoc";
  if (/\bpels\b/.test(n) || n.includes("power")) return "pels";
  if (/\bim\b/.test(n) || n.includes("instrumentation")) return "im";
  if (/\bcis\b/.test(n) || n.includes("computational")) return "cis";
  return id.toString();
};

const Societies = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const { data: societies = [], isLoading } = useQuery({
    queryKey: ["societies"],
    queryFn: async () => {
      const { data } = await supabase.from("societies").select("*").order("id", { ascending: true });
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <section className="py-24 bg-slate-50 flex flex-col justify-center items-center min-h-[300px]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-400 font-bold text-xs tracking-widest uppercase animate-pulse">Loading Societies...</p>
      </section>
    );
  }

  return (
    <section id="societies" className="py-12 md:py-16 relative overflow-hidden bg-slate-50/50">
      
      {/* Soft background glow accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-blue-50/30 to-transparent blur-3xl pointer-events-none rounded-full translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-t from-emerald-50/30 to-transparent blur-3xl pointer-events-none rounded-full -translate-x-1/4 translate-y-1/4" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* HEADER SECTION: Title, Description, and Stats Cards (Horizontal Row) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 text-left">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs tracking-wider uppercase mb-4 shadow-sm">
              <Layers size={12} className="text-blue-500 animate-pulse" />
              Technical Chapters
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Our Societies
            </h2>
            <p className="mt-4 text-slate-500 text-sm md:text-base leading-relaxed">
              Explore SREC's specialized technical societies designed to foster innovation, facilitate research, and connect students to global engineering frameworks.
            </p>
          </div>

          {/* Quick Stats Panel (Horizontal Row) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:w-[45%] shrink-0">
            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between h-[110px]">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Cpu size={16} />
              </div>
              <div>
                <h4 className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Active Chapters</h4>
                <p className="text-base font-bold text-white mt-0.5">{societies.length} Societies</p>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between h-[110px]">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 flex items-center justify-center shrink-0">
                <Users size={16} />
              </div>
              <div>
                <h4 className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total Members</h4>
                <p className="text-base font-bold text-white mt-0.5">500+ Students</p>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between h-[110px]">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Award size={16} />
              </div>
              <div>
                <h4 className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Annual Projects</h4>
                <p className="text-base font-bold text-white mt-0.5">100+ Initiatives</p>
              </div>
            </div>
          </div>
        </div>

        {/* FULL-WIDTH GRID OF SOCIETIES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {societies.map((s: any, i: number) => {
            const token = designTokens[i % designTokens.length];
            const Icon = token.icon;
            const isHovered = hoveredIdx === i;
            const linkSlug = getSlugForSociety(s.name, s.id);
            const logo = logoMapping[linkSlug];
            const internalUrl = internalSocietyLinks[linkSlug] || `/societies/${s.id}`;
            const externalUrl = externalSocietyLinks[linkSlug] || "https://www.ieee.org/";
            
            return (
              <motion.div
                key={s.id || s.name}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative group rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-h-[300px]"
              >
                <Link to={internalUrl} className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ease-out relative overflow-hidden ${isHovered ? 'shadow-md scale-105 border border-slate-200 bg-white' : 'bg-slate-50 border border-slate-100'}`}>
                        {logo ? (
                          <img src={logo} alt={`${s.name} logo`} className="w-full h-full object-contain p-1" />
                        ) : (
                          <div className="text-slate-500">
                            <Icon className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] font-bold tracking-widest uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100/50">Active Chapter</span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-slate-800 mb-3 group-hover:text-blue-650 transition-colors">
                      {s.name}
                    </h3>
                    
                    {s.description ? (
                      <p className="text-slate-500 text-xs md:text-sm leading-relaxed line-clamp-4">
                        {s.description}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Exploring innovations pushing technological boundaries.</p>
                    )}
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700 transition-colors mt-6">
                    <span className="flex items-center gap-1.5">View Chapter Page <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(externalUrl, "_blank", "noopener,noreferrer"); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="IEEE Global Portal"
                    >
                      <ExternalLink size={14} />
                    </button>

                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Societies;
