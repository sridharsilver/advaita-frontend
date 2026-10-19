import { useState, useEffect } from "react";
import { Mail, Phone, MessageCircle, Instagram, Facebook, Linkedin, Twitter, Send, MapPin } from "lucide-react";
import { toast } from "sonner";

export function Contact() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Thanks! I'll be in touch within 24 hours.");
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 relative scroll-mt-24">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12">
        <div>
          <p className="text-sm text-[color:var(--brand-orange)] uppercase tracking-widest mb-4">
            Let's talk
          </p>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Start something <span className="text-gradient">meaningful</span>.
          </h2>
          <p className="text-muted-foreground mb-10 max-w-md leading-relaxed">
            Tell me about your project. I'll get back within 24 hours with next steps and a tailored proposal.
          </p>

          <div className="space-y-4">
            <a href={`mailto:${settings.email || "hello@advaita.design"}`} className="flex items-center gap-4 glass rounded-2xl p-4 hover:bg-[var(--glass-hover)] transition">
              <div className="h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center">
                <Mail className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Email</div>
                <div className="font-medium">{settings.email || "hello@advaita.design"}</div>
              </div>
            </a>
            {settings.show_phone !== "false" && (
              <a href={`tel:${settings.phone || "+910000000000"}`} className="flex items-center gap-4 glass rounded-2xl p-4 hover:bg-[var(--glass-hover)] transition">
                <div className="h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center">
                  <Phone className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Phone</div>
                  <div className="font-medium">{settings.phone || "+91 00000 00000"}</div>
                </div>
              </a>
            )}
            {settings.show_whatsapp !== "false" && (
              <a href={`https://wa.me/${settings.whatsapp || "910000000000"}`} className="flex items-center gap-4 glass rounded-2xl p-4 hover:bg-[var(--glass-hover)] transition">
                <div className="h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">WhatsApp</div>
                  <div className="font-medium">Chat with me</div>
                </div>
              </a>
            )}
            {settings.show_virtual_address !== "false" && settings.virtual_address && (
              <div className="flex items-center gap-4 glass rounded-2xl p-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Address</div>
                  <div className="font-medium whitespace-pre-line text-sm">{settings.virtual_address}</div>
                </div>
              </div>
            )}
          </div>

          {settings.show_social_links !== "false" && (settings.instagram_url || settings.facebook_url || settings.linkedin_url || settings.twitter_url) && (
            <div className="flex gap-3 mt-8">
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="h-11 w-11 rounded-full glass flex items-center justify-center hover:bg-[var(--glass-hover)] transition">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="h-11 w-11 rounded-full glass flex items-center justify-center hover:bg-[var(--glass-hover)] transition">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {settings.linkedin_url && (
                <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="h-11 w-11 rounded-full glass flex items-center justify-center hover:bg-[var(--glass-hover)] transition">
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {settings.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="h-11 w-11 rounded-full glass flex items-center justify-center hover:bg-[var(--glass-hover)] transition">
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              <a href="https://www.fiverr.com/sridharsilver" target="_blank" rel="noopener noreferrer" className="h-11 w-11 rounded-full glass flex items-center justify-center hover:bg-[var(--glass-hover)] transition group" title="Fiverr">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current group-hover:text-[#1DBF73] transition-colors">
                  <path d="M7.05 2.87v5.7H3.6v2.86h3.45v6.06c0 2.56 1.47 3.77 3.8 3.77.76 0 1.54-.1 2.3-.31v-2.77a4.67 4.67 0 0 1-1.1.13c-1.07 0-1.67-.5-1.67-1.67v-5.2h3.99V8.57H10.38V2.87H7.05Z"/>
                </svg>
              </a>
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="glass-strong rounded-3xl p-8 md:p-10 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" name="name" />
            <Field label="Company" name="company" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Email" name="email" type="email" />
            <Field label="Phone No." name="phone" type="tel" />
          </div>
          <Field label="Budget" name="budget" placeholder="e.g. $5k – $20k" />
          <div>
            <label className="text-xs text-muted-foreground">Project details</label>
            <textarea
              required
              name="message"
              rows={5}
              className="mt-2 w-full rounded-xl field px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-orange)]/50 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-7 py-4 text-sm font-medium text-primary-foreground glow-orange hover:scale-[1.01] transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send message"}
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  label, name, type = "text", placeholder,
}: { label: string; name: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input
        required
        name={name}
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl field px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-orange)]/50"
      />
    </div>
  );
}
