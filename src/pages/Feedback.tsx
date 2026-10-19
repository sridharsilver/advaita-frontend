import { useState, useEffect } from "react";
import { Upload, CheckCircle2, Loader2, ArrowLeft, Star, Quote, User, Briefcase, MessageSquare, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";

export function Feedback() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    quote: "",
    name: "",
    role: "",
    image_url: "",
  });
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings")
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch");
      })
      .then(data => setSettings(data))
      .catch(err => console.error("Error fetching settings:", err));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be smaller than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400; // Smaller max width for avatars
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setFormData({ ...formData, image_url: compressedBase64 });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col relative overflow-hidden">
      <div className="absolute top-1/4 -left-64 h-[500px] w-[500px] rounded-full bg-gradient-brand opacity-20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-[var(--brand-teal)] opacity-10 blur-3xl" />
      
      <div className="container mx-auto px-6 max-w-5xl relative z-10 flex-1 flex flex-col justify-center">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 self-start bg-background/50 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-sm">
          <ArrowLeft className="h-4 w-4" />
          Back to site
        </Link>

        <div className="glass-strong rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/10 dark:border-white/5">
          {/* Left Column - Branding Message */}
          <div className="md:w-5/12 bg-foreground text-background p-10 md:p-14 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-brand opacity-20 mix-blend-overlay" />
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[var(--brand-teal)]/30 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-1.5 mb-10">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400 drop-shadow-sm" />
                ))}
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">Your voice helps me grow.</h2>
              
              <p className="text-background/80 text-lg mb-8 leading-relaxed font-light">
                Thank you for choosing Advaita Designs. I strive for excellence in every project, and your honest feedback is the most valuable tool I have to achieve that.
              </p>
              
              <div className="mt-auto pt-12">
                <Quote className="h-10 w-10 text-background/20 mb-4" />
                <p className="text-sm text-background/70 font-medium leading-relaxed">
                  "Design is not just what it looks like and feels like. Design is how it works."
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="md:w-7/12 p-8 md:p-14 relative bg-background/40 backdrop-blur-sm">
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div className="mb-10">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">Leave a Review</h1>
                    <p className="text-muted-foreground">Share your experience working with me.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center gap-6 mb-8 bg-background/50 p-4 rounded-2xl border border-border shadow-sm">
                      <label className="relative group cursor-pointer shrink-0">
                        <div className="h-20 w-20 rounded-full overflow-hidden bg-muted border-2 border-dashed border-border flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:bg-primary/5 shadow-inner">
                          {formData.image_url ? (
                            <img src={formData.image_url} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors group-hover:scale-110 duration-300" />
                          )}
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Profile Photo</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                          Upload a picture of yourself to personalize your testimonial. (Max 2MB)
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                          <User className="h-3.5 w-3.5" /> Your Name
                        </label>
                        <input 
                          required
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-3.5 rounded-xl bg-background/50 border border-border focus:border-primary outline-none transition-all focus:ring-4 focus:ring-primary/10 shadow-sm" 
                          placeholder="e.g. Jane Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                          <Briefcase className="h-3.5 w-3.5" /> Role / Company
                        </label>
                        <input 
                          required
                          value={formData.role}
                          onChange={e => setFormData({...formData, role: e.target.value})}
                          className="w-full px-4 py-3.5 rounded-xl bg-background/50 border border-border focus:border-primary outline-none transition-all focus:ring-4 focus:ring-primary/10 shadow-sm" 
                          placeholder="e.g. CEO at Acme Corp"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <MessageSquare className="h-3.5 w-3.5" /> Your Experience
                      </label>
                      <textarea 
                        required
                        value={formData.quote}
                        onChange={e => setFormData({...formData, quote: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl bg-background/50 border border-border focus:border-primary outline-none transition-all focus:ring-4 focus:ring-primary/10 shadow-sm min-h-[160px] resize-y" 
                        placeholder="Tell us what you thought about the project..."
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full py-4 rounded-xl bg-gradient-brand text-white font-semibold hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                        <>
                          Submit Review
                          <Send className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="text-center py-20 flex flex-col items-center justify-center h-full"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="h-24 w-24 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/20"
                  >
                    <CheckCircle2 className="h-12 w-12" />
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
                  <p className="text-muted-foreground text-lg max-w-sm mx-auto leading-relaxed mb-6">
                    Your review has been submitted successfully. I truly appreciate your feedback and support.
                  </p>

                  <div className="bg-muted/40 border border-border/60 rounded-2xl p-6 max-w-md mx-auto mb-8 text-center shadow-sm">
                    <p className="text-sm font-semibold mb-3">Could you also share your review on Google?</p>
                    <p className="text-xs text-muted-foreground mb-4">It takes less than a minute and helps others find my services.</p>
                    <a 
                      href={settings.google_review_link || "https://maps.app.goo.gl/q8YxR3xzhQY9hLZX6"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background text-sm font-bold hover:opacity-90 transition-all duration-300 shadow-md"
                    >
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      Review on Google
                    </a>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setSuccess(false);
                      setFormData({ quote: "", name: "", role: "", image_url: "" });
                    }}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                  >
                    Submit another review
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
