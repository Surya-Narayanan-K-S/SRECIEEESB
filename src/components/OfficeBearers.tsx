import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, Edit2, Trash2, Upload, FileUser, X, Link2, Mail, Phone, Globe, ChevronRight } from "lucide-react";

const BEARER_ROLES = [
  "President",
  "Secretary",
  "Vice President",
  "Joint Secretary - Boy",
  "Joint Secretary - Girl",
  "Media Relation Officer",
  "Student Branch Counsellor",
  "Chairperson",
  "Vice Chairperson",
  "Treasurer",
  "Joint Treasurer",
  "Webmaster",
  "Technical Head",
  "Design Head",
  "Content Head",
  "PRO"
];

const EXECUTIVE_ROLES = [
  "Executive Members",
  "Executive Member",
  "Joint Activities Co-ordinator"
];

type Person = {
  id: number;
  name: string;
  role: string;
  department: string | null;
  academic_year: string | null;
  year: number;
  group_name?: string | null;
  image_url: string | null;
  photo: string | null;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  linkedin_url: string | null;
};

const OfficeBearers = () => {
  const [activeSubTab, setActiveSubTab] = useState<"bearers" | "executives">("bearers");

  // State
  const [bearers, setBearers] = useState<Person[]>([]);
  const [executives, setExecutives] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [selectedSocietyFilter, setSelectedSocietyFilter] = useState<string>("all");

  // Forms
  const [form, setForm] = useState({
    id: null as number | null,
    name: "",
    role: "",
    department: "",
    academic_year: "2026-2027",
    year: "2026",
    group_name: "cs",
    image_url: "",
    email: "",
    phone: "",
    website: "",
    linkedin_url: "",
  });

  const fetchBearers = async () => {
    const { data } = await supabase
      .from("new_office_bearers")
      .select("*")
      .order("year", { ascending: false })
      .order("id", { ascending: true });
    setBearers(data || []);
  };

  const fetchExecutives = async () => {
    const { data } = await supabase
      .from("new_executive_members")
      .select("*")
      .order("year", { ascending: false })
      .order("id", { ascending: true });
    setExecutives(data || []);
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchBearers(), fetchExecutives()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error } = await supabase.storage
        .from("office_bearers")
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data } = supabase.storage.from("office_bearers").getPublicUrl(fileName);
      setForm((prev) => ({ ...prev, image_url: data.publicUrl }));
    } catch (err: any) {
      alert("Error uploading image: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      role: "",
      department: "",
      academic_year: "2026-2027",
      year: "2026",
      group_name: "cs",
      image_url: "",
      email: "",
      phone: "",
      website: "",
      linkedin_url: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const table = activeSubTab === "bearers" ? "new_office_bearers" : "new_executive_members";

    const payload = {
      name: form.name,
      role: form.role,
      department: form.department || null,
      academic_year: form.academic_year || null,
      year: Number(form.year),
      group_name: form.group_name || "cs",
      image_url: form.image_url || null,
      email: form.email || null,
      phone: form.phone || null,
      website: form.website || null,
      linkedin_url: form.linkedin_url || null,
    };

    try {
      if (form.id) {
        // Edit
        const { error } = await supabase.from(table).update(payload).eq("id", form.id);
        if (error) throw error;
      } else {
        // Add new
        const { error } = await supabase.from(table).insert([payload]);
        if (error) throw error;
      }
      resetForm();
      await loadData();
    } catch (err: any) {
      alert("Error saving record: " + err.message);
    }
  };

  const handleEdit = (p: Person) => {
    setForm({
      id: p.id,
      name: p.name || "",
      role: p.role || "",
      department: p.department || "",
      academic_year: p.academic_year || "2026-2027",
      year: String(p.year),
      group_name: p.group_name || "cs",
      image_url: p.image_url || p.photo || p.photo_url || "",
      email: p.email || "",
      phone: p.phone || "",
      website: p.website || "",
      linkedin_url: p.linkedin_url || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    const table = activeSubTab === "bearers" ? "new_office_bearers" : "new_executive_members";

    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      await loadData();
    } catch (err: any) {
      alert("Error deleting record: " + err.message);
    }
  };

  const rolesList = activeSubTab === "bearers" ? BEARER_ROLES : EXECUTIVE_ROLES;
  const isPredefined = rolesList.includes(form.role);
  const selectValue = form.role === "" ? "" : (isPredefined ? form.role : "Custom");

  const currentRows = activeSubTab === "bearers" ? bearers : executives;

  return (
    <div className="space-y-8">
      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => {
            setActiveSubTab("bearers");
            resetForm();
          }}
          className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all ${
            activeSubTab === "bearers" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Office Bearers
        </button>
        <button
          onClick={() => {
            setActiveSubTab("executives");
            resetForm();
          }}
          className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all ${
            activeSubTab === "executives" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Executive Members
        </button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
        <h3 className="mb-6 text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileUser size={20} className="text-blue-600" />
          {form.id ? `Edit ${activeSubTab === "bearers" ? "Office Bearer" : "Executive Member"}` : `Add New ${activeSubTab === "bearers" ? "Office Bearer" : "Executive Member"}`}
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Target Society Chapter *</label>
            <select
              value={form.group_name}
              onChange={(e) => setForm({ ...form, group_name: e.target.value })}
              className="rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white text-slate-900 font-semibold"
              required
            >
              <option value="cs">Computer Society (CS)</option>
              <option value="cis">Computational Intelligence Society (CIS)</option>
              <option value="comsoc">Communications Society (ComSoc)</option>
              <option value="embs">Engineering in Medicine & Biology Society (EMBS)</option>
              <option value="im">Instrumentation & Measurement Society (IMS)</option>
              <option value="pels">Power Electronics Society (PELS)</option>
              <option value="wie">Women in Engineering (WIE)</option>
              <option value="srec">IEEE SREC Student Branch (Main SB)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Name *</label>
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Role *</label>
            <select
              value={selectValue}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "Custom") {
                  setForm({ ...form, role: "" });
                } else {
                  setForm({ ...form, role: val });
                }
              }}
              className="rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white text-slate-900"
              required
            >
              <option value="" disabled>Select a Role</option>
              {rolesList.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
              <option value="Custom">Custom Role (Type below)...</option>
            </select>

            {(selectValue === "Custom" || !isPredefined) && (
              <input
                type="text"
                placeholder="Type custom role name..."
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mt-2 rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Department</label>
            <input
              type="text"
              placeholder="e.g., CSE, ECE, BME"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Academic Year</label>
            <input
              type="text"
              placeholder="e.g., 2025-2026"
              value={form.academic_year}
              onChange={(e) => setForm({ ...form, academic_year: e.target.value })}
              className="rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Calendar Year *</label>
            <input
              type="number"
              placeholder="e.g., 2025"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              className="rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Profile Picture (Supabase Storage)</label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-between border rounded-lg px-4 py-2.5 bg-slate-50 hover:bg-slate-100 cursor-pointer text-sm font-semibold transition text-slate-600">
                <span className="flex items-center gap-2">
                  <Upload size={16} />
                  {uploading ? "Uploading..." : "Choose Profile Pic"}
                </span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              {form.image_url && (
                <div className="relative w-11 h-11 rounded-lg border overflow-hidden shrink-0">
                  <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, image_url: "" }))}
                    className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Mail size={12}/> Email</label>
            <input
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Phone size={12}/> Phone</label>
            <input
              type="text"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Globe size={12}/> Portfolio Website</label>
            <input
              type="url"
              placeholder="https://..."
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Link2 size={12}/> LinkedIn Profile</label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/..."
              value={form.linkedin_url}
              onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
              className="rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 hover:bg-blue-700 px-6 py-3 font-semibold text-white text-sm transition-all"
            disabled={uploading}
          >
            {form.id ? "Update Member" : "Add Member"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg bg-slate-100 hover:bg-slate-200 px-6 py-3 font-semibold text-sm transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List Table */}
      <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm">
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : currentRows.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-medium">No personnel added yet.</div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 text-left">Member</th>
                <th className="px-5 py-3.5 text-left">Role</th>
                <th className="px-5 py-3.5 text-left">Department</th>
                <th className="px-5 py-3.5 text-center">Calendar Year</th>
                <th className="px-5 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-slate-50/55 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-semibold text-slate-800 flex items-center gap-3">
                    <img
                      src={row.image_url || row.photo || row.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=E0F2FE&color=0369A1`}
                      alt={row.name}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-100 bg-slate-50 shrink-0"
                    />
                    <div>
                      <div className="text-slate-900">{row.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{row.academic_year || "N/A"}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-650 font-medium">{row.role}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-650 font-medium">{row.department || "General"}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-650 font-medium text-center">{row.year}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-650 font-medium text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(row)}
                        className="p-2 hover:bg-slate-100 text-amber-600 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="p-2 hover:bg-slate-100 text-red-600 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OfficeBearers;
