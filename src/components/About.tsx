import { useState } from "react";
import { Zap, Globe, GraduationCap, Lightbulb, Target, Eye, Users, Rocket, Activity } from "lucide-react";

const features = [
  { icon: Zap, title: "Technical Workshops", desc: "Hands-on sessions on MATLAB, PLC, IoT and emerging technologies.", color: "from-amber-400 to-orange-500", bg: "bg-orange-500/10", text: "text-orange-500" },
  { icon: Globe, title: "Global Networking", desc: "Connect with IEEE professionals and researchers worldwide.", color: "from-blue-400 to-cyan-500", bg: "bg-slate-1000/10", text: "text-blue-500" },
  { icon: GraduationCap, title: "Career Growth", desc: "Industry interaction, guest lectures and skill development.", color: "from-emerald-400 to-teal-500", bg: "bg-emerald-500/10", text: "text-emerald-500" },
  { icon: Lightbulb, title: "Innovation", desc: "Ideathons, hackathons and IEEE Xtreme programming.", color: "from-purple-400 to-pink-500", bg: "bg-purple-500/10", text: "text-purple-500" },
];

const tabContent = {
  mission: {
    icon: Target,
    title: "Our Mission",
    content: "To foster technological innovation and excellence for the benefit of humanity by providing a networking platform for students to learn, grow, and develop highly sought-after professional skills.",
  },
  vision: {
    icon: Eye,
    title: "Our Vision",
    content: "To be the premier student branch recognized for developing exceptional leaders, promoting cutting-edge research, and bridging the gap between academic learning and industry requirements.",
  },
  impact: {
    icon: Rocket,
    title: "Our Impact",
    content: "With over two decades of excellence since 2001, we have nurtured thousands of students, bridging theoretical knowledge with practical implementations through 500+ successful events.",
  }
};

const About = ({ showStats = true }: { showStats?: boolean }) => {
  const [activeTab, setActiveTab] = useState<keyof typeof tabContent>("mission");

  return (
    <section id="about" className="py-8 md:py-12 relative overflow-hidden bg-slate-50">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-100/40 to-cyan-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00629b]/10 text-[#00629b] font-semibold text-xs tracking-widest uppercase mb-4 shadow-sm border border-[#00629b]/20">
            <Activity size={14} className="animate-pulse" />
            <span>Discover Our Legacy</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 drop-shadow-sm">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00629b] to-[#00a3e0]">IEEE SREC</span>
          </h2>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
            The IEEE Student Branch of Sri Ramakrishna Engineering College, operating since June 11th, 2001 under the IEEE Madras Section, is a vibrant hub promoting continuous technical excellence and professional evolution.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column: Interactive Tabs */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-none p-2 shadow-sm hover:shadow-lg border border-slate-100 flex overflow-x-auto no-scrollbar">
              {Object.keys(tabContent).map((key) => {
                const tabKey = key as keyof typeof tabContent;
                const isActive = activeTab === tabKey;
                const Icon = tabContent[tabKey].icon;
                return (
                  <button
                     key={key}
                     onClick={() => setActiveTab(tabKey)}
                     className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-none font-semibold text-sm transition-all duration-700 ease-in-out relative whitespace-nowrap ${
                       isActive ? "text-slate-900 shadow-md transform scale-[1.02]" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                     }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00629b] to-[#0089c4] rounded-none transition-all duration-700 ease-in-out -z-10" />
                    )}
                    <Icon size={18} className={isActive ? "animate-bounce" : ""} />
                    <span className="capitalize">{key}</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-white rounded-none p-8 md:p-10 shadow-sm hover:shadow-lg border border-slate-100 flex flex-col justify-center relative overflow-hidden group min-h-[280px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-50 to-transparent opacity-50 rounded-bl-[100px] -z-10" />
              <div className="w-16 h-16 rounded-none bg-gradient-to-br from-[#00629b]/10 to-transparent flex items-center justify-center mb-6 border border-[#00629b]/20 shadow-sm">
                {(() => {
                  const Icon = tabContent[activeTab].icon;
                  return <Icon size={32} className="text-[#00629b]" />;
                })()}
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-4">{tabContent[activeTab].title}</h3>
              <p className="text-slate-600 text-lg leading-relaxed">{tabContent[activeTab].content}</p>
            </div>
          </div>

          {/* Right Column: Feature Cards Grid */}
          <div className="lg:col-span-7 grid md:grid-cols-2 gap-6 relative">
            <div className="absolute inset-0 bg-slate-1000/5 blur-[120px] -z-10 rounded-full" />
            
            {features.map((f, i) => (
              <div 
                key={f.title} 
                className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-none p-8 transition-all duration-700 ease-in-out group hover:shadow-lg relative overflow-hidden shadow-sm"
              >
                {/* Micro-animation hover gradient effect */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${f.color} -z-10`} />
                
                <div className={`w-14 h-14 rounded-none ${f.bg} flex items-center justify-center mb-6 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300 shadow-sm border border-white/50`}>
                  <f.icon className={`h-7 w-7 ${f.text}`} />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-800 mb-3 group-hover:text-slate-900 transition-colors">{f.title}</h3>
                <p className="text-slate-500 text-base leading-relaxed group-hover:text-slate-600 transition-colors">{f.desc}</p>
                
                {/* Decorative corner element */}
                <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-tl ${f.color} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-all duration-700 ease-in-out`} />
              </div>
            ))}
          </div>

        </div>
        
        {/* Statistics Bar below */}
        {showStats && (
          <div className="mt-10 md:mt-16 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200/60 bg-white shadow-xl rounded-none p-6 md:p-8 border border-slate-100">
             <div className="flex flex-col items-center justify-center p-4">
                <span className="text-4xl md:text-5xl font-bold tracking-tight text-slate-800 mb-2">24<span className="text-[#00629b]">+</span></span>
                <span className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-widest text-center">Years Legacy</span>
             </div>
             <div className="flex flex-col items-center justify-center p-4">
                <span className="text-4xl md:text-5xl font-bold tracking-tight text-slate-800 mb-2">500<span className="text-[#00629b]">+</span></span>
                <span className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-widest text-center">Members</span>
             </div>
             <div className="flex flex-col items-center justify-center p-4">
                <span className="text-4xl md:text-5xl font-bold tracking-tight text-slate-800 mb-2">60<span className="text-[#00629b]">+</span></span>
                <span className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-widest text-center">Annual Events</span>
             </div>
             <div className="flex flex-col items-center justify-center p-4">
                <span className="text-4xl md:text-5xl font-bold tracking-tight text-slate-800 mb-2">12<span className="text-[#00629b]">+</span></span>
                <span className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-widest text-center">Societies</span>
             </div>
          </div>
        )}
        
      </div>
    </section>
  );
};

export default About;
