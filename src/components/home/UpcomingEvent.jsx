import { useState, useEffect } from "react";
import { Timer, ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
const UpcomingEvent = () => {
    // Target date set to 30 days from now
    const [timeLeft, setTimeLeft] = useState({
        days: 30,
        hours: 12,
        minutes: 45,
        seconds: 0
    });
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { days, hours, minutes, seconds } = prev;
                if (seconds > 0) {
                    seconds--;
                }
                else {
                    seconds = 59;
                    if (minutes > 0) {
                        minutes--;
                    }
                    else {
                        minutes = 59;
                        if (hours > 0) {
                            hours--;
                        }
                        else {
                            hours = 23;
                            if (days > 0) {
                                days--;
                            }
                        }
                    }
                }
                return { days, hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    const timeUnits = [
        { label: "DAYS", value: timeLeft.days },
        { label: "HOURS", value: timeLeft.hours },
        { label: "MINUTES", value: timeLeft.minutes },
        { label: "SECONDS", value: timeLeft.seconds },
    ];
    return (<section className="py-24 bg-slate-900 relative overflow-hidden text-white border-y border-slate-800">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      
      {/* Heavy Light Beams */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none"/>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"/>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Side: Event Details */}
        <div className="flex-1 space-y-8 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-bold text-[10px] tracking-widest uppercase shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Zap size={14} className="text-yellow-400 fill-yellow-400 animate-pulse"/>
            Flagship Global Hackathon
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1]">
            IEEE XTREME <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              18.0 PRO EDITION
            </span>
          </h2>
          
          <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
            The ultimate 24-hour global programming competition. Form teams, solve intense algorithmic challenges, and compete against the world's best engineering universities. 
          </p>

          <Link to="/join" className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-cyan-500 text-slate-900 font-black uppercase tracking-[0.1em] hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            Register Squad
            <ArrowRight className="group-hover:translate-x-1 transition-transform"/>
          </Link>
        </div>

        {/* Right Side: The Ticker */}
        <div className="flex-1 w-full relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 bg-slate-900/50 p-6 md:p-8 border border-slate-800 backdrop-blur-xl shadow-2xl relative">
            
            <div className="absolute -top-3 -right-3 text-cyan-500 animate-spin-slow">
              <Timer size={40}/>
            </div>

            {timeUnits.map((unit, idx) => (<div key={unit.label} className="flex flex-col items-center justify-center bg-slate-950 border border-slate-800 py-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
                <span className="text-4xl md:text-5xl font-black text-white font-mono tracking-tighter mb-2 z-10">
                  {unit.value.toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 tracking-[0.2em] relative z-10">
                  {unit.label}
                </span>
              </div>))}
            
          </div>
        </div>

      </div>
    </section>);
};
export default UpcomingEvent;
