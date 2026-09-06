import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Route, Routes, useLocation, useSearchParams } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/feedback/sonner";
import { Toaster } from "@/components/ui/feedback/toaster";
import { TooltipProvider } from "@/components/ui/overlays/tooltip";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { Capacitor } from "@capacitor/core";
import { AnimatePresence, motion } from "framer-motion";
import srecCampus from "@/assets/srec-campus.png";
import { supabase } from "@/lib/supabase";
import { useIsMobile } from "@/hooks/use-mobile";
import { LaunchPage } from "./pages/launch/LaunchPage";
import { LaunchRemote } from "./pages/launch/LaunchRemote";
import { HomePage } from "./pages/home";
import { MobileAppPage } from "./pages/mobile";
import { NotFound } from "./pages/not-found";
import { AboutPage, ActivitiesPage, AnnualPlansPage, AwardsPage, ContactPage, FundingsPlanPage, GalleryPage, TeamPage, PdfViewerPage } from "./pages/info";
import { SocietiesPage, SocietyDetailPage, SocietyOfficeBearersPage, SrecBranchPage, WiePage, EmbsPage, CsPage, ComsocPage, PelsPage, ImPage, CisPage, CasPage, } from "./pages/societies";
import { StudentLoginPage, StudentDashboardPage, MembershipRegistrationPage, JoinPage, } from "./pages/student";
import { OfficeBearersPage, PastOfficeBearersPage } from "./pages/office-bearers";
import { EventReportsPage } from "./pages/reports";
import { AdminDashboardRoute, AdminLoginPage, TrafficAnalyticsAdmin } from "./pages/admin";
import { InspectionSecurityGuard } from "@/components/security/InspectionSecurityGuard";
import { useVisitorTracker } from "@/hooks/useVisitorTracker";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";
import FloatingUIWidget from "@/components/layout/FloatingUIWidget";
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
    <div className="relative z-10 w-full min-h-screen">
      {children}
    </div>
  </ErrorBoundary>
);
// Global Launch Mode Guard — intercepts ALL public routes (e.g. /about, /societies, /gallery, etc.)
// when Launch Mode is enabled in Supabase, preventing any bypass and displaying LaunchPage
// while keeping /remote, /admin, and post-inauguration (?inaugurated=true) routes functional.
const GlobalLaunchModeGuard = ({ children }) => {
  const location = useLocation();
  const pathname = location.pathname.toLowerCase();
  const searchParams = new URLSearchParams(location.search);
  const isInaugurated = searchParams.get("inaugurated") === "true";

  // Check if current route is an administrative, remote control, or bypass route
  const isExcludedRoute =
    pathname.startsWith("/launch") ||
    pathname.startsWith("/remote") ||
    pathname.startsWith("/mobile-remote") ||
    pathname.startsWith("/stage") ||
    pathname.startsWith("/inauguration") ||
    pathname.startsWith("/admin");

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
  }, [location.pathname]);

  // If Launch Mode is active and current route is not an excluded route or post-inauguration bypass
  if (isLaunchMode && !isExcludedRoute && !isInaugurated) {
    return <LaunchPage />;
  }

  return children;
};

// Universal Smart Responsive Route Wrapper
// Automatically provides full Mobile App view on mobile viewports/devices/apps
// and Desktop Web Experience on desktop viewports.
const ResponsiveRoute = ({
  desktop: DesktopComponent,
  mobileTab = "home",
  mobileCategory = "menu",
  focusSociety = null,
  forceLogin = false,
  desktopProps = {}
}) => {
  const isNativeApp = Capacitor.isNativePlatform();
  const isMobileDevice = useIsMobile();
  const [searchParams] = useSearchParams();
  const forceView = searchParams.get("view"); // Allow ?view=desktop or ?view=mobile
  const hostname = typeof window !== "undefined" ? window.location.hostname.toLowerCase() : "";

  const userPrefersDesktop =
    typeof window !== "undefined" &&
    (localStorage.getItem("ieee_preferred_view") === "desktop" || forceView === "desktop");
  const userPrefersMobile =
    typeof window !== "undefined" &&
    (localStorage.getItem("ieee_preferred_view") === "mobile" || forceView === "mobile" || forceView === "app");

  if (userPrefersDesktop) {
    return <DesktopComponent {...desktopProps} />;
  }
  if (userPrefersMobile) {
    return (
      <MobileAppPage
        defaultTab={mobileTab}
        defaultCategory={mobileCategory}
        focusSociety={focusSociety}
        forceLogin={forceLogin}
      />
    );
  }

  // Environment variable flags
  const appMode = (import.meta.env.VITE_APP_MODE || import.meta.env.MODE || "").toLowerCase();
  const isStandaloneAppEnv =
    appMode === "app" || appMode === "mobile" || appMode === "android" || appMode === "ios";

  const isAppDomain =
    isNativeApp ||
    isStandaloneAppEnv ||
    isMobileDevice ||
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

  if (isAppDomain) {
    return (
      <MobileAppPage
        defaultTab={mobileTab}
        defaultCategory={mobileCategory}
        focusSociety={focusSociety}
        forceLogin={forceLogin}
      />
    );
  }

  return <DesktopComponent {...desktopProps} />;
};

const AnimatedRoutes = () => {
    useVisitorTracker();
    const location = useLocation();
    return (
      <GlobalLaunchModeGuard>
        <ScrollToTop />
        <GlobalCollegeBackground />
        <Routes location={location} key={location.pathname}>
          {/* Main Home Route */}
          <Route path="/" element={<PageTransition><ResponsiveRoute desktop={HomePage} mobileTab="home" /></PageTransition>}/>

          {/* Launch & Inauguration Protocols */}
          <Route path="/launch" element={<PageTransition><LaunchPage /></PageTransition>}/>
          <Route path="/inauguration" element={<PageTransition><LaunchPage /></PageTransition>}/>
          <Route path="/stage" element={<PageTransition><LaunchPage forceMode="stage" /></PageTransition>}/>
          <Route path="/launch-stage" element={<PageTransition><LaunchPage forceMode="stage" /></PageTransition>}/>
          <Route path="/remote" element={<PageTransition><LaunchRemote /></PageTransition>}/>
          <Route path="/launch-remote" element={<PageTransition><LaunchRemote /></PageTransition>}/>
          <Route path="/mobile-remote" element={<PageTransition><LaunchRemote /></PageTransition>}/>
          <Route path="/launch/remote" element={<PageTransition><LaunchRemote /></PageTransition>}/>
          <Route path="/remote-control" element={<PageTransition><LaunchRemote /></PageTransition>}/>
          <Route path="/remote-mode" element={<PageTransition><LaunchRemote /></PageTransition>}/>

          {/* Explicit Platform Overrides */}
          <Route path="/web" element={<PageTransition><HomePage /></PageTransition>}/>
          <Route path="/desktop" element={<PageTransition><HomePage /></PageTransition>}/>
          <Route path="/app" element={<PageTransition><MobileAppPage /></PageTransition>}/>
          <Route path="/mobile" element={<PageTransition><MobileAppPage /></PageTransition>}/>
          <Route path="/m" element={<PageTransition><MobileAppPage /></PageTransition>}/>

          {/* Core Information & Branch Pages (Dual Mobile/Desktop) */}
          <Route path="/about" element={<PageTransition><ResponsiveRoute desktop={AboutPage} mobileTab="menu" mobileCategory="about" /></PageTransition>}/>
          <Route path="/activities" element={<PageTransition><ResponsiveRoute desktop={ActivitiesPage} mobileTab="events" /></PageTransition>}/>
          <Route path="/reports" element={<PageTransition><ResponsiveRoute desktop={EventReportsPage} mobileTab="menu" mobileCategory="reports" /></PageTransition>}/>
          <Route path="/event-reports" element={<PageTransition><ResponsiveRoute desktop={EventReportsPage} mobileTab="menu" mobileCategory="reports" /></PageTransition>}/>
          <Route path="/activity-reports" element={<PageTransition><ResponsiveRoute desktop={EventReportsPage} mobileTab="menu" mobileCategory="reports" /></PageTransition>}/>
          <Route path="/hub-congress" element={<PageTransition><ResponsiveRoute desktop={EventReportsPage} mobileTab="menu" mobileCategory="reports" /></PageTransition>}/>
          <Route path="/team" element={<PageTransition><ResponsiveRoute desktop={TeamPage} mobileTab="menu" mobileCategory="team" /></PageTransition>}/>
          <Route path="/executive-committee" element={<PageTransition><ResponsiveRoute desktop={TeamPage} mobileTab="menu" mobileCategory="team" /></PageTransition>}/>
          <Route path="/office-bearers" element={<PageTransition><ResponsiveRoute desktop={OfficeBearersPage} mobileTab="menu" mobileCategory="office-bearers" /></PageTransition>}/>
          <Route path="/past-bearers" element={<PageTransition><ResponsiveRoute desktop={PastOfficeBearersPage} mobileTab="menu" mobileCategory="past-bearers" /></PageTransition>}/>
          <Route path="/past-office-bearers" element={<PageTransition><ResponsiveRoute desktop={PastOfficeBearersPage} mobileTab="menu" mobileCategory="past-bearers" /></PageTransition>}/>
          <Route path="/gallery" element={<PageTransition><ResponsiveRoute desktop={GalleryPage} mobileTab="menu" mobileCategory="gallery" /></PageTransition>}/>
          <Route path="/awards" element={<PageTransition><ResponsiveRoute desktop={AwardsPage} mobileTab="menu" mobileCategory="awards" /></PageTransition>}/>
          <Route path="/annual-plans" element={<PageTransition><ResponsiveRoute desktop={AnnualPlansPage} mobileTab="menu" mobileCategory="plans" /></PageTransition>}/>
          <Route path="/funding" element={<PageTransition><ResponsiveRoute desktop={FundingsPlanPage} mobileTab="menu" mobileCategory="funding" /></PageTransition>}/>
          <Route path="/contact" element={<PageTransition><ResponsiveRoute desktop={ContactPage} mobileTab="menu" mobileCategory="contact" /></PageTransition>}/>

          {/* Technical Societies Pages (Dual Mobile/Desktop) */}
          <Route path="/societies" element={<PageTransition><ResponsiveRoute desktop={SocietiesPage} mobileTab="societies" /></PageTransition>}/>
          <Route path="/societies/office-bearers" element={<PageTransition><ResponsiveRoute desktop={SocietyOfficeBearersPage} mobileTab="societies" /></PageTransition>}/>
          <Route path="/societies/:id/office-bearers" element={<PageTransition><ResponsiveRoute desktop={SocietyOfficeBearersPage} mobileTab="societies" /></PageTransition>}/>
          <Route path="/society-office-bearers" element={<PageTransition><ResponsiveRoute desktop={SocietyOfficeBearersPage} mobileTab="societies" /></PageTransition>}/>
          <Route path="/societies/srec" element={<PageTransition><ResponsiveRoute desktop={SrecBranchPage} mobileTab="societies" focusSociety="srec" /></PageTransition>}/>
          <Route path="/societies/wie" element={<PageTransition><ResponsiveRoute desktop={WiePage} mobileTab="societies" focusSociety="wie" /></PageTransition>}/>
          <Route path="/societies/embs" element={<PageTransition><ResponsiveRoute desktop={EmbsPage} mobileTab="societies" focusSociety="embs" /></PageTransition>}/>
          <Route path="/societies/cs" element={<PageTransition><ResponsiveRoute desktop={CsPage} mobileTab="societies" focusSociety="cs" /></PageTransition>}/>
          <Route path="/societies/comsoc" element={<PageTransition><ResponsiveRoute desktop={ComsocPage} mobileTab="societies" focusSociety="comsoc" /></PageTransition>}/>
          <Route path="/societies/pels" element={<PageTransition><ResponsiveRoute desktop={PelsPage} mobileTab="societies" focusSociety="pels" /></PageTransition>}/>
          <Route path="/societies/im" element={<PageTransition><ResponsiveRoute desktop={ImPage} mobileTab="societies" focusSociety="im" /></PageTransition>}/>
          <Route path="/societies/cis" element={<PageTransition><ResponsiveRoute desktop={CisPage} mobileTab="societies" focusSociety="cis" /></PageTransition>}/>
          <Route path="/societies/cas" element={<PageTransition><ResponsiveRoute desktop={CasPage} mobileTab="societies" focusSociety="cas" /></PageTransition>}/>
          <Route path="/societies/cass" element={<PageTransition><ResponsiveRoute desktop={CasPage} mobileTab="societies" focusSociety="cas" /></PageTransition>}/>
          <Route path="/societies/:id" element={<PageTransition><ResponsiveRoute desktop={SocietyDetailPage} mobileTab="societies" /></PageTransition>}/>

          {/* Student Portal & Member Dashboards (Dual Mobile/Desktop) */}
          <Route path="/join" element={<PageTransition><ResponsiveRoute desktop={JoinPage} mobileTab="home" /></PageTransition>}/>
          <Route path="/membership-registration" element={<PageTransition><ResponsiveRoute desktop={MembershipRegistrationPage} mobileTab="home" /></PageTransition>}/>
          <Route path="/register" element={<PageTransition><ResponsiveRoute desktop={MembershipRegistrationPage} mobileTab="home" /></PageTransition>}/>
          <Route path="/student-login" element={<PageTransition><ResponsiveRoute desktop={StudentLoginPage} mobileTab="id" forceLogin={true} /></PageTransition>}/>
          <Route path="/student-portal" element={<PageTransition><ResponsiveRoute desktop={StudentLoginPage} mobileTab="id" forceLogin={true} /></PageTransition>}/>
          <Route path="/member-portal" element={<PageTransition><ResponsiveRoute desktop={StudentLoginPage} mobileTab="id" forceLogin={true} /></PageTransition>}/>
          <Route path="/student-dashboard" element={<PageTransition><ResponsiveRoute desktop={StudentDashboardPage} mobileTab="id" /></PageTransition>}/>
          <Route path="/member-dashboard" element={<PageTransition><ResponsiveRoute desktop={StudentDashboardPage} mobileTab="id" /></PageTransition>}/>
          <Route path="/dashboard" element={<PageTransition><ResponsiveRoute desktop={StudentDashboardPage} mobileTab="id" /></PageTransition>}/>
          <Route path="/member-card" element={<PageTransition><ResponsiveRoute desktop={StudentDashboardPage} mobileTab="id" /></PageTransition>}/>

          {/* Document & Utility Viewers */}
          <Route path="/pdf-viewer" element={<PageTransition><PdfViewerPage /></PageTransition>}/>
          <Route path="/view-pdf" element={<PageTransition><PdfViewerPage /></PageTransition>}/>
          <Route path="/document" element={<PageTransition><PdfViewerPage /></PageTransition>}/>
          <Route path="/document-viewer" element={<PageTransition><PdfViewerPage /></PageTransition>}/>

          {/* Administrative Portals */}
          <Route path="/admin-login" element={<PageTransition><AdminLoginPage /></PageTransition>}/>
          <Route path="/admin/traffic" element={<PageTransition><TrafficAnalyticsAdmin /></PageTransition>}/>
          <Route path="/admin/*" element={<PageTransition><AdminDashboardRoute /></PageTransition>}/>

          {/* 404 Fallback */}
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>}/>
        </Routes>
    </GlobalLaunchModeGuard>);
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
                <FloatingUIWidget />
              </RouterComponent>
            </InspectionSecurityGuard>
          </TooltipProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    );
};
export default App;
