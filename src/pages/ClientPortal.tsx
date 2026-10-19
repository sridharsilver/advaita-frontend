import React, { useState, useEffect } from "react";
import { Loader2, Folder, DollarSign, Clock, ShieldCheck, CheckCircle2, ChevronRight, Download } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function ClientPortal() {
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [portalData, setPortalData] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, this would be an authenticated endpoint returning all client data
      // For this implementation, we will mock a fetch to get projects for this email
      const res = await fetch(`/api/client/portal?email=${encodeURIComponent(email)}&code=${encodeURIComponent(accessCode)}`);
      if (res.ok) {
        const data = await res.json();
        setPortalData(data);
        setIsAuthenticated(true);
      } else {
        toast.error("Invalid credentials.");
      }
    } catch (e) {
      toast.error("Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-900">Client Portal</h1>
            <p className="text-sm text-slate-500 mt-2">Sign in to view your projects and invoices.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Access Code</label>
              <input
                type="password"
                required
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition disabled:opacity-50 flex justify-center items-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Access Portal"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black mb-1">Welcome back, {portalData?.clientName || "Client"}</h1>
            <p className="text-slate-400 text-sm">Here is an overview of your active projects and account status.</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg transition backdrop-blur-md">
            Sign Out
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Projects Column */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Folder className="h-5 w-5 text-indigo-500" /> Active Projects
            </h2>
            
            {portalData?.projects?.length > 0 ? (
              portalData.projects.map((project: any) => (
                <div key={project.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{project.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">Started on {new Date(project.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full">
                      {project.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Recent Milestones</h4>
                    {project.milestones?.length > 0 ? (
                      project.milestones.map((m: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-3">
                          {m.status === "Completed" ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-slate-300 shrink-0" />
                          )}
                          <div>
                            <p className={`text-sm font-semibold ${m.status === "Completed" ? "text-slate-900" : "text-slate-600"}`}>{m.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{m.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">No milestones recorded yet.</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 shadow-sm">
                No active projects found.
              </div>
            )}
          </div>

          {/* Sidebar Column: Invoices & Agreements */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-500" /> Invoices
            </h2>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              {portalData?.invoices?.length > 0 ? (
                portalData.invoices.map((invoice: any) => (
                  <div key={invoice.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition cursor-pointer border border-transparent hover:border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{invoice.type}</p>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">{invoice.amount}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                      invoice.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center">No invoices found.</p>
              )}
            </div>

            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mt-8">
              <ShieldCheck className="h-5 w-5 text-blue-500" /> Documents
            </h2>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
               {portalData?.agreements?.length > 0 ? (
                portalData.agreements.map((agreement: any) => (
                  <div key={agreement.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition border border-transparent hover:border-slate-100">
                    <div className="min-w-0 pr-4">
                      <p className="text-sm font-bold text-slate-900 truncate">Service Agreement</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{new Date(agreement.created_at).toLocaleDateString()}</p>
                    </div>
                    {agreement.pdf_url ? (
                      <a href={agreement.pdf_url} target="_blank" rel="noreferrer" className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition shrink-0" title="Download Signed PDF">
                        <Download className="h-4 w-4" />
                      </a>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Processing</span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center">No documents found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
