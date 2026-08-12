import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Target, Calendar, Users, Cpu, Network, Activity, ArrowRight, BookOpen, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const CisPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-[#003764] selection:text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full pt-32 pb-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          
          <Link to="/#societies" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold uppercase tracking-widest text-[10px] transition-colors mb-12">
            <ArrowLeft size={14} /> Back to Societies
          </Link>

          {/* HERO SECTION */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-16 border border-slate-200 bg-white p-8 md:p-16 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700">
               <Layers size={300} />
            </div>
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center justify-between">
              <div className="flex-1">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest mb-6 inline-block">Official Chapter</span>
                <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                  IEEE Computational Intelligence Society (CIS)
                </h1>
                <div className="h-[2px] w-16 bg-slate-900 mb-6"></div>
                <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                  Dedicated to pushing the boundaries of technology and providing a collaborative environment for leading researchers, professionals, and students.
                </p>
              </div>
              
              <div className="w-full lg:w-[300px] shrink-0 border border-slate-200 bg-slate-50 p-8 shadow-inner">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Stats</p>
                <div className="space-y-6">
                  <div>
                    <p className="text-3xl font-black text-slate-900">120+</p>
                    <p className="text-xs text-slate-500 font-bold">Active Members</p>
                  </div>
                  <div className="h-[1px] w-full bg-slate-200"></div>
                  <div>
                    <p className="text-3xl font-black text-slate-900">15+</p>
                    <p className="text-xs text-slate-500 font-bold">Yearly Events</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* INTERACTIVE WORKSPACE */}
          <div className="flex gap-4 border-b border-slate-200 mb-12 overflow-x-auto scrollbar-hide">
            {["overview", "initiatives", "workshops"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors relative ${
                  activeTab === tab ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="tabMarker" className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-900" />
                )}
              </button>
            ))}
          </div>

          {/* TAB CONTENT GRID */}
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            <div className="md:col-span-2 border border-slate-200 bg-white p-8 md:p-12">
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6 capitalize">{activeTab} Details</h3>
              <p className="text-slate-600 leading-relaxed mb-6 font-medium">
                The IEEE Computational Intelligence Society (CIS) organizes high-impact technical symposiums, hands-on industrial workshops, and expert lectures focusing on the bleeding edge of modern engineering.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#fafafa] border border-slate-100 p-6 flex flex-col items-start hover:border-slate-300 transition-colors cursor-default">
                  <Cpu size={24} className="text-cyan-600 mb-4" />
                  <p className="font-bold text-slate-900 text-sm mb-1">Technical Excellence</p>
                  <p className="text-xs text-slate-500">Core engineering focus</p>
                </div>
                <div className="bg-[#fafafa] border border-slate-100 p-6 flex flex-col items-start hover:border-slate-300 transition-colors cursor-default">
                  <Network size={24} className="text-blue-600 mb-4" />
                  <p className="font-bold text-slate-900 text-sm mb-1">Global Networking</p>
                  <p className="text-xs text-slate-500">Industry connections</p>
                </div>
              </div>
            </div>

            {/* ACTION SIDEBAR */}
            <div className="space-y-6">
              <div className="border border-slate-200 bg-slate-900 text-white p-8 shadow-xl">
                <Users className="text-slate-400 mb-6" size={28} />
                <h3 className="font-bold text-white mb-3 text-lg leading-tight">Join the Network</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-8">
                  Get exclusive access to society resources, journals, and private community networks.
                </p>
                <Link to="/join" className="group flex items-center justify-between w-full pb-3 border-b border-white/20 text-[10px] font-black uppercase tracking-[0.2em] hover:border-white transition-colors">
                  Submit Application <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>

              <div className="border border-slate-200 bg-white p-8">
                <BookOpen className="text-slate-400 mb-6" size={28} />
                <h3 className="font-bold text-slate-900 mb-3 text-lg">Browse Vault</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-6">
                  Review historical documents, project files, and technical records.
                </p>
                <Link to="/reports" className="group flex items-center justify-between w-full pb-3 border-b border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] hover:border-slate-900 transition-colors">
                  Open Repository <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CisPage;
