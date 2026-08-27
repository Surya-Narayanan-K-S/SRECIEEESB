import React from "react";
import { Home, Calendar, IdCard, Cpu, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
const NAV_ITEMS = [
    { id: "home", label: "Home", icon: Home },
    { id: "events", label: "Events", icon: Calendar },
    { id: "id", label: "My ID", icon: IdCard },
    { id: "societies", label: "Societies", icon: Cpu },
    { id: "menu", label: "All Pages", icon: LayoutGrid },
];
export const MobileBottomNav = ({ activeTab, onChangeTab, }) => {
    return (<nav aria-label="Mobile Navigation Dock" className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-t border-slate-200/80 px-2 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-10px_35px_rgba(0,40,85,0.12)]">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (<button key={item.id} onClick={() => onChangeTab(item.id)} className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 mobile-touch-feedback ${isActive ? "text-[#002855] font-black" : "text-slate-500 hover:text-slate-800"}`}>
              {isActive && (<motion.div layoutId="mobileWhiteActiveDock" transition={{ type: "spring", stiffness: 450, damping: 35 }} className="absolute -top-2 w-8 h-1 bg-gradient-to-r from-[#002855] via-[#00629b] to-[#00d2ff] rounded-full shadow-[0_2px_10px_rgba(0,166,214,0.6)]"/>)}

              <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive
                    ? "bg-[#002855]/10 border border-[#002855]/25 text-[#002855] shadow-sm scale-105"
                    : "text-slate-400 hover:bg-slate-100"}`}>
                <Icon size={19} className={isActive ? "text-[#002855]" : "text-slate-500"}/>
              </div>

              <span className={`text-[10px] tracking-wider uppercase mt-1 leading-tight ${isActive ? "font-black text-[#002855]" : "font-semibold text-slate-500"}`}>
                {item.label}
              </span>
            </button>);
        })}
      </div>
    </nav>);
};
export default MobileBottomNav;
