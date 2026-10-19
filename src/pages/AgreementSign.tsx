import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import { Loader2, ShieldCheck, Download, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function AgreementSign() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agreement, setAgreement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signatureName, setSignatureName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const sigPad = useRef<any>(null);

  useEffect(() => {
    const fetchAgreement = async () => {
      try {
        const res = await fetch(`/api/agreements?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setAgreement(data);
          
          // If already signed, don't show signing pad
          if (data.status === "Signed") {
            toast.success("This agreement has already been signed.");
          }
        } else {
          toast.error("Agreement not found");
        }
      } catch (e) {
        toast.error("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };
    fetchAgreement();
  }, [id]);

  const handleClearSignature = () => {
    if (sigPad.current) {
      sigPad.current.clear();
    }
  };

  const handleSignAgreement = async () => {
    if (!agreed) {
      toast.error("Please check the 'I Agree' box.");
      return;
    }
    if (!signatureName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (sigPad.current?.isEmpty()) {
      toast.error("Please draw your signature.");
      return;
    }

    setSubmitting(true);
    
    try {
      const signatureImage = sigPad.current.getTrimmedCanvas().toDataURL("image/png");
      const browserInfo = navigator.userAgent;
      const ipAddress = "127.0.0.1";

      const res = await fetch(`/api/agreements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sign",
          id: agreement.id,
          signatureName,
          signatureImage,
          ipAddress,
          browserInfo
        })
      });

      if (res.ok) {
        toast.success("Agreement signed successfully!");
        setAgreement({ ...agreement, status: "Signed" });
      } else {
        toast.error("Failed to sign agreement");
      }
    } catch (e: any) {
      console.error("Signing error:", e);
      toast.error(e.message || "Network error while signing");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Agreement Not Found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-8 text-center space-y-2">
          <ShieldCheck className="h-12 w-12 text-emerald-400 mx-auto mb-2" />
          <h1 className="text-2xl sm:text-3xl font-black">Service Agreement</h1>
          <p className="text-slate-300 text-sm">Prepared for {agreement.client_name}</p>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-12 space-y-8">
          <div className="prose max-w-none space-y-6 text-slate-700 text-sm">
            <div>
              <h3 className="font-bold text-slate-900 mb-2">1. Project Scope</h3>
              <div dangerouslySetInnerHTML={{ __html: agreement.scope_of_work || "No scope defined." }} />
            </div>
            
            <div>
              <h3 className="font-bold text-slate-900 mb-2">2. Deliverables</h3>
              <div dangerouslySetInnerHTML={{ __html: agreement.deliverables || "No deliverables defined." }} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2">3. Timeline</h3>
              <div dangerouslySetInnerHTML={{ __html: agreement.timeline || "No timeline defined." }} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2">4. Payment Terms</h3>
              <div dangerouslySetInnerHTML={{ __html: agreement.payment_terms || "No payment terms defined." }} />
              <p className="mt-2 font-bold">Total Project Value: {agreement.project_value}</p>
            </div>
          </div>

          {/* Signature Area */}
          <div className="mt-10 pt-10 border-t border-slate-200">
            {agreement.status === "Signed" ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
                <h3 className="text-xl font-bold text-emerald-900">Agreement Signed</h3>
                <p className="text-emerald-700">Thank you for signing. Your project is now being set up.</p>
                <div className="flex justify-center gap-4 pt-4">
                  <a href="/client/portal" className="px-6 py-2 bg-emerald-600 text-white rounded-full font-bold shadow hover:bg-emerald-700 transition">
                    Go to Portal
                  </a>
                  {agreement.pdf_url && (
                    <a href={agreement.pdf_url} target="_blank" rel="noreferrer" className="px-6 py-2 bg-white text-emerald-700 rounded-full font-bold shadow hover:bg-slate-50 transition flex items-center gap-2">
                      <Download className="h-4 w-4" /> Download PDF
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Sign Agreement</h3>
                  <p className="text-xs text-slate-500">By signing below, you agree to the terms outlined above.</p>
                </div>
                
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300 transition">
                    <input 
                      type="checkbox" 
                      checked={agreed} 
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-5 h-5 text-indigo-600 rounded"
                    />
                    <span className="text-sm font-semibold text-slate-800">I have read and agree to the Service Agreement.</span>
                  </label>

                  <input 
                    type="text" 
                    placeholder="Enter your full legal name" 
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    className="w-full p-4 rounded-xl border border-slate-200 font-bold focus:border-indigo-500 outline-none transition"
                  />

                  <div className="border border-slate-200 bg-white rounded-xl overflow-hidden relative">
                    <div className="absolute top-2 left-3 text-xs font-bold text-slate-300 uppercase tracking-widest select-none pointer-events-none">Draw Signature Below</div>
                    <SignatureCanvas 
                      ref={sigPad}
                      penColor="black"
                      canvasProps={{ className: "w-full h-48 cursor-crosshair" }}
                    />
                    <button 
                      onClick={handleClearSignature}
                      className="absolute bottom-2 right-2 text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1 bg-slate-100 rounded"
                    >
                      Clear
                    </button>
                  </div>

                  <button
                    onClick={handleSignAgreement}
                    disabled={submitting}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                    {submitting ? "Signing & Creating Project..." : "Sign & Finalize Agreement"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Ensure CheckCircle2 is imported if I missed it
import { CheckCircle2 } from "lucide-react";
