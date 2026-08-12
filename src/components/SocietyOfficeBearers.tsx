import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Users, Crown, ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

type Person = {
  id: number | string;
  name: string;
  role: string;
  department?: string | null;
  image_url?: string | null;
  photo?: string | null;
  photo_url?: string | null;
};

const REAL_BEARERS_DATA: Person[] = [
  { id: "ob-1", name: "S Darshan", role: "Chairperson", department: "IV EEE" },
  { id: "ob-2", name: "D Jennifer Shobha", role: "Vice-Chairperson", department: "III Civil" },
  { id: "ob-3", name: "R Vishnu Kaarthik", role: "Secretary", department: "III EEE" },
  { id: "ob-4", name: "D R Prithika", role: "Treasurer", department: "II EEE B" },
  { id: "ob-5", name: "S Deepak", role: "Activities Coordinator", department: "IV EEE" },
  { id: "ob-6", name: "S Amirtha Varshini", role: "Joint Activity Coordinator", department: "III CSE A" },
  { id: "ob-7", name: "V Smrthikha", role: "Joint Activity Coordinator", department: "III BME" },
  { id: "ob-8", name: "K S Surya Narayanan", role: "Web Designer", department: "II EEE B" },
  { id: "ob-9", name: "Nithin Annamalai R", role: "Editor", department: "II EEE B" },
  { id: "ob-12", name: "Dr.K.Balamurugan", role: "Student Branch Counsellor", department: "AsP/EEE", image_url: "https://srec.ac.in/uploads/Faculty/imresizer4drkbalamurugan260715124354.jpg" },
];

const REAL_EXECS_DATA: Person[] = [
  { id: "em-1", name: "S Mathusri", role: "Executive Lead", department: "III M.Tech CSE" },
  { id: "em-2", name: "D Akshaya Dharun", role: "Technical Executive", department: "II CSE A" },
  { id: "em-3", name: "A Dhivya Tharsana", role: "Creative Executive", department: "II AI & DS" },
  { id: "em-4", name: "S V Hemesh", role: "Operations Executive", department: "II CSE A" },
  { id: "em-5", name: "M Barath", role: "Events Executive", department: "II EEE A" },
  { id: "em-6", name: "F Mohammed Aathif F", role: "Social Media Executive", department: "II EEE A" },
];

interface SocietyOfficeBearersProps {
  societyName?: string;
}

const SocietyOfficeBearers = ({ societyName = "Society" }: SocietyOfficeBearersProps) => {
  const [bearers, setBearers] = useState<Person[]>([]);
  const [executives, setExecutives] = useState<Person[]>([]);
  const [activeTab, setActiveTab] = useState<"bearers" | "executives">("bearers");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bearersRes, execsRes] = await Promise.all([
          supabase.from("new_office_bearers").select("*").order("id", { ascending: true }),
          supabase.from("new_executive_members").select("*").order("id", { ascending: true }),
        ]);

        const dbBearers = bearersRes.data && bearersRes.data.length > 0 ? bearersRes.data : REAL_BEARERS_DATA;
        const dbExecs = execsRes.data && execsRes.data.length > 0 ? execsRes.data : REAL_EXECS_DATA;

        setBearers(dbBearers);
        setExecutives(dbExecs);
      } catch {
        setBearers(REAL_BEARERS_DATA);
        setExecutives(REAL_EXECS_DATA);
      }
    };

    fetchData();
  }, []);

  const currentList = activeTab === "bearers" ? bearers : executives;

  return (
    <div className="w-full col-span-full font-sans">
      {/* Header Banner */}
      <div className="border border-slate-200 bg-white p-8 md:p-10 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-[10px] uppercase tracking-wider mb-3">
            <Users size={13} />
            <span>Chapter Leadership</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            {societyName} Office Bearers
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl">
            Meet the student office bearers and executive members driving innovation, technical events, and chapter operations at SREC.
          </p>
        </div>

        <Link
          to="/office-bearers"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg shrink-0"
        >
          <span>Open Full Office Bearers Page</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Sub Toggles */}
      <div className="flex gap-3 mb-8 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveTab("bearers")}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-all rounded-lg ${
            activeTab === "bearers"
              ? "bg-slate-900 text-white shadow"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Office Bearers ({bearers.length})
        </button>
        <button
          onClick={() => setActiveTab("executives")}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-all rounded-lg ${
            activeTab === "executives"
              ? "bg-slate-900 text-white shadow"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Executive Members ({executives.length})
        </button>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentList.map((person, idx) => {
          const imgSrc = person.image_url || person.photo || person.photo_url;
          return (
            <motion.div
              key={person.id || idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="bg-white border border-slate-200 hover:border-blue-400/80 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Photo / Avatar */}
                <div className="w-full h-48 rounded-xl bg-slate-100 overflow-hidden mb-4 relative flex items-center justify-center border border-slate-100">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={person.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 text-white text-2xl font-black -z-0">
                    {person.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                </div>

                <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 font-extrabold text-[10px] uppercase tracking-wider rounded-md mb-2">
                  {person.role}
                </span>

                <h4 className="font-serif font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                  {person.name}
                </h4>

                {person.department && (
                  <p className="text-slate-500 text-xs font-semibold mt-1">
                    {person.department}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>SREC Chapter</span>
                <Link to="/office-bearers" className="text-blue-600 hover:underline flex items-center gap-0.5">
                  <span>Profile</span>
                  <ExternalLink size={10} />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Link */}
      <div className="mt-10 text-center border-t border-slate-200 pt-8">
        <Link
          to="/office-bearers"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all rounded-full shadow-lg hover:shadow-blue-500/25"
        >
          <Crown size={15} />
          <span>View Complete SREC Office Bearers Directory</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
};

export default SocietyOfficeBearers;
