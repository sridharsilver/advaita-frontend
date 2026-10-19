import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { RootLayout } from "@/layouts/RootLayout";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";

// Lazy-loaded route components (mapping named exports for React.lazy)
const Feedback = lazy(() => import("@/pages/Feedback").then(m => ({ default: m.Feedback })));
const Privacy = lazy(() => import("@/pages/Privacy").then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import("@/pages/Terms").then(m => ({ default: m.Terms })));
const ProposalView = lazy(() => import("@/pages/ProposalView").then(m => ({ default: m.ProposalView })));
const AgreementView = lazy(() => import("@/pages/AgreementView").then(m => ({ default: m.AgreementView })));
const AgreementSign = lazy(() => import("@/pages/AgreementSign").then(m => ({ default: m.AgreementSign })));
const ClientPortal = lazy(() => import("@/pages/ClientPortal").then(m => ({ default: m.ClientPortal })));
const RequirementsForm = lazy(() => import("@/pages/RequirementsForm").then(m => ({ default: m.RequirementsForm })));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
          </Route>

          {/* Standalone Proposal, Agreement, Portal & Form Routes */}
          <Route path="proposal/:slug" element={<ProposalView />} />
          <Route path="proposal/:slug/contract" element={<AgreementView />} />
          <Route path="agreement/:id/sign" element={<AgreementSign />} />
          <Route path="agreement/:id" element={<AgreementSign />} />
          <Route path="client/portal" element={<ClientPortal />} />
          <Route path="requirements/:slug" element={<RequirementsForm />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
