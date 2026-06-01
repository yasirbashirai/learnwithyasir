import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/lib/theme";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "@/pages/Landing";

// Lazy-load everything past the landing page to keep the first paint fast.
const Login = lazy(() => import("@/pages/Login"));
const Catalog = lazy(() => import("@/pages/Catalog"));
const CoursePage = lazy(() => import("@/pages/CoursePage"));
const LessonPage = lazy(() => import("@/pages/LessonPage"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Admin = lazy(() => import("@/pages/Admin"));
const Paths = lazy(() => import("@/pages/Paths"));
const Certificate = lazy(() => import("@/pages/Certificate"));
const Legal = lazy(() => import("@/pages/Legal"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

function PageFallback() {
  return (
    <div className="grid place-items-center min-h-[60vh]">
      <div className="w-10 h-10 rounded-full border-2 border-teal/30 border-t-teal animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        {/* Ambient background layers */}
        <div className="mesh-bg" aria-hidden />
        <div className="grain" aria-hidden />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/courses" element={<Catalog />} />
              <Route path="/paths" element={<Paths />} />
              <Route path="/courses/:slug" element={<CoursePage />} />
              <Route path="/privacy" element={<Legal doc="privacy" />} />
              <Route path="/terms" element={<Legal doc="terms" />} />
              <Route path="/disclaimer" element={<Legal doc="disclaimer" />} />
              <Route
                path="/courses/:slug/lesson/:lessonId"
                element={
                  <ProtectedRoute>
                    <LessonPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:slug/certificate"
                element={
                  <ProtectedRoute>
                    <Certificate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
