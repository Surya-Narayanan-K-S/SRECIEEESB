import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Crown, ShieldCheck, Plus, Trash2, Edit2, Upload, Search, CheckCircle2, Loader2, RefreshCw, X, Linkedin, } from "lucide-react";
const SOCIETIES_CONFIG = [
    { code: "cs", name: "IEEE Computer Society (CS)", color: "from-blue-600 to-cyan-600", border: "border-cyan-500/40" },
    { code: "cis", name: "IEEE Computational Intelligence Society (CIS)", color: "from-purple-600 to-indigo-600", border: "border-indigo-500/40" },
    { code: "comsoc", name: "IEEE Communications Society (ComSoc)", color: "from-emerald-600 to-teal-600", border: "border-emerald-500/40" },
    { code: "embs", name: "IEEE Engineering in Medicine & Biology (EMBS)", color: "from-rose-600 to-pink-600", border: "border-rose-500/40" },
    { code: "im", name: "IEEE Instrumentation & Measurement (IM)", color: "from-amber-600 to-orange-600", border: "border-amber-500/40" },
    { code: "pels", name: "IEEE Power Electronics Society (PELS)", color: "from-yellow-600 to-amber-600", border: "border-yellow-500/40" },
    { code: "cas", name: "IEEE Circuits and Systems Society (CAS)", color: "from-teal-600 to-cyan-700", border: "border-teal-500/40" },
    { code: "wie", name: "IEEE Women in Engineering (WIE)", color: "from-pink-600 to-purple-700", border: "border-pink-500/40" },
    { code: "srec", name: "IEEE Student Branch SREC (Main SB)", color: "from-blue-700 to-indigo-900", border: "border-blue-500/40" },
];
export const SocietyLeadershipAdmin = () => {
    const [selectedSociety, setSelectedSociety] = useState("cs");
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [bearers, setBearers] = useState([]);
    const [executives, setExecutives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editingCategory, setEditingCategory] = useState("bearers");
    const [editingSourceTable, setEditingSourceTable] = useState(null);
    const [form, setForm] = useState({
        name: "",
        role: "Chairperson",
        category: "bearers",
        department: "",
        academic_year: "2024-2025",
        linkedin_url: "",
        image_url: "",
    });
    const currentSocietyObj = useMemo(() => SOCIETIES_CONFIG.find((s) => s.code === selectedSociety) || SOCIETIES_CONFIG[0], [selectedSociety]);
    const fetchLeadership = useCallback(async () => {
        setLoading(true);
        try {
            const safeFetch = async (table) => {
                try {
                    const { data, error } = await supabase.from(table).select("*").order("id", { ascending: true });
                    if (error)
                        return [];
                    return data || [];
                }
                catch {
                    return [];
                }
            };
            if (selectedSociety === "srec") {
                const [bearersData, execsData] = await Promise.all([
                    safeFetch("srec_office_bearers"),
                    safeFetch("srec_executive_members"),
                ]);
                setBearers(bearersData.map((m) => ({ ...m, _sourceTable: "srec_office_bearers" })));
                setExecutives(execsData.map((m) => ({ ...m, _sourceTable: "srec_executive_members" })));
            }
            else {
                const dedicatedTableB = `${selectedSociety}_office_bearers`;
                const dedicatedTableE = `${selectedSociety}_executive_members`;
                let [dedicatedB, dedicatedE] = await Promise.all([
                    safeFetch(dedicatedTableB),
                    safeFetch(dedicatedTableE),
                ]);
                if (selectedSociety === "im" && dedicatedB.length === 0 && dedicatedE.length === 0) {
                    const [imsB, imsE] = await Promise.all([
                        safeFetch("ims_office_bearers"),
                        safeFetch("ims_executive_members"),
                    ]);
                    if (imsB.length > 0 || imsE.length > 0) {
                        dedicatedB = imsB;
                        dedicatedE = imsE;
                    }
                }
                if (selectedSociety === "cas" && dedicatedB.length === 0 && dedicatedE.length === 0) {
                    const [cassB, cassE] = await Promise.all([
                        safeFetch("cass_office_bearers"),
                        safeFetch("cass_executive_members"),
                    ]);
                    if (cassB.length > 0 || cassE.length > 0) {
                        dedicatedB = cassB;
                        dedicatedE = cassE;
                    }
                }
                setBearers(dedicatedB.map((m) => ({ ...m, _sourceTable: dedicatedTableB })));
                setExecutives(dedicatedE.map((m) => ({ ...m, _sourceTable: dedicatedTableE })));
            }
        }
        catch (err) {
            console.error("Error fetching leadership for admin:", err);
        }
        finally {
            setLoading(false);
        }
    }, [selectedSociety]);
    useEffect(() => {
        fetchLeadership();
    }, [fetchLeadership]);
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        try {
            setUploading(true);
            const fileExt = file.name.split(".").pop() || "jpg";
            const fileName = `society-${selectedSociety}-${Date.now()}.${fileExt}`;
            const filePath = `leadership/${fileName}`;
            const candidateBuckets = [
                "office_bearers",
                "society_members",
                "leadership_portraits",
                "member-avatars",
                "photos",
                "ieee-cards",
            ];
            let uploadedUrl = null;
            for (const bucket of candidateBuckets) {
                try {
                    const { error: upErr } = await supabase.storage
                        .from(bucket)
                        .upload(filePath, file, { upsert: true });
                    if (!upErr) {
                        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
                        if (data?.publicUrl) {
                            uploadedUrl = data.publicUrl;
                            break;
                        }
                    }
                }
                catch {
                    // try next bucket
                }
            }
            // If storage bucket is not yet created, fallback smoothly to DataURL
            if (!uploadedUrl) {
                uploadedUrl = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            }
            setForm((prev) => ({ ...prev, image_url: uploadedUrl || "" }));
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : "Upload error";
            alert("Photo upload note: " + msg);
        }
        finally {
            setUploading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            alert("Please enter member name.");
            return;
        }
        try {
            setSubmitting(true);
            const isBearer = form.category === "bearers";
            const targetTable = selectedSociety === "srec"
                ? isBearer
                    ? "srec_office_bearers"
                    : "srec_executive_members"
                : isBearer
                    ? `${selectedSociety}_office_bearers`
                    : `${selectedSociety}_executive_members`;
            const primaryTable = editingSourceTable || targetTable;
            // Clean ID for database integer column
            const cleanDbId = editingId ? String(editingId).replace(/^(ob|em|fb-b|fb-e)-/i, "") : null;
            const payload = {
                name: form.name.trim(),
                role: form.role.trim(),
                department: form.department.trim() || null,
                academic_year: form.academic_year.trim() || "2026-2027",
                year: new Date().getFullYear(),
                linkedin_url: form.linkedin_url.trim() || null,
                image_url: form.image_url.trim() || null,
            };
            // Resilient Execute with auto schema recovery
            const executeSave = async (table, data) => {
                const curData = { ...data };
                let res = cleanDbId && /^\d+$/.test(cleanDbId)
                    ? await supabase.from(table).update(curData).eq("id", parseInt(cleanDbId, 10))
                    : await supabase.from(table).insert([curData]);
                // Auto-fix missing column errors
                if (res.error?.message) {
                    const errMsg = res.error.message;
                    const colMatch = errMsg.match(/Could not find the '([^']+)' column/) ||
                        errMsg.match(/column "([^"]+)" of relation/) ||
                        errMsg.match(/column "([^"]+)" does not exist/);
                    if (colMatch?.[1] && curData[colMatch[1]] !== undefined) {
                        delete curData[colMatch[1]];
                        res = cleanDbId && /^\d+$/.test(cleanDbId)
                            ? await supabase.from(table).update(curData).eq("id", parseInt(cleanDbId, 10))
                            : await supabase.from(table).insert([curData]);
                    }
                }
                return res;
            };
            let result = await executeSave(primaryTable, payload);
            if (result.error)
                throw result.error;
            alert(editingId ? `Updated ${form.name} successfully!` : `Added ${form.name} to ${currentSocietyObj.name} successfully!`);
            resetForm();
            fetchLeadership();
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : "Database error";
            alert("Operation failed: " + msg);
        }
        finally {
            setSubmitting(false);
        }
    };
    const handleDelete = async (id, category, name) => {
        if (!window.confirm(`Are you sure you want to delete ${name}?`))
            return;
        try {
            const isBearer = category === "bearers";
            const targetTable = selectedSociety === "srec"
                ? isBearer
                    ? "srec_office_bearers"
                    : "srec_executive_members"
                : isBearer
                    ? `${selectedSociety}_office_bearers`
                    : `${selectedSociety}_executive_members`;
            const member = [...bearers, ...executives].find((m) => m.id === id || m.name === name);
            const tableToDelete = member?._sourceTable || targetTable;
            const cleanDbId = String(id).replace(/^(ob|em|fb-b|fb-e)-/i, "");
            try {
                if (/^\d+$/.test(cleanDbId)) {
                    await supabase.from(tableToDelete).delete().eq("id", parseInt(cleanDbId, 10));
                }
                if (name) {
                    await supabase.from(tableToDelete).delete().ilike("name", name.trim());
                }
            }
            catch {
                // ignore
            }
            alert(`Deleted ${name} from ${currentSocietyObj.name}.`);
            fetchLeadership();
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : "Database error";
            alert("Delete failed: " + msg);
        }
    };
    const handleEdit = (member, category) => {
        setEditingId(member.id);
        setEditingCategory(category);
        setEditingSourceTable(member._sourceTable || null);
        setForm({
            name: member.name || "",
            role: member.role || "Chairperson",
            category,
            department: member.department || "",
            academic_year: member.academic_year || "2026-2027",
            linkedin_url: member.linkedin_url || "",
            image_url: member.image_url || member.photo || member.photo_url || "",
        });
        window.scrollTo({ top: 400, behavior: "smooth" });
    };
    const resetForm = () => {
        setEditingId(null);
        setEditingSourceTable(null);
        setForm({
            name: "",
            role: "Chairperson",
            category: "bearers",
            department: "",
            academic_year: "2026-2027",
            linkedin_url: "",
            image_url: "",
        });
    };
    const filteredBearers = useMemo(() => {
        if (!searchQuery.trim())
            return bearers;
        const q = searchQuery.toLowerCase();
        return bearers.filter((b) => b.name?.toLowerCase().includes(q) ||
            b.role?.toLowerCase().includes(q) ||
            b.department?.toLowerCase().includes(q));
    }, [bearers, searchQuery]);
    const filteredExecutives = useMemo(() => {
        if (!searchQuery.trim())
            return executives;
        const q = searchQuery.toLowerCase();
        return executives.filter((e) => e.name?.toLowerCase().includes(q) ||
            e.role?.toLowerCase().includes(q) ||
            e.department?.toLowerCase().includes(q));
    }, [executives, searchQuery]);
    return (<div className="space-y-10 text-slate-100 font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#0b1e3b] to-slate-900 border border-cyan-500/30 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-wider mb-3">
              <Crown size={14}/>
              <span>Society Leadership Console</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight font-serif">
              Society Office Bearers &amp; Executives
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Create, update, and manage official office bearer tables, executive committee members, and photo files across all 9 IEEE student societies.
            </p>
          </div>

          <button type="button" onClick={fetchLeadership} className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition shadow-md cursor-pointer">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""}/>
            <span>Refresh Leadership</span>
          </button>
        </div>
      </div>

      {/* Society Switcher Grid */}
      <div className="space-y-3">
        <label className="text-xs font-black text-cyan-400 uppercase tracking-wider">
          Select Society to Manage
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SOCIETIES_CONFIG.map((soc) => {
            const isSelected = selectedSociety === soc.code;
            return (<button key={soc.code} type="button" onClick={() => {
                    setSelectedSociety(soc.code);
                    resetForm();
                }} className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${isSelected
                    ? "bg-gradient-to-br " + soc.color + " border-white/40 text-white shadow-lg shadow-cyan-500/20 scale-[1.02]"
                    : "bg-[#0c1626] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-black/20">
                    {soc.code.toUpperCase()}
                  </span>
                  {isSelected && <CheckCircle2 size={16} className="text-white"/>}
                </div>
                <span className="font-bold text-xs leading-tight line-clamp-2">
                  {soc.name}
                </span>
              </button>);
        })}
        </div>
      </div>

      {/* Add / Edit Member Form Card */}
      <form onSubmit={handleSubmit} className="rounded-3xl bg-[#0c1626] border border-slate-800 p-8 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              {editingId ? <Edit2 size={18}/> : <Plus size={18}/>}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {editingId ? "Edit Leadership Member" : `Add Member to ${currentSocietyObj.name}`}
              </h3>
              <p className="text-xs text-slate-400">
                Upload portrait photo to Supabase storage and save official designation.
              </p>
            </div>
          </div>

          {editingId && (<button type="button" onClick={resetForm} className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800">
              <X size={14}/> Cancel Edit
            </button>)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Member Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Member Full Name *
            </label>
            <input type="text" required placeholder="e.g. S Darshan" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#070e17] border border-slate-700 text-sm font-semibold text-white focus:border-cyan-400 focus:outline-none"/>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Category *
            </label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#070e17] border border-slate-700 text-sm font-semibold text-white focus:border-cyan-400 focus:outline-none">
              <option value="bearers">Core Office Bearer</option>
              <option value="executives">Executive Committee Member</option>
            </select>
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Designated Role *
            </label>
            <input type="text" required list="admin-role-suggestions" placeholder="e.g. Program Coordinator / Chairperson / Secretary" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#070e17] border border-slate-700 text-sm font-semibold text-white focus:border-cyan-400 focus:outline-none"/>
            <datalist id="admin-role-suggestions">
              <option value="Program Coordinator"/>
              <option value="Faculty Advisor"/>
              <option value="Student Branch Counsellor"/>
              <option value="Chairperson"/>
              <option value="Vice Chairperson"/>
              <option value="Secretary"/>
              <option value="Joint Secretary"/>
              <option value="Treasurer"/>
              <option value="Joint Treasurer"/>
              <option value="Activity Coordinator"/>
              <option value="Social Media Lead"/>
              <option value="Social Media"/>
              <option value="Media Relation Officer"/>
              <option value="Webmaster"/>
              <option value="Technical Head"/>
              <option value="Design Head"/>
              <option value="Content Head"/>
              <option value="Executive Member"/>
            </datalist>
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Department &amp; Year
            </label>
            <input type="text" placeholder="e.g. IV EEE / III CSE A" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#070e17] border border-slate-700 text-sm font-semibold text-white focus:border-cyan-400 focus:outline-none"/>
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Academic Year
            </label>
            <input type="text" placeholder="2024-2025" value={form.academic_year} onChange={(e) => setForm({ ...form, academic_year: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#070e17] border border-slate-700 text-sm font-semibold text-white focus:border-cyan-400 focus:outline-none"/>
          </div>

          {/* LinkedIn Profile URL */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2 items-center gap-1.5">
              <Linkedin size={13} className="text-cyan-400"/> LinkedIn Profile Link
            </label>
            <div className="relative">
              <input type="url" placeholder="https://linkedin.com/in/username" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#070e17] border border-slate-700 text-sm font-semibold text-white focus:border-cyan-400 focus:outline-none placeholder:text-slate-500"/>
              <Linkedin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none"/>
            </div>
          </div>

          {/* Photo File Upload directly to Supabase Bucket */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Upload Photo (Supabase Storage)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-700 hover:border-cyan-400 bg-[#070e17] text-xs font-bold text-slate-300 transition">
                <Upload size={15} className="text-cyan-400"/>
                <span>{uploading ? "Uploading to Bucket..." : "Choose Image File"}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden"/>
              </label>

              {form.image_url && (<div className="w-11 h-11 rounded-xl bg-slate-800 overflow-hidden border border-cyan-400 shrink-0">
                  <img src={form.image_url} alt="Preview" className="w-full h-full object-cover"/>
                </div>)}
            </div>
            {form.image_url && (<p className="text-[11px] text-cyan-400 font-mono mt-1.5 truncate">
                ✓ URL: {form.image_url}
              </p>)}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end gap-3">
          {editingId && (<button type="button" onClick={resetForm} className="px-6 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white font-bold text-xs">
              Cancel
            </button>)}
          <button type="submit" disabled={submitting || uploading} className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/20 flex items-center gap-2">
            {submitting ? <Loader2 size={16} className="animate-spin"/> : <CheckCircle2 size={16}/>}
            <span>{editingId ? "Update Member" : "Save Leadership Member"}</span>
          </button>
        </div>
      </form>

      {/* Tables Section for Selected Society */}
      <div className="space-y-6">
        {/* Toolbar: Category Filter & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            <button type="button" onClick={() => setActiveCategory("all")} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition ${activeCategory === "all" ? "bg-cyan-500 text-slate-950 shadow-md" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
              All Tables ({bearers.length + executives.length})
            </button>
            <button type="button" onClick={() => setActiveCategory("bearers")} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition ${activeCategory === "bearers" ? "bg-cyan-500 text-slate-950 shadow-md" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
              Office Bearers ({bearers.length})
            </button>
            <button type="button" onClick={() => setActiveCategory("executives")} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition ${activeCategory === "executives" ? "bg-cyan-500 text-slate-950 shadow-md" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
              Executive Members ({executives.length})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input type="text" placeholder="Search table..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#070e17] border border-slate-700 text-xs font-semibold text-white focus:border-cyan-400 focus:outline-none"/>
          </div>
        </div>

        {loading ? (<div className="p-16 flex flex-col items-center justify-center gap-3 bg-[#0c1626] border border-slate-800 rounded-3xl">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400"/>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Loading {currentSocietyObj.name} records...
            </span>
          </div>) : (<div className="space-y-8">
            {/* Office Bearers Table */}
            {(activeCategory === "all" || activeCategory === "bearers") && (<div className="rounded-3xl bg-[#0c1626] border border-slate-800 overflow-hidden shadow-xl">
                <div className="p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-white">
                    <Crown size={18} className="text-amber-400"/>
                    <h4 className="font-serif font-bold text-sm sm:text-base">
                      {currentSocietyObj.name} — Office Bearers Table
                    </h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-black uppercase">
                    {filteredBearers.length} Officers
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#070e17] text-slate-400 uppercase tracking-widest font-black border-b border-slate-800 text-[10px]">
                        <th className="py-3.5 px-5 w-14">#</th>
                        <th className="py-3.5 px-5">Photo</th>
                        <th className="py-3.5 px-5">Name</th>
                        <th className="py-3.5 px-5">Designated Role</th>
                        <th className="py-3.5 px-5">Department</th>
                        <th className="py-3.5 px-5">Academic Year</th>
                        <th className="py-3.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                      {filteredBearers.length === 0 ? (<tr>
                          <td colSpan={7} className="py-10 text-center text-slate-500 font-semibold">
                            No office bearers recorded for this society. Use the form above to add members.
                          </td>
                        </tr>) : (filteredBearers.map((person, idx) => {
                    const imgSrc = person.image_url || person.photo || person.photo_url;
                    return (<tr key={person.id || idx} className="hover:bg-slate-800/40 transition">
                              <td className="py-3 px-5 text-slate-500 font-bold">{idx + 1}</td>
                              <td className="py-3 px-5">
                                <div className="w-9 h-9 rounded-xl bg-slate-800 overflow-hidden border border-slate-700 flex items-center justify-center">
                                  {imgSrc ? (<img src={imgSrc} alt={person.name} className="w-full h-full object-cover"/>) : (<span className="font-bold text-xs text-slate-400">
                                      {person.name?.slice(0, 2).toUpperCase()}
                                    </span>)}
                                </div>
                              </td>
                              <td className="py-3 px-5 font-bold text-white text-sm">
                                {person.name}
                              </td>
                              <td className="py-3 px-5">
                                <span className="inline-block px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-cyan-300 font-bold text-[11px] uppercase">
                                  {person.role}
                                </span>
                              </td>
                              <td className="py-3 px-5 text-slate-400 font-semibold">
                                {person.department || "SREC"}
                              </td>
                              <td className="py-3 px-5 text-slate-400 font-mono">
                                {person.academic_year || "2024-2025"}
                              </td>
                              <td className="py-3 px-5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button type="button" onClick={() => handleEdit(person, "bearers")} className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white transition">
                                    <Edit2 size={13}/>
                                  </button>
                                  <button type="button" onClick={() => handleDelete(person.id, "bearers", person.name)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition">
                                    <Trash2 size={13}/>
                                  </button>
                                </div>
                              </td>
                            </tr>);
                }))}
                    </tbody>
                  </table>
                </div>
              </div>)}

            {/* Executive Members Table */}
            {(activeCategory === "all" || activeCategory === "executives") && (<div className="rounded-3xl bg-[#0c1626] border border-slate-800 overflow-hidden shadow-xl">
                <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-white">
                    <ShieldCheck size={18} className="text-indigo-400"/>
                    <h4 className="font-serif font-bold text-sm sm:text-base">
                      {currentSocietyObj.name} — Executive Committee Members Table
                    </h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-black uppercase">
                    {filteredExecutives.length} Executives
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#070e17] text-slate-400 uppercase tracking-widest font-black border-b border-slate-800 text-[10px]">
                        <th className="py-3.5 px-5 w-14">#</th>
                        <th className="py-3.5 px-5">Photo</th>
                        <th className="py-3.5 px-5">Name</th>
                        <th className="py-3.5 px-5">Designated Role</th>
                        <th className="py-3.5 px-5">Department</th>
                        <th className="py-3.5 px-5">Academic Year</th>
                        <th className="py-3.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                      {filteredExecutives.length === 0 ? (<tr>
                          <td colSpan={7} className="py-10 text-center text-slate-500 font-semibold">
                            No executive members recorded for this society. Use the form above to add members.
                          </td>
                        </tr>) : (filteredExecutives.map((person, idx) => {
                    const imgSrc = person.image_url || person.photo || person.photo_url;
                    return (<tr key={person.id || idx} className="hover:bg-slate-800/40 transition">
                              <td className="py-3 px-5 text-slate-500 font-bold">{idx + 1}</td>
                              <td className="py-3 px-5">
                                <div className="w-9 h-9 rounded-xl bg-slate-800 overflow-hidden border border-slate-700 flex items-center justify-center">
                                  {imgSrc ? (<img src={imgSrc} alt={person.name} className="w-full h-full object-cover"/>) : (<span className="font-bold text-xs text-slate-400">
                                      {person.name?.slice(0, 2).toUpperCase()}
                                    </span>)}
                                </div>
                              </td>
                              <td className="py-3 px-5 font-bold text-white text-sm">
                                {person.name}
                              </td>
                              <td className="py-3 px-5">
                                <span className="inline-block px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold text-[11px] uppercase">
                                  {person.role}
                                </span>
                              </td>
                              <td className="py-3 px-5 text-slate-400 font-semibold">
                                {person.department || "SREC"}
                              </td>
                              <td className="py-3 px-5 text-slate-400 font-mono">
                                {person.academic_year || "2024-2025"}
                              </td>
                              <td className="py-3 px-5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button type="button" onClick={() => handleEdit(person, "executives")} className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition">
                                    <Edit2 size={13}/>
                                  </button>
                                  <button type="button" onClick={() => handleDelete(person.id, "executives", person.name)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition">
                                    <Trash2 size={13}/>
                                  </button>
                                </div>
                              </td>
                            </tr>);
                }))}
                    </tbody>
                  </table>
                </div>
              </div>)}
          </div>)}
      </div>
    </div>);
};
export default SocietyLeadershipAdmin;
