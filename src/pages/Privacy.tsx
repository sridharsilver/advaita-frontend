import React, { useState, useEffect } from "react";
import { Shield, Eye, Lock, FileText, HelpCircle } from "lucide-react";

export function Privacy() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute top-1/4 -left-64 h-[500px] w-[500px] rounded-full bg-gradient-brand opacity-15 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-0 h-[600px] w-[600px] rounded-full bg-[var(--brand-teal)] opacity-10 blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto max-w-3xl relative z-10">
        <div className="text-center md:text-left mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-primary uppercase bg-primary/10 border border-primary/20 mb-4">
            Legal Agreement
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last Updated: May 30, 2026 • Advaita Creative Studio</p>
        </div>

        <div className="glass border border-white/10 dark:border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-10 leading-relaxed text-sm text-muted-foreground/90">
          <p className="text-base text-foreground/80">
            At Advaita Designs, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website, submit project inquiries, or interact with our digital proposals and contract platforms.
          </p>

          <div className="h-px bg-border/50" />

          {/* Section 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">1. Introduction</h2>
            </div>
            <p className="pl-11">
              We process your data strictly in accordance with modern digital protection standards. This policy governs all data collection endpoints, dynamic proposals, and mutual service agreements established on our cloud systems.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Eye className="h-4.5 w-4.5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">2. Information We Collect</h2>
            </div>
            <div className="pl-11 space-y-3">
              <p>We collect information that you voluntarily provide to us, including:</p>
              <ul className="space-y-2 list-none pl-0">
                <li className="flex gap-2 items-start">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Contact Information:</strong> Your name, company name, email address, phone number, and mailing address.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Project Inquiries:</strong> Any details you provide when contacting us regarding creative, design, or engineering services.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Electronic Signatures:</strong> Your typed full name and timestamp when accepting and signing a digital service agreement.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">3. How We Use Your Information</h2>
            </div>
            <div className="pl-11 space-y-3">
              <p>The information we collect is used to:</p>
              <ul className="space-y-2 list-none pl-0">
                <li className="flex gap-2 items-start">
                  <span className="text-primary font-bold">•</span>
                  <span>Respond to your service requests and inquiries.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-primary font-bold">•</span>
                  <span>Draft, deliver, track, and execute project proposals and mutual service agreements.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-primary font-bold">•</span>
                  <span>Manage client relationships, schedule reviews, and process payments.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-primary font-bold">•</span>
                  <span>Optimize website performance and improve user experience.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="h-4.5 w-4.5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">4. Information Sharing & Security</h2>
            </div>
            <p className="pl-11">
              We do not sell, trade, or transfer your personal data to third parties. We implement industry-standard security measures (including secure hosting, serverless edge operations, and encrypted endpoints) to maintain the safety of your information.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <HelpCircle className="h-4.5 w-4.5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">5. Your Rights & Contact</h2>
            </div>
            <div className="pl-11 space-y-2">
              <p>
                You have the right to access, update, or request deletion of your personal data stored on our systems. If you have any questions regarding this Privacy Policy, please contact us at:
              </p>
              <div className="bg-muted/50 border border-border p-4 rounded-2xl mt-4 inline-block">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Direct Email</p>
                <p className="text-sm font-bold text-foreground">{settings.email || "hello@advaita.design"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
