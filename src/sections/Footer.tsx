import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import logo from "@/assets/advaita-logo.webp";
import logoDark from "@/assets/logo-dark.webp";

export function Footer() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsAdmin(document.cookie.includes("admin_token="));
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {});
  }, []);

  return (
    <footer className="border-t border-[var(--divider)] pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-16">
          <div className="md:col-span-2">
            <img src={logo} alt="Advaita Designs" className="h-16 w-auto mb-5 dark:hidden" />
            <img src={logoDark} alt="Advaita Designs" className="hidden h-16 w-auto mb-5 dark:block" />
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              A freelance design practice building brands and digital products that grow.
            </p>
            {settings.show_virtual_address !== "false" && settings.virtual_address && (
              <div className="flex items-start gap-2 mt-4 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="whitespace-pre-line leading-relaxed">{settings.virtual_address}</span>
              </div>
            )}
          </div>
          <div>
            <div className="text-sm font-semibold mb-4">Explore</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#about" className="hover:text-foreground">About</a></li>
              <li><a href="#experience" className="hover:text-foreground">Experience</a></li>
              <li><a href="#process" className="hover:text-foreground">Process</a></li>
              <li><a href="#portfolio" className="hover:text-foreground">Work</a></li>
              <li><a href="#contact" className="hover:text-foreground">Contact</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold mb-4">Services</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Branding & Identity</li>
              <li>Web & UI/UX</li>
              <li>Print & Packaging</li>
              <li>Social Creatives</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-[var(--divider)] text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Advaita Designs. All rights reserved.</div>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-slate-800 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-800 dark:hover:text-white transition-colors">Terms of Service</Link>
            {isAdmin && (
              <a href="/admin" target="_blank" rel="noopener noreferrer" className="hover:text-slate-800 dark:hover:text-white transition-colors font-semibold border-l border-[var(--divider)] pl-4">
                Admin Panel
              </a>
            )}
          </div>
          <div>Crafted with care · Made for purpose-driven brands</div>
        </div>
      </div>
    </footer>
  );
}
