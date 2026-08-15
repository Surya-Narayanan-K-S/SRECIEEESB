import React from "react";
import { Home, Users, IdCard, Cpu, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

export type MobileTabType = "home" | "directory" | "id" | "societies" | "menu";

interface MobileBottomNavProps {
  activeTab: MobileTabType;
  onChangeTab: (tab: MobileTabType) => void;
  memberCount?: number;
}

const NAV_ITEMS: { id: MobileTabType; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "directory", label: "Members", icon: Users },
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
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#000d20]/95 backdrop-blur-2xl border-t border-cyan-500/30 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-10px_35px_rgba(0,0,0,0.8)]"
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
                isActive ? "text-cyan-300 font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileActiveDock"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  className="absolute -top-2 w-8 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-[0_0_12px_rgba(0,210,255,0.9)]"
                />
              )}

              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-tr from-cyan-500/25 to-blue-600/30 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,210,255,0.4)] text-cyan-300"
                    : "text-slate-400"
                }`}
              >
                <Icon size={19} className={isActive ? "animate-pulse" : ""} />
              </div>

              <span className="text-[10px] tracking-wider uppercase mt-1 leading-tight font-extrabold">
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
