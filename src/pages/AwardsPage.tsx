import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Trophy,
    Award as AwardIcon,
    Medal,
    Sparkles,
    Search,
    Loader2,
    Star,
    DollarSign,
    ExternalLink
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

type Award = {
    id: number;
    title: string;
    year: number;
    description: string | null;
    category: string | null;
    amount: string | null;
    image_url?: string | null;
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.45, ease: "easeOut" }
    }
};

const getValidImageUrl = (url?: string | null) => {
    if (!url || !url.trim()) return "";
    const path = url.trim();
    if (path.startsWith("http")) return path;

    const safePath = encodeURIComponent(path);
    const { data } = supabase.storage.from("activities").getPublicUrl(safePath);
    return data?.publicUrl || "";
};

const AwardsPage = () => {
    const [data, setData] = useState<Award[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedYear, setSelectedYear] = useState<string>("All");

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase
                .from("awards")
                .select("*")
                .order("year", { ascending: false });

            setData(data || []);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const availableYears = useMemo(() => {
        return ["All", ...Array.from(new Set(data.map((d) => d.year.toString())))].sort(
            (a, b) => (b === "All" ? 1 : a === "All" ? -1 : Number(b) - Number(a))
        );
    }, [data]);

    const filteredAwards = useMemo(() => {
        return data.filter((award) => {
            const matchesYear = selectedYear === "All" || award.year?.toString() === selectedYear;
            const term = search.toLowerCase();

            const matchesSearch =
                !term ||
                (award.title && award.title.toLowerCase().includes(term)) ||
                (award.description && award.description.toLowerCase().includes(term)) ||
                (award.category && award.category.toLowerCase().includes(term));

            return matchesYear && matchesSearch;
        });
    }, [data, search, selectedYear]);

    // Separate Spotlight Awards (e.g. containing "outstanding", "best", "winner" or with high amounts)
    const { spotlightAwards, regularAwards } = useMemo(() => {
        const spotlights: Award[] = [];
        const regulars: Award[] = [];

        filteredAwards.forEach(award => {
            const isSpot = award.title.toLowerCase().includes("outstanding") || 
                           award.title.toLowerCase().includes("national") ||
                           (award.amount && award.amount.toLowerCase().includes("usd"));
            if (isSpot && spotlights.length < 2) {
                spotlights.push(award);
            } else {
                regulars.push(award);
            }
        });

        return { spotlightAwards: spotlights, regularAwards: regulars };
    }, [filteredAwards]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 overflow-x-hidden">
            <Navbar />


            {/* Hall of Fame Header Section */}
            <section className="bg-gradient-to-br from-[#001730] via-[#002b54] to-[#003866] text-white py-16 md:py-20 relative overflow-hidden rounded-b-[40px] border-b border-[#004780]/40 text-left">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />

                <motion.div
                    animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                    className="absolute top-10 right-16 opacity-15 hidden md:block"
                >
                    <Trophy size={140} />
                </motion.div>

                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-6">
                            <Sparkles size={12} className="animate-spin-slow" />
                            Hall of Fame
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight mb-4">
                            Honors & Awards
                        </h1>
                        <p className="text-blue-100 text-base md:text-lg leading-relaxed max-w-xl">
                            Celebrating outstanding achievements, grants, and global recognitions earned by the students and advisors of IEEE SREC.
                        </p>
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 relative z-20">
                
                {/* Search & Year Filtering Dashboard */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-10 flex flex-col xl:flex-row gap-5 xl:items-center justify-between"
                >
                    <div className="relative flex-1 max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search honors, grants, categories..."
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 transition text-sm font-semibold placeholder-slate-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0 no-scrollbar">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Select Year</span>
                        {availableYears.map((y) => (
                            <button
                                key={y}
                                onClick={() => setSelectedYear(y)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                                    selectedYear === y
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-650/15"
                                        : "bg-slate-50 text-slate-650 hover:bg-slate-100 border border-slate-100"
                                }`}
                            >
                                {y}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {isLoading ? (
                    <div className="py-24 flex flex-col items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                        <p className="text-slate-400 font-bold text-sm tracking-widest uppercase animate-pulse">Loading Honors Gallery...</p>
                    </div>
                ) : filteredAwards.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200"
                    >
                        <Trophy className="mx-auto text-slate-300 w-16 h-16 mb-4" />
                        <h3 className="text-lg font-bold text-slate-800 mb-2">No Awards Found</h3>
                        <p className="text-slate-500 text-xs max-w-xs mx-auto">
                            No matching items were found under the active filter parameters.
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-12 text-left">

                        {/* spotlight awards */}
                        {spotlightAwards.length > 0 && (
                            <div className="space-y-6">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 flex items-center gap-1.5">
                                    <Sparkles size={14} className="fill-blue-500" /> Spotlight Achievements
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {spotlightAwards.map(award => (
                                        <motion.div
                                            key={award.id}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="group relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#001730] to-[#002a52] text-white flex flex-col justify-between min-h-[300px] border border-[#003c78]/40 shadow-lg hover:scale-[1.01] transition-all duration-300"
                                        >
                                            <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all pointer-events-none" />
                                            
                                            <div className="flex justify-between items-start">
                                                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-amber-300">
                                                    <Trophy size={28} />
                                                </div>
                                                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/10 text-blue-200 border border-white/10 tracking-widest uppercase">{award.year}</span>
                                            </div>

                                            <div className="mt-8">
                                                {award.category && (
                                                    <span className="text-[10px] font-bold tracking-widest uppercase text-blue-300 block mb-2">{award.category}</span>
                                                )}
                                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">
                                                    {award.title}
                                                </h3>
                                                {award.description && (
                                                    <p className="text-white/60 text-xs leading-relaxed line-clamp-3">
                                                        {award.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                                                {award.amount && award.amount !== "-" ? (
                                                    <span className="text-green-300 font-extrabold text-sm flex items-center gap-1">
                                                        <DollarSign size={14} /> {award.amount}
                                                    </span>
                                                ) : <div />}
                                                {award.image_url && (
                                                    <a 
                                                        href={getValidImageUrl(award.image_url)} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-xs font-bold text-blue-300 hover:text-white flex items-center gap-1.5 transition-colors"
                                                    >
                                                        Details <ExternalLink size={12} />
                                                    </a>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* gallery list / regular awards grid */}
                        <div className="space-y-6">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Honors Directory</h2>
                            
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                <AnimatePresence>
                                    {regularAwards.map((award) => (
                                        <motion.div
                                            key={award.id}
                                            variants={itemVariants}
                                            layout
                                            className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all flex flex-col justify-between min-h-[260px] group relative text-left"
                                        >
                                            <div>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-650 group-hover:text-blue-600 transition-colors">
                                                        {award.category?.toLowerCase().includes("winner") ? (
                                                            <Medal size={20} />
                                                        ) : (
                                                            <AwardIcon size={20} />
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-100">{award.year}</span>
                                                </div>

                                                <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                                                    {award.title}
                                                </h3>
                                                {award.description && (
                                                    <p className="text-slate-550 text-xs leading-relaxed line-clamp-3">
                                                        {award.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                                                {award.amount && award.amount !== "-" ? (
                                                    <span className="text-emerald-700 font-extrabold">{award.amount}</span>
                                                ) : <div />}
                                                {award.image_url && (
                                                    <a 
                                                        href={getValidImageUrl(award.image_url)} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                                    >
                                                        Details <ExternalLink size={12} />
                                                    </a>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        </div>

                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default AwardsPage;
