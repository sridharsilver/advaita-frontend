import { motion } from "motion/react";
import { Star, ExternalLink } from "lucide-react";

const reviews = [
  {
    text: "Exceptional work and incredibly fast turnaround. Maintained a high level of professionalism throughout the entire 450-page anthology project with multiple editors and stakeholders.",
    name: "jayoatway",
    location: "Hong Kong",
    rating: 5,
  },
  {
    text: "Very easy to work with, made the necessary adjustments and delivered quickly. Highly recommend.",
    name: "liftlikeamother",
    location: "United States",
    rating: 5,
  },
  {
    text: "Perfect work. Professional, on time.",
    name: "welcomevictoria",
    location: "Belgium",
    rating: 4.7,
  },
];

export function FiverrReviews() {
  return (
    <section id="fiverr-reviews" className="py-16 relative border-b border-[var(--divider)]/50 scroll-mt-24">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-sm text-[var(--brand-orange)] uppercase tracking-widest mb-4">
            Fiverr Reviews
          </p>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Trusted by <span className="text-gradient">424+ clients</span> from around the globe.
          </h2>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < 4
                      ? "text-yellow-500 fill-yellow-500"
                      : i === 4
                        ? "text-yellow-500 fill-yellow-500/70"
                        : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-2xl font-bold">4.7</span>
            <span className="text-muted-foreground">· 424 reviews</span>
            <a
              href="https://www.fiverr.com/sridharsilver"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand-teal)] hover:underline"
            >
              View on Fiverr <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6 max-w-md">
            {[
              { label: "5 Star", count: 392, pct: 92 },
              { label: "4 Star", count: 12, pct: 3 },
              { label: "3 Star", count: 7, pct: 2 },
            ].map((s) => (
              <div
                key={s.label}
                className="glass rounded-xl p-3 text-center"
              >
                <div className="text-lg font-bold">{s.count}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-strong rounded-2xl p-6 border border-border/50 flex flex-col"
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`h-4 w-4 ${
                      j < Math.floor(r.rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed mb-4 flex-1">
                "{r.text}"
              </p>
              <div className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground/80">
                  {r.name}
                </span>
                <span> · {r.location}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
