const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'pages', 'AdminDashboard.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Types
const types = `
type Society = { id: number; name: string; description: string | null; };
type Award = { id: number; title: string; year: number; description: string; category: string; amount: string | null; };
`;
content = content.replace('const AdminDashboard = () => {', types + '\nconst AdminDashboard = () => {');

// 2. Active Tab
content = content.replace(
  'useState<"overview" | "activities" | "office" | "members" | "plans" | "funding">("overview");',
  'useState<"overview" | "activities" | "office" | "members" | "plans" | "funding" | "societies" | "awards">("overview");'
);

// 3. States
const block1 = `
  const [societies, setSocieties] = useState<Society[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
`;
content = content.replace('const [fundingRequests, setFundingRequests] = useState<FundingSubmission[]>([]);', 'const [fundingRequests, setFundingRequests] = useState<FundingSubmission[]>([]);' + block1);

// 4. Editing states
const block2 = `
  const [editingSocietyId, setEditingSocietyId] = useState<number | null>(null);
  const [editingAwardId, setEditingAwardId] = useState<number | null>(null);
`;
content = content.replace('const [editingFundingId, setEditingFundingId] = useState<number | null>(null);', 'const [editingFundingId, setEditingFundingId] = useState<number | null>(null);' + block2);

// 5. Form states
const block3 = `
  const [societyForm, setSocietyForm] = useState({ name: "", description: "" });
  const [awardForm, setAwardForm] = useState({ title: "", year: "2025", description: "", category: "", amount: "" });
`;
content = content.replace('contact_email: "",\n  });', 'contact_email: "",\n  });' + block3);

// 6. Fetch functions
const block4 = `
  const fetchSocieties = async () => {
    const { data } = await supabase.from("societies").select("*").order("name", { ascending: true });
    setSocieties(data || []);
  };
  const fetchAwards = async () => {
    const { data } = await supabase.from("awards").select("*").order("year", { ascending: false });
    setAwards(data || []);
  };
`;
content = content.replace('const fetchActivities = async () => {', block4 + '\n  const fetchActivities = async () => {');

// 7. useEffect invokes
content = content.replace('fetchFundingRequests();\n  }, [navigate]);', 'fetchFundingRequests();\n    fetchSocieties();\n    fetchAwards();\n  }, [navigate]);');

// 8. Resets
const block5 = `
  const resetSocietyForm = () => {
    setEditingSocietyId(null);
    setSocietyForm({ name: "", description: "" });
  };
  const resetAwardForm = () => {
    setEditingAwardId(null);
    setAwardForm({ title: "", year: "2025", description: "", category: "", amount: "" });
  };
`;
content = content.replace('contact_email: "" });\n  };', 'contact_email: "" });\n  };\n' + block5);

// 9. Handlers
const block6 = `
  const submitSociety = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name: societyForm.name, description: societyForm.description || null };
    if (editingSocietyId) await supabase.from("societies").update(payload).eq("id", editingSocietyId);
    else await supabase.from("societies").insert([payload]);
    resetSocietyForm();
    fetchSocieties();
  };

  const submitAward = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { 
      title: awardForm.title, 
      year: Number(awardForm.year), 
      description: awardForm.description, 
      category: awardForm.category, 
      amount: awardForm.amount || null 
    };
    if (editingAwardId) await supabase.from("awards").update(payload).eq("id", editingAwardId);
    else await supabase.from("awards").insert([payload]);
    resetAwardForm();
    fetchAwards();
  };

  const deleteSociety = async (id: number) => {
    await supabase.from("societies").delete().eq("id", id);
    fetchSocieties();
  };
  const deleteAward = async (id: number) => {
    await supabase.from("awards").delete().eq("id", id);
    fetchAwards();
  };
`;
content = content.replace('const filteredActivities = useMemo(() => {', block6 + '\n  const filteredActivities = useMemo(() => {');

// 10. Menu buttons
const block7 = `
            <button
              onClick={() => setActiveTab("societies")}
              className={\`w-full rounded-lg px-4 py-3 text-left font-medium \${activeTab === "societies" ? "bg-white text-[#0b3b8f]" : "hover:bg-white/10"}\`}
            >
              Societies
            </button>
            <button
              onClick={() => setActiveTab("awards")}
              className={\`w-full rounded-lg px-4 py-3 text-left font-medium \${activeTab === "awards" ? "bg-white text-[#0b3b8f]" : "hover:bg-white/10"}\`}
            >
              Awards
            </button>
`;
content = content.replace('Funding Requests\n            </button>', 'Funding Requests\n            </button>' + block7);

// 11. Headers
const block8 = `
                  {activeTab === "societies" && "Manage Societies"}
                  {activeTab === "awards" && "Manage Awards"}
`;
content = content.replace('{activeTab === "funding" && "Manage Funding Requests"}\n                </h2>', '{activeTab === "funding" && "Manage Funding Requests"}\n' + block8 + '                </h2>');

// 12. Cards overview
const block9 = `
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-sm text-slate-500">Societies</p>
                  <h3 className="mt-2 text-4xl font-bold text-[#0b3b8f]">{societies.length}</h3>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-sm text-slate-500">Awards</p>
                  <h3 className="mt-2 text-4xl font-bold text-[#0b3b8f]">{awards.length}</h3>
                </div>
`;
content = content.replace('{fundingRequests.length}</h3>\n                </div>\n              </div>', '{fundingRequests.length}</h3>\n                </div>\n' + block9 + '              </div>');

// 13. UI blocks (Plans, Funding, Societies, Awards)
const block10 = `
            {activeTab === "plans" && (
              <div className="space-y-8">
                <form onSubmit={submitPlan} className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">{editingPlanId ? "Edit Plan" : "Add Plan"}</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input type="number" placeholder="S.No" value={planForm.s_no} onChange={(e) => setPlanForm({ ...planForm, s_no: e.target.value })} className="rounded-lg border px-4 py-3" required />
                    <input type="text" placeholder="Event" value={planForm.event} onChange={(e) => setPlanForm({ ...planForm, event: e.target.value })} className="rounded-lg border px-4 py-3" required />
                    <input type="text" placeholder="Sub Event" value={planForm.sub_event} onChange={(e) => setPlanForm({ ...planForm, sub_event: e.target.value })} className="rounded-lg border px-4 py-3" />
                    <input type="text" placeholder="Schedule" value={planForm.schedule} onChange={(e) => setPlanForm({ ...planForm, schedule: e.target.value })} className="rounded-lg border px-4 py-3" required />
                  </div>
                  <div className="mt-6 flex gap-4">
                    <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white">{editingPlanId ? "Update" : "Add"}</button>
                    {editingPlanId && (<button type="button" onClick={resetPlanForm} className="rounded-lg bg-slate-200 px-6 py-3 font-semibold">Cancel</button>)}
                  </div>
                </form>
                <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
                  <table className="w-full border-collapse">
                    <thead className="bg-[#0b5ed7] text-white">
                      <tr><th className="px-4 py-3 text-left">S.No</th><th className="px-4 py-3 text-left">Event</th><th className="px-4 py-3 text-left">Sub Event</th><th className="px-4 py-3 text-left">Schedule</th><th className="px-4 py-3 text-left">Actions</th></tr>
                    </thead>
                    <tbody>
                      {annualPlans.map((row) => (
                        <tr key={row.id} className="border-b"><td className="px-4 py-3">{row.s_no}</td><td className="px-4 py-3">{row.event}</td><td className="px-4 py-3">{row.sub_event}</td><td className="px-4 py-3">{row.schedule}</td>
                          <td className="px-4 py-3"><div className="flex gap-2">
                              <button onClick={() => { setEditingPlanId(row.id); setPlanForm({ s_no: String(row.s_no), event: row.event, sub_event: row.sub_event || "", schedule: row.schedule }); }} className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white">Edit</button>
                              <button onClick={() => deletePlan(row.id)} className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white">Delete</button>
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "funding" && (
              <div className="space-y-8">
                <form onSubmit={submitFunding} className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">{editingFundingId ? "Edit Funding" : "Add Funding"}</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input type="text" placeholder="Title" value={fundingForm.title} onChange={(e) => setFundingForm({ ...fundingForm, title: e.target.value })} className="rounded-lg border px-4 py-3" required />
                    <input type="text" placeholder="Type" value={fundingForm.submission_type} onChange={(e) => setFundingForm({ ...fundingForm, submission_type: e.target.value })} className="rounded-lg border px-4 py-3" required />
                    <input type="text" placeholder="Description" value={fundingForm.description} onChange={(e) => setFundingForm({ ...fundingForm, description: e.target.value })} className="rounded-lg border px-4 py-3" />
                    <input type="number" placeholder="Budget Amount" value={fundingForm.budget_amount} onChange={(e) => setFundingForm({ ...fundingForm, budget_amount: e.target.value })} className="rounded-lg border px-4 py-3" />
                    <input type="email" placeholder="Contact Email" value={fundingForm.contact_email} onChange={(e) => setFundingForm({ ...fundingForm, contact_email: e.target.value })} className="rounded-lg border px-4 py-3" />
                  </div>
                  <div className="mt-6 flex gap-4">
                    <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white">{editingFundingId ? "Update" : "Add"}</button>
                    {editingFundingId && (<button type="button" onClick={resetFundingForm} className="rounded-lg bg-slate-200 px-6 py-3 font-semibold">Cancel</button>)}
                  </div>
                </form>
                <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
                  <table className="w-full border-collapse">
                    <thead className="bg-[#0b5ed7] text-white">
                      <tr><th className="px-4 py-3 text-left">Title</th><th className="px-4 py-3 text-left">Type</th><th className="px-4 py-3 text-left">Budget</th><th className="px-4 py-3 text-left">Email</th><th className="px-4 py-3 text-left">Actions</th></tr>
                    </thead>
                    <tbody>
                      {fundingRequests.map((row) => (
                        <tr key={row.id} className="border-b"><td className="px-4 py-3">{row.title}</td><td className="px-4 py-3">{row.submission_type}</td><td className="px-4 py-3">{row.budget_amount}</td><td className="px-4 py-3">{row.contact_email}</td>
                          <td className="px-4 py-3"><div className="flex gap-2">
                              <button onClick={() => { setEditingFundingId(row.id); setFundingForm({ title: row.title, submission_type: row.submission_type, description: row.description || "", budget_amount: row.budget_amount ? String(row.budget_amount) : "", contact_email: row.contact_email || "" }); }} className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white">Edit</button>
                              <button onClick={() => deleteFunding(row.id)} className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white">Delete</button>
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "societies" && (
              <div className="space-y-8">
                <form onSubmit={submitSociety} className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">{editingSocietyId ? "Edit Society" : "Add Society"}</h3>
                  <div className="grid gap-4">
                    <input type="text" placeholder="Society Name" value={societyForm.name} onChange={(e) => setSocietyForm({ ...societyForm, name: e.target.value })} className="rounded-lg border px-4 py-3" required />
                    <textarea placeholder="Description" value={societyForm.description} onChange={(e) => setSocietyForm({ ...societyForm, description: e.target.value })} className="rounded-lg border px-4 py-3" rows={3}></textarea>
                  </div>
                  <div className="mt-6 flex gap-4">
                    <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white">{editingSocietyId ? "Update" : "Add"}</button>
                    {editingSocietyId && (<button type="button" onClick={resetSocietyForm} className="rounded-lg bg-slate-200 px-6 py-3 font-semibold">Cancel</button>)}
                  </div>
                </form>
                <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
                  <table className="w-full border-collapse">
                    <thead className="bg-[#0b5ed7] text-white">
                      <tr><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Description</th><th className="px-4 py-3 text-left">Actions</th></tr>
                    </thead>
                    <tbody>
                      {societies.map((row) => (
                        <tr key={row.id} className="border-b"><td className="px-4 py-3 font-medium">{row.name}</td><td className="px-4 py-3 text-sm">{row.description}</td>
                          <td className="px-4 py-3"><div className="flex gap-2">
                              <button onClick={() => { setEditingSocietyId(row.id); setSocietyForm({ name: row.name, description: row.description || "" }); }} className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white">Edit</button>
                              <button onClick={() => deleteSociety(row.id)} className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white">Delete</button>
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "awards" && (
              <div className="space-y-8">
                <form onSubmit={submitAward} className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">{editingAwardId ? "Edit Award" : "Add Award"}</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input type="text" placeholder="Title" value={awardForm.title} onChange={(e) => setAwardForm({ ...awardForm, title: e.target.value })} className="rounded-lg border px-4 py-3" required />
                    <input type="number" placeholder="Year" value={awardForm.year} onChange={(e) => setAwardForm({ ...awardForm, year: e.target.value })} className="rounded-lg border px-4 py-3" required />
                    <input type="text" placeholder="Category" value={awardForm.category} onChange={(e) => setAwardForm({ ...awardForm, category: e.target.value })} className="rounded-lg border px-4 py-3" required />
                    <input type="text" placeholder="Amount (optional)" value={awardForm.amount} onChange={(e) => setAwardForm({ ...awardForm, amount: e.target.value })} className="rounded-lg border px-4 py-3" />
                  </div>
                  <textarea placeholder="Description" value={awardForm.description} onChange={(e) => setAwardForm({ ...awardForm, description: e.target.value })} className="mt-4 w-full rounded-lg border px-4 py-3" rows={3} required></textarea>
                  <div className="mt-6 flex gap-4">
                    <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white">{editingAwardId ? "Update" : "Add"}</button>
                    {editingAwardId && (<button type="button" onClick={resetAwardForm} className="rounded-lg bg-slate-200 px-6 py-3 font-semibold">Cancel</button>)}
                  </div>
                </form>
                <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
                  <table className="w-full border-collapse">
                    <thead className="bg-[#0b5ed7] text-white">
                      <tr><th className="px-4 py-3 text-left">Year</th><th className="px-4 py-3 text-left">Title</th><th className="px-4 py-3 text-left">Category</th><th className="px-4 py-3 text-left">Amount</th><th className="px-4 py-3 text-left">Actions</th></tr>
                    </thead>
                    <tbody>
                      {awards.map((row) => (
                        <tr key={row.id} className="border-b"><td className="px-4 py-3">{row.year}</td><td className="px-4 py-3 font-medium">{row.title}</td><td className="px-4 py-3">{row.category}</td><td className="px-4 py-3">{row.amount || "-"}</td>
                          <td className="px-4 py-3"><div className="flex gap-2">
                              <button onClick={() => { setEditingAwardId(row.id); setAwardForm({ title: row.title, year: String(row.year), description: row.description, category: row.category, amount: row.amount || "" }); }} className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white">Edit</button>
                              <button onClick={() => deleteAward(row.id)} className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white">Delete</button>
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
`;
const searchString = '{activeTab === "members" && (';
const searchIndex = content.lastIndexOf(searchString);
if (searchIndex !== -1) {
  const nextSectionIndex = content.indexOf('</main>', searchIndex);
  content = content.substring(0, nextSectionIndex) + block10 + content.substring(nextSectionIndex);
}

fs.writeFileSync(file, content);
console.log("AdminDashboard rewritten successfully.");
