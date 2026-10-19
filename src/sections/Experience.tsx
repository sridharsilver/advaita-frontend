import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Briefcase, MapPin, Calendar } from "lucide-react";

const roleTemplates = [
  {
    title: "Founder & Creative Director",
    company: "Advaita Designs",
    location: "Remote",
    period: "2008 – Present",
    descKey: "founder",
  },
  {
    title: "Senior UI/UX Designer",
    company: "Independent Consulting",
    location: "Remote",
    period: "2020 – Present",
    desc: "UX strategy, product design, and front-end consulting for early-stage startups and enterprise teams.",
  },
  {
    title: "Lead Branding & UI/UX Designer → Branding & UI/UX Designer",
    company: "Brane Enterprises Pvt Ltd",
    url: "https://www.braneenterprises.com/",
    location: "Hyderabad, India",
    period: "2020 – 2025",
    desc: "Led branding and UI/UX for enterprise products. Promoted from Branding & UI/UX Designer (Mar 2020 – Apr 2022) to Lead (Apr 2022 – Feb 2025). Skills: Mobile Applications, Journey Mapping, and 11+ more.",
  },
];

export function Experience() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings")
      .then(r => { if (r.ok) return r.json().then(setSettings); })
      .catch(() => {});
  }, []);

  const clients = settings.stat_clients_served || "100+";
  const countries = settings.stat_countries_served || "12";

  const roles = roleTemplates.map(r =>
    r.descKey === "founder"
      ? { ...r, desc: `Leading brand identity, web design, UI/UX, and print projects for ${clients} clients across ${countries} countries.` }
      : r
  );
  return (
    <section id="experience" className="py-16 relative border-b border-[var(--divider)]/50 scroll-mt-24">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-sm text-[var(--brand-teal)] uppercase tracking-widest mb-4">
            Experience
          </p>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Years of <span className="text-gradient">craft</span>.
          </h2>
        </div>

        <div className="relative space-y-0">
          <div className="absolute left-[14px] sm:left-[18px] top-6 bottom-6 w-px bg-gradient-to-b from-white/20 to-transparent" />
          {roles.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 sm:gap-8 pb-10 sm:pb-14 last:pb-0"
            >
              <div className="shrink-0 relative">
                <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-gradient-brand flex items-center justify-center shadow-lg z-10 relative">
                  <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
                </div>
              </div>
              <div className="glass-strong rounded-xl sm:rounded-2xl p-4 sm:p-6 flex-1 border border-border/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <h3 className="text-base sm:text-xl font-bold leading-snug">{r.title}</h3>
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {r.period}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-[var(--brand-teal)] font-medium mb-2 sm:mb-3">
                  {'url' in r && r.url ? (
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{r.company}</a>
                  ) : (
                    <span>{r.company}</span>
                  )}
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {r.location}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  {r.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
