import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/feedback/sonner";
import { Toaster } from "@/components/ui/feedback/toaster";
import { TooltipProvider } from "@/components/ui/overlays/tooltip";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { Capacitor } from "@capacitor/core";
import { AnimatePresence, motion } from "framer-motion";
import srecCampus from "@/assets/srec-campus.png";
import { supabase } from "@/lib/supabase";
import { LaunchPage } from "./pages/launch/LaunchPage";
import { LaunchRemote } from "./pages/launch/LaunchRemote";
import { HomePage } from "./pages/home";
import { MobileAppPage } from "./pages/mobile";
import { NotFound } from "./pages/not-found";
import { AboutPage, ActivitiesPage, AnnualPlansPage, AwardsPage, ContactPage, FundingsPlanPage, GalleryPage, TeamPage, } from "./pages/info";
import { SocietiesPage, SocietyDetailPage, SocietyOfficeBearersPage, SrecBranchPage, WiePage, EmbsPage, CsPage, ComsocPage, PelsPage, ImPage, CisPage, CasPage, } from "./pages/societies";
import { StudentLoginPage, StudentDashboardPage, MembershipRegistrationPage, JoinPage, } from "./pages/student";
import { OfficeBearersPage, PastOfficeBearersPage } from "./pages/office-bearers";
import { EventReportsPage } from "./pages/reports";
import { AdminDashboardRoute, AdminLoginPage, TrafficAnalyticsAdmin } from "./pages/admin";
import { InspectionSecurityGuard } from "@/components/security/InspectionSecurityGuard";
import { useVisitorTracker } from "@/hooks/useVisitorTracker";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";
const queryClient = new QueryClient();
// Global College Campus Background across the entire site
const GlobalCollegeBackground = () => (<div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
    {/* SREC Campus Image Layer */}
    <div className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.08] filter contrast-125 saturate-110" style={{ backgroundImage: `url(${srecCampus})` }}/>
    {/* Soft architectural vignette overlays */}
    <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60"/>
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,102,204,0.04),transparent_60%)]"/>
  </div>);
// Scroll to top helper on every page navigation
const ScrollToTop = () => {
    const { pathname, hash } = useLocation();
    useEffect(() => {
        if (!hash) {
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
        else {
            const id = hash.replace("#", "");
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
            else {
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
    : (props) => (<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} {...props}/>);
// Page Transition & Fault Isolation Wrapper — guarantees EVERY page is protected by ErrorBoundary + Report Bug
const PageTransition = ({ children }) => (
  <ErrorBoundary>
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10"
    >
      {children}
    </motion.div>
  </ErrorBoundary>
);
// Smart Domain & Platform Routing
const ResponsiveHome = () => {
    const isNativeApp = Capacitor.isNativePlatform();
    const hostname = typeof window !== "undefined" ? window.location.hostname.toLowerCase() : "";

    // Check Launch Mode status
    const [isLaunchMode, setIsLaunchMode] = useState(() => {
      return typeof window !== "undefined" && localStorage.getItem("ieee_launch_mode_active") === "true";
    });

    useEffect(() => {
      const checkLaunchMode = async () => {
        try {
          const { data } = await supabase
            .from("page_content")
            .select("content_text")
            .eq("page_key", "launch_config")
            .eq("content_key", "launch_active")
            .maybeSingle();
          if (data) {
            const active = data.content_text === "true";
            setIsLaunchMode(active);
            localStorage.setItem("ieee_launch_mode_active", active ? "true" : "false");
          }
        } catch {
          // Ignore
        }
      };
      checkLaunchMode();
    }, []);

    // Environment variable flags
    const appMode = (import.meta.env.VITE_APP_MODE || import.meta.env.MODE || "").toLowerCase();
    const isStandalonePortalEnv = appMode === "portal" ||
        appMode === "student" ||
        appMode === "id" ||
        appMode === "member";
    const isStandaloneAppEnv = appMode === "app" ||
        appMode === "mobile" ||
        appMode === "android" ||
        appMode === "ios";
    // Hostname matching
    const isPortalDomain = isStandalonePortalEnv ||
        hostname.startsWith("portal.") ||
        hostname.startsWith("student.") ||
        hostname.startsWith("id.") ||
        hostname.startsWith("members.") ||
        hostname.startsWith("membership.") ||
        hostname.includes("srecieeeportal") ||
        hostname.includes("srecieeestudent") ||
        (hostname.includes("srecieee.org") && hostname.includes("portal"));
    const isAppDomain = isNativeApp ||
        isStandaloneAppEnv ||
        hostname.includes("srec-ieee-app") ||
        hostname.includes("srecieeeapp") ||
        hostname.includes("srecieeestudent") ||
        hostname.startsWith("srecieeestudent.") ||
        hostname.startsWith("app.") ||
        hostname.startsWith("m.") ||
        hostname.startsWith("mobile.") ||
        hostname.includes("-app") ||
        hostname.includes("app-") ||
        hostname.includes("ieee-app") ||
        hostname.includes("srec-app") ||
        hostname.includes("student-app") ||
        (hostname.includes("srecieee.org") && hostname.includes("student"));

    if (isLaunchMode && !isPortalDomain && !isAppDomain) {
        return <LaunchPage />;
    }

    if (isAppDomain) {
        return <MobileAppPage />;
    }
    if (isPortalDomain) {
        return <StudentLoginPage />;
    }
    return <HomePage />;
};
const AnimatedRoutes = () => {
    useVisitorTracker();
    const location = useLocation();
    return (<>
      <ScrollToTop />
      <GlobalCollegeBackground />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><ResponsiveHome /></PageTransition>}/>
          <Route path="/launch" element={<PageTransition><LaunchPage /></PageTransition>}/>
          <Route path="/inauguration" element={<PageTransition><LaunchPage /></PageTransition>}/>
          <Route path="/stage" element={<PageTransition><LaunchPage forceMode="stage" /></PageTransition>}/>
          <Route path="/launch-stage" element={<PageTransition><LaunchPage forceMode="stage" /></PageTransition>}/>
          <Route path="/remote" element={<PageTransition><LaunchRemote /></PageTransition>}/>
          <Route path="/launch-remote" element={<PageTransition><LaunchRemote /></PageTransition>}/>
          <Route path="/mobile-remote" element={<PageTransition><LaunchRemote /></PageTransition>}/>
          <Route path="/launch/remote" element={<PageTransition><LaunchRemote /></PageTransition>}/>
          <Route path="/web" element={<PageTransition><HomePage /></PageTransition>}/>
          <Route path="/desktop" element={<PageTransition><HomePage /></PageTransition>}/>
          <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>}/>
          <Route path="/activities" element={<PageTransition><ActivitiesPage /></PageTransition>}/>
          <Route path="/reports" element={<PageTransition><EventReportsPage /></PageTransition>}/>
          <Route path="/event-reports" element={<PageTransition><EventReportsPage /></PageTransition>}/>
          <Route path="/activity-reports" element={<PageTransition><EventReportsPage /></PageTransition>}/>
          <Route path="/hub-congress" element={<PageTransition><EventReportsPage /></PageTransition>}/>
          <Route path="/team" element={<PageTransition><TeamPage /></PageTransition>}/>
          <Route path="/office-bearers" element={<PageTransition><OfficeBearersPage /></PageTransition>}/>
          <Route path="/past-bearers" element={<PageTransition><PastOfficeBearersPage /></PageTransition>}/>
          <Route path="/gallery" element={<PageTransition><GalleryPage /></PageTransition>}/>
          <Route path="/awards" element={<PageTransition><AwardsPage /></PageTransition>}/>
          <Route path="/annual-plans" element={<PageTransition><AnnualPlansPage /></PageTransition>}/>
          <Route path="/funding" element={<PageTransition><FundingsPlanPage /></PageTransition>}/>
          <Route path="/societies" element={<PageTransition><SocietiesPage /></PageTransition>}/>
          <Route path="/societies/office-bearers" element={<PageTransition><SocietyOfficeBearersPage /></PageTransition>}/>
          <Route path="/societies/:id/office-bearers" element={<PageTransition><SocietyOfficeBearersPage /></PageTransition>}/>
          <Route path="/society-office-bearers" element={<PageTransition><SocietyOfficeBearersPage /></PageTransition>}/>
          <Route path="/societies/srec" element={<PageTransition><SrecBranchPage /></PageTransition>}/>
          <Route path="/societies/wie" element={<PageTransition><WiePage /></PageTransition>}/>
          <Route path="/societies/embs" element={<PageTransition><EmbsPage /></PageTransition>}/>
          <Route path="/societies/cs" element={<PageTransition><CsPage /></PageTransition>}/>
          <Route path="/societies/comsoc" element={<PageTransition><ComsocPage /></PageTransition>}/>
          <Route path="/societies/pels" element={<PageTransition><PelsPage /></PageTransition>}/>
          <Route path="/societies/im" element={<PageTransition><ImPage /></PageTransition>}/>
          <Route path="/societies/cis" element={<PageTransition><CisPage /></PageTransition>}/>
          <Route path="/societies/cas" element={<PageTransition><CasPage /></PageTransition>}/>
          <Route path="/societies/cass" element={<PageTransition><CasPage /></PageTransition>}/>
          <Route path="/join" element={<PageTransition><JoinPage /></PageTransition>}/>
          <Route path="/membership-registration" element={<PageTransition><MembershipRegistrationPage /></PageTransition>}/>
          <Route path="/register" element={<PageTransition><MembershipRegistrationPage /></PageTransition>}/>
          <Route path="/student-login" element={<PageTransition><StudentLoginPage /></PageTransition>}/>
          <Route path="/student-portal" element={<PageTransition><StudentLoginPage /></PageTransition>}/>
          <Route path="/member-portal" element={<PageTransition><StudentLoginPage /></PageTransition>}/>
          <Route path="/student-dashboard" element={<PageTransition><StudentDashboardPage /></PageTransition>}/>
          <Route path="/member-dashboard" element={<PageTransition><StudentDashboardPage /></PageTransition>}/>
          <Route path="/dashboard" element={<PageTransition><StudentDashboardPage /></PageTransition>}/>
          <Route path="/member-card" element={<PageTransition><StudentDashboardPage /></PageTransition>}/>
          <Route path="/app" element={<PageTransition><MobileAppPage /></PageTransition>}/>
          <Route path="/mobile" element={<PageTransition><MobileAppPage /></PageTransition>}/>
          <Route path="/m" element={<PageTransition><MobileAppPage /></PageTransition>}/>
          <Route path="/societies/:id" element={<PageTransition><SocietyDetailPage /></PageTransition>}/>
          <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>}/>
          <Route path="/admin-login" element={<PageTransition><AdminLoginPage /></PageTransition>}/>
          <Route path="/admin/traffic" element={<PageTransition><TrafficAnalyticsAdmin /></PageTransition>}/>
          <Route path="/admin/*" element={<PageTransition><AdminDashboardRoute /></PageTransition>}/>
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>}/>
        </Routes>
      </AnimatePresence>
    </>);
};
const App = () => {
    return (
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {typeof window !== "undefined" && window.location.hostname.includes("vercel.app") && (
              <>
                <SpeedInsights />
                <Analytics />
              </>
            )}
            <InspectionSecurityGuard>
              <RouterComponent>
                <AnimatedRoutes />
              </RouterComponent>
            </InspectionSecurityGuard>
          </TooltipProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    );
};
export default App;
