import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Users, Crown, ArrowRight, ExternalLink, Table as TableIcon, LayoutGrid, ShieldCheck, UserCheck, Award, Loader2, Plus, X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  // Modal State for Adding New Member directly on Society Page
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [memberForm, setMemberForm] = useState({
    name: "",
    role: "Chairperson",
    category: "bearers" as "bearers" | "executives",
    department: "",
    image_url: "",
  });

  const key = getSocietyKey(societyName);

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

      // Fallback query to new_office_bearers / new_executive_members with group filter
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

  useEffect(() => {
    fetchLeadership();
  }, [key]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error } = await supabase.storage.from("office_bearers").upload(fileName, file);

      if (error) throw error;
      const { data } = supabase.storage.from("office_bearers").getPublicUrl(fileName);
      setMemberForm((prev) => ({ ...prev, image_url: data.publicUrl }));
    } catch (err: any) {
      alert("Error uploading image: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.name.trim()) return alert("Please enter member name.");

    const isBearer = memberForm.category === "bearers";
    const primaryTable = isBearer ? "society_office_bearers" : "society_executive_members";
    const fallbackTable = isBearer ? "new_office_bearers" : "new_executive_members";

    const payload = {
      society_code: key,
      group_name: key,
      name: memberForm.name.trim(),
      role: memberForm.role.trim(),
      department: memberForm.department.trim() || "SREC Engineering",
      academic_year: "2026-2027",
      year: 2026,
      image_url: memberForm.image_url.trim() || null,
    };

    try {
      // Try inserting into society_office_bearers / society_executive_members
      let { error } = await supabase.from(primaryTable).insert([payload]);
      if (error) {
        // Fallback to new_office_bearers / new_executive_members
        const fallbackRes = await supabase.from(fallbackTable).insert([payload]);
        if (fallbackRes.error) throw fallbackRes.error;
      }

      setMemberForm({
        name: "",
        role: "Chairperson",
        category: "bearers",
        department: "",
        image_url: "",
      });
      setIsAddModalOpen(false);
      await fetchLeadership();
    } catch (err: any) {
      alert("Failed to add member: " + err.message);
    }
  };

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
    <div className="w-full col-span-full font-sans relative">
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
          {/* Add Member CTA Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all rounded-lg shadow-md hover:shadow-lg"
          >
            <Plus size={15} />
            <span>Add Member to {key.toUpperCase()}</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === "table" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <TableIcon size={14} />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === "grid" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <LayoutGrid size={14} />
              <span>Card</span>
            </button>
          </div>

          <Link
            to="/office-bearers"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <span>Directory</span>
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

      {/* ADD MEMBER MODAL DIALOG */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden p-6 md:p-8"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-serif font-bold text-slate-900">Add Member to {societyName}</h3>
                  <p className="text-slate-500 text-xs">Add an official Office Bearer or Executive Member to this society.</p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddMemberSubmit} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">Category *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMemberForm({ ...memberForm, category: "bearers" })}
                      className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                        memberForm.category === "bearers" ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      Office Bearer
                    </button>
                    <button
                      type="button"
                      onClick={() => setMemberForm({ ...memberForm, category: "executives" })}
                      className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                        memberForm.category === "executives" ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      Executive Member
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., K S Surya Narayanan"
                    value={memberForm.name}
                    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                    className="w-full border rounded-lg px-3.5 py-2.5 text-sm focus:ring-1 focus:ring-blue-600 outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">Role *</label>
                  <input
                    type="text"
                    placeholder="e.g., Chairperson, Vice-Chairperson, Technical Lead"
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                    className="w-full border rounded-lg px-3.5 py-2.5 text-sm focus:ring-1 focus:ring-blue-600 outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">Department</label>
                  <input
                    type="text"
                    placeholder="e.g., II EEE B, III CSE A"
                    value={memberForm.department}
                    onChange={(e) => setMemberForm({ ...memberForm, department: e.target.value })}
                    className="w-full border rounded-lg px-3.5 py-2.5 text-sm focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">Member Photo (File Upload / URL)</label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 flex items-center justify-between border rounded-lg px-3.5 py-2 bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-semibold text-slate-700">
                      <span className="flex items-center gap-2">
                        <Upload size={14} />
                        {uploading ? "Uploading..." : "Choose Image File"}
                      </span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                  <input
                    type="url"
                    placeholder="Or paste photo URL here..."
                    value={memberForm.image_url}
                    onChange={(e) => setMemberForm({ ...memberForm, image_url: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-600 outline-none mt-1"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition"
                  >
                    Save Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
