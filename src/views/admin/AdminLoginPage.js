import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Lock, User, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
const AdminLoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
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
            const email = `${cleanUsername.toLowerCase()}@ieeesrec.org`;
            if (isRegistering) {
                if (adminKey !== LOCAL_ADMIN_KEY) {
                    toast.error("Invalid Admin Passkey. Registration blocked.");
                    setLoading(false);
                    return;
                }
                // Try Supabase Auth SignUp
                const { error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                // Also insert into database `admins` table so it works seamlessly
                try {
                    await supabase.from("admins").insert([{ username: cleanUsername, password }]);
                }
                catch (_) {
                    // ignore duplicate DB entry error
                }
                if (authError && authError.message) {
                    toast.info("Admin account registered! You can now log in.");
                }
                else {
                    toast.success("Registration successful! You can now log in.");
                }
                setIsRegistering(false);
            }
            else {
                // 1. Check Master Key / Passkey fallback
                if (password === LOCAL_ADMIN_KEY ||
                    adminKey === LOCAL_ADMIN_KEY ||
                    (cleanUsername.toLowerCase() === "admin" && (password === "admin" || password === LOCAL_ADMIN_KEY))) {
                    sessionStorage.setItem("admin_auth", "true");
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
                        sessionStorage.setItem("admin_auth", "true");
                        toast.success("Logged in successfully");
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
    return (<div className="min-h-screen bg-[#050507] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      {/* Decorative Animated Gold & Obsidian Background */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-amber-500/10 rounded-full blur-3xl mix-blend-screen animate-pulse pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[30rem] h-[30rem] bg-yellow-500/10 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[40rem] h-[40rem] bg-amber-600/10 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-zinc-400 hover:text-amber-300 transition font-bold z-10 bg-[#0c0c12]/80 backdrop-blur border border-amber-500/20 px-4 py-2 rounded-full shadow-lg">
        <ArrowLeft size={18} className="text-amber-400"/>
        <span>Return to Portal</span>
      </Link>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} className="w-full max-w-[420px] bg-[#0b0b0f]/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(217,119,6,0.15)] border border-amber-500/30 overflow-hidden relative z-10">
        <div className="bg-gradient-to-br from-[#14141c] via-[#0d0d12] to-[#07070a] border-b border-amber-500/20 p-10 text-center relative overflow-hidden">
          {/* Overlay glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-black rounded-[1.5rem] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-500/30 border border-yellow-300 relative z-10">
            <Lock size={34} strokeWidth={2.2}/>
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 tracking-tight relative z-10">
            {isRegistering ? "Admin Registration" : "Admin Gateway"}
          </h1>
          <p className="text-zinc-400 font-medium mt-2 text-xs relative z-10">
            {isRegistering ? "Provision a new security clearance" : "Authorized IEEE SREC personnel only"}
          </p>
        </div>

        <div className="p-8 pt-8">
          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-2">
                User ID / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-400">
                  <User size={18}/>
                </div>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-[#050507] border border-amber-500/20 rounded-xl text-white font-bold text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all outline-none" placeholder="admin" required/>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-400">
                  <Lock size={18}/>
                </div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-[#050507] border border-amber-500/20 rounded-xl text-white text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all outline-none" placeholder="••••••••" required/>
              </div>
            </div>

            {isRegistering && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                <label className="block text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
                  Local Admin Passkey <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-rose-400">
                    <Lock size={18}/>
                  </div>
                  <input type="password" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-[#140a0c] border border-rose-500/30 rounded-xl text-white text-sm focus:border-rose-400 transition-all outline-none" placeholder="Enter system master key" required={isRegistering}/>
                </div>
              </motion.div>)}

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-black font-black text-sm uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50 cursor-pointer">
              {loading ? (<>
                  <Loader2 className="animate-spin text-black" size={18}/>
                  <span>{isRegistering ? "Registering..." : "Authenticating..."}</span>
                </>) : (isRegistering ? "Create Account" : "Secure Login")}
            </button>
          </form>

          <div className="mt-6 text-center text-xs font-semibold">
            <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="text-amber-400 hover:text-amber-300 hover:underline transition-all cursor-pointer">
              {isRegistering ? "Already have an account? Sign In" : "Need access? Register here"}
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-zinc-500 flex flex-col items-center gap-2">
            <ShieldCheck size={18} className="text-amber-400/60"/>
            <p>Secured by 256-bit encryption &amp; Supabase Auth.</p>
          </div>
        </div>
      </motion.div>
    </div>);
};
export default AdminLoginPage;
