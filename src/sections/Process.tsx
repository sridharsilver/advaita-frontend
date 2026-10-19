import { motion } from "motion/react";
import { Search, PenTool, Code2, Rocket } from "lucide-react";

const steps = [
  { icon: Search, title: "Discover", desc: "Research, strategy, and brand audit to align on goals." },
  { icon: PenTool, title: "Design", desc: "Concepts, systems and prototypes crafted with intent." },
  { icon: Code2, title: "Develop", desc: "Production-grade builds, accessible and performant." },
  { icon: Rocket, title: "Deliver", desc: "Launch, measure, iterate — and grow together." },
];

export function Process() {
  return (
    <section id="process" className="py-16 relative border-b border-[var(--divider)]/50 scroll-mt-24">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-sm text-[color:var(--brand-orange)] uppercase tracking-widest mb-4">
            How I work
          </p>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Four steps, one <span className="text-gradient">obsession</span>.
          </h2>
        </div>

        <div className="relative grid md:grid-cols-4 gap-6">
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative glass rounded-3xl p-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center mb-6 relative z-10">
                <s.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="text-xs text-muted-foreground mb-1">Step 0{i + 1}</div>
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
