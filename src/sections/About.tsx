import { useState, useEffect } from "react";
import { motion } from "motion/react";
import profileImg from "@/assets/sridhar-silver.webp";

export function About() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings")
      .then(r => { if (r.ok) return r.json().then(setSettings); })
      .catch(() => {});
  }, []);

  const brands = settings.stat_brands_served || "75+";
  const countries = settings.stat_countries_served || "12";
  const projects = settings.stat_projects_delivered || "100+";

  const timeline = [
    { year: "2008", text: "Started Advaita as a freelance design practice." },
    { year: "2014", text: "Expanded into digital products & UX." },
    { year: "2019", text: `${brands} brands served across ${countries} countries.` },
    { year: "2025", text: `${projects} projects delivered. Still curious, still crafting.` },
  ];
  return (
    <section id="about" className="py-16 relative border-b border-[var(--divider)]/50 scroll-mt-24">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative flex flex-col items-center justify-center gap-4"
        >
          <div className="absolute w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] bg-gradient-brand blur-3xl opacity-30 rounded-full" />
          <div className="relative w-72 h-72 lg:w-96 lg:h-96 rounded-full p-1.5 bg-gradient-to-br from-[var(--brand-orange)] via-[var(--brand-teal)] to-[var(--brand-purple)] shadow-2xl shadow-[var(--brand-orange)]/20">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-background">
              <img src={profileImg} alt="Sridhar Silver" className="w-full h-full object-cover" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-semibold tracking-wide mt-2 relative z-10 bg-background/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-border/40 shadow-sm">
            {settings.about_image_caption || `${settings.legal_name || "Sridhar Silver"} — Founder & Creative Director`}
          </p>
        </motion.div>

        <div>
          <p className="text-sm text-[color:var(--brand-teal)] uppercase tracking-widest mb-4">
            About
          </p>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Design-driven work where{" "}
            <span className="text-gradient">strategy meets craft</span>.
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-10">
            I believe great design lives at the intersection of clarity, emotion
            and performance. I partner directly with founders and marketing
            leaders to build brands and digital products that grow.
          </p>

          <div className="space-y-5">
            {timeline.map((t, i) => (
              <motion.div
                key={t.year}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="text-xl font-bold text-gradient w-20 shrink-0">
                  {t.year}
                </div>
                <p className="text-foreground/90 pt-0.5">{t.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
