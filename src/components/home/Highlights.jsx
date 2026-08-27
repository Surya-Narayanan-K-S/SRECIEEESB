import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, ArrowRight, Calendar, Users, Mic } from "lucide-react";
import { Link } from "react-router-dom";
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
    return (<section className="py-12 md:py-16 bg-slate-50 relative overflow-hidden">
      {/* Light blue animated decorative backgrounds */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-200/20 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3 animate-pulse animate-duration-6s"/>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/3 animate-pulse animate-duration-8s"/>
      
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-slate-100 pb-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 font-semibold text-xs tracking-widest uppercase mb-4 border border-cyan-100 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-1000"></span>
              </span>
              <span>Recent Highlights</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-slate-900 drop-shadow-sm">
              Discover Our <span className="text-slate-900 font-serif font-medium">Latest Events</span>
            </h2>
          </div>
          <Link to="/activities" className="mt-6 md:mt-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-all shadow-sm border border-slate-200 hover:border-slate-300 group">
            View All Activities
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
          </Link>
        </div>

        {isLoading ? (<div className="flex justify-center items-center h-48">
            <Loader2 className="h-12 w-12 animate-spin text-[#00629b] opacity-50"/>
          </div>) : (<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestActivities.map((activity) => {
                const imageUrl = activity.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800";
                return (<div key={activity.id} className="group relative bg-white/70 backdrop-blur-lg rounded-none overflow-hidden border border-white shadow-sm hover:shadow-lg transition-all duration-700 ease-in-out flex flex-col">
                  <div className="relative overflow-hidden shrink-0 h-56">
                    <img src={imageUrl} alt={activity.event} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-80"/>
                    
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                       <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-slate-900 text-xs font-bold border border-white/20 flex items-center gap-1.5 shadow-sm">
                         <Calendar size={12}/> {activity.date || activity.year}
                       </span>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between bg-white">
                    <h3 className="font-serif font-bold text-slate-800 mb-4 group-hover:text-[#00629b] transition-colors leading-tight text-xl">
                      {activity.event}
                    </h3>

                    <div className="flex flex-wrap gap-3 mt-auto">
                      {activity.chief_guest && (<div className="flex items-center gap-2 text-sm text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <Mic className="h-4 w-4 text-[#00629b]"/>
                          <span className="line-clamp-1">{activity.chief_guest}</span>
                        </div>)}
                      {activity.participants && (<div className="flex items-center gap-2 text-sm text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <Users className="h-4 w-4 text-[#00629b]"/>
                          <span>{activity.participants}</span>
                        </div>)}
                    </div>
                  </div>
                </div>);
            })}
          </div>)}
      </div>
    </section>);
};
export default Highlights;
