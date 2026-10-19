import { motion } from "motion/react";
import {
  Globe, Code2, Layout, Sparkles, Palette, Printer,
  Share2, Package, BookOpen,
} from "lucide-react";

const services = [
  { icon: Globe, title: "Web Design", desc: "Bespoke websites that feel as good as they look." },
  { icon: Code2, title: "Web Development", desc: "Performant, scalable front-end & full-stack builds." },
  { icon: Layout, title: "UI / UX Design", desc: "Product flows that turn visitors into customers." },
  { icon: Sparkles, title: "Branding & Identity", desc: "Memorable identity systems with lasting equity." },
  { icon: Palette, title: "Graphic Design", desc: "Crafted visuals across every brand touchpoint." },
  { icon: Printer, title: "Print Design", desc: "Premium print collateral, brochures and reports." },
  { icon: Share2, title: "Social Creatives", desc: "Scroll-stopping content for every platform." },
  { icon: Package, title: "Packaging Design", desc: "Shelf-ready packaging that sells the story." },
  { icon: BookOpen, title: "Ebooks & Publishing", desc: "Editorial design for digital and print." },
];

export function Services() {
  return (
    <section id="services" className="py-16 relative border-b border-[var(--divider)]/50 scroll-mt-24">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-sm text-[color:var(--brand-orange)] uppercase tracking-widest mb-4">
            What I do
          </p>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            A full-stack creative <span className="text-gradient">practice</span>.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative glass rounded-3xl p-8 hover:bg-[var(--glass-hover)] transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-brand blur-2xl -z-10" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <s.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/90 transition-colors">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
