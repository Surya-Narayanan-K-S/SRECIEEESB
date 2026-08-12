import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Loader2, Target, Calendar, Users, Layers } from "lucide-react";
import { motion } from "framer-motion";

// Helper function to map common IEEE societies to professional focus areas
const getFocusAreas = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("computer") || lower.includes("cs")) return ["Software Architecture", "Artificial Intelligence", "Cybersecurity", "Cloud Computing"];
  if (lower.includes("roboti") || lower.includes("ras")) return ["Autonomous Systems", "Machine Vision", "Control Theory", "Mechatronics"];
  if (lower.includes("power") || lower.includes("pes")) return ["Renewable Energy", "Smart Grid Infrastructure", "Power Electronics", "Sustainable Tech"];
  if (lower.includes("communic") || lower.includes("comsoc")) return ["5G/6G Networks", "Signal Processing", "IoT Ecosystems", "Telecommunications"];
  if (lower.includes("medic") || lower.includes("embs")) return ["Bioinformatics", "Medical Imaging", "Neural Engineering", "Biosensors"];
  if (lower.includes("women") || lower.includes("wie")) return ["Leadership Development", "Diversity in STEM", "Mentorship", "Career Advocacy"];
  if (lower.includes("computational") || lower.includes("cis")) return ["Deep Learning", "Fuzzy Logic", "Evolutionary Computation", "Neural Networks"];
  return ["Advanced Research & Development", "System Integration", "Applied Engineering", "Technological Innovation"];
};

const SocietyDetailPage = () => {
  const { id } = useParams();

  const { data: society, isLoading, error } = useQuery({
    queryKey: ["society", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("societies")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const focusAreas = society ? getFocusAreas(society.name) : [];

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-slate-900 selection:text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full pt-32 pb-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          
          <Link to="/#societies" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold uppercase tracking-widest text-[10px] transition-colors mb-16">
            <ArrowLeft size={14} /> Back to Societies
          </Link>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : error || !society ? (
            <div className="text-center py-24 border border-slate-200 bg-white">
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Society Not Found</h2>
              <p className="text-slate-500">The requested society details could not be loaded.</p>
            </div>
          ) : (
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
                  {society.name}
                </h1>
                
                <div className="h-[1px] w-24 bg-slate-900 mb-8"></div>
                
                <p className="text-xl md:text-2xl text-slate-500 font-light leading-relaxed max-w-4xl relative z-10">
                  {society.description || "Advancing technology for humanity through dedicated focus, engineering excellence, and specialized research initiatives."}
                </p>
              </div>

              {/* In-depth Explanation Section */}
              <div className="border border-slate-200 bg-white p-12 md:p-20 relative">
                <div className="grid lg:grid-cols-2 gap-16">
                  
                  {/* Left Column: Scope and Details */}
                  <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">About the Society</h2>
                    <div className="h-[1px] w-12 bg-cyan-500 mb-8"></div>
                    
                    <div className="text-slate-600 space-y-6 text-lg font-light leading-relaxed">
                      <p>
                        The <strong>{society.name}</strong> is dedicated to exploring the fundamental theories and practical applications within its specialized domain. As technology increasingly intersects with daily human life, this society serves as a critical bridge between academic research and industry implementation.
                      </p>
                      <p>
                        Members engage deeply with cutting-edge literature, collaborate on open-source hardware and software projects, and participate in intensive workshops designed to transform theoretical knowledge into tangible engineering solutions. 
                      </p>
                      <p>
                        Whether you are aiming to publish groundbreaking research or simply want to build deployable systems, the society offers the resources, mentorship, and global network necessary to accelerate your technological footprint.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Focus Areas */}
                  <div className="bg-[#fafafa] border border-slate-100 p-10">
                    <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-6">Strategic Focus Areas</h3>
                    <ul className="space-y-4">
                      {focusAreas.map((area, idx) => (
                        <li key={idx} className="flex items-start gap-4">
                          <div className="mt-1 h-2 w-2 rounded-full bg-slate-400 shrink-0"></div>
                          <span className="text-slate-600 font-medium">{area}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-12 pt-10 border-t border-slate-200">
                       <h3 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-4">Core Objectives</h3>
                       <p className="text-slate-500 text-sm leading-relaxed">
                         To foster technological innovation and excellence for the benefit of humanity. We aim to connect professionals, share critical knowledge, and architect the systems of tomorrow safely and efficiently.
                       </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Grid Details (Actionable) */}
              <div className="grid md:grid-cols-2 gap-8">
                
                <div className="border border-slate-200 bg-white p-10 hover:shadow-lg transition-shadow duration-500">
                  <Calendar className="text-slate-400 mb-6" size={32} />
                  <h3 className="font-bold text-slate-900 mb-4 tracking-tight">Key Activities</h3>
                  <p className="text-slate-500 text-sm leading-relaxed text-justify">
                    From regular symposiums and technical bootcamps to global networking events, our activities are heavily project-oriented and collaborative. Members routinely participate in hackathons, design challenges, and peer-reviewed publishing.
                  </p>
                </div>

                <div className="border border-slate-200 bg-slate-900 text-white p-10 hover:shadow-xl transition-shadow duration-500">
                  <Users className="text-slate-400 mb-6" size={32} />
                  <h3 className="font-bold text-white mb-4 tracking-tight">Join the {society.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    Become a part of an elite network of engineers and researchers. Gain exclusive access to leading journals, technical libraries, and an unparalleled professional alumni network.
                  </p>
                  <Link to="/join" className="uppercase tracking-[0.2em] font-bold text-[10px] pb-1 border-b border-white hover:text-slate-300 hover:border-slate-300 transition-colors inline-block">Submit Application</Link>
                </div>
              </div>

            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SocietyDetailPage;
