import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Users, Crown, ArrowRight, ExternalLink, Table as TableIcon, LayoutGrid, ShieldCheck, UserCheck, Award, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export type Person = {
  id: number | string;
  name: string;
  role: string;
  department?: string | null;
  image_url?: string | null;
  photo?: string | null;
  photo_url?: string | null;
};

export const getSocietyKey = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes("computer") || lower.includes("cs")) return "cs";
  if (lower.includes("computational") || lower.includes("cis")) return "cis";
  if (lower.includes("communication") || lower.includes("comsoc")) return "comsoc";
  if (lower.includes("medicine") || lower.includes("embs")) return "embs";
  if (lower.includes("instrumentation") || lower.includes("im")) return "im";
  if (lower.includes("power") || lower.includes("pels")) return "pels";
  if (lower.includes("women") || lower.includes("wie")) return "wie";
  return "srec";
};

interface SocietyOfficeBearersProps {
  societyName?: string;
}

const SocietyOfficeBearers = ({ societyName = "Society" }: SocietyOfficeBearersProps) => {
  const [filterTab, setFilterTab] = useState<"all" | "bearers" | "executives">("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const [bearers, setBearers] = useState<Person[]>([]);
  const [executives, setExecutives] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const key = getSocietyKey(societyName);

  useEffect(() => {
    const fetchLeadership = async () => {
      setLoading(true);
      try {
        const [bearersRes, execsRes] = await Promise.all([
          supabase
            .from("society_office_bearers")
            .select("*")
            .eq("society_code", key)
            .order("id", { ascending: true }),
          supabase
            .from("society_executive_members")
            .select("*")
            .eq("society_code", key)
            .order("id", { ascending: true }),
        ]);

        // If specific tables aren't set up yet, query new_office_bearers / new_executive_members with group filter
        if ((!bearersRes.data || bearersRes.data.length === 0) && (!execsRes.data || execsRes.data.length === 0)) {
          const [altBearers, altExecs] = await Promise.all([
            supabase.from("new_office_bearers").select("*").eq("group_name", key).order("id", { ascending: true }),
            supabase.from("new_executive_members").select("*").eq("group_name", key).order("id", { ascending: true }),
          ]);
          setBearers(altBearers.data || []);
          setExecutives(altExecs.data || []);
        } else {
          setBearers(bearersRes.data || []);
          setExecutives(execsRes.data || []);
        }
      } catch {
        setBearers([]);
        setExecutives([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadership();
  }, [key]);

  // Render a Single Table
  const renderTable = (list: Person[], title: string, badgeText: string, headerGradient: string) => (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
      {/* Table Section Header */}
      <div className={`p-4 md:px-6 md:py-4 bg-gradient-to-r ${headerGradient} text-white flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Award size={18} className="text-amber-300" />
          <h4 className="font-serif font-bold text-base md:text-lg tracking-tight">{title}</h4>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-white/10 border border-white/20">
          {list.length} Members
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest border-b border-slate-800">
              <th className="py-3.5 px-6 w-16">#</th>
              <th className="py-3.5 px-6">Member Name</th>
              <th className="py-3.5 px-6">Designated Role</th>
              <th className="py-3.5 px-6">Department</th>
              <th className="py-3.5 px-6">Category</th>
              <th className="py-3.5 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
            {list.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 px-6 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <UserCheck size={32} className="text-slate-300" />
                    <span className="text-slate-600 font-bold text-base">Yet to select</span>
                    <span className="text-slate-400 text-xs">No records present in database for this category.</span>
                  </div>
                </td>
              </tr>
            ) : (
              list.map((person, idx) => {
                const imgSrc = person.image_url || person.photo || person.photo_url;
                return (
                  <tr key={person.id || idx} className="hover:bg-blue-50/40 transition-colors group">
                    <td className="py-3.5 px-6 font-bold text-slate-400">{idx + 1}</td>

                    <td className="py-3.5 px-6 font-serif font-bold text-slate-900 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-sans font-black text-xs shrink-0 overflow-hidden border border-slate-200">
                          {imgSrc ? (
                            <img src={imgSrc} alt={person.name} className="w-full h-full object-cover object-top" />
                          ) : (
                            person.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
                          )}
                        </div>
                        <span className="group-hover:text-blue-600 transition-colors">{person.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-6">
                      <span className="inline-block px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-[11px] uppercase tracking-wider rounded-md">
                        {person.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-6 font-semibold text-slate-600">
                      {person.department || "SREC Engineering"}
                    </td>

                    <td className="py-3.5 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                        {badgeText}
                      </span>
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <Link
                        to="/office-bearers"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold text-xs hover:underline"
                      >
                        <span>Profile</span>
                        <ExternalLink size={11} />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full col-span-full font-sans">
      {/* Header Banner */}
      <div className="border border-slate-200 bg-white p-8 md:p-10 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-[10px] uppercase tracking-wider mb-3">
            <Users size={13} />
            <span>Dedicated Chapter Leadership</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            {societyName} Office Bearers & Executive Team
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl">
            Separate official directory tables for office bearers and executive members guiding the {societyName} chapter at SREC.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === "table" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <TableIcon size={14} />
              <span>Table View</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === "grid" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <LayoutGrid size={14} />
              <span>Card View</span>
            </button>
          </div>

          <Link
            to="/office-bearers"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <span>Full Directory</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Category Filter Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterTab("all")}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-all rounded-lg ${
              filterTab === "all" ? "bg-slate-900 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Tables ({bearers.length + executives.length})
          </button>
          <button
            onClick={() => setFilterTab("bearers")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider transition-all rounded-lg ${
              filterTab === "bearers" ? "bg-slate-900 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <UserCheck size={14} />
            <span>Office Bearers ({bearers.length})</span>
          </button>
          <button
            onClick={() => setFilterTab("executives")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider transition-all rounded-lg ${
              filterTab === "executives" ? "bg-slate-900 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <ShieldCheck size={14} />
            <span>Executive Members ({executives.length})</span>
          </button>
        </div>
      </div>

      {/* TABLES VIEW */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 bg-white border border-slate-200 rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Chapter Data...</span>
        </div>
      ) : viewMode === "table" ? (
        <div className="space-y-8">
          {(filterTab === "all" || filterTab === "bearers") &&
            renderTable(
              bearers,
              `${societyName} — Office Bearers Table`,
              "Office Bearer",
              "from-slate-900 to-blue-900"
            )}

          {(filterTab === "all" || filterTab === "executives") &&
            renderTable(
              executives,
              `${societyName} — Executive Members Table`,
              "Executive Member",
              "from-slate-800 to-indigo-900"
            )}
        </div>
      ) : (
        /* GRID VIEW FALLBACK */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {[...(filterTab === "executives" ? [] : bearers), ...(filterTab === "bearers" ? [] : executives)].length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white border border-slate-200 rounded-2xl">
              <UserCheck size={36} className="mx-auto text-slate-300 mb-2" />
              <p className="text-slate-600 font-bold text-base">Yet to select</p>
              <p className="text-slate-400 text-xs mt-1">No office bearers or executive members selected yet.</p>
            </div>
          ) : (
            [...(filterTab === "executives" ? [] : bearers), ...(filterTab === "bearers" ? [] : executives)].map(
              (person, idx) => {
                const imgSrc = person.image_url || person.photo || person.photo_url;
                return (
                  <motion.div
                    key={person.id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    className="bg-white border border-slate-200 hover:border-blue-400/80 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-full h-44 rounded-xl bg-slate-100 overflow-hidden mb-4 relative flex items-center justify-center border border-slate-100">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={person.name}
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : null}
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 text-white text-2xl font-black -z-0">
                          {person.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                      </div>

                      <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 font-extrabold text-[10px] uppercase tracking-wider rounded-md mb-2">
                        {person.role}
                      </span>

                      <h4 className="font-serif font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                        {person.name}
                      </h4>

                      {person.department && (
                        <p className="text-slate-500 text-xs font-semibold mt-1">{person.department}</p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>{societyName}</span>
                      <Link to="/office-bearers" className="text-blue-600 hover:underline flex items-center gap-0.5">
                        <span>Profile</span>
                        <ExternalLink size={10} />
                      </Link>
                    </div>
                  </motion.div>
                );
              }
            )
          )}
        </div>
      )}

      {/* Footer CTA */}
      <div className="mt-8 text-center border-t border-slate-200 pt-8">
        <Link
          to="/office-bearers"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all rounded-full shadow-lg hover:shadow-blue-500/25"
        >
          <Crown size={15} />
          <span>View Complete SREC Office Bearers Directory</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
};

export default SocietyOfficeBearers;
