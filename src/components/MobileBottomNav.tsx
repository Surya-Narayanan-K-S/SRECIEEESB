import React from "react";
import { Home, Calendar, IdCard, Cpu, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

export type MobileTabType = "home" | "events" | "id" | "societies" | "menu";

interface MobileBottomNavProps {
  activeTab: MobileTabType;
  onChangeTab: (tab: MobileTabType) => void;
  memberCount?: number;
}

const NAV_ITEMS: { id: MobileTabType; label: string; icon: React.ElementType }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "events", label: "Events", icon: Calendar },
  { id: "id", label: "My ID", icon: IdCard },
  { id: "societies", label: "Societies", icon: Cpu },
  { id: "menu", label: "All Pages", icon: LayoutGrid },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onChangeTab,
}) => {
  return (
    <nav
      aria-label="Mobile Navigation Dock"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/75 backdrop-blur-2xl border-t border-white/80 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-10px_35px_rgba(0,40,85,0.10)] ring-1 ring-black/5"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 active:scale-95 ${
                isActive ? "text-[#002855] font-extrabold" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileWhiteActiveDock"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  className="absolute -top-2 w-8 h-1 bg-gradient-to-r from-[#002855] to-[#00629B] rounded-full shadow-[0_2px_8px_rgba(0,40,85,0.4)]"
                />
              )}

              <div
                className={`p-1.5 rounded-xl transition-all backdrop-blur-md ${
                  isActive
                    ? "bg-[#002855]/10 border border-[#002855]/20 text-[#002855] shadow-sm"
                    : "text-slate-400"
                }`}
              >
                <Icon size={19} className={isActive ? "scale-105 transition-transform text-[#002855]" : ""} />
              </div>

              <span className="text-[10px] tracking-wider uppercase mt-1 leading-tight font-black">
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

