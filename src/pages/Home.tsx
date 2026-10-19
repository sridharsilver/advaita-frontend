import { useState, useEffect } from "react";
import { Hero } from "@/sections/Hero";
import { Stats } from "@/sections/Stats";
import { Services } from "@/sections/Services";
import { Portfolio } from "@/sections/Portfolio";
import { Experience } from "@/sections/Experience";
import { FiverrReviews } from "@/sections/FiverrReviews";
import { About } from "@/sections/About";
import { Process } from "@/sections/Process";
import { Testimonials } from "@/sections/Testimonials";
import { Marquee } from "@/sections/Marquee";
import { Contact } from "@/sections/Contact";

export function Home() {
  const [settings, setSettings] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => {
        if (!res.ok) throw new Error("Settings fetch failed");
        return res.json();
      })
      .then((data) => setSettings(data))
      .catch(() => {
        // Fallback to empty object so all sections show by default
        setSettings({});
      });
  }, []);

  // Show sections by default unless explicitly disabled in settings
  const shouldShow = (key: string) => {
    if (!settings) return true;
    return settings[key] !== "false";
  };

  return (
    <>
      <Hero showPortfolio={shouldShow("show_portfolio")} />
      <About />
      {shouldShow("show_stats") && <Stats />}
      {shouldShow("show_services") && <Services />}
      {shouldShow("show_portfolio") && <Portfolio />}
      {shouldShow("show_fiverr_reviews") && <FiverrReviews />}
      {shouldShow("show_experience") && <Experience />}
      {shouldShow("show_process") && <Process />}
      {shouldShow("show_testimonials") && <Testimonials />}
      {shouldShow("show_marquee") && <Marquee />}
      {shouldShow("show_contact") && <Contact />}
    </>
  );
}
