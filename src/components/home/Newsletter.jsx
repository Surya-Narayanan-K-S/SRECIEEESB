import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email)
            return;
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubscribed(true);
            toast.success("Successfully subscribed to IEEE SREC updates!");
            setEmail("");
        }, 1500);
    };
    return (<section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-50/50 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"/>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-50/50 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 translate-y-1/2"/>


      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-100 mb-8 shadow-sm">
          <Mail className="w-8 h-8 text-cyan-600"/>
        </div>
        
        <h2 className="font-heading text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
          Stay Ahead of the Curve
        </h2>
        <p className="text-slate-600 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Join our newsletter to receive the latest updates on upcoming technical workshops, hackathons, and exclusive networking opportunities straight to your inbox.
        </p>

        {isSubscribed ? (<div className="flex flex-col items-center justify-center p-8 bg-green-50 rounded-3xl border border-green-100 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-12 h-12 text-green-500 mb-4"/>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">You're All Set!</h3>
            <p className="text-slate-600 text-sm">Thanks for joining. Watch your inbox for exciting updates.</p>
            <button onClick={() => setIsSubscribed(false)} className="mt-6 text-sm font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">
              Subscribe another email
            </button>
          </div>) : (<form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400"/>
              </div>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your university email address" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 transition-all shadow-sm"/>
            </div>
            <button type="submit" disabled={isLoading} className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group">
              {isLoading ? (<div className="w-6 h-6 border-2 border-slate-400 border-t-white rounded-full animate-spin"/>) : (<>
                  Subscribe
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                </>)}
            </button>
          </form>)}
        
        <p className="text-slate-400 text-sm font-medium mt-6">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>);
};
export default Newsletter;
