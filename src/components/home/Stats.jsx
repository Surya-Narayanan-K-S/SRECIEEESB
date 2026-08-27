import { useState, useEffect, useRef } from "react";
import { useCountUp } from "@/hooks/useCountUp";
const AnimatedNumber = ({ value, label }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);
    const count = useCountUp(isVisible ? value : 0, 2000);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => observer.disconnect();
    }, []);
    return (<div ref={ref} className="flex flex-col items-center justify-center p-4 md:p-6 text-center h-full">
      <div className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 font-serif mb-2 drop-shadow-sm">
        {count}+
      </div>
      <div className="text-slate-500 font-bold uppercase tracking-widest text-xs md:text-sm">
        {label}
      </div>
    </div>);
};
const Stats = () => {
    return (<section className="py-2 md:py-4 relative overflow-hidden bg-slate-50">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
      
      {/* Decorative floating shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-transparent rounded-full blur-[100px] pointer-events-none"/>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-transparent rounded-full blur-[80px] pointer-events-none"/>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="bg-white rounded-none border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-700 ease-in-out">
            <AnimatedNumber value={24} label="Years Active"/>
          </div>
          <div className="bg-white rounded-none border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-700 ease-in-out">
            <AnimatedNumber value={500} label="Student Members"/>
          </div>
          <div className="bg-white rounded-none border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-700 ease-in-out">
            <AnimatedNumber value={60} label="Annual Events"/>
          </div>
          <div className="bg-white rounded-none border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-700 ease-in-out">
            <AnimatedNumber value={12} label="Technical Societies"/>
          </div>
        </div>
      </div>
    </section>);
};
export default Stats;
