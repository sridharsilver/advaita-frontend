import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";

// Intercept relative /api/ calls and route them to VITE_API_URL if configured
const API_BASE = (
  import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? "https://advaita-admin.pages.dev" : "")
).replace(/\/$/, "");
if (API_BASE) {
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    let target = input;
    if (typeof input === "string" && input.startsWith("/api/")) {
      target = `${API_BASE}${input}`;
    }
    return originalFetch(target, {
      ...init,
      credentials: init?.credentials || "include",
    });
  };
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
