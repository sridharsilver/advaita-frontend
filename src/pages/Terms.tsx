import React from "react";
import { FileText, Award, CreditCard, Key, AlertTriangle } from "lucide-react";

export function Terms() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute top-1/4 -left-64 h-[500px] w-[500px] rounded-full bg-gradient-brand opacity-15 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-0 h-[600px] w-[600px] rounded-full bg-[var(--brand-teal)] opacity-10 blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto max-w-3xl relative z-10">
        <div className="text-center md:text-left mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-primary uppercase bg-primary/10 border border-primary/20 mb-4">
            Legal Terms
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last Updated: May 30, 2026 • Advaita Creative Studio</p>
        </div>

        <div className="glass border border-white/10 dark:border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-10 leading-relaxed text-sm text-muted-foreground/90">
          <p className="text-base text-foreground/80">
            Welcome to Advaita Designs. By accessing our website, requesting design proposals, or entering into service contracts, you agree to comply with and be bound by these Terms of Service. These terms apply to all clients, visitors, and partners engaging with Advaita Designs.
          </p>

          <div className="h-px bg-border/50" />

          {/* Section 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="h-4.5 w-4.5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">1. Engagement of Services</h2>
            </div>
            <p className="pl-11">
              Advaita Designs provides professional creative, visual design, and engineering services. All engagements are initiated through custom proposals and finalized upon client confirmation and formal agreement signatures.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Award className="h-4.5 w-4.5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">2. Digital Proposals and Contracting</h2>
            </div>
            <p className="pl-11">
              Advaita Designs delivers project proposals and formal service contracts digitally. All agreements accepted and signed electronically using our digital signature portal have the same legal weight as traditional ink signatures.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <CreditCard className="h-4.5 w-4.5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">3. Fees & Payment Terms</h2>
            </div>
            <p className="pl-11">
              Compensation for services is determined by the final proposal and the itemized cost breakdown tables included in the executed Mutual Service Agreement. Milestones, billing schedules, and terms will be specified within each individual contract. Project initiation typically requires an upfront deposit.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Key className="h-4.5 w-4.5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">4. Intellectual Property</h2>
            </div>
            <p className="pl-11">
              Unless otherwise agreed in writing, intellectual property ownership of the final designs and codebase transfers to the client only after full and final payment has been cleared. Advaita Designs retains the right to display the completed work in marketing materials, case studies, and portfolios.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <AlertTriangle className="h-4.5 w-4.5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">5. Governing Law & Limitation of Liability</h2>
            </div>
            <p className="pl-11">
              These terms are governed by the laws of India. Advaita Designs will not be held liable for any indirect, consequential, or special damages. Our total liability under any engagement will not exceed the total fees paid by the client for the specific project.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
