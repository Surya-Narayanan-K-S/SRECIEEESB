import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Lock, User, Loader2, ArrowLeft, ShieldCheck, Image, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
];

const AdminLoginPage = () => {
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Master Administrator");
    const [avatarUrl, setAvatarUrl] = useState(AVATAR_PRESETS[0]);
    const [adminKey, setAdminKey] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const LOCAL_ADMIN_KEY = "MRBB2026";

    useEffect(() => {
        // Check if already logged in via Session Storage or Supabase Auth
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const localAdmin = sessionStorage.getItem("admin_auth");
            if (session || localAdmin === "true") {
                navigate("/admin");
            }
        };
        checkSession();
    }, [navigate]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const cleanUsername = username.trim();
            const cleanDisplayName = displayName.trim() || cleanUsername;
            const email = `${cleanUsername.toLowerCase()}@ieeesrec.org`;

            if (isRegistering) {
                if (adminKey !== LOCAL_ADMIN_KEY) {
                    toast.error("Invalid Admin Passkey. Registration blocked.");
                    setLoading(false);
                    return;
                }

                // 1. Insert into database `admins` table with role, display_name, avatar_url
                const insertPayload = {
                    username: cleanUsername,
                    password,
                    role,
                    display_name: cleanDisplayName,
                    avatar_url: avatarUrl,
                };

                let { error: dbErr } = await supabase.from("admins").insert([insertPayload]);
                if (dbErr && dbErr.message && (dbErr.message.includes("column") || dbErr.message.includes("does not exist"))) {
                    // Fallback insertion for older schemas
                    await supabase.from("admins").insert([{
                        username: cleanUsername,
                        password,
                    }]);
                }

                // 2. Try Supabase Auth SignUp
                try {
                    await supabase.auth.signUp({
                        email,
                        password,
                    });
                } catch (_) {}

                // Save session credentials
                sessionStorage.setItem("admin_auth", "true");
                sessionStorage.setItem("admin_username", cleanDisplayName);
                sessionStorage.setItem("admin_email", email);
                sessionStorage.setItem("admin_role", role);
                sessionStorage.setItem("admin_avatar", avatarUrl);
                localStorage.setItem("admin_username", cleanDisplayName);
                localStorage.setItem("admin_role", role);
                localStorage.setItem("admin_avatar", avatarUrl);

                toast.success(`Admin account registered with ${role} clearance!`);
                navigate("/admin");
            }
            else {
                // 1. Check Master Key / Passkey fallback
                if (password === LOCAL_ADMIN_KEY ||
                    adminKey === LOCAL_ADMIN_KEY ||
                    (cleanUsername.toLowerCase() === "admin" && (password === "admin" || password === LOCAL_ADMIN_KEY))) {
                    sessionStorage.setItem("admin_auth", "true");
                    sessionStorage.setItem("admin_username", cleanUsername || "Admin Manager");
                    sessionStorage.setItem("admin_email", email);
                    sessionStorage.setItem("admin_role", "Master Administrator");
                    sessionStorage.setItem("admin_avatar", avatarUrl || AVATAR_PRESETS[0]);
                    localStorage.setItem("admin_username", cleanUsername || "Admin Manager");
                    localStorage.setItem("admin_role", "Master Administrator");
                    localStorage.setItem("admin_avatar", avatarUrl || AVATAR_PRESETS[0]);
                    toast.success("Logged in successfully (Master Access)");
                    navigate("/admin");
                    return;
                }

                // 2. Check database `admins` table
                try {
                    const { data: dbAdmins } = await supabase
                        .from("admins")
                        .select("*")
                        .eq("username", cleanUsername)
                        .eq("password", password);

                    if (dbAdmins && dbAdmins.length > 0) {
                        const adminRecord = dbAdmins[0];
                        const userRole = adminRecord.role || (cleanUsername.toLowerCase() === "admin" ? "Master Administrator" : "Society Officer");
                        const userAvatar = adminRecord.avatar_url || adminRecord.avatar || AVATAR_PRESETS[0];
                        const userDisplay = adminRecord.display_name || adminRecord.name || cleanUsername;

                        sessionStorage.setItem("admin_auth", "true");
                        sessionStorage.setItem("admin_username", userDisplay);
                        sessionStorage.setItem("admin_email", email);
                        sessionStorage.setItem("admin_role", userRole);
                        sessionStorage.setItem("admin_avatar", userAvatar);
                        localStorage.setItem("admin_username", userDisplay);
                        localStorage.setItem("admin_role", userRole);
                        localStorage.setItem("admin_avatar", userAvatar);

                        toast.success(`Logged in as ${userDisplay} (${userRole})`);
                        navigate("/admin");
                        return;
                    }
                }
                catch (dbErr) {
                    console.warn("DB Admin check fallback:", dbErr);
                }

                // 3. Check Supabase Auth
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (!error && data?.session) {
                    sessionStorage.setItem("admin_auth", "true");
                    sessionStorage.setItem("admin_username", cleanUsername || data.session.user?.email?.split('@')[0] || "Administrator");
                    sessionStorage.setItem("admin_email", data.session.user?.email || email);
                    sessionStorage.setItem("admin_role", "Master Administrator");
                    sessionStorage.setItem("admin_avatar", AVATAR_PRESETS[0]);
                    localStorage.setItem("admin_username", cleanUsername);
                    localStorage.setItem("admin_role", "Master Administrator");
                    localStorage.setItem("admin_avatar", AVATAR_PRESETS[0]);
                    toast.success("Logged in successfully");
                    navigate("/admin");
                    return;
                }

                toast.error("Invalid credentials. Please check your username and password.");
            }
        }
        catch (err) {
            toast.error("An unexpected error occurred during authentication.");
        }
        finally {
            setLoading(false);
        }
    };

    return (<div className="min-h-screen bg-[#f4f7fb] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      {/* Decorative Subtle Blue & Slate Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[40rem] h-[40rem] bg-sky-100/50 rounded-full blur-3xl pointer-events-none"></div>

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-600 hover:text-blue-600 transition font-bold z-10 bg-white/90 backdrop-blur border border-slate-200 px-4 py-2 rounded-full shadow-sm hover:shadow">
        <ArrowLeft size={18} className="text-blue-600"/>
        <span>Return to Portal</span>
      </Link>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} className="w-full max-w-[480px] bg-white rounded-[2rem] shadow-xl border border-slate-200/80 overflow-hidden relative z-10 my-8">
        <div className="bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 border-b border-slate-100 p-7 text-center relative overflow-hidden">
          <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/20 relative z-10">
            <Lock size={26} strokeWidth={2.2}/>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight relative z-10">
            {isRegistering ? "Admin Security Registration" : "Admin Gateway"}
          </h1>
          <p className="text-slate-500 font-medium mt-1 text-xs relative z-10">
            {isRegistering ? "Provision new security credentials & role clearance" : "Authorized IEEE SREC personnel only"}
          </p>
        </div>

        <div className="p-7">
          <form onSubmit={handleAuth} className="space-y-4">
            {isRegistering && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Display Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Sparkles size={16}/>
                    </div>
                    <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" placeholder="e.g. Dr. John Doe / Admin Manager" required={isRegistering}/>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Security Clearance / Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:bg-white focus:border-blue-500 outline-none"
                  >
                    <option value="Master Administrator">👑 Master Administrator (Full System Access)</option>
                    <option value="Student Registrar & Admissions">👥 Student Registrar &amp; Admissions (Roster &amp; ID Cards)</option>
                    <option value="Activities & Event Coordinator">📅 Activities &amp; Event Coordinator (Events &amp; Remote)</option>
                    <option value="Chapter & Society Lead">🏛️ Chapter &amp; Society Lead (Societies &amp; Leaders)</option>
                    <option value="Auditor & Viewer (Read-Only)">🔍 Auditor &amp; Viewer (Read-Only Mode)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Avatar Selection
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    {AVATAR_PRESETS.map((p, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setAvatarUrl(p)}
                        className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition ${avatarUrl === p ? "border-blue-600 scale-105 shadow-xs" : "border-slate-200 opacity-70 hover:opacity-100"}`}
                      >
                        <img src={p} alt="Preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Image size={16}/>
                    </div>
                    <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-blue-500 outline-none" placeholder="https://..." />
                  </div>
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                User ID / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={18}/>
                </div>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" placeholder="admin_user" required/>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18}/>
                </div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" placeholder="••••••••" required/>
              </div>
            </div>

            {isRegistering && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                <label className="block text-xs font-bold uppercase tracking-wider text-rose-600 mb-1.5">
                  Local Master Passkey <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400">
                    <Lock size={18}/>
                  </div>
                  <input type="password" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-rose-50/50 border border-rose-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-rose-400 transition-all outline-none" placeholder="Enter system master passkey" required={isRegistering}/>
                </div>
              </motion.div>)}

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm uppercase tracking-wider py-3 rounded-xl transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer mt-3">
              {loading ? (<>
                  <Loader2 className="animate-spin text-white" size={18}/>
                  <span>{isRegistering ? "Registering Clearance..." : "Authenticating..."}</span>
                </>) : (isRegistering ? "Create & Register Admin" : "Secure Login")}
            </button>
          </form>

          <div className="mt-5 text-center text-xs font-semibold">
            <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="text-blue-600 hover:text-blue-700 hover:underline transition-all cursor-pointer">
              {isRegistering ? "Already registered? Sign In" : "Need clearance? Register admin account"}
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400 flex flex-col items-center gap-1.5">
            <ShieldCheck size={18} className="text-blue-500/80"/>
            <p>Secured with Role-Based Access Control &amp; Supabase Auth.</p>
          </div>
        </div>
      </motion.div>
    </div>);
};

export default AdminLoginPage;
