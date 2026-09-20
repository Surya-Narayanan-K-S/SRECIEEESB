import React, { useEffect, useState, Suspense, lazy } from "react";
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
import { HomePage } from "@/views/home";
import { InspectionSecurityGuard } from "@/components/security/InspectionSecurityGuard";
import { useVisitorTracker } from "@/hooks/useVisitorTracker";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";
import FloatingUIWidget from "@/components/layout/FloatingUIWidget";

// Code-split route components to maximize mobile performance & eliminate initial payload overhead
const LaunchPage = lazy(() => import("@/views/launch/LaunchPage").then(m => ({ default: m.LaunchPage || m.default })));
const LaunchRemote = lazy(() => import("@/views/launch/LaunchRemote").then(m => ({ default: m.LaunchRemote || m.default })));
const MobileAppPage = lazy(() => import("@/views/mobile/MobileAppPage"));
const NotFound = lazy(() => import("@/views/not-found/NotFound").then(m => ({ default: m.NotFound || m.default })));
const AboutPage = lazy(() => import("@/views/info/AboutPage").then(m => ({ default: m.AboutPage || m.default })));
const ActivitiesPage = lazy(() => import("@/views/info/ActivitiesPage").then(m => ({ default: m.ActivitiesPage || m.default })));
const AnnualPlansPage = lazy(() => import("@/views/info/AnnualPlansPage").then(m => ({ default: m.AnnualPlansPage || m.default })));
const AwardsPage = lazy(() => import("@/views/info/AwardsPage").then(m => ({ default: m.AwardsPage || m.default })));
const ContactPage = lazy(() => import("@/views/info/ContactPage").then(m => ({ default: m.ContactPage || m.default })));
const FundingsPlanPage = lazy(() => import("@/views/info/FundingsPlanPage").then(m => ({ default: m.FundingsPlanPage || m.default })));
const GalleryPage = lazy(() => import("@/views/info/GalleryPage").then(m => ({ default: m.GalleryPage || m.default })));
const TeamPage = lazy(() => import("@/views/info/TeamPage").then(m => ({ default: m.TeamPage || m.default })));
const PdfViewerPage = lazy(() => import("@/views/info/PdfViewerPage").then(m => ({ default: m.PdfViewerPage || m.default })));
const SocietiesPage = lazy(() => import("@/views/societies/SocietiesPage").then(m => ({ default: m.SocietiesPage || m.default })));
const SocietyDetailPage = lazy(() => import("@/views/societies/SocietyDetailPage").then(m => ({ default: m.SocietyDetailPage || m.default })));
const SocietyOfficeBearersPage = lazy(() => import("@/views/societies/SocietyOfficeBearersPage").then(m => ({ default: m.SocietyOfficeBearersPage || m.default })));
const SrecBranchPage = lazy(() => import("@/views/societies/chapters/SrecBranchPage"));
const WiePage = lazy(() => import("@/views/societies/chapters/WiePage"));
const EmbsPage = lazy(() => import("@/views/societies/chapters/EmbsPage"));
const CsPage = lazy(() => import("@/views/societies/chapters/CsPage"));
const ComsocPage = lazy(() => import("@/views/societies/chapters/ComsocPage"));
const PelsPage = lazy(() => import("@/views/societies/chapters/PelsPage"));
const ImPage = lazy(() => import("@/views/societies/chapters/ImPage"));
const CisPage = lazy(() => import("@/views/societies/chapters/CisPage"));
const CasPage = lazy(() => import("@/views/societies/chapters/CasPage"));
const StudentLoginPage = lazy(() => import("@/views/student/StudentLoginPage").then(m => ({ default: m.StudentLoginPage || m.default })));
const StudentDashboardPage = lazy(() => import("@/views/student/StudentDashboardPage").then(m => ({ default: m.StudentDashboardPage || m.default })));
const MembershipRegistrationPage = lazy(() => import("@/views/student/MembershipRegistrationPage").then(m => ({ default: m.MembershipRegistrationPage || m.default })));
const JoinPage = lazy(() => import("@/views/student/JoinPage").then(m => ({ default: m.JoinPage || m.default })));
const OfficeBearersPage = lazy(() => import("@/views/office-bearers/OfficeBearersPage").then(m => ({ default: m.OfficeBearersPage || m.default })));
const PastOfficeBearersPage = lazy(() => import("@/views/office-bearers/PastOfficeBearersPage").then(m => ({ default: m.PastOfficeBearersPage || m.default })));
const EventReportsPage = lazy(() => import("@/views/reports/EventReportsPage").then(m => ({ default: m.EventReportsPage || m.default })));
const AdminDashboardRoute = lazy(() => import("@/views/admin/AdminDashboard").then(m => ({ default: m.default || m.AdminDashboard })));
const AdminLoginPage = lazy(() => import("@/views/admin/AdminLoginPage").then(m => ({ default: m.AdminLoginPage || m.default })));
const TrafficAnalyticsAdmin = lazy(() => import("@/views/admin/TrafficAnalyticsAdmin").then(m => ({ default: m.TrafficAnalyticsAdmin || m.default })));

const queryClient = new QueryClient();

// Global Pristine White Presentation Canvas across the entire site
const GlobalCollegeBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-white" aria-hidden="true">
    {/* Subtle Architectural Campus Watermark */}
    <div className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.04] filter grayscale contrast-125" style={{ backgroundImage: `url(${srecCampus})` }}/>
    
    {/* Clean Geometric Matrix Lines */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,102,204,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,102,204,0.03)_1px,transparent_1px)] bg-[size:36px_36px]" />
    
    {/* Soft Accent Radial Glows */}
    <div className="absolute top-1/4 -left-20 w-[550px] h-[550px] bg-blue-400/6 rounded-full blur-[160px]" />
    <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-sky-400/6 rounded-full blur-[170px]" />
    <div className="absolute top-2/3 left-1/3 w-[450px] h-[450px] bg-amber-400/5 rounded-full blur-[150px]" />
    
    {/* Subtle Vignette Overlay */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(248,250,252,0.6)_100%)]" />
  </div>
);

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

// Page Transition & Fault Isolation Wrapper with Suspense code-splitting
const PageTransition = ({ children }) => (
  <ErrorBoundary>
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Loading...</p>
          </div>
        </div>
      }
    >
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </Suspense>
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
// Defaults to the full responsive website on all devices (mobile phone, tablet, desktop).
// Standalone native mobile apps (Capacitor/APK) and explicit app routes (/app, /mobile, ?view=app)
// use the MobileAppPage tab interface.
const ResponsiveRoute = ({
  desktop: DesktopComponent,
  mobileTab = "home",
  mobileCategory = "menu",
  focusSociety = null,
  forceLogin = false,
  desktopProps = {}
}) => {
  const isNativeApp = Capacitor.isNativePlatform();
  const [searchParams] = useSearchParams();
  const forceView = searchParams.get("view"); // Allow ?view=desktop or ?view=mobile/app
  const hostname = typeof window !== "undefined" ? window.location.hostname.toLowerCase() : "";

  const userPrefersDesktop =
    typeof window !== "undefined" &&
    (localStorage.getItem("ieee_preferred_view") === "desktop" || forceView === "desktop" || forceView === "web");
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

  // Environment variable flags for dedicated standalone mobile builds (e.g., Capacitor APK)
  const appMode = (import.meta.env.VITE_APP_MODE || import.meta.env.MODE || "").toLowerCase();
  const isStandaloneAppEnv =
    appMode === "app" || appMode === "mobile" || appMode === "android" || appMode === "ios";

  // Dedicated app subdomains or native app environments
  const isDedicatedAppPlatform =
    isNativeApp ||
    isStandaloneAppEnv ||
    hostname.includes("srec-ieee-app") ||
    hostname.includes("srecieeeapp") ||
    hostname.startsWith("app.") ||
    hostname.startsWith("m.") ||
    hostname.startsWith("mobile.");

  if (isDedicatedAppPlatform) {
    return (
      <MobileAppPage
        defaultTab={mobileTab}
        defaultCategory={mobileCategory}
        focusSociety={focusSociety}
        forceLogin={forceLogin}
      />
    );
  }

  // Default: All mobile phones, tablets, and computers open the full website first!
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
          {/* Main Home Route - Standalone Remote Mode Support */}
          <Route
            path="/"
            element={
              <PageTransition>
                {import.meta.env.VITE_STANDALONE_REMOTE === "true" ||
                import.meta.env.VITE_APP_TARGET === "remote" ? (
                  <LaunchRemote />
                ) : (
                  <ResponsiveRoute desktop={HomePage} mobileTab="home" />
                )}
              </PageTransition>
            }
          />

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
