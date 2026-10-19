import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Loader2, ArrowLeft, Send, AlertTriangle, FileSignature, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import logo from "@/assets/advaita-logo.webp";
import logoDark from "@/assets/logo-dark.webp";

interface FormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "checkbox";
  options?: string[];
  required: boolean;
}

interface FormTemplate {
  id: number;
  title: string;
  description: string;
  fields_json: string;
}

export function RequirementsForm() {
  const { slug } = useParams<{ slug: string }>();
  const [form, setForm] = useState<FormTemplate | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  // Multi-step state for comprehensive form
  const [currentStep, setCurrentStep] = useState(0);

  const comprehensiveSteps = [
    { title: "Business Information", fields: ["field_name", "field_email", "biz_name", "biz_tagline", "biz_industry", "biz_desc", "biz_established", "biz_contact", "biz_phone", "biz_address", "biz_url"] },
    { title: "Project Overview", fields: ["project_purpose", "project_goals", "project_reason", "project_problems", "project_launch"] },
    { title: "Target Audience", fields: ["audience_ideal", "audience_age", "audience_location", "audience_interests", "audience_action"] },
    { title: "Website Type & Pages", fields: ["web_type", "pages_required"] },
    { title: "Branding & Design", fields: ["design_logo", "design_colors", "design_fonts", "design_guidelines", "design_style", "design_likes", "design_dislikes"] },
    { title: "Content Requirements", fields: ["content_provide", "content_writing", "content_languages", "content_images", "content_stock", "content_videos"] },
    { title: "Features & Functionality", fields: ["features_general"] },
    { title: "Proposal & Workflows", fields: ["workflow_needs"] },
    { title: "Tech & Management", fields: ["cms_management", "tech_hosting", "tech_pref"] },
    { title: "SEO, Budget & Timeline", fields: ["seo_reqs", "maintenance_needs", "budget_est", "budget_timeline", "additional_notes"] }
  ];

  const shortSteps = [
    { title: "Business & Project Goals", fields: ["field_name", "field_email", "biz_name", "biz_contact", "biz_phone", "biz_url", "biz_desc", "project_why", "project_goal"] },
    { title: "Audience & Pages", fields: ["audience_customers", "audience_location", "pages_needed"] },
    { title: "Branding & Content", fields: ["design_logo", "design_colors", "design_likes", "content_text", "content_images", "features_needed"] },
    { title: "Workflow, Tech & Budget", fields: ["workflow_pass", "workflow_approve", "workflow_sig", "tech_domain", "tech_hosting", "budget_est", "budget_date", "additional_notes", "client_sig"] }
  ];

  const bookSteps = [
    { title: "Project Details", fields: ["field_name", "field_email", "book_title", "author_name", "book_type", "book_lang", "book_pages", "book_format", "book_size"] },
    { title: "Formatting Requirements", fields: ["req_chapters", "req_headers", "req_page_nums", "req_toc", "req_images", "req_notes", "req_caps", "req_typo"] },
    { title: "Platform & Deliverables", fields: ["platform_kdp", "platform_ingram", "platform_undecided", "deliv_print", "deliv_epub", "deliv_kindle", "deliv_source"] },
    { title: "Timeline & Details", fields: ["proj_timeline", "proj_notes"] }
  ];

  const steps = slug === "website-comprehensive" 
    ? comprehensiveSteps 
    : slug === "book-formatting-requirements" 
      ? bookSteps 
      : shortSteps;

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/requirements?slug=${slug}`)
      .then(res => {
        if (res.status === 404) throw new Error("Form template not found");
        if (!res.ok) throw new Error("Failed to load form");
        return res.json();
      })
      .then((data: any) => {
        setForm(data);
        try {
          const parsedFields = JSON.parse(data.fields_json) as FormField[];
          setFields(parsedFields);
          
          // Initialize answer states
          const initialAnswers: Record<string, any> = {};
          parsedFields.forEach(f => {
            if (f.type === "checkbox") {
              initialAnswers[f.label] = false;
            } else {
              initialAnswers[f.label] = "";
            }
          });
          setAnswers(initialAnswers);
        } catch {
          throw new Error("Invalid form configuration");
        }
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleValueChange = (label: string, val: any) => {
    setAnswers({ ...answers, [label]: val });
  };

  const isStepValid = (stepIdx: number) => {
    const stepFields = steps[stepIdx].fields;
    for (const fId of stepFields) {
      const field = fields.find(f => f.id === fId);
      if (field?.required) {
        const val = answers[field.label];
        if (val === undefined || val === null || val === "") {
          return false;
        }
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (isStepValid(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
      window.scrollTo(0, 0);
    } else {
      toast.error("Please fill in all required fields on this step.");
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  };

  const toast = {
    error: (msg: string) => alert(msg)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    // Validate current step
    const isComprehensive = slug === "website-comprehensive" || slug === "website-requirements-short" || slug === "book-formatting-requirements";
    if (isComprehensive && !isStepValid(currentStep)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitLoading(true);
    
    // Find client name & email answers (usually label is "Your Name" & "Your Email" or matching IDs)
    const nameField = fields.find(f => f.id === "field_name")?.label || "Your Name";
    const emailField = fields.find(f => f.id === "field_email")?.label || "Your Email";

    const clientName = answers[nameField] || "Anonymous Client";
    const clientEmail = answers[emailField] || "no-email@example.com";

    const payload = {
      form_id: form.id,
      client_name: clientName,
      client_email: clientEmail,
      answers_json: JSON.stringify(answers)
    };

    try {
      const res = await fetch("/api/requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const d = await res.json();
        setError(d.error || "Failed to submit answers");
      }
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderField = (field: FormField) => {
    return (
      <div key={field.id} className="w-full">
        {field.type === "text" && (
          <div className="relative mt-6">
            <input 
              required={field.required}
              value={answers[field.label] || ""}
              onChange={e => handleValueChange(field.label, e.target.value)}
              className="peer w-full px-4 py-4 rounded-xl bg-background/40 border border-border/80 focus:border-primary focus:bg-background/60 outline-none transition-all focus:ring-4 focus:ring-primary/10 shadow-sm text-sm placeholder-transparent"
              placeholder={`Enter ${field.label.toLowerCase()}`}
              id={field.id}
            />
            <label 
              htmlFor={field.id}
              className="absolute left-4 top-4 text-sm font-semibold text-muted-foreground/85 transition-all duration-200 pointer-events-none origin-[0_0] px-1.5 floating-label-bg rounded
              peer-placeholder-shown:top-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:bg-transparent
              peer-focus:-top-2.5 peer-focus:scale-80 peer-focus:text-primary
              peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:scale-80"
            >
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
          </div>
        )}

        {field.type === "textarea" && (
          <div className="relative mt-6">
            <textarea 
              required={field.required}
              value={answers[field.label] || ""}
              onChange={e => handleValueChange(field.label, e.target.value)}
              className="peer w-full px-4 py-4 rounded-xl bg-background/40 border border-border/80 focus:border-primary focus:bg-background/60 outline-none transition-all focus:ring-4 focus:ring-primary/10 shadow-sm min-h-[120px] text-sm resize-y placeholder-transparent"
              placeholder="Type your response here..."
              id={field.id}
            />
            <label 
              htmlFor={field.id}
              className="absolute left-4 top-4 text-sm font-semibold text-muted-foreground/85 transition-all duration-200 pointer-events-none origin-[0_0] px-1.5 floating-label-bg rounded
              peer-placeholder-shown:top-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:bg-transparent
              peer-focus:-top-2.5 peer-focus:scale-80 peer-focus:text-primary
              peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:scale-80"
            >
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
          </div>
        )}

        {field.type === "select" && (
          <div className="space-y-2 mt-4">
            <label className="text-xs font-bold text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
              {field.options?.map(opt => {
                const isSelected = answers[field.label] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleValueChange(field.label, opt)}
                    className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                      isSelected 
                        ? "border-primary bg-primary/5 shadow-md ring-4 ring-primary/5" 
                        : "border-border/60 bg-background/20 hover:bg-background/40 hover:border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground leading-snug">{opt}</span>
                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "border-primary text-primary bg-primary/10" : "border-border/80 bg-transparent"
                      }`}>
                        {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {field.type === "checkbox" && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => handleValueChange(field.label, !answers[field.label])}
              className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-300 w-full ${
                answers[field.label] 
                  ? "border-primary bg-primary/5 shadow-md ring-4 ring-primary/5 scale-[1.005]" 
                  : "border-border/60 bg-background/20 hover:bg-background/40 hover:border-border"
              }`}
            >
              <span className="text-sm font-semibold text-foreground leading-snug pr-4">{field.label}</span>
              <div className={`h-5 w-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                answers[field.label] ? "bg-primary border-primary text-white shadow-sm" : "border-border/80 bg-transparent"
              }`}>
                {answers[field.label] && (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          </div>
        )}
      </div>
    );
  };

  const isComprehensive = slug === "website-comprehensive" || slug === "website-requirements-short" || slug === "book-formatting-requirements";

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading requirements form…</p>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-md text-center">
          <div className="h-16 w-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Form Error</h2>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            {error || "We couldn't load the requirements form page. Please double check your link."}
          </p>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4 hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col relative overflow-hidden">
      <div className="absolute top-1/4 -left-64 h-[500px] w-[500px] rounded-full bg-gradient-brand opacity-20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-[var(--brand-teal)] opacity-10 blur-3xl" />

      <div className="container mx-auto px-6 max-w-3xl relative z-10 flex-1 flex flex-col justify-center">
        <Link to="/" className="mb-8 self-start transition-opacity hover:opacity-85">
          <img src={logo} alt="Advaita Designs" className="h-12 w-auto dark:hidden" />
          <img src={logoDark} alt="Advaita Designs" className="hidden h-12 w-auto dark:block" />
        </Link>

        <div className="glass-strong rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl border border-white/10 dark:border-white/5">
          <div className="p-8 sm:p-12 border-b border-border bg-muted/20">
            <div className="flex items-center gap-3 mb-4 text-xs font-bold text-primary tracking-widest uppercase">
              <FileSignature className="h-4 w-4" /> Requirements Collection
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">{form.title}</h1>
            
            {isComprehensive ? (
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}</span>
                  <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden border border-border/20">
                  <div 
                    className="h-full bg-gradient-brand rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            ) : form.description ? (
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{form.description}</p>
            ) : null}
          </div>

          <div className="p-8 sm:p-12 bg-background/30 backdrop-blur-sm">
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.form 
                  key={isComprehensive ? `step-${currentStep}` : "single-form"}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  {isComprehensive ? (
                    <div className="space-y-6">
                      {steps[currentStep].fields.map(fId => {
                        const field = fields.find(f => f.id === fId);
                        return field ? renderField(field) : null;
                      })}
                      
                      <div className="flex justify-between items-center gap-4 pt-6 border-t border-border mt-8">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          disabled={currentStep === 0}
                          className="px-6 py-3.5 rounded-xl border border-border hover:bg-muted text-sm font-semibold transition-colors disabled:opacity-40 flex items-center gap-2"
                        >
                          <ChevronLeft className="h-4 w-4" /> Back
                        </button>
                        
                        {currentStep < steps.length - 1 ? (
                          <button
                            type="button"
                            onClick={handleNextStep}
                            className="px-6 py-3.5 rounded-xl bg-foreground text-background font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                          >
                            Next <ChevronRight className="h-4 w-4" />
                          </button>
                        ) : (
                          <button 
                            type="submit" 
                            disabled={submitLoading}
                            className="px-8 py-3.5 rounded-xl bg-gradient-brand text-white font-semibold hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                          >
                            {submitLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                              <>
                                Submit Requirements Brief
                                <Send className="h-4 w-4 ml-1" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      {fields.map(renderField)}
                      <button 
                        type="submit" 
                        disabled={submitLoading}
                        className="w-full py-4 rounded-xl bg-gradient-brand text-white font-semibold hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none mt-8"
                      >
                        {submitLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                          <>
                            Submit Requirements Brief
                            <Send className="h-4 w-4 ml-1" />
                          </>
                        )}
                      </button>
                    </>
                  )}
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="text-center py-12 flex flex-col items-center justify-center"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="h-24 w-24 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/20"
                  >
                    <CheckCircle2 className="h-12 w-12" />
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-4">Requirements Submitted!</h2>
                  <p className="text-muted-foreground text-lg max-w-sm mx-auto leading-relaxed">
                    Thank you. Your requirements brief has been successfully sent. I will review details and get in touch with you shortly.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
