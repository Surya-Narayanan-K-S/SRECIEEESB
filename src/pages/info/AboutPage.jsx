import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CollegeAbout from "@/components/about/CollegeAbout";
import Testimonials from "@/components/home/Testimonials";
import { motion } from "framer-motion";
import { Trophy, Globe2, Users, Rocket, Sparkles, BookOpen, Award, Heart, Quote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { usePageContent } from "@/hooks/useContent";
import journeyImage from "@/assets/IMG20251015144015.jpg";
const milestones = [
  {
    year: "2001",
    title: "Inception of IEEE SREC",
    description: "The IEEE Student Branch of Sri Ramakrishna Engineering College was officially inaugurated on June 11th, 2001, setting the foundation for technical excellence.",
    icon: Rocket,
    color: "from-blue-600 to-indigo-600"
  },
  {
    year: "2008",
    title: "Branch Expansion",
    description: "Launched specialized technical societies including Computer Society and Power and Electronics Society to cater to diverse engineering disciplines.",
    icon: Globe2,
    color: "from-emerald-500 to-teal-600"
  },
  {
    year: "2015",
    title: "Global Recognition",
    description: "Awarded continuous outstanding student branch rebates from IEEE Headquarters, New York, recognizing the massive scale of events conducted.",
    icon: Award,
    color: "from-amber-500 to-orange-600"
  },
  {
    year: "2020",
    title: "Digital Transformation",
    description: "Successfully transitioned to virtual platforms, hosting massive online hackathons, ideathons, and webinars reaching a global audience during the pandemic.",
    icon: Sparkles,
    color: "from-purple-600 to-fuchsia-600"
  },
  {
    year: "2024",
    title: "Legacy of Excellence",
    description: "Surpassed 500+ active members and marked 23+ years of continuous operation, remaining one of the most active student branches under IEEE Madras Section.",
    icon: Trophy,
    color: "from-rose-500 to-pink-600"
  }
];
const pillars = [
  {
    title: "Technical Excellence",
    desc: "We prioritize cutting-edge knowledge sharing through workshops, seminars, and technical symposia.",
    color: "from-blue-600 to-indigo-600",
    lightColor: "bg-blue-50 text-blue-600 border-blue-200",
    icon: BookOpen
  },
  {
    title: "Leadership & Growth",
    desc: "We build leaders by giving students complete autonomy to organize and execute large-scale initiatives.",
    color: "from-emerald-500 to-teal-600",
    lightColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
    icon: Users
  },
  {
    title: "Global Collaboration",
    desc: "Through international conferences and contests, we bridge SREC and the global tech community.",
    color: "from-purple-500 to-fuchsia-600",
    lightColor: "bg-purple-50 text-purple-600 border-purple-200",
    icon: Globe2
  }
];
const AboutPage = () => {
  const { data: counselor } = useQuery({
    queryKey: ["counselor_image"],
    queryFn: async () => {
      const { data } = await supabase
        .from("office_bearers")
        .select("image_url, name")
        .eq("role", "Student Branch Counsellor")
        .eq("year", 2025)
        .maybeSingle();
      return data;
    }
  });
  const { data: principal } = useQuery({
    queryKey: ["principal_info"],
    queryFn: async () => {
      const { data } = await supabase
        .from("senior_members")
        .select("image_url, name")
        .ilike("current_role", "%Principal%")
        .maybeSingle();
      return data;
    }
  });
  const { data: content } = usePageContent("about");
  return (<div className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden font-sans">

    {/* Crisp Ambient Background Pattern */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none z-0" />
    <div className="absolute top-1/4 left-0 w-[550px] h-[550px] bg-blue-400/10 rounded-full blur-[140px] pointer-events-none -translate-x-1/2" />
    <div className="absolute top-3/4 right-0 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[150px] pointer-events-none translate-x-1/3" />

    <Navbar />

    <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 py-12 flex flex-col gap-16 md:gap-24">

      {/* SECTION 1: Hero & Executive Messages (Two Columns) */}
      <section className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center text-left">
        <div className="lg:col-span-7 space-y-6">
          <motion.span initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-xs tracking-widest uppercase shadow-sm">
            <Sparkles size={14} className="text-blue-600 animate-pulse" />
            <span>Discover Our Legacy</span>
          </motion.span>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-none tracking-tight font-display">
            About <br />
            <span className="bg-gradient-to-r from-[#002855] via-blue-800 to-indigo-900 bg-clip-text text-transparent not-italic font-black">
              SREC IEEE SB
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-slate-600 text-base md:text-lg leading-relaxed font-normal">
            {content?.intro_text || "The IEEE Student Branch of Sri Ramakrishna Engineering College, operating since June 11th, 2001 under the IEEE Madras Section, is a vibrant hub promoting continuous technical excellence, research innovation, and professional evolution."}
          </motion.p>

          <div className="grid sm:grid-cols-3 gap-4 pt-4">
            {[
              { label: "Established", val: "2001" },
              { label: "Active Members", val: "500+" },
              { label: "IEEE Section", val: "Madras" }
            ].map((stat, i) => (<div key={i} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-md">
              <span className="text-2xl font-black text-blue-700 block font-display">{stat.val}</span>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</span>
            </div>))}
          </div>
        </div>

        {/* Right Column: Executive Messages */}
        <div className="lg:col-span-5 space-y-6">
          {/* Principal Message Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all">
            <Quote className="absolute top-3 right-3 text-slate-100 w-20 h-20 pointer-events-none" />
            <div className="relative z-10 flex flex-row items-center gap-4 sm:gap-5">
              {/* Left Photo */}
              <div className="shrink-0">
                {principal?.image_url ? (<img src={principal.image_url} alt={principal.name || "Dr. A. Soundarrajan"} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl object-cover shadow-lg border-2 border-blue-600/30 shrink-0" />) : (<div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-2xl shadow-lg border-2 border-blue-600/30 shrink-0">
                  AS
                </div>)}
              </div>

              {/* Right Content */}
              <div className="flex-1 min-w-0 text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] sm:text-xs tracking-widest uppercase mb-2 border border-blue-200">
                  <Award size={12} className="animate-pulse" />
                  <span>Principal Message</span>
                </span>
                <p className="text-slate-700 text-xs sm:text-sm italic leading-relaxed mb-3">
                  "{content?.principal_message || "Fostering innovation, research, and technical excellence to empower young minds to solve global challenges with ethical values and leadership."}"
                </p>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base font-display leading-tight">{principal?.name || "Dr. A. Soundarrajan"}</h4>
                  <p className="text-blue-700 text-[10px] sm:text-xs font-bold tracking-wider uppercase mt-0.5">Principal, SREC</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Counselor Message Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all">
            <Quote className="absolute top-3 right-3 text-slate-100 w-20 h-20 pointer-events-none" />
            <div className="relative z-10 flex flex-row items-center gap-4 sm:gap-5">
              {/* Left Photo */}
              <div className="shrink-0">
                <img src="https://srec.ac.in/uploads/Faculty/imresizer4drkbalamurugan260715124354.jpg" alt={counselor?.name || "Dr. K. Balamurugan"} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl object-cover shadow-lg border-2 border-indigo-600/30 shrink-0" />
              </div>

              {/* Right Content */}
              <div className="flex-1 min-w-0 text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px] sm:text-xs tracking-widest uppercase mb-2 border border-indigo-200">
                  <Heart size={12} className="animate-pulse" />
                  <span>Counselor Message</span>
                </span>
                <p className="text-slate-700 text-xs sm:text-sm italic leading-relaxed mb-3">
                  "{content?.counselor_message || "Empowering students to transcend boundaries and embrace the technological future with confidence, leadership, and ethical responsibility."}"
                </p>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base font-display leading-tight">{counselor?.name || "Dr. K. Balamurugan"}</h4>
                  <p className="text-indigo-700 text-[10px] sm:text-xs font-bold tracking-wider uppercase mt-0.5">Branch Counselor, IEEE SREC</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: Institutional College About Spotlight with Campus Photo */}
      <section className="border-t border-slate-200 pt-10">
        <CollegeAbout />
      </section>

      {/* SECTION 3: Historic Timeline */}
      <section className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start text-left border-t border-slate-200 pt-16 md:pt-24">
        <div className="lg:col-span-5 lg:sticky lg:top-36 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-2">Milestones</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight font-display">Our Historic Journey</h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Over two decades of continuous commitment to technical empowerment, student leadership, and global impact.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white p-2">
            <img src={journeyImage} alt="SREC IEEE Historic Group Photo" className="w-full h-auto rounded-2xl object-cover hover:scale-[1.02] transition-transform duration-500" />
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="relative space-y-6 pl-4 md:pl-8">
            <div className="absolute left-[9px] md:left-4 top-2 bottom-2 w-[2.5px] bg-slate-200" />

            {milestones.map((item, index) => (<div key={index} className="relative pl-8 group">
              <div className="absolute left-[3px] md:left-[10px] top-2 w-4 h-4 -translate-x-1/2 bg-white border-2 border-blue-600 rounded-full shadow-sm group-hover:scale-125 transition-transform z-10">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mx-auto my-0.5" />
              </div>

              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xs font-black px-3 py-1 rounded-full bg-gradient-to-r ${item.color} text-white uppercase tracking-wider`}>
                    {item.year}
                  </span>
                  <h3 className="font-display font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            </div>))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Core Pillars & Benefits Bento Grid */}
      <section className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start text-left border-t border-slate-200 pt-16 md:pt-24">

        {/* Left Column: Pillars */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-2">Foundations</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 font-display">Our Core Pillars</h2>
          </div>

          <div className="flex flex-col gap-4">
            {pillars.map((pillar, i) => (<motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl flex items-start gap-4 group transition-all">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${pillar.lightColor}`}>
                <pillar.icon size={22} />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </motion.div>))}
          </div>
        </div>

        {/* Right Column: Benefits */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-2">Perks</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 font-display">Membership Benefits</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: "IEEE Xplore Library",
                desc: "Gain free access to millions of highly cited engineering documents, papers, and journals.",
                icon: BookOpen,
                color: "text-blue-600 bg-blue-50 border-blue-200"
              },
              {
                title: "Global Networking",
                desc: "Connect directly with industry leaders and engineering students across more than 160 countries.",
                icon: Globe2,
                color: "text-indigo-600 bg-indigo-50 border-indigo-200"
              },
              {
                title: "Financial Grants",
                desc: "Eligibility for exclusive IEEE scholarships, travel grants, and project funding.",
                icon: Award,
                color: "text-emerald-600 bg-emerald-50 border-emerald-200"
              },
              {
                title: "Skill Credentials",
                desc: "Earn internationally recognized certificates for participating in technical contests.",
                icon: Trophy,
                color: "text-purple-600 bg-purple-50 border-purple-200"
              }
            ].map((perk, i) => (<div key={i} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl flex flex-col justify-between min-h-[160px] group transition-all">
              <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 mb-4 ${perk.color}`}>
                <perk.icon size={20} />
              </div>
              <div>
                <h4 className="font-display font-bold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors">{perk.title}</h4>
                <p className="text-slate-600 text-xs leading-relaxed">{perk.desc}</p>
              </div>
            </div>))}
          </div>
        </div>
      </section>

    </div>

    {/* SECTION 5: Student Reviews Carousel Section */}
    <section className="mt-16">
      <Testimonials />
    </section>

    <Footer />
  </div>);
};
export default AboutPage;
