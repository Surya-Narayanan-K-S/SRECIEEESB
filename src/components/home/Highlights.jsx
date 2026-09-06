import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, ArrowRight, Calendar, Users, Mic, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fallbackImage = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800";

const Highlights = () => {
    const { data: latestActivities = [], isLoading } = useQuery({
        queryKey: ["latest_activities"],
        queryFn: async () => {
            const { data } = await supabase
                .from("activities")
                .select("*")
                .order("s_no", { ascending: false })
                .limit(3);
            return data || [];
        }
    });

    return (
      <section className="py-12 md:py-18 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
        {/* Light blue animated decorative backgrounds */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-200/20 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-blue-200/20 rounded-full blur-[130px] -z-10 -translate-x-1/2 translate-y-1/3 pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-4 border-b border-slate-200/80 gap-4">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-700 font-bold text-xs tracking-wider uppercase mb-3 shadow-xs">
                <Sparkles size={13} className="text-cyan-600 animate-pulse" />
                <span>Recent Highlights</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 font-heading">
                Discover Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600">Latest Events</span>
              </h2>
            </div>
            <Link
              to="/activities"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-900 hover:text-white text-slate-800 font-bold text-xs sm:text-sm transition-all duration-300 shadow-sm hover:shadow-md border border-slate-200 hover:border-slate-900 group active:scale-95 shrink-0"
            >
              <span>View All Activities</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-56">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600 opacity-60" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {latestActivities.map((activity, idx) => {
                const imageUrl = activity.image_url || fallbackImage;
                return (
                  <motion.div
                    key={activity.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                    className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-cyan-400/50 hover:-translate-y-1.5 transition-all duration-400 flex flex-col h-full"
                  >
                    <div className="relative overflow-hidden shrink-0 h-56 bg-slate-100">
                      <img
                        src={imageUrl}
                        alt={activity.event || "Activity"}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                        onError={(e) => { e.currentTarget.src = fallbackImage; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-90" />
                      
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-slate-900 text-xs font-black shadow-md flex items-center gap-1.5">
                          <Calendar size={12} className="text-blue-600" />
                          <span>{activity.date || activity.year || "Recent"}</span>
                        </span>
                        {activity.s_no && (
                          <span className="text-[11px] font-mono font-bold text-white/80 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur">
                            #{activity.s_no}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                      <div>
                        <h3 className="font-heading font-extrabold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-snug text-lg line-clamp-2">
                          {activity.event}
                        </h3>
                        {activity.description && (
                          <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                            {activity.description}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 mt-auto">
                        {activity.chief_guest && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100 max-w-full">
                            <Mic className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                            <span className="truncate">{activity.chief_guest}</span>
                          </div>
                        )}
                        {activity.participants && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100">
                            <Users className="h-3.5 w-3.5 text-cyan-600 shrink-0" />
                            <span>{activity.participants}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    );
};

export default Highlights;
