import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Chatbot } from "@/components/Chatbot";
import { Footer } from "@/sections/Footer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { motion, AnimatePresence } from "motion/react";

export function RootLayout() {
  const location = useLocation();

  return (
    <ThemeProvider>
      <div className="relative">
        {/* Google Translate widget container (visually hidden) */}
        <div id="google_translate_element" className="notranslate" translate="no" />
        <style>{`
          #google_translate_element {
            position: absolute !important;
            width: 1px !important;
            height: 1px !important;
            padding: 0 !important;
            margin: -1px !important;
            overflow: hidden !important;
            clip: rect(0,0,0,0) !important;
            border: 0 !important;
          }
          .goog-te-gadget img, .goog-te-banner-frame, .goog-te-balloon-frame,
          iframe.goog-te-menu-frame, iframe.skiptranslate { display: none !important; }
          body { top: 0px !important; position: static !important; }
          .goog-tooltip, .goog-tooltip:hover { display: none !important; }
          .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
          .goog-te-gadget { font-size: 0px !important; }
          .goog-te-gadget .goog-te-combo {
            position: absolute !important; width: 1px !important; height: 1px !important;
            padding: 0 !important; margin: -1px !important; overflow: hidden !important;
            clip: rect(0,0,0,0) !important; border: 0 !important;
          }
          .skiptranslate { display: none !important; }
          .lang-te h1, .lang-te h2, .lang-te h3, .lang-te h4, .lang-te h5, .lang-te h6 {
            font-family: "Ramabhadra", sans-serif !important; font-weight: 400 !important;
          }
          .lang-te { font-family: "NTR", sans-serif !important; }
          .lang-te p, .lang-te li, .lang-te span, .lang-te div:not(.notranslate) {
            font-family: "NTR", sans-serif !important;
          }
        `}</style>
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
        <Footer />
        <Chatbot />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
