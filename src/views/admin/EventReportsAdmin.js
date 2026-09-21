import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { FileText, PlusCircle, X, Upload, Loader2, Search, Check, Eye, Images } from "lucide-react";
export const EventReportsAdmin = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReport, setEditingReport] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [photosList, setPhotosList] = useState([]);
    const [newPhotoUrlInput, setNewPhotoUrlInput] = useState("");
    const [form, setForm] = useState({
        title: "",
        date: "",
        venue: "PSG Institute of Technology and Applied Research, Coimbatore",
        organized_by: "IEEE Madras Section",
        academic_year: "2025-2026",
        society_code: "IEEE SB",
        category: "Hub Congress",
        certificate_urls: "",
        event_overview: "",
        key_highlights: "",
        conclusion_text: "",
        status: "PUBLISHED"
    });
    const parsePhotos = (photo_url, photo_urls) => {
        const list = [];
        if (photo_urls && photo_urls.trim()) {
            try {
                if (photo_urls.startsWith("[") && photo_urls.endsWith("]")) {
                    const parsed = JSON.parse(photo_urls);
                    if (Array.isArray(parsed))
                        list.push(...parsed.filter(Boolean));
                }
                else {
                    list.push(...photo_urls.split(",").map((s) => s.trim()).filter(Boolean));
                }
            }
            catch {
                list.push(...photo_urls.split(",").map((s) => s.trim()).filter(Boolean));
            }
        }
        if (photo_url && photo_url.trim() && !list.includes(photo_url.trim())) {
            list.unshift(photo_url.trim());
        }
        return Array.from(new Set(list));
    };
    const fetchReports = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("event_reports")
                .select("*")
                .order("id", { ascending: false });
            if (!error && data) {
                setReports(data);
            }
            else {
                setReports([]);
            }
        }
        catch (err) {
            console.warn("Error fetching event reports:", err);
            setReports([]);
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchReports();
        const channel = supabase
            .channel("admin-event-reports-sync")
            .on("postgres_changes", { event: "*", schema: "public", table: "event_reports" }, () => {
            fetchReports();
        })
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchReports]);
    const handleOpenAdd = () => {
        setEditingReport(null);
        setPhotosList([]);
        setNewPhotoUrlInput("");
        setForm({
            title: "",
            date: "",
            venue: "PSG Institute of Technology and Applied Research, Coimbatore",
            organized_by: "IEEE Madras Section",
            academic_year: "2025-2026",
            society_code: "IEEE SB",
            category: "Hub Congress",
            certificate_urls: "",
            event_overview: "",
            key_highlights: "",
            conclusion_text: "",
            status: "PUBLISHED"
        });
        setIsModalOpen(true);
    };
    const handleOpenEdit = (item) => {
        setEditingReport(item);
        setPhotosList(parsePhotos(item.photo_url, item.photo_urls));
        setNewPhotoUrlInput("");
        setForm({
            title: item.title || "",
            date: item.date || "",
            venue: item.venue || "",
            organized_by: item.organized_by || "IEEE Madras Section",
            academic_year: item.academic_year || "2025-2026",
            society_code: item.society_code || "IEEE SB",
            category: item.category || "Hub Congress",
            certificate_urls: item.certificate_urls || "",
            event_overview: item.event_overview || "",
            key_highlights: item.key_highlights || "",
            conclusion_text: item.conclusion_text || "",
            status: item.status || "PUBLISHED"
        });
        setIsModalOpen(true);
    };
    // Upload one or multiple photos to Supabase storage with multi-bucket fallback
    const handleUploadPhotos = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0)
            return;
        try {
            setIsUploadingPhoto(true);
            const newUrls = [];
            const candidateBuckets = ["reports", "member-avatars", "activities", "ieee-cards"];
            let lastUploadError = null;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileExt = file.name.split(".").pop() || "jpg";
                const fileName = `report_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
                let uploaded = false;

                for (const bucket of candidateBuckets) {
                    try {
                        const { error } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true });
                        if (!error) {
                            const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
                            if (data?.publicUrl) {
                                newUrls.push(data.publicUrl);
                                uploaded = true;
                                break;
                            }
                        } else {
                            lastUploadError = error;
                        }
                    } catch (err) {
                        lastUploadError = err;
                    }
                }

                // If cloud storage bucket failed, fallback to base64 data URL so user work isn't lost
                if (!uploaded) {
                    const reader = new FileReader();
                    await new Promise((resolve) => {
                        reader.onload = (readEvent) => {
                            if (readEvent.target?.result) {
                                newUrls.push(readEvent.target.result);
                            }
                            resolve();
                        };
                        reader.readAsDataURL(file);
                    });
                }
            }

            if (newUrls.length > 0) {
                setPhotosList((prev) => [...prev, ...newUrls].slice(0, 8));
                if (lastUploadError && !newUrls[0].startsWith("http")) {
                    alert(`Photos loaded! Note: Supabase storage upload had a notice (${lastUploadError.message || "bucket permissions"}), but photos were attached for saving.`);
                } else {
                    alert(`Uploaded ${newUrls.length} photo(s) successfully!`);
                }
            }
        }
        catch (err) {
            alert("Error uploading images: " + (err.message || "Please check storage bucket."));
        }
        finally {
            setIsUploadingPhoto(false);
            e.target.value = "";
        }
    };
    const handleAddManualPhotoUrl = () => {
        if (!newPhotoUrlInput.trim())
            return;
        setPhotosList((prev) => [...prev, newPhotoUrlInput.trim()].slice(0, 6));
        setNewPhotoUrlInput("");
    };
    const handleRemovePhoto = (index) => {
        setPhotosList((prev) => prev.filter((_, i) => i !== index));
    };
    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.date.trim()) {
            alert("Please provide the Report Title and Date.");
            return;
        }
        try {
            setIsSaving(true);
            const primaryPhoto = photosList[0] || null;
            const photoUrlsString = photosList.length > 0 ? JSON.stringify(photosList) : null;
            const payload = {
                title: form.title.trim(),
                date: form.date.trim(),
                venue: form.venue.trim() || "SREC Campus",
                organized_by: form.organized_by.trim() || "IEEE Madras Section",
                academic_year: form.academic_year || "2025-2026",
                society_code: form.society_code || "IEEE SB",
                category: form.category || "Hub Congress",
                photo_url: primaryPhoto,
                photo_urls: photoUrlsString,
                certificate_urls: form.certificate_urls.trim() || null,
                event_overview: form.event_overview.trim() || null,
                key_highlights: form.key_highlights.trim() || null,
                conclusion_text: form.conclusion_text.trim() || null,
                status: form.status || "PUBLISHED"
            };
            if (editingReport) {
                const { error } = await supabase
                    .from("event_reports")
                    .update(payload)
                    .eq("id", editingReport.id);
                if (error)
                    throw error;
                alert("Report updated successfully with photos!");
            }
            else {
                const { error } = await supabase.from("event_reports").insert([payload]);
                if (error)
                    throw error;
                alert("Report published to database with photos successfully!");
            }
            setIsModalOpen(false);
            await fetchReports();
        }
        catch (err) {
            alert("Database error: " + (err.message || ""));
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this event report from database?"))
            return;
        try {
            const { error } = await supabase.from("event_reports").delete().eq("id", id);
            if (error)
                throw error;
            alert("Report deleted successfully!");
            await fetchReports();
        }
        catch (err) {
            alert("Error deleting report: " + (err.message || ""));
        }
    };
    const filteredReports = reports.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.venue.toLowerCase().includes(search.toLowerCase()) ||
        r.organized_by.toLowerCase().includes(search.toLowerCase()));
    return (<div className="space-y-6 text-zinc-100 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0d0d12] to-[#07070a] p-6 rounded-3xl border border-amber-500/25 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <FileText size={20}/>
            </span>
            <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300">Event Reports Manager</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Publish official IEEE Congress and Event reports with 3–4 photos per event stored in <code className="font-mono text-amber-400">public.event_reports</code>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a href="/reports" target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-xl bg-[#14141c] hover:bg-[#1a1a24] text-zinc-300 hover:text-amber-300 text-xs font-bold transition flex items-center gap-1.5 border border-amber-500/20">
            <Eye size={14}/>
            <span>View Public Reports</span>
          </a>

          <button type="button" onClick={handleOpenAdd} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-black text-xs font-black uppercase tracking-wider transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer">
            <PlusCircle size={16}/>
            <span>Add Event Report</span>
          </button>
        </div>
      </div>

      {/* Search and Stats Bar */}
      <div className="flex items-center justify-between gap-4 bg-[#0b0b0f] p-4 rounded-2xl border border-amber-500/20 shadow-md">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400"/>
          <input type="text" placeholder="Search reports by title, venue, or organized by..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#050507] border border-amber-500/20 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"/>
        </div>

        <div className="text-xs text-zinc-400 font-bold flex items-center gap-2">
          <span>Total Database Reports:</span>
          <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-300 font-mono border border-amber-500/30">
            {reports.length}
          </span>
        </div>
      </div>

      {/* Reports Table List */}
      {loading ? (<div className="p-12 text-center text-zinc-400 space-y-3 bg-[#0b0b0f] rounded-3xl border border-amber-500/20">
          <Loader2 size={32} className="mx-auto text-amber-400 animate-spin"/>
          <p className="text-xs font-mono">Loading reports from database...</p>
        </div>) : filteredReports.length === 0 ? (<div className="p-12 text-center space-y-3 bg-[#0b0b0f] rounded-3xl border border-amber-500/20 text-zinc-400">
          <FileText size={36} className="mx-auto text-zinc-600"/>
          <h3 className="text-sm font-bold text-white uppercase">No Event Reports Found in Database</h3>
          <p className="text-xs text-zinc-500">Click "Add Event Report" above to publish your report with 3–4 photos.</p>
        </div>) : (<div className="overflow-x-auto rounded-3xl bg-[#0b0b0f] border border-amber-500/20 shadow-2xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#050507] text-amber-400 border-b border-amber-500/20">
                <th className="p-4 font-black uppercase text-[10px] tracking-wider">Report Title</th>
                <th className="p-4 font-black uppercase text-[10px] tracking-wider">Date &amp; Year</th>
                <th className="p-4 font-black uppercase text-[10px] tracking-wider">Venue</th>
                <th className="p-4 font-black uppercase text-[10px] tracking-wider">Photos</th>
                <th className="p-4 font-black uppercase text-[10px] tracking-wider">Organized By</th>
                <th className="p-4 font-black uppercase text-[10px] tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredReports.map((row) => {
                const photos = parsePhotos(row.photo_url, row.photo_urls);
                return (<tr key={row.id} className="hover:bg-amber-500/5 transition-colors">
                    <td className="p-4 min-w-[220px]">
                      <div className="font-black text-white">{row.title}</div>
                      <div className="text-[10px] text-amber-400 font-mono mt-0.5">{row.category || "Hub Congress"}</div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="font-bold text-zinc-200">{row.date}</div>
                      <div className="text-[10px] text-zinc-400">{row.academic_year || "2025-2026"}</div>
                    </td>
                    <td className="p-4 text-zinc-300 max-w-[180px] truncate">{row.venue}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                          {photos.length} Photo{photos.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-300 font-bold">{row.organized_by}</td>
                    <td className="p-4 text-right whitespace-nowrap space-x-2">
                      <button type="button" onClick={() => handleOpenEdit(row)} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-110 text-black text-xs font-black uppercase tracking-wider transition cursor-pointer">
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDelete(row.id)} className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-bold transition cursor-pointer border border-rose-500/30">
                        Delete
                      </button>
                    </td>
                  </tr>);
            })}
            </tbody>
          </table>
        </div>)}

      {/* Add / Edit Modal */}
      {isModalOpen && (<div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#09090d] rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-5 bg-gradient-to-r from-[#14141c] via-[#0f0f14] to-[#08080c] border-b border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-amber-400"/>
                <h3 className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300">
                  {editingReport ? "Edit Event Report" : "Publish New Event Report"}
                </h3>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer">
                <X size={18}/>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-bold text-amber-400/90 block mb-1">Report Title *</label>
                  <input type="text" required placeholder="e.g. IEEE Madras Section Coimbatore Hub Congress 2025" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-[#050507] border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"/>
                </div>

                <div>
                  <label className="font-bold text-amber-400/90 block mb-1">Event Date *</label>
                  <input type="text" required placeholder="e.g. 13 September 2025" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-[#050507] border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"/>
                </div>

                <div>
                  <label className="font-bold text-amber-400/90 block mb-1">Organized By *</label>
                  <input type="text" required placeholder="e.g. IEEE Madras Section" value={form.organized_by} onChange={(e) => setForm({ ...form, organized_by: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-[#050507] border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"/>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-amber-400/90 block mb-1">Venue *</label>
                  <input type="text" required placeholder="e.g. PSG Institute of Technology and Applied Research, Coimbatore" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-[#050507] border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"/>
                </div>

                {/* ─── MULTIPLE EVENT PHOTOS UPLOAD SECTION (3 to 4 photos) ─── */}
                <div className="sm:col-span-2 p-4 rounded-2xl bg-[#0f0f14] border border-amber-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                      <Images size={15}/>
                      <span>Event Photos (Upload 3 to 4 Photos to Bucket `reports`)</span>
                    </label>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {photosList.length} of 4 photos attached
                    </span>
                  </div>

                  {/* Upload button & Manual URL input */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <label className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-black text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 shrink-0 hover:brightness-110 transition shadow-md">
                      {isUploadingPhoto ? <Loader2 size={14} className="animate-spin text-black"/> : <Upload size={14}/>}
                      <span>Upload Photos</span>
                      <input type="file" accept="image/*" multiple onChange={handleUploadPhotos} disabled={isUploadingPhoto} className="hidden"/>
                    </label>

                    <div className="flex flex-1 items-center gap-1.5">
                      <input type="text" placeholder="Or paste direct image URL (https://...)" value={newPhotoUrlInput} onChange={(e) => setNewPhotoUrlInput(e.target.value)} className="flex-1 px-3 py-2 rounded-xl bg-[#050507] border border-amber-500/20 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"/>
                      <button type="button" onClick={handleAddManualPhotoUrl} className="px-3.5 py-2 rounded-xl bg-[#14141c] hover:bg-[#1f1f2a] text-amber-300 font-bold text-xs shrink-0 border border-amber-500/30 cursor-pointer">
                        Add URL
                      </button>
                    </div>
                  </div>

                  {/* Attached Photos Grid Preview */}
                  {photosList.length > 0 ? (<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {photosList.map((url, idx) => (<div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-amber-500/30 bg-[#050507] group">
                          <img src={url} alt={`Event photo ${idx + 1}`} className="w-full h-full object-cover"/>
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-amber-300 font-bold border border-amber-500/30">
                            {idx === 0 ? "Featured" : `#${idx + 1}`}
                          </div>
                          <button type="button" onClick={() => handleRemovePhoto(idx)} className="absolute top-1 right-1 p-1 rounded-full bg-rose-600/90 text-white hover:bg-rose-500 transition opacity-80 group-hover:opacity-100 cursor-pointer" title="Remove photo">
                            <X size={11}/>
                          </button>
                        </div>))}
                    </div>) : (<p className="text-[11px] text-zinc-500 italic">
                      No photos attached yet. You can attach 3 to 4 event photos (stage presentation, group photo, certificate award, audience).
                    </p>)}
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-amber-400/90 block mb-1">Event Overview</label>
                  <textarea rows={4} placeholder="I had the privilege of participating in the IEEE Madras Section Coimbatore Hub Congress 2025..." value={form.event_overview} onChange={(e) => setForm({ ...form, event_overview: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-[#050507] border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"/>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-amber-400/90 block mb-1">
                    Key Highlights &amp; Learnings (one bullet point per line)
                  </label>
                  <textarea rows={5} placeholder="• IEEE leadership and effective student branch management.&#10;• Planning and execution of technical and professional activities..." value={form.key_highlights} onChange={(e) => setForm({ ...form, key_highlights: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-[#050507] border border-amber-500/20 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"/>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-amber-400/90 block mb-1">Concluding Remarks</label>
                  <textarea rows={3} placeholder="The interactions and discussions provided a broader understanding..." value={form.conclusion_text} onChange={(e) => setForm({ ...form, conclusion_text: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-[#050507] border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"/>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-[#14141c] hover:bg-[#1f1f2a] text-zinc-300 font-bold text-xs uppercase border border-zinc-700 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-md shadow-amber-500/20">
                  {isSaving ? <Loader2 size={14} className="animate-spin text-black"/> : <Check size={14}/>}
                  <span>{editingReport ? "Update Database Report" : "Publish to Database"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>)}
    </div>);
};
export default EventReportsAdmin;
