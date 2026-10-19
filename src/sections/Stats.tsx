import { useEffect, useState } from "react";
import { motion } from "motion/react";

const statKeys = [
  { key: "stat_years_experience", label: "Years of Experience", fallback: "17+" },
  { key: "stat_projects_delivered", label: "Projects Delivered", fallback: "100+" },
  { key: "stat_happy_clients", label: "Happy Clients", fallback: "424+" },
  { key: "stat_creative_support", label: "Creative Support", fallback: "24/7" },
];

export function Stats() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {});
  }, []);

  return (
    <section className="py-12 relative border-b border-[var(--divider)]/50">
      <div className="container mx-auto px-6">
        <div className="glass-strong rounded-3xl p-10 md:p-14 grid grid-cols-2 md:grid-cols-4 gap-8">
          {statKeys.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl md:text-6xl font-bold text-gradient">
                {settings[item.key] || item.fallback}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
