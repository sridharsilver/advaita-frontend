const logos = [
  "Aurora", "Nimbus", "Verdant", "Lumen", "Atlas",
  "Pulse", "Northwind", "Bloom", "Helix", "Orbit",
];

export function Marquee() {
  const row = [...logos, ...logos];
  return (
    <section className="py-10 overflow-hidden border-y border-[var(--divider)]">
      <div className="container mx-auto px-6 mb-8 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Trusted by brands worldwide
        </p>
      </div>
      <div className="relative">
        <div className="flex gap-16 animate-marquee whitespace-nowrap w-max">
          {row.map((l, i) => (
            <span
              key={i}
              className="text-3xl md:text-4xl font-display font-semibold text-muted-foreground/60 hover:text-foreground transition"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
