import os

pages = [
    ("SrecBranchPage", "IEEE Student Branch SREC", "srec"),
    ("WiePage", "IEEE Women in Engineering (WIE)", "wie"),
    ("EmbsPage", "IEEE Engineering in Medicine and Biology Society (EMBS)", "embs"),
    ("CsPage", "IEEE Computer Society (CS)", "cs"),
    ("ComsocPage", "IEEE Communication Society (ComSoc)", "comsoc"),
    ("PelsPage", "IEEE Power Electronics Society (PELS)", "pels"),
    ("ImPage", "IEEE Instrumentation and Measurement Society (IM)", "im"),
    ("CisPage", "IEEE Computational Intelligence Society (CIS)", "cis")
]

template = """import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Layers, Target, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const {component} = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-slate-900 selection:text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full pt-32 pb-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          
          <Link to="/#societies" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold uppercase tracking-widest text-[10px] transition-colors mb-16">
            <ArrowLeft size={14} /> Back to Societies
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-16"
          >
            {/* Header Box */}
            <div className="border border-slate-200 bg-white p-12 md:p-20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                <Layers size={200} />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-slate-900 mb-8 max-w-3xl relative z-10">
                {title}
              </h1>
              
              <div className="h-[1px] w-24 bg-slate-900 mb-8"></div>
              
              <p className="text-xl md:text-2xl text-slate-500 font-light leading-relaxed max-w-4xl relative z-10">
                Welcome to the official customized page for {title}. You can now replace this generic content with customized HTML and specific sections tailored specifically for this chapter!
              </p>
            </div>

            {/* Grid Details (Actionable) */}
            <div className="grid md:grid-cols-2 gap-8">
              
              <div className="border border-slate-200 bg-white p-10 hover:shadow-lg transition-shadow duration-500">
                <Calendar className="text-slate-400 mb-6" size={32} />
                <h3 className="font-bold text-slate-900 mb-4 tracking-tight">Key Activities</h3>
                <p className="text-slate-500 text-sm leading-relaxed text-justify">
                  Custom activities, galleries, and events for {title} can be added exactly here.
                </p>
              </div>

              <div className="border border-slate-200 bg-slate-900 text-white p-10 hover:shadow-xl transition-shadow duration-500">
                <Users className="text-slate-400 mb-6" size={32} />
                <h3 className="font-bold text-white mb-4 tracking-tight">Executive Members</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  Dedicated static lists of executive members for {title}. Add custom member cards here!
                </p>
                <button className="uppercase tracking-[0.2em] font-bold text-[10px] pb-1 border-b border-white hover:text-slate-300 hover:border-slate-300 transition-colors">
                  Join Chapter
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default {component};
"""

for component, title, _ in pages:
    with open(f"src/pages/{component}.tsx", "w", encoding="utf-8") as f:
        f.write(template.replace("{component}", component).replace("{title}", title))
        
import_statements = "\\n".join([f'import {c} from "./pages/{c}";' for c, _, _ in pages])
routes = "\\n".join([f'          <Route path="/societies/{slug}" element={{<{c} />}} />' for c, _, slug in pages])

print("--- COPY IMPORTS ---")
print(import_statements)
print("--- COPY ROUTES ---")
print(routes)
