import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { History, ArrowLeft, Building2, Mail, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

type Person = {
  id: number | string;
  name?: string;
  role?: string;
  department?: string;
  year?: number;
  academic_year?: string;
  image_url?: string;
  photo?: string;
  photo_url?: string;
  email?: string;
  phone?: string;
  website?: string;
  linkedin_url?: string;
  linkedin?: string;
  linkedin_profile?: string;
};

const ROLE_HIERARCHY = [
  "Chairperson",
  "Chair",
  "Vice Chairperson",
  "Vice Chair",
  "Secretary",
  "Joint Secretary",
  "Treasurer",
  "Joint Treasurer",
  "Webmaster",
  "Technical Head",
  "Technical Lead",
  "Design Head",
  "Design Lead",
  "Content Head",
  "PRO",
  "Public Relations",
];

const getRoleWeight = (role: string) => {
  const r = role.trim().toLowerCase();
  const index = ROLE_HIERARCHY.findIndex(h => r.includes(h.toLowerCase()));
  return index === -1 ? 999 : index;
};

const formatRoleDisplay = (roleText?: string) => {
  if (!roleText) return "Office Bearer";
  if (roleText.toLowerCase().includes("executive member joint")) {
    return (
      <>
        <span className="block">Executive Member</span>
        <span className="block mt-0.5 font-medium opacity-80 text-[9px] uppercase tracking-wider">Joint Activities Co-ordinator</span>
      </>
    );
  }
  return roleText;
};

const getPersonImage = (person: Person): string => {
  const dbUrl = person.image_url || person.photo || person.photo_url;
  if (dbUrl) {
    if (dbUrl.startsWith("http")) return dbUrl;
    const safePath = encodeURIComponent(dbUrl.trim());
    const { data } = supabase.storage.from("office_bearers").getPublicUrl(safePath);
    return data?.publicUrl;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name || "")}&background=F1F5F9&color=64748B`;
};

const PastOfficeBearersPage = () => {
  const CURRENT_YEAR = 2026;
  const [legacyBearers, setLegacyBearers] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchLegacy = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("office_bearers")
          .select("*")
          .order("year", { ascending: false })
          .order("id", { ascending: true });

        if (error) throw error;
        if (data) {
          // Filter out current year (2026) to only show legacy alumni
          const legacy = data.filter(b => b.year && b.year !== CURRENT_YEAR);
          setLegacyBearers(legacy);
        }
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLegacy();
  }, []);

  const legacyYears = useMemo(() => {
    return Array.from(new Set(legacyBearers.map(b => b.year as number))).sort((a, b) => b - a);
  }, [legacyBearers]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden flex flex-col">
      {/* Background ambient designs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-1/4 w-[700px] h-[700px] bg-indigo-400/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />

      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-8 pb-8 md:pt-10 md:pb-10 overflow-hidden bg-gradient-to-b from-blue-50 via-slate-50 to-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex justify-start mb-4">
            <Link
              to="/team"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 shadow-sm transition"
            >
              <ArrowLeft size={14} />
              Back to Team
            </Link>
          </div>

          <div className="text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 backdrop-blur text-xs font-semibold text-blue-700 shadow-[0_4px_12px_rgba(59,130,246,0.05)] mb-4"
            >
              <History size={14} className="text-blue-600" />
              Leadership Archives
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-3 text-slate-900"
            >
              Leadership <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 font-sans">Alumni</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm md:text-base text-slate-505 max-w-2xl leading-relaxed font-light"
            >
              Explore the historical directory of student office bearers who led the branch across past academic cycles.
            </motion.p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-12 relative z-10 flex-grow w-full">
        {loading ? (
          <div className="py-24 flex flex-col items-center">
            <Loader2 className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-600 rounded-full animate-spin shadow-md" />
            <p className="mt-4 text-slate-505 text-sm font-medium tracking-wide">Fetching Alumni Directory...</p>
          </div>
        ) : errorMsg ? (
          <div className="py-12 text-center text-red-650 font-semibold">{errorMsg}</div>
        ) : legacyYears.length === 0 ? (
          <div className="py-24 text-center">
            <History className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">No Archives Found</h3>
            <p className="text-xs text-slate-500 mt-1">Past academic records have not been uploaded yet.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {legacyYears.map(year => {
              const yearMembers = legacyBearers.filter(b => b.year === year);
              const legacyGroups: Record<string, Person[]> = {};
              yearMembers.forEach(b => {
                const role = (b.role || "Member").trim();
                if (!legacyGroups[role]) legacyGroups[role] = [];
                legacyGroups[role].push(b);
              });
              const sortedGroups = Object.keys(legacyGroups)
                .sort((a, b) => getRoleWeight(a) - getRoleWeight(b))
                .map(role => ({ role, members: legacyGroups[role] }));

              return (
                <div key={year} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                    <History className="h-5 w-5 text-slate-450" />
                    Academic Year: {year} - {year + 1}
                  </h2>

                  <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
                    {sortedGroups.map(group => (
                      <div key={group.role} className="flex-col gap-3 break-inside-avoid mb-6 inline-block w-full">
                        <h4 className="text-[10px] font-black tracking-widest uppercase text-slate-500 border-b border-slate-100 pb-1.5 mb-3">
                          {formatRoleDisplay(group.role)}
                        </h4>
                        <div className="space-y-3">
                          {group.members.map(member => (
                            <div key={member.id} className="bg-slate-50 hover:bg-slate-100/75 rounded-xl p-3 border border-slate-200/60 transition-colors flex items-center gap-3 font-sans">
                              <img
                                src={getPersonImage(member)}
                                alt={member.name}
                                className="w-11 h-11 rounded-lg object-cover border border-slate-250 bg-slate-100 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-extrabold text-slate-800 leading-snug truncate">{member.name}</p>
                                {member.department && (
                                  <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-400 font-bold uppercase truncate">
                                    <Building2 className="w-2.5 h-2.5 shrink-0" />
                                    <span className="truncate">{member.department}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PastOfficeBearersPage;
