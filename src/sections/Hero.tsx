import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { FloatingShapes } from "@/components/FloatingShapes";
import heroBg from "@/assets/hero-bg.webp";

export function Hero({ showPortfolio = true }: { showPortfolio?: boolean }) {
  return (
    <section 
      id="top" 
      className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      <FloatingShapes />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-foreground/90 font-medium mb-8">
            <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand-orange)]" />
            Independent Design Practice · Est. 2008
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight">
            Crafting digital <br />
            experiences that{" "}
            <span className="text-gradient">tell your story</span>.
          </h1>

          <p className="mt-8 max-w-2xl text-lg md:text-xl text-foreground/80 leading-relaxed">
            I'm Sridhar Silver — a freelance designer crafting web, branding, UI/UX,
            and print solutions for purpose-driven brands and founders.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-4 text-sm font-medium text-primary-foreground glow-orange hover:scale-[1.02] transition-transform"
            >
              Start your project
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            {showPortfolio && (
              <a
                href="#portfolio"
                className="inline-flex items-center gap-2 rounded-full glass px-7 py-4 text-sm font-medium text-foreground hover:bg-[var(--glass-hover)] transition"
              >
                View portfolio
              </a>
            )}
          </div>
        </motion.div>


      </div>
    </section>
  );
}
