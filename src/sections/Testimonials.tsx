import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id?: number;
  quote: string;
  name: string;
  role: string;
  image_url?: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    quote: "Advaita reimagined our brand from the ground up. Conversion lifted 38% in the first quarter after launch.",
    name: "Priya Menon",
    role: "CMO, Nimbus Fintech",
    image_url: "https://api.dicebear.com/7.x/notionists/svg?seed=Priya&backgroundColor=ffdfbf"
  },
  {
    id: 2,
    quote: "Their design team thinks like product strategists. Every pixel earns its place.",
    name: "Marc Lefevre",
    role: "Founder, Aurora Skincare",
    image_url: "https://api.dicebear.com/7.x/notionists/svg?seed=Marc&backgroundColor=b6e3f4"
  },
  {
    id: 3,
    quote: "From identity to packaging to web, they shipped a cohesive experience that finally feels like us.",
    name: "Anika Sharma",
    role: "Head of Brand, Verdant",
    image_url: "https://api.dicebear.com/7.x/notionists/svg?seed=Anika&backgroundColor=c0aede"
  }
];

export function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [i, setI] = useState(0);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.data || []);
        if (list.length > 0) {
          setItems(list);
        }
      })
      .catch((e) => console.error("Failed to fetch testimonials"));
  }, []);

  const displayItems = items.length > 0 ? items : DEFAULT_TESTIMONIALS;
  const next = () => setI((p) => (p + 1) % displayItems.length);
  const prev = () => setI((p) => (p - 1 + displayItems.length) % displayItems.length);
  const t = displayItems[i] || displayItems[0];

  return (
    <section id="testimonials" className="py-16 relative border-b border-[var(--divider)]/50 scroll-mt-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="glass-strong rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-brand opacity-30 blur-3xl" />
          <Quote className="h-10 w-10 text-[color:var(--brand-orange)] mb-8 relative" />
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <p className="text-2xl md:text-3xl font-medium leading-snug mb-8">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                {t.image_url ? (
                  <img src={t.image_url} alt={t.name} className="h-12 w-12 rounded-full object-cover border-2 border-background shadow-sm" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold border-2 border-background shadow-sm">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div className="text-sm">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-3 mt-10 relative">
            <button onClick={prev} className="h-10 w-10 rounded-full glass flex items-center justify-center hover:bg-[var(--glass-hover)]">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={next} className="h-10 w-10 rounded-full glass flex items-center justify-center hover:bg-[var(--glass-hover)]">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
