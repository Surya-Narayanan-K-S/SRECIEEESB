import { TrendingUp, Users, BookOpen } from "lucide-react";

const impacts = [
  {
    icon: TrendingUp,
    title: "Career Advancement",
    description: "Our alumni consistently secure top-tier placements at leading tech giants globally, propelled by skills honed through our hands-on workshops.",
    metric: "95%"
  },
  {
    icon: Users,
    title: "Community Outreach",
    description: "We are committed to empowering the local community through regular coding bootcamps and STEM initiatives for high school students.",
    metric: "2,000+"
  },
  {
    icon: BookOpen,
    title: "Open Source Contributions",
    description: "Our members actively contribute to major open-source repositories, driving innovation that extends far beyond the campus borders.",
    metric: "500+"
  }
];

const Impact = () => {
  return (
    <section className="py-10 md:py-12 bg-white border-t border-slate-50 relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-50/50 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            Our <span className="text-slate-900 font-serif font-medium">Impact</span>
          </h2>
          <p className="text-slate-600 md:text-lg">
            We measure our success not just by the events we host, but by the tangible difference we make in the careers of our members and our local tech community.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 pl-0">
          {impacts.map((impact, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-full bg-[#fafafa] border border-slate-200 flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 group-hover:shadow-lg transition-all duration-700 ease-in-out">
                <impact.icon size={32} className="text-slate-400" />
              </div>
              <h3 className="text-4xl font-bold tracking-tight text-slate-900 mb-2 group-hover:text-slate-500 transition-colors">
                {impact.metric}
              </h3>
              <h4 className="text-xl font-bold text-slate-800 mb-4">
                {impact.title}
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                {impact.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Impact;
