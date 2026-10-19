/**
 * Base API URL configuration.
 * In development, defaults to "" so Vite's proxy forwards to the local backend.
 * In production, set VITE_API_URL in Cloudflare Pages environment variables
 * (e.g., https://admin.advaitadesigns.com).
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? "https://advaita-admin.pages.dev" : "")
).replace(/\/$/, "");

/**
 * Helper to construct full API endpoints
 */
export function apiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
}

/**
 * Pre-configured fetch wrapper with credentials support
 */
export async function apiFetch(endpoint: string, init?: RequestInit): Promise<Response> {
  return fetch(apiUrl(endpoint), {
    ...init,
    credentials: init?.credentials || "include",
  });
}
