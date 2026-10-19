import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check, X, Printer, Building2, Mail, MapPin, ArrowLeft, Rocket, CreditCard, FileSignature, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { toast, Toaster } from "sonner";
import logo from "@/assets/advaita-logo.webp";

interface Section {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  content?: string;
  items?: any[];
  config?: Record<string, any>;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  let cleanStr = dateStr;
  if (dateStr.includes(" ") && !dateStr.includes("T")) {
    cleanStr = dateStr.replace(" ", "T") + "Z";
  }
  const d = new Date(cleanStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString();
}

function Skeleton() {
  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <div className="h-16 bg-white/80 border-b border-slate-200" />
      <div className="container mx-auto px-4 py-12 max-w-4xl animate-pulse">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-16 space-y-10">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-slate-200 rounded-full" />
          </div>
          <div className="h-8 bg-slate-200 rounded-full w-64 mx-auto" />
          <div className="h-4 bg-slate-200 rounded-full w-40 mx-auto" />
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="h-48 bg-slate-100 rounded-2xl" />
            <div className="h-48 bg-slate-100 rounded-2xl" />
          </div>
          <div className="space-y-3">
            <div className="h-6 bg-slate-200 rounded-full w-48" />
            <div className="h-4 bg-slate-100 rounded-full w-full" />
            <div className="h-4 bg-slate-100 rounded-full w-3/4" />
          </div>
          <div className="space-y-3">
            <div className="h-6 bg-slate-200 rounded-full w-56" />
            <div className="h-32 bg-slate-100 rounded-xl" />
          </div>
          <div className="space-y-3">
            <div className="h-6 bg-slate-200 rounded-full w-52" />
            <div className="space-y-2">
              <div className="h-4 bg-slate-100 rounded-full w-full" />
              <div className="h-4 bg-slate-100 rounded-full w-full" />
              <div className="h-4 bg-slate-100 rounded-full w-3/4" />
              <div className="h-4 bg-slate-100 rounded-full w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgreementView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [urlPwd] = useState(() => new URLSearchParams(window.location.search).get("pwd") || "");
  const [proposal, setProposal] = useState<any>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [signatureName, setSignatureName] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [signedAt, setSignedAt] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const [legalOpen, setLegalOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const docRef = useRef<HTMLDivElement>(null);

  const handleSignAgreement = async () => {
    if (!isChecked || !signatureName.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          action: "status",
          status: "Approved",
          signatureName: signatureName.trim(),
        }),
      });

      if (res.ok) {
        const now = new Date();
        setSignedAt(now.toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" }));
        setProposal((prev: any) => ({
          ...prev,
          status: "Approved",
          signature_name: signatureName.trim(),
          signature_date: now.toISOString(),
        }));
        setIsSigned(true);
      } else {
        toast.error("Failed to sign the agreement.");
      }
    } catch {
      toast.error("Error signing the agreement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proposalRes, settingsRes] = await Promise.all([
          fetch(`/api/proposal?slug=${slug}${urlPwd ? `&pwd=${urlPwd}` : ""}`),
          fetch("/api/settings")
        ]);

        if (proposalRes.ok) {
          const data = await proposalRes.json();
          setProposal(data);
          if (data.status === "Approved") {
            setIsSigned(true);
            setSignedAt(data.signature_date ? new Date(data.signature_date).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" }) : "");
            setSignatureName(data.signature_name || "");
          }

          if (data.content_json) {
            try {
              setSections(JSON.parse(data.content_json));
            } catch {
              setSections([]);
            }
          } else {
            setSections([]);
          }
        } else {
          setError("This agreement's parent proposal doesn't exist or may have been deleted.");
        }

        if (settingsRes.ok) {
          setSettings(await settingsRes.json());
        }
      } catch {
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, urlPwd]);

  useEffect(() => {
    if (loading || error) return;
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(Math.min((scrollTop / docHeight) * 100, 100));

      const sectionIds = ["parties", "scope", "pricing", "legal", "signature"];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(id);
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, error]);

  const handlePrint = () => window.print();

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center text-slate-800 p-6">
        <div className="max-w-md w-full text-center space-y-4 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
          <X className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold">Agreement Unreachable</h2>
          <p className="text-slate-500 text-sm leading-relaxed">{error}</p>
          <a href="/" className="inline-block px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-full text-sm">
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  const allPricingSections = sections.filter(s => s.type === "pricing");
  const detailedPricingSections = allPricingSections.filter(s => {
    const title = (s.title || "").toLowerCase();
    return !title.includes("summary") && !title.includes("overall") && !title.includes("project cost");
  });
  const displayPricingSections = detailedPricingSections.length > 0 ? detailedPricingSections : allPricingSections;
  const urlMode = new URLSearchParams(window.location.search).get("mode");
  const isPhysicalMode = urlMode === "physical" && proposal.status === "Accepted" && !proposal.signature_name && !isSigned;
  const needsSignature = proposal.status !== "Accepted" && !isSigned;

  const navItems = [
    { id: "parties", label: "Parties" },
    { id: "scope", label: "Scope" },
    { id: "pricing", label: "Pricing" },
    { id: "legal", label: "Terms" },
    { id: "signature", label: "Sign" },
  ];

  return (
    <div className="bg-[#FAF9F6] text-[#0F172A] min-h-screen font-sans pb-32 sm:pb-24 print:bg-white print:text-black print:pb-0">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap');
        .font-signature { font-family: 'Dancing Script', cursive; }
        @media print {
          @page { size: A4; margin: 20mm; }
          body { background-color: white !important; color: black !important; font-size: 11pt; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .no-print { display: none !important; }
          .agreement-paper { box-shadow: none !important; border: none !important; padding: 0 !important; margin: 0 !important; background: transparent !important; max-width: 100% !important; }
          .print-break-before { page-break-before: always !important; break-before: page !important; padding-top: 10mm !important; }
        }
      `}</style>

      {/* Scroll Progress Bar */}
      <div className="no-print fixed top-0 left-0 right-0 z-50 h-1 bg-slate-200">
        <div className="h-full bg-slate-900 transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Section Navigation Dots */}
      <nav className="no-print fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={`group relative flex items-center justify-center w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === item.id ? "bg-slate-900 scale-125" : "bg-slate-300 hover:bg-slate-400"
            }`}
          >
            <span className="absolute right-5 px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Floating Toolbar */}
      <header className="no-print sticky top-1 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 h-14 sm:h-16 flex items-center justify-between shadow-sm px-4 sm:px-6">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-black tracking-wider text-xs sm:text-sm uppercase shrink-0">ADVAITA DESIGNS</span>
          <span className="h-4 w-px bg-slate-200 hidden xs:inline" />
          <span className="text-xs text-slate-500 hidden sm:inline truncate">Service Agreement</span>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity"
        >
          <Printer className="h-3.5 w-3.5" />
          <span className="hidden xs:inline">Print / Save PDF</span>
          <span className="xs:hidden">PDF</span>
        </button>
      </header>

      {/* Main Document Wrapper */}
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl print:py-0 print:px-0" ref={docRef}>
        <div className="agreement-paper bg-white border border-slate-200 shadow-xl rounded-3xl p-6 sm:p-10 lg:p-16 space-y-8 sm:space-y-10 transition-colors duration-300 print:shadow-none print:border-none print:p-0">

          {/* Header Title */}
          <div id="parties" className="text-center space-y-4 border-b border-slate-100 pb-6 sm:pb-8 scroll-mt-20">
            <div className="flex justify-center mb-4 sm:mb-6">
              <img src={logo} alt="Advaita Designs" className="h-12 sm:h-16 w-auto" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 uppercase leading-tight">
              Mutual Service Agreement
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold tracking-wider uppercase">
              Project: {proposal.title}
            </p>
          </div>

          {/* Parties Introduction */}
          <section className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700">
            <p>
              This Mutual Service Agreement (the <strong>"Agreement"</strong>) is entered into and made effective as of {proposal.status === "Accepted" ? <strong>{formatDate(proposal.signature_date || proposal.updated_at)}</strong> : "the date of electronic acceptance"} (the <strong>"Effective Date"</strong>), by and between:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
              <div className="bg-slate-50/70 p-5 sm:p-6 rounded-2xl border border-slate-100/80 flex flex-col justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200/60 text-slate-800 mb-3 sm:mb-4 w-fit">
                  Service Provider
                </span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-3">{settings.legal_name || "Sridhar Silver"}</h3>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{settings.email || "hello@advaita.design"}</span>
                  </div>
                  {settings.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="whitespace-pre-line leading-relaxed">{settings.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-50/70 p-5 sm:p-6 rounded-2xl border border-slate-100/80 flex flex-col justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 mb-3 sm:mb-4 w-fit">
                  Client
                </span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-3">{proposal.client_name}</h3>
                <div className="space-y-2 text-xs text-slate-600">
                  {proposal.company_name && proposal.company_name.toLowerCase().trim() !== proposal.client_name.toLowerCase().trim() && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{proposal.company_name}</span>
                    </div>
                  )}
                  {proposal.client_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{proposal.client_email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p>
              WHEREAS, Client desires to retain Service Provider to perform professional creative, design, and/or development services, and Service Provider agrees to perform such services under the terms and conditions set forth below.
            </p>
          </section>

          {/* Section 1: Scope of Work */}
          <section id="scope" className="space-y-3 scroll-mt-20">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-950 uppercase border-b border-slate-100 pb-1.5">
              1. Scope of Work & Deliverables
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Service Provider agrees to design and deliver the items described in the project proposal as outlined below:
            </p>
            {sections.filter(s => ["scope", "deliverables", "goals"].includes(s.type)).map((sec) => (
              <div key={sec.id} className="pl-3 sm:pl-4 border-l-2 border-slate-200 py-1 space-y-2 mt-2">
                <p className="font-bold text-xs sm:text-sm text-slate-800">{sec.title}</p>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 pl-0 list-none">
                  {sec.items?.map((item, idx) => (
                    <li key={idx} className="flex gap-2 items-start">
                      <span className="text-slate-400 select-none shrink-0">•</span>
                      <div>
                        <strong className="text-slate-900">{item.title || item.name}</strong>
                        {(item.description || item.detail) && (
                          <span className="text-slate-500"> — {item.description || item.detail}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Section 2: Financial Terms */}
          <section id="pricing" className="space-y-4 print-break-before scroll-mt-20">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-950 uppercase border-b border-slate-100 pb-1.5">
              2. Fees, Investment, & Billing Schedule
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Client agrees to compensate Service Provider for the services rendered as itemized below:
            </p>

            {displayPricingSections.map((pricingSec, secIdx) => {
              const items = pricingSec.items?.filter(item => {
                const name = item.name.toLowerCase();
                return !name.includes("total") && !name.includes("overall") && !name.includes("gst");
              }) || [];
              const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
              const hasGST = pricingSec.config?.showGST;
              const gstRate = pricingSec.config?.gstRate || 18;
              const gstAmount = hasGST ? (subtotal * gstRate) / 100 : 0;
              const grandTotal = subtotal + gstAmount;

              return (
                <div key={pricingSec.id} className="space-y-2 mt-3 sm:mt-4">
                  <p className="font-bold text-xs sm:text-sm text-slate-800">{pricingSec.title || `Pricing Section ${secIdx + 1}`}</p>
                  <div className="overflow-hidden border border-slate-200 rounded-xl shadow-xs">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-slate-900 text-white">
                          <th className="p-2.5 sm:p-3 font-semibold">Item / Phase</th>
                          <th className="p-2.5 sm:p-3 font-semibold text-right">Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="p-2.5 sm:p-3 font-medium text-slate-900">{item.name}</td>
                            <td className="p-2.5 sm:p-3 text-right font-bold text-slate-900">
                              ₹{Number(item.price || 0).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        ))}
                        {hasGST && (
                          <tr>
                            <td className="p-2.5 sm:p-3 font-medium text-slate-500">{gstRate}% GST</td>
                            <td className="p-2.5 sm:p-3 text-right font-bold text-slate-500">
                              ₹{gstAmount.toLocaleString("en-IN")}
                            </td>
                          </tr>
                        )}
                        <tr className="bg-emerald-50 font-bold">
                          <td className="p-2.5 sm:p-3 text-slate-900">Total {pricingSec.title || "Section"} Value</td>
                          <td className="p-2.5 sm:p-3 text-right font-black text-slate-900">
                            ₹{grandTotal.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}

            {(() => {
              if (displayPricingSections.length > 1) {
                let totalProjectValue = 0;
                displayPricingSections.forEach(sec => {
                  const items = sec.items?.filter(item => {
                    const name = item.name.toLowerCase();
                    return !name.includes("total") && !name.includes("overall") && !name.includes("gst");
                  }) || [];
                  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
                  const hasGST = sec.config?.showGST;
                  const gstRate = sec.config?.gstRate || 18;
                  const gstAmount = hasGST ? (subtotal * gstRate) / 100 : 0;
                  totalProjectValue += (subtotal + gstAmount);
                });
                return (
                  <div className="bg-emerald-50 p-3 sm:p-4 rounded-xl border border-emerald-200 mt-3 sm:mt-4 flex justify-between items-center font-bold">
                    <span className="text-slate-900 text-xs sm:text-sm uppercase tracking-wider">Total Contract Value (Combined)</span>
                    <span className="text-slate-950 text-sm sm:text-base lg:text-lg font-black">₹{totalProjectValue.toLocaleString("en-IN")}</span>
                  </div>
                );
              }
              return null;
            })()}

            {sections.find(s => s.type === "terms")?.content && (
              <div className="space-y-2 mt-2">
                <p className="font-bold text-xs sm:text-sm text-slate-800">Billing & Payment Schedule:</p>
                <div
                  className="text-slate-600 text-xs sm:text-sm leading-relaxed prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: sections.find(s => s.type === "terms")?.content || "" }}
                />
              </div>
            )}
            {settings.payment_instructions && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                <p className="font-bold text-xs text-slate-700 uppercase tracking-wider">Payment Instructions:</p>
                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{settings.payment_instructions}</p>
              </div>
            )}
          </section>

          {/* Section 3: Legal Terms & Conditions */}
          <section id="legal" className="space-y-4 print-break-before scroll-mt-20">
            <button
              onClick={() => setLegalOpen(!legalOpen)}
              className="no-print w-full flex items-center justify-between text-base sm:text-lg font-bold tracking-tight text-slate-950 uppercase border-b border-slate-100 pb-1.5"
            >
              <span>3. Legal Terms & Conditions</span>
              {legalOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </button>
            <h2 className="print-only text-base sm:text-lg font-bold tracking-tight text-slate-950 uppercase border-b border-slate-100 pb-1.5 hidden print:block">
              3. Legal Terms & Conditions
            </h2>
            <div className={`text-xs sm:text-sm leading-relaxed text-slate-600 space-y-3 ${legalOpen || typeof window === "undefined" ? "block" : "hidden print:block"} print:!block`}>
              <p>
                <strong>3.1 Intellectual Property & Ownership:</strong> Upon receipt of final payment in full, the exclusive ownership rights and intellectual property of the final deliverables designed under this Agreement will transfer to the Client. Service Provider retains the right to showcase the completed work in portfolios, case studies, and marketing materials.
              </p>
              <p>
                <strong>3.2 Confidentiality:</strong> Both parties agree to protect and keep confidential all proprietary or non-public information received during the course of the project, including business strategies, technical details, and client data.
              </p>
              <p>
                <strong>3.3 Revisions & Out-of-Scope Work:</strong> Any revisions or additional features outside the defined scope of work in Section 1 will be considered out-of-scope and billed at Service Provider's standard hourly rate or under a separate work agreement.
              </p>
              <p>
                <strong>3.4 Limitation of Liability:</strong> In no event will either party be liable to the other for any indirect, special, or consequential damages. Service Provider's total liability under this Agreement will not exceed the total fees paid by the Client.
              </p>
            </div>
          </section>

          {/* Section 4: Sign-off Signatures */}
          <section id="signature" className="space-y-6 pt-8 sm:pt-12 border-t border-slate-200 mt-8 sm:mt-12 print-break-before scroll-mt-20">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              IN WITNESS WHEREOF, the parties hereto have electronically accepted and executed this Service Agreement.
            </p>

            <div className="grid sm:grid-cols-2 gap-8 sm:gap-12 pt-6 sm:pt-8">
              <div className="space-y-4 sm:space-y-6">
                <p className="font-bold text-xs uppercase text-slate-400 tracking-wider">For Service Provider:</p>
                <div className="border-b border-slate-300 pb-2 h-14 sm:h-16 flex items-end">
                  <span className="font-serif italic text-lg sm:text-xl text-slate-800">{settings.legal_name || "Sridhar Silver"}</span>
                </div>
                <div className="text-xs text-slate-500 space-y-1">
                  <p className="font-bold text-slate-800">{settings.legal_name || "Sridhar Silver"}</p>
                  <p>Title: Principal Designer & Consultant</p>
                  <p>Date: {proposal.updated_at ? new Date(proposal.updated_at).toLocaleDateString() : new Date().toLocaleDateString()}</p>
                  {settings.address && (
                    <p className="whitespace-pre-line mt-1.5 pt-1.5 border-t border-slate-200/60 leading-relaxed text-[11px]">
                      {settings.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <p className="font-bold text-xs uppercase text-slate-400 tracking-wider">For Client:</p>
                <div className="border-b border-slate-300 pb-2 h-14 sm:h-16 flex items-end">
                  {isPhysicalMode ? (
                    <span className="text-slate-400 italic text-xs sm:text-sm">(Sign here →)</span>
                  ) : proposal.status === "Accepted" && proposal.signature_name ? (
                    <span className="font-signature text-xl sm:text-2xl text-emerald-600 font-bold leading-none">
                      {proposal.signature_name}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-300">Signature Line</span>
                  )}
                </div>
                <div className="text-xs text-slate-500 space-y-1">
                  <p className="font-bold text-slate-800">{proposal.client_name}</p>
                  {proposal.company_name && <p>Company: {proposal.company_name}</p>}
                  <p>
                    {isPhysicalMode
                      ? `Accepted offline and pending physical signature`
                      : proposal.status === "Accepted" && proposal.signature_name
                      ? `Digitally signed on: ${proposal.signature_date ? formatDate(proposal.signature_date) : formatDate(proposal.updated_at)}`
                      : "Status: Pending Acceptance"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Physical Signature Panel (accepted offline) */}
          {isPhysicalMode && (
            <div className="no-print mt-8 sm:mt-12 space-y-6">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 sm:p-10 text-center space-y-5">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-amber-100 flex items-center justify-center ring-4 sm:ring-8 ring-amber-50">
                      <Printer className="h-8 w-8 sm:h-10 sm:w-10 text-amber-600" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Accepted Offline</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                    This agreement has been approved for <span className="font-bold text-slate-800">{proposal.title}</span>.
                    Print it out and collect a physical signature from the client.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur border border-amber-200 rounded-2xl p-3 sm:p-4 inline-flex flex-col items-center gap-1 mx-auto">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Accepted by</p>
                  <span className="font-bold text-lg sm:text-xl text-slate-900">
                    {proposal.client_name}
                  </span>
                  {proposal.updated_at && (
                    <p className="text-[11px] text-slate-400 mt-1">
                      On {formatDate(proposal.updated_at)} · Pending physical signature
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="min-w-0 flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:opacity-90 transition"
                  >
                    <Printer className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Print for Signature</span>
                  </button>
                  <button
                    onClick={() => navigate(`/proposal/${slug}`)}
                    className="min-w-0 flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Back to Proposal</span>
                  </button>
                  {settings.email && (
                    <a
                      href={`mailto:${settings.email}?subject=Re: ${encodeURIComponent(proposal.title)}`}
                      className="min-w-0 flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition"
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">Email Us</span>
                    </a>
                  )}
                </div>

                <details className="text-left border border-amber-200 rounded-2xl p-4 bg-white/60">
                  <summary className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                    What to do next
                  </summary>
                  <ol className="mt-3 space-y-2 text-xs text-slate-600 list-decimal list-inside">
                    <li>Click <strong>Print for Signature</strong> above to generate a PDF.</li>
                    <li>Have the client sign and date the printed copy in the signature section (page 2).</li>
                    <li>Keep the signed copy for your records and provide a copy to the client.</li>
                  </ol>
                </details>
              </div>
            </div>
          )}

          {/* Digital Signature Panel */}
          {needsSignature && (
            <div className="no-print mt-8 sm:mt-12 space-y-6">
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 sm:p-5 flex gap-3 sm:gap-4 items-start">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                  <FileSignature className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-indigo-900">You're one step away from making it official</p>
                  <p className="text-xs text-indigo-700 mt-0.5 leading-relaxed">
                    Review the agreement above for <span className="font-semibold">{proposal.title}</span>.
                    Your digital signature below is legally binding and confirms your acceptance.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-8 space-y-5 sm:space-y-6">
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">Sign & Accept Agreement</h3>
                  <p className="text-xs sm:text-sm text-slate-500">To accept this agreement, confirm the acknowledgement and type your name below.</p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer shrink-0"
                    />
                    <span className="text-xs sm:text-sm text-slate-600 select-none group-hover:text-slate-800 transition-colors">
                      I agree to the Mutual Service Agreement terms, billing schedule, and legal conditions as outlined above.
                    </span>
                  </label>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Full Name (Type to Sign)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Priya Menon"
                        value={signatureName}
                        onChange={(e) => setSignatureName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-sm font-medium transition-all"
                      />
                      {signatureName && (
                        <div className="hidden sm:block absolute right-3 top-2.5 text-xs text-slate-400 italic pointer-events-none">
                          Preview: <span className="font-signature text-slate-800 text-xl ml-1 font-bold">{signatureName}</span>
                        </div>
                      )}
                    </div>
                    {signatureName && (
                      <p className="sm:hidden text-xs text-slate-400 italic">
                        Preview: <span className="font-signature text-slate-800 text-base ml-1 font-bold">{signatureName}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Desktop Sign Button */}
                <button
                  onClick={handleSignAgreement}
                  disabled={isSubmitting || !isChecked || !signatureName.trim()}
                  className="hidden sm:flex w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl text-sm transition-all hover:opacity-95 disabled:opacity-40 items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <span>Sign & Accept Agreement</span>
                </button>
              </div>
            </div>
          )}

          {/* Post-Sign Celebration Screen */}
          {(isSigned || (proposal.status === "Accepted" && proposal.signature_name)) && (
            <div className="no-print mt-8 sm:mt-12 space-y-6">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-6 sm:p-10 text-center space-y-5">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-emerald-100 flex items-center justify-center ring-4 sm:ring-8 ring-emerald-50">
                      <Check className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-600" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Agreement Signed</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                    The service agreement for <span className="font-bold text-slate-800">{proposal.title}</span> has been signed and accepted.
                  </p>
                  {proposal.client_type === "local" && (
                    <div className="mx-auto max-w-sm mt-2 p-3 bg-emerald-100/50 border border-emerald-200 rounded-xl">
                      <p className="text-emerald-800 text-xs sm:text-sm font-semibold">
                        Our representative will collect the physical copy.
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-white/80 backdrop-blur border border-emerald-200 rounded-2xl p-3 sm:p-4 inline-flex flex-col items-center gap-1 mx-auto">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Signed by</p>
                  <span className="font-signature text-2xl sm:text-3xl text-emerald-700 font-bold">
                    {proposal.signature_name || signatureName}
                  </span>
                  {(signedAt || proposal.signature_date) && (
                    <p className="text-[11px] text-slate-400 mt-1">
                      {signedAt || new Date(proposal.signature_date).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="min-w-0 flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:opacity-90 transition"
                  >
                    <Printer className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Download / Print</span>
                  </button>
                  <button
                    onClick={() => navigate(`/proposal/${slug}`)}
                    className="min-w-0 flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Back to Proposal</span>
                  </button>
                  {settings.email && (
                    <a
                      href={`mailto:${settings.email}?subject=Re: ${encodeURIComponent(proposal.title)}`}
                      className="min-w-0 flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition"
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">Email Us</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Sticky Signature Bar (digital signature mode only) */}
      {needsSignature && !isPhysicalMode && (
        <div className="no-print sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-2xl p-4 pb-6">
          <button
            onClick={handleSignAgreement}
            disabled={isSubmitting || !isChecked || !signatureName.trim()}
            className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl text-sm transition-all hover:opacity-95 disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            <span>Sign & Accept Agreement</span>
          </button>
        </div>
      )}

      <Toaster />
    </div>
  );
}
