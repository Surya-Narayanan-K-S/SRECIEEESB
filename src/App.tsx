import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { Capacitor } from "@capacitor/core";
import { AnimatePresence, motion } from "framer-motion";
import InstallPrompt from "@/components/InstallPrompt";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import SocietiesPage from "./pages/SocietiesPage";
import SocietyDetailPage from "./pages/SocietyDetailPage";
import SrecBranchPage from "./pages/SrecBranchPage";
import WiePage from "./pages/WiePage";
import EmbsPage from "./pages/EmbsPage";
import CsPage from "./pages/CsPage";
import ComsocPage from "./pages/ComsocPage";
import PelsPage from "./pages/PelsPage";
import ImPage from "./pages/ImPage";
import CisPage from "./pages/CisPage";
import JoinPage from "./pages/JoinPage";
import MembershipRegistrationPage from "./pages/MembershipRegistrationPage";
import ContactPage from "./pages/ContactPage";
import TeamPage from "./pages/TeamPage";
import OfficeBearersPage from "./pages/OfficeBearersPage";
import PastOfficeBearersPage from "./pages/PastOfficeBearersPage";
import AdminDashboardRoute from "./pages/AdminDashboard.tsx";
import AdminLoginPage from "./pages/AdminLoginPage.tsx";
import AwardsPage from "./pages/AwardsPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import ActivitiesPage from "./pages/ActivitiesPage.tsx";
import AnnualPlansPage from "./pages/AnnualPlansPage.tsx";
import FundingsPlanPage from "./pages/FundingsPlanPage.tsx";
import GalleryPage from "./pages/GalleryPage.tsx";
import GodDayPage from "./pages/GodDayPage.tsx";
import StudentLoginPage from "./pages/StudentLoginPage.tsx";

const queryClient = new QueryClient();

// Scroll to top helper on every page navigation
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    } else {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, hash]);

  return null;
};

// Use HashRouter for native app platforms to prevent WebView routing failures,
// and BrowserRouter for web platforms (like Vercel) to maintain clean URLs.
const RouterComponent = Capacitor.isNativePlatform()
  ? HashRouter
  : (props: React.ComponentProps<typeof BrowserRouter>) => (
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} {...props} />
    );


// Page Transition Wrapper — smooth fade+slide animation on every route change
const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
          <Route path="/activities" element={<PageTransition><ActivitiesPage /></PageTransition>} />
          <Route path="/team" element={<PageTransition><TeamPage /></PageTransition>} />
          <Route path="/office-bearers" element={<PageTransition><OfficeBearersPage /></PageTransition>} />
          <Route path="/past-bearers" element={<PageTransition><PastOfficeBearersPage /></PageTransition>} />
          <Route path="/gallery" element={<PageTransition><GalleryPage /></PageTransition>} />
          <Route path="/awards" element={<PageTransition><AwardsPage /></PageTransition>} />
          <Route path="/annual-plans" element={<PageTransition><AnnualPlansPage /></PageTransition>} />
          <Route path="/funding" element={<PageTransition><FundingsPlanPage /></PageTransition>} />
          <Route path="/societies" element={<PageTransition><SocietiesPage /></PageTransition>} />
          <Route path="/societies/srec" element={<PageTransition><SrecBranchPage /></PageTransition>} />
          <Route path="/societies/wie" element={<PageTransition><WiePage /></PageTransition>} />
          <Route path="/societies/embs" element={<PageTransition><EmbsPage /></PageTransition>} />
          <Route path="/societies/cs" element={<PageTransition><CsPage /></PageTransition>} />
          <Route path="/societies/comsoc" element={<PageTransition><ComsocPage /></PageTransition>} />
          <Route path="/societies/pels" element={<PageTransition><PelsPage /></PageTransition>} />
          <Route path="/societies/im" element={<PageTransition><ImPage /></PageTransition>} />
          <Route path="/societies/cis" element={<PageTransition><CisPage /></PageTransition>} />
          <Route path="/join" element={<PageTransition><JoinPage /></PageTransition>} />
          <Route path="/membership-registration" element={<PageTransition><MembershipRegistrationPage /></PageTransition>} />
          <Route path="/register" element={<PageTransition><MembershipRegistrationPage /></PageTransition>} />
          <Route path="/student-login" element={<PageTransition><StudentLoginPage /></PageTransition>} />
          <Route path="/student-portal" element={<PageTransition><StudentLoginPage /></PageTransition>} />
          <Route path="/member-portal" element={<PageTransition><StudentLoginPage /></PageTransition>} />
          <Route path="/member-card" element={<PageTransition><StudentLoginPage /></PageTransition>} />
          <Route path="/societies/:id" element={<PageTransition><SocietyDetailPage /></PageTransition>} />
          <Route path="/godday" element={<PageTransition><GodDayPage /></PageTransition>} />
          <Route path="/god-day" element={<PageTransition><GodDayPage /></PageTransition>} />
          <Route path="/god-day-2026" element={<PageTransition><GodDayPage /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
          <Route path="/admin-login" element={<PageTransition><AdminLoginPage /></PageTransition>} />
          <Route path="/admin/*" element={<PageTransition><AdminDashboardRoute /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!Capacitor.isNativePlatform() && <SpeedInsights />}
        {!Capacitor.isNativePlatform() && <Analytics />}
        {!Capacitor.isNativePlatform() && <InstallPrompt />}
        <RouterComponent>
          <AnimatedRoutes />
        </RouterComponent>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;