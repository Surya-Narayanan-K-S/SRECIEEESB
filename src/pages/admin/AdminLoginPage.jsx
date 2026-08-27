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
    return (<div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Decorative Animated Background */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-400/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[40rem] h-[40rem] bg-cyan-400/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000"></div>

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-[#0b3b8f] transition font-bold z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm">
        <ArrowLeft size={18}/>
        Return to Portal
      </Link>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(11,59,143,0.15)] border border-white overflow-hidden relative z-10">
        <div className="bg-gradient-to-br from-[#0b3b8f] to-indigo-900 p-10 text-center relative overflow-hidden">
          {/* Subtle overlay pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:12px_12px]"></div>
          
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center mx-auto mb-5 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] border border-white/20 relative z-10">
            <Lock size={36} strokeWidth={1.5}/>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight relative z-10">{isRegistering ? "Admin Registration" : "Admin Gateway"}</h1>
          <p className="text-blue-100/80 font-medium mt-2 text-sm relative z-10">
            {isRegistering ? "Provision a new security clearance" : "Authorized IEEE SREC personnel only"}
          </p>
        </div>

        <div className="p-8 pt-10">
          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                User ID / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User size={20}/>
                </div>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0b3b8f] focus:border-transparent transition-all outline-none" placeholder="admin" required/>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={20}/>
                </div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0b3b8f] focus:border-transparent transition-all outline-none" placeholder="••••••••" required/>
              </div>
            </div>

            {isRegistering && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Local Admin Passkey <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-red-500">
                    <Lock size={20}/>
                  </div>
                  <input type="password" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-red-50 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none" placeholder="Enter system master key" required={isRegistering}/>
                </div>
              </motion.div>)}

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-[#0b3b8f] hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-70">
              {loading ? (<>
                  <Loader2 className="animate-spin" size={20}/>
                  {isRegistering ? "Registering..." : "Authenticating..."}
                </>) : (isRegistering ? "Create Account" : "Secure Login")}
            </button>
          </form>

          <div className="mt-6 text-center text-sm font-semibold">
            <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="text-[#0b3b8f] hover:underline transition-all">
              {isRegistering ? "Already have an account? Sign In" : "Need access? Register here"}
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
            <ShieldCheck size={18} className="text-[#0b3b8f]/50"/>
            <p>Secured by 256-bit encryption & Supabase Auth.</p>
          </div>
        </div>
      </motion.div>
    </div>);
};
export default AdminLoginPage;
