import React from "react";
import { Home, Calendar, IdCard, Cpu, LayoutGrid, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { id: "home", label: "Feed", icon: Home },
  { id: "societies", label: "Societies", icon: Cpu },
  { id: "id", label: "Digital ID", icon: IdCard, badge: "LIVE" },
  { id: "events", label: "Events", icon: Calendar },
  { id: "menu", label: "Explore", icon: LayoutGrid },
];

export const MobileBottomNav = ({ activeTab, onChangeTab }) => {
  const handleTabClick = (id) => {
    if (typeof window !== "undefined" && "navigator" in window && navigator.vibrate) {
      try {
        navigator.vibrate(30);
      } catch {
        // Ignore
      }
    }
    onChangeTab(id);
  };

  return (
    <nav
      aria-label="Mobile Navigation Dock"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-t border-slate-200/90 px-2 pt-1.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,40,85,0.06)]"
    >
      <div className="w-full max-w-2xl mx-auto flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 mobile-touch-feedback cursor-pointer ${
                isActive ? "text-[#002855] font-black scale-105" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {/* Active spring pill indicator */}
              {isActive && (
                <motion.div
                  layoutId="mobileActiveDockPill"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  className="absolute -top-1.5 w-8 h-1 bg-[#002855] rounded-full shadow-xs"
                />
              )}

              <div className="relative">
                <div
                  className={`p-1.5 rounded-xl transition-all duration-200 flex items-center justify-center ${
                    isActive
                      ? "bg-blue-50/90 border border-blue-200/90 text-[#002855] shadow-xs"
                      : "text-slate-500 hover:bg-slate-100/80"
                  }`}
                >
                  <Icon size={19} className={isActive ? "text-[#002855]" : "text-slate-500"} />
                </div>

                {item.badge && !isActive && (
                  <span className="absolute -top-1 -right-1.5 px-1 py-0.2 rounded-full bg-blue-600 text-white font-black text-[7px] uppercase tracking-wider shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[9.5px] tracking-wider uppercase mt-0.5 leading-tight ${
                  isActive ? "font-black text-[#002855]" : "font-semibold text-slate-500"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
