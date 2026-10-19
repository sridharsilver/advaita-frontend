import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { 
  Eye, Download, Share2, QrCode, Sun, Moon, Check, X, 
  Mail, Phone, Globe, Calendar, FileText, Search, ChevronDown,
  Link, MessageCircle
} from "lucide-react";
import { toast, Toaster } from "sonner";
import logo from "@/assets/advaita-logo.webp";
import logoDark from "@/assets/logo-dark.webp";

interface Section {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  content?: string;
  items?: any[];
  config?: Record<string, any>;
}

const LANGUAGES = [
  // Top / Indian languages first
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'mr', name: 'Marathi (मराठी)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
  { code: 'ur', name: 'Urdu (اردو)' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'ml', name: 'Malayalam (മലയാളം)' },
  { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },

  // Rest of the languages alphabetically
  { code: 'af', name: 'Afrikaans' },
  { code: 'sq', name: 'Albanian (Shqip)' },
  { code: 'am', name: 'Amharic (አማርኛ)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'hy', name: 'Armenian (Հայերեն)' },
  { code: 'as', name: 'Assamese (অসমীয়া)' },
  { code: 'ay', name: 'Aymara (Janqi)' },
  { code: 'az', name: 'Azerbaijani (Azərbaycan)' },
  { code: 'bm', name: 'Bambara (Bamanankan)' },
  { code: 'eu', name: 'Basque (Euskara)' },
  { code: 'be', name: 'Belarusian (Беларуская)' },
  { code: 'bho', name: 'Bhojpuri (भोजपुरी)' },
  { code: 'bs', name: 'Bosnian (Bosanski)' },
  { code: 'bg', name: 'Bulgarian (Български)' },
  { code: 'ca', name: 'Catalan (Català)' },
  { code: 'ceb', name: 'Cebuano' },
  { code: 'ny', name: 'Chichewa (Nyanja)' },
  { code: 'zh-CN', name: 'Chinese (Simplified) (简体中文)' },
  { code: 'zh-TW', name: 'Chinese (Traditional) (繁體中文)' },
  { code: 'co', name: 'Corsican (Corsu)' },
  { code: 'hr', name: 'Croatian (Hrvatski)' },
  { code: 'cs', name: 'Czech (Čeština)' },
  { code: 'da', name: 'Danish (Dansk)' },
  { code: 'dv', name: 'Dhivehi (ދިވެހިބަސް)' },
  { code: 'doi', name: 'Dogri (डोगरी)' },
  { code: 'nl', name: 'Dutch (Nederlands)' },
  { code: 'eo', name: 'Esperanto' },
  { code: 'et', name: 'Estonian (Eesti)' },
  { code: 'ee', name: 'Ewe (Eʋegbe)' },
  { code: 'fil', name: 'Filipino (Tagalog)' },
  { code: 'fi', name: 'Finnish (Suomi)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'fy', name: 'Frisian (Frysk)' },
  { code: 'gl', name: 'Galician (Galego)' },
  { code: 'ka', name: 'Georgian (ქართული)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'el', name: 'Greek (Ελληνικά)' },
  { code: 'gn', name: 'Guarani' },
  { code: 'ht', name: 'Haitian Creole (Kreyòl)' },
  { code: 'ha', name: 'Hausa' },
  { code: 'haw', name: 'Hawaiian (ʻŌlelo Hawaiʻi)' },
  { code: 'he', name: 'Hebrew (עברית)' },
  { code: 'hmn', name: 'Hmong (Lus Hmoob)' },
  { code: 'hu', name: 'Hungarian (Magyar)' },
  { code: 'is', name: 'Icelandic (Íslenska)' },
  { code: 'ig', name: 'Igbo' },
  { code: 'ilo', name: 'Ilocano (Ilokano)' },
  { code: 'id', name: 'Indonesian (Bahasa Indonesia)' },
  { code: 'ga', name: 'Irish (Gaeilge)' },
  { code: 'it', name: 'Italian (Italiano)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'jw', name: 'Javanese (Jawa)' },
  { code: 'kk', name: 'Kazakh (Қазақ)' },
  { code: 'km', name: 'Khmer (ខ្មែរ)' },
  { code: 'rw', name: 'Kinyarwanda' },
  { code: 'gom', name: 'Konkani (कोंकणी)' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'kri', name: 'Krio' },
  { code: 'ku', name: 'Kurdish (Kurmanji) (Kurdî)' },
  { code: 'ckb', name: 'Kurdish (Sorani) (کوردی)' },
  { code: 'ky', name: 'Kyrgyz (Кыргызча)' },
  { code: 'lo', name: 'Lao (ລາວ)' },
  { code: 'la', name: 'Latin (Latina)' },
  { code: 'lv', name: 'Latvian (Latviešu)' },
  { code: 'ln', name: 'Lingala' },
  { code: 'lt', name: 'Lithuanian (Lietuvių)' },
  { code: 'lg', name: 'Luganda' },
  { code: 'lb', name: 'Luxembourgish (Lëtzebuergesch)' },
  { code: 'mk', name: 'Macedonian (Македонски)' },
  { code: 'mai', name: 'Maithili (मैथिली)' },
  { code: 'mg', name: 'Malagasy' },
  { code: 'ms', name: 'Malay (Bahasa Melayu)' },
  { code: 'mt', name: 'Maltese (Malti)' },
  { code: 'mi', name: 'Maori (Māori)' },
  { code: 'mni-Mtei', name: 'Meiteilon (Manipuri)' },
  { code: 'lus', name: 'Mizo' },
  { code: 'mn', name: 'Mongolian (Монгол)' },
  { code: 'my', name: 'Myanmar (Burmese) (မြန်မာ)' },
  { code: 'ne', name: 'Nepali (नेपाली)' },
  { code: 'no', name: 'Norwegian (Norsk)' },
  { code: 'or', name: 'Odia (Oriya) (ଓଡ଼ିଆ)' },
  { code: 'om', name: 'Oromo (Afaan Oromoo)' },
  { code: 'ps', name: 'Pashto (پښتو)' },
  { code: 'fa', name: 'Persian (فارسی)' },
  { code: 'pl', name: 'Polish (Polski)' },
  { code: 'pt', name: 'Portuguese (Português)' },
  { code: 'qu', name: 'Quechua' },
  { code: 'ro', name: 'Romanian (Română)' },
  { code: 'ru', name: 'Russian (Русский)' },
  { code: 'sm', name: 'Samoan (Gagana Samoa)' },
  { code: 'sa', name: 'Sanskrit (संस्कृतम्)' },
  { code: 'gd', name: 'Scots Gaelic (Gàidhlig)' },
  { code: 'nso', name: 'Sepedi (Sesotho sa Leboa)' },
  { code: 'sr', name: 'Serbian (Српски)' },
  { code: 'st', name: 'Sesotho' },
  { code: 'sn', name: 'Shona (Chishona)' },
  { code: 'sd', name: 'Sindhi (سنڌي)' },
  { code: 'si', name: 'Sinhala (සිංහල)' },
  { code: 'sk', name: 'Slovak (Slovenčina)' },
  { code: 'sl', name: 'Slovenian (Slovenščina)' },
  { code: 'so', name: 'Somali (Soomaali)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'su', name: 'Sundanese (Basa Sunda)' },
  { code: 'sw', name: 'Swahili (Kiswahili)' },
  { code: 'sv', name: 'Swedish (Svenska)' },
  { code: 'tg', name: 'Tajik (Тоҷикӣ)' },
  { code: 'tt', name: 'Tatar (Татар)' },
  { code: 'th', name: 'Thai (ไทย)' },
  { code: 'ti', name: 'Tigrinya (ትግርኛ)' },
  { code: 'ts', name: 'Tsonga (Xitsonga)' },
  { code: 'tr', name: 'Turkish (Türkçe)' },
  { code: 'tk', name: 'Turkmen (Türkmençe)' },
  { code: 'ak', name: 'Twi (Akan)' },
  { code: 'uk', name: 'Ukrainian (Українська)' },
  { code: 'ug', name: 'Uyghur (ئۇيغۇرچه)' },
  { code: 'uz', name: 'Uzbek (Oʻzbekcha)' },
  { code: 'vi', name: 'Vietnamese (Tiếng Việt)' },
  { code: 'cy', name: 'Welsh (Cymraeg)' },
  { code: 'xh', name: 'Xhosa (isiXhosa)' },
  { code: 'yi', name: 'Yiddish (ייִדיש)' },
  { code: 'yo', name: 'Yoruba (Ede Yoruba)' },
  { code: 'zu', name: 'Zulu (isiZulu)' }
];


export function ProposalView() {
  const { slug } = useParams();
  const [proposal, setProposal] = useState<any>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to clean light mode
  const [showQR, setShowQR] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [updating, setUpdating] = useState(false);

  // Custom translate dropdown states
  const [currentLangCode, setCurrentLangCode] = useState("en");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [langSearchQuery, setLangSearchQuery] = useState("");
  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
  
  // Passcode protection states
  const [isLocked, setIsLocked] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  // Sync dark class on <html> with ProposalView's theme
  // This prevents dark: Tailwind classes from leaking in from the main site's ThemeProvider
  useEffect(() => {
    const html = document.documentElement;
    const hadDark = html.classList.contains("dark");

    if (isDarkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    return () => {
      // Restore original state on unmount so the main site's theme isn't broken
      if (hadDark) {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    };
  }, [isDarkMode]);

  // Sync a .lang-te class on <html> when translating to Telugu
  useEffect(() => {
    const html = document.documentElement;
    if (currentLangCode === "te") {
      html.classList.add("lang-te");
    } else {
      html.classList.remove("lang-te");
    }
    return () => {
      html.classList.remove("lang-te");
    };
  }, [currentLangCode]);

  useEffect(() => {
    // Always default to English on fresh page load by clearing existing translation cookies
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname + ";";
    document.cookie = "googtrans=/en/en; path=/;";
    setCurrentLangCode("en");
  }, []);

  const handleSelectLanguage = (langCode: string) => {
    setCurrentLangCode(langCode);
    setIsLangDropdownOpen(false);
    setLangSearchQuery("");

    const selectEl = document.querySelector("#google_translate_element select") as HTMLSelectElement 
      || document.querySelector(".goog-te-combo") as HTMLSelectElement;

    if (selectEl) {
      selectEl.value = langCode;
      selectEl.dispatchEvent(new Event("change"));
    } else {
      toast.error("Translation service is initializing or blocked by your browser. Please try again in a few seconds.");
    }
  };

  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      toast.success("Proposal link copied!");
    } catch (err) {
      toast.error("Failed to copy link. Please manually copy it.");
    }
    document.body.removeChild(textArea);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast.success("Proposal link copied!");
      }).catch(() => {
        fallbackCopyText(shareUrl);
      });
    } else {
      fallbackCopyText(shareUrl);
    }
  };

  const [settings, setSettings] = useState<Record<string, string>>({});

  // Load proposal data
  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const pwdParam = urlParams.get("pwd") || "";

        const [res, settingsRes] = await Promise.all([
          fetch(`/api/proposal?slug=${slug}&pwd=${pwdParam}`),
          fetch("/api/settings")
        ]);

        if (res.ok) {
          const data = await res.json();
          if (data.isLocked) {
            setIsLocked(true);
            setProposal({ title: data.title, client_name: data.client_name });
          } else {
            setProposal(data);
            const parsed = JSON.parse(data.content_json);
            setSections(Array.isArray(parsed) ? parsed : []);
            setIsLocked(false);
          }
        } else {
          setError("This proposal doesn't exist or may have been deleted.");
        }

        if (settingsRes.ok) {
          setSettings(await settingsRes.json());
        }
      } catch (e) {
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchProposal();
  }, [slug]);

  useEffect(() => {
    let checkInterval: NodeJS.Timeout;

    const initTranslate = () => {
      if ((window as any).google && (window as any).google.translate && (window as any).google.translate.TranslateElement) {
        const targetElem = document.getElementById("google_translate_element");
        if (targetElem && targetElem.childElementCount === 0) {
          try {
            new (window as any).google.translate.TranslateElement(
              { pageLanguage: "en" },
              "google_translate_element"
            );
          } catch (e) {
            console.error("Google Translate Init Error:", e);
          }
        }
      }
    };

    (window as any).googleTranslateElementInit = initTranslate;

    // Check if script already exists
    const existingScript = document.getElementById("google-translate-script");
    
    if ((window as any).google?.translate?.TranslateElement) {
      // If already loaded from previous navigation, re-init
      initTranslate();
    } else if (!existingScript) {
      // Load script if not present
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    // Fallback polling in case the callback failed or was delayed
    checkInterval = setInterval(() => {
      const targetElem = document.getElementById("google_translate_element");
      if (targetElem && targetElem.childElementCount === 0 && (window as any).google?.translate?.TranslateElement) {
        initTranslate();
      }
    }, 1000);

    return () => {
      clearInterval(checkInterval);
      // Clean up the widget DOM to allow re-initialization on remount
      const targetElem = document.getElementById("google_translate_element");
      if (targetElem) {
        targetElem.innerHTML = "";
      }
    };
  }, []);

  useEffect(() => {
    const handleBeforePrint = () => {
      const rootDiv = document.getElementById("proposal-view-root");
      if (rootDiv) {
        rootDiv.classList.remove("dark");
        rootDiv.classList.remove("bg-[#0F172A]");
        rootDiv.classList.remove("text-slate-100");
        rootDiv.classList.remove("bg-[#FAF9F6]");
        rootDiv.classList.remove("text-[#0F172A]");
        rootDiv.classList.add("bg-white");
        rootDiv.classList.add("text-[#0F172A]");
      }
    };
    
    const handleAfterPrint = () => {
      const rootDiv = document.getElementById("proposal-view-root");
      if (rootDiv) {
        rootDiv.classList.remove("bg-white");
        rootDiv.classList.remove("text-[#0F172A]");
        if (isDarkMode) {
          rootDiv.classList.add("dark");
          rootDiv.classList.add("bg-[#0F172A]");
          rootDiv.classList.add("text-slate-100");
        } else {
          rootDiv.classList.add("bg-[#FAF9F6]");
          rootDiv.classList.add("text-[#0F172A]");
        }
      }
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [isDarkMode]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError("");
    try {
      const res = await fetch(`/api/proposal?slug=${slug}&pwd=${passcode}`);
      if (res.ok) {
        const data = await res.json();
        if (data.isLocked) {
          setPasscodeError("Incorrect passcode. Please try again.");
        } else {
          setProposal(data);
          const parsed = JSON.parse(data.content_json);
          setSections(Array.isArray(parsed) ? parsed : []);
          setIsLocked(false);
          
          // Append password to URL so reloading is seamless
          const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?pwd=${passcode}`;
          window.history.replaceState({ path: newUrl }, "", newUrl);
        }
      } else {
        setPasscodeError("Failed to verify passcode.");
      }
    } catch (err) {
      setPasscodeError("Network error. Please try again.");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await fetch("/api/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, action: "download" })
      });
    } catch (e) {
      // Ignore network error for printing
    }
    window.print();
  };

  const handleUpdateStatus = async (status: string) => {
    setUpdating(true);
    try {
      const res = await fetch("/api/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          action: "status",
          status,
          signatureName: status === "Approved" ? signatureName || proposal.client_name : undefined,
          rejectReason: status === "Rejected" ? rejectReason : undefined,
        }),
      });
      if (res.ok) {
        toast.success(
          status === "Approved"
            ? "Proposal approved — an agreement will be generated."
            : "Proposal rejected — feedback has been noted."
        );
        setProposal({ ...proposal, status });
        setShowApproveModal(false);
        setShowRejectModal(false);
        setSignatureName("");
        setRejectReason("");
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Failed to update status");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center text-slate-800">
        <div className="relative flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">PREPARING PROPOSAL...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center text-slate-800 p-6">
        <div className="max-w-md w-full text-center space-y-4 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
          <X className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold">Proposal Unreachable</h2>
          <p className="text-slate-500 text-sm leading-relaxed">{error}</p>
          <a href="/" className="inline-block px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-full text-sm">
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0F172A] flex flex-col items-center justify-center text-slate-800 dark:text-slate-100 p-6 transition-colors duration-300">
        <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 p-8 sm:p-10 rounded-3xl shadow-xl transition-all duration-300">
          <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Password Protected</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              This project proposal is private. Please enter the passcode to view the document.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-1">
              <input
                required
                type="text"
                placeholder="ENTER PASSCODE"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value.toUpperCase().trim())}
                className="w-full text-center tracking-widest px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl text-sm font-bold uppercase placeholder-slate-400 dark:placeholder-slate-600 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition font-mono"
              />
              {passcodeError && (
                <p className="text-xs text-red-500 font-semibold mt-1.5">{passcodeError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 dark:bg-indigo-600 text-white font-bold rounded-2xl hover:opacity-90 active:scale-[0.98] transition text-sm flex items-center justify-center gap-2"
            >
              Unlock Proposal
            </button>
          </form>
        </div>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/proposal/${slug}`;

  // Helper to extract timeline description if exists
  const getTimelineText = (sec: Section) => {
    if (sec.items && sec.items.length > 0) {
      const itemsText = sec.items.map(i => `${i.milestone || i.title}: ${i.duration || i.desc}`).join(", ");
      return `Estimated Timeline: ${itemsText}`;
    }
    return "";
  };

  return (
    <div id="proposal-view-root" className={`${isDarkMode ? "dark bg-[#0F172A] text-slate-100" : "bg-[#FAF9F6] text-[#0F172A]"} min-h-screen font-sans transition-colors duration-300 print:bg-white print:text-black pb-24 w-full max-w-full overflow-x-hidden min-w-0`}>
      {/* Print styles overrides */}
      <style>{`
        /* Google Translate custom premium styles */
        #google_translate_element {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          border: 0 !important;
        }
        .goog-te-gadget {
          font-family: inherit !important;
          font-size: 0px !important;
        }
        .goog-te-gadget .goog-te-combo {
          background-color: transparent;
          border: none;
          padding: 2px 14px 2px 2px;
          font-size: 11px;
          font-weight: 600;
          outline: none;
          cursor: pointer;
          color: inherit;
          font-family: inherit;
          max-width: 95px;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0px center;
          background-size: 8px;
        }
        .dark .goog-te-gadget .goog-te-combo {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E");
        }
        .goog-te-gadget .goog-te-combo option {
          background-color: #ffffff;
          color: #0f172a;
          font-family: inherit;
        }
        .dark .goog-te-gadget .goog-te-combo option {
          background-color: #1e293b;
          color: #f1f5f9;
          font-family: inherit;
        }
        .goog-te-gadget img, .goog-te-banner-frame, .goog-te-balloon-frame, iframe.goog-te-menu-frame, iframe.skiptranslate {
          display: none !important;
        }
        body {
          top: 0px !important;
          position: static !important;
        }
        .goog-tooltip, .goog-tooltip:hover {
          display: none !important;
        }
        .goog-text-highlight {
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }

        /* Telugu fonts when Google Translate is active */
        .lang-te h1,
        .lang-te h2,
        .lang-te h3,
        .lang-te h4,
        .lang-te h5,
        .lang-te h6 {
          font-family: "Ramabhadra", sans-serif !important;
          font-weight: 400 !important;
        }
        .lang-te {
          font-family: "NTR", sans-serif !important;
        }
        .lang-te p,
        .lang-te li,
        .lang-te span,
        .lang-te div:not(.notranslate) {
          font-family: "NTR", sans-serif !important;
        }

        @media print {
          @page {
            size: A4;
            margin: 15mm 20mm;
          }
          body {
            background-color: white !important;
            color: #0f172a !important;
            font-size: 11pt;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #proposal-view-root {
            background-color: white !important;
            background: white !important;
            color: #0f172a !important;
            padding-bottom: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .proposal-paper {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
            max-width: 100% !important;
          }
          .print-break-before {
            page-break-before: always !important;
            break-before: page !important;
            padding-top: 10mm !important;
          }
          .dark-table-header {
            background-color: #0F172A !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .highlight-green-row {
            background-color: #DCFCE7 !important;
            color: #15803d !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          th, td {
            color: #0f172a !important;
            border-color: #e2e8f0 !important;
          }
          .dark-table-header th {
            color: white !important;
          }
          .highlight-green-row td {
            color: #15803d !important;
          }
          ul, li {
            page-break-inside: avoid;
          }
          h1, h2, h3 {
            page-break-after: avoid;
          }
        }
      `}</style>

      {/* Floating Toolbar */}
      <header className="no-print sticky top-0 z-40 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300 shadow-sm notranslate w-full max-w-full overflow-x-hidden">
        <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="font-black tracking-wider text-xs sm:text-sm uppercase shrink-0">
              <span className="hidden xs:inline">ADVAITA DESIGNS</span>
              <span className="xs:hidden">ADVAITA</span>
            </span>
            <span className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden xs:inline shrink-0" />
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline truncate max-w-[200px]">{proposal.title}</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Visually-hidden target for Google Translate library (NOT display:none — widget needs rendering) */}
            <div id="google_translate_element" className="notranslate" translate="no" />

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition shrink-0"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
             <div className="relative shrink-0">
              <button
                onClick={() => setIsShareDropdownOpen(!isShareDropdownOpen)}
                className="p-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition flex items-center justify-center"
                title="Share Proposal"
              >
                <Share2 className="h-3.5 w-3.5" />
              </button>

              {isShareDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsShareDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] shadow-xl z-50 overflow-hidden py-1">
                    <button
                      onClick={() => {
                        handleCopyLink();
                        setIsShareDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-2"
                    >
                      <Link className="h-3.5 w-3.5 text-slate-400" />
                      <span>Copy Link</span>
                    </button>
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent((proposal?.title ? proposal.title + " - " : "") + shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsShareDropdownOpen(false)}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-2"
                    >
                      <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Share via WhatsApp</span>
                    </a>
                    <a
                      href={`mailto:?subject=${encodeURIComponent("Proposal: " + (proposal?.title || "Advaita Designs"))}&body=${encodeURIComponent("Please review the proposal here:\n\n" + shareUrl)}`}
                      onClick={() => setIsShareDropdownOpen(false)}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-2"
                    >
                      <Mail className="h-3.5 w-3.5 text-sky-500" />
                      <span>Share via Email</span>
                    </a>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setShowQR(true)}
              className="p-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition hidden xs:inline-flex shrink-0"
              title="QR Code"
            >
              <QrCode className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-full hover:opacity-90 transition-opacity shrink-0"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Paper Container */}
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-12 print:py-0 print:px-0 min-w-0 overflow-x-hidden">
        <div className="proposal-paper bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl sm:rounded-3xl p-4 xs:p-6 sm:p-16 space-y-12 sm:space-y-16 transition-colors duration-300 print:shadow-none print:border-none print:p-0 min-w-0 overflow-hidden">
          
          {/* Cover Page */}
          <section className="relative min-h-[45vh] flex flex-col justify-between py-6 sm:py-12 border-b border-slate-200 dark:border-slate-800/50 print:border-slate-200 print:min-h-[85vh]">
            {/* Cover Image Thumbnail */}
            {proposal?.cover_image && (
              <img src={proposal.cover_image} alt="Cover" className="absolute top-4 left-4 w-24 h-14 object-cover rounded-lg border border-slate-200 dark:border-slate-600" />
            )}

            {/* Language Selector — top-right of cover, full name shown */}
            <div className="no-print notranslate absolute top-0 right-0 z-30" translate="no">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/70 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/40 rounded-xl transition text-xs font-semibold shadow-sm"
                title="Select Language"
              >
                <Globe className="h-3.5 w-3.5 shrink-0" />
                <span>{LANGUAGES.find((l) => l.code === currentLangCode)?.name || "English"}</span>
                <ChevronDown className="h-3 w-3 transition-transform duration-200" style={{ transform: isLangDropdownOpen ? 'rotate(180deg)' : 'none' }} />
              </button>

              {isLangDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] shadow-xl z-50 overflow-hidden">
                    <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                      <Search className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-1" />
                      <input
                        type="text"
                        placeholder="Search language..."
                        value={langSearchQuery}
                        onChange={(e) => setLangSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none text-xs outline-none py-1 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                        autoFocus
                      />
                      {langSearchQuery && (
                        <button onClick={() => setLangSearchQuery("")} className="p-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                          <X className="h-3 w-3 text-slate-400" />
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1">
                      {(() => {
                        const filtered = LANGUAGES.filter((l) =>
                          l.name.toLowerCase().includes(langSearchQuery.toLowerCase())
                        );
                        if (filtered.length === 0) {
                          return <div className="px-3 py-4 text-center text-xs text-slate-400">No languages found.</div>;
                        }
                        return filtered.map((lang) => {
                          const isSelected = lang.code === currentLangCode;
                          return (
                            <button
                              key={lang.code}
                              onClick={() => handleSelectLanguage(lang.code)}
                              className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                                isSelected
                                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                              }`}
                            >
                              <span>{lang.name}</span>
                              {isSelected && <Check className="h-3.5 w-3.5" />}
                            </button>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-8 sm:space-y-12 text-center my-auto">
              <div className="flex justify-center mb-6 sm:mb-8">
                <img src={logo} alt="Advaita Designs" className="h-16 sm:h-24 w-auto dark:hidden" />
                <img src={logoDark} alt="Advaita Designs" className="hidden h-16 sm:h-24 w-auto dark:block" />
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-2xl mx-auto leading-tight px-2">
                {proposal?.title || "Untitled Proposal"}
              </h1>
              
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-500 tracking-widest block">PREPARED FOR</span>
                {proposal.company_name ? (
                  <>
                    <p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                      {proposal.company_name}
                    </p>
                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
                      Contact: {proposal.client_name}
                    </p>
                  </>
                ) : (
                  <p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    {proposal.client_name}
                  </p>
                )}
              </div>

              <div className="w-32 sm:w-48 h-px bg-slate-200 dark:bg-slate-700 mx-auto" />

              {sections.find(s => s.type === "hero")?.content && (
                <p className="text-xs sm:text-base text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed px-4">
                  {sections.find(s => s.type === "hero")?.content}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 sm:justify-between sm:items-end pt-8 text-xs sm:text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 sm:border-t-0 mt-8 sm:mt-0">
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">Prepared by:</p>
                <p>{settings.legal_name || "Sridhar Silver"}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Visual Designer • UI/UX Designer • Digital Consultant</p>
              </div>
              {proposal.valid_until && (
                <div className="sm:text-right">
                  <span className="font-semibold text-slate-950 dark:text-white">Date:</span>
                  <span>{proposal.valid_until}</span>
                  {/* Expiry Badge */}
                  {proposal.valid_until && (() => {
                    const expiry = new Date(proposal.valid_until);
                    expiry.setHours(23,59,59,999);
                    const now = new Date();
                    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000*60*60*24));
                    let label = "";
                    let style = "bg-emerald-500/10 text-emerald-600";
                    if (diffDays < 0) { label = "Expired"; style = "bg-red-500/10 text-red-600"; }
                    else if (diffDays === 0) { label = "Expires today"; style = "bg-orange-500/10 text-orange-600"; }
                    else if (diffDays <= 3) { label = `Expires in ${diffDays}d`; style = "bg-amber-500/10 text-amber-600"; }
                    else { label = `Valid ${diffDays}d`; style = "bg-emerald-500/10 text-emerald-600"; }
                    return <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${style}`}>{label}</span>;
                  })()}
                </div>
              )}
            </div>
          </section>

          {/* Dynamic Document Sections */}
          {sections.filter(s => s.type !== "hero").map((section) => {
            const isBreakSection = ["pricing", "terms", "contact", "thankyou"].includes(section.type);
            
            return (
              <section 
                key={section.id} 
                className={`space-y-4 sm:space-y-6 ${isBreakSection ? "print-break-before" : ""}`}
              >
                {/* Section Header */}
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  {section.title}
                </h2>

                {/* Scope Lists (Render as simple clean bullet points like image) */}
                {section.type === "scope" && section.items && (
                  <ul className="space-y-2.5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm list-none pl-0">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <span className="text-slate-400 dark:text-slate-500 select-none">•</span>
                        <div>
                          <strong className="text-slate-900 dark:text-white">{item.title || item.name}</strong>
                          {item.description && <span className="text-slate-500 dark:text-slate-400"> — {item.description}</span>}
                          {item.detail && <span className="text-slate-500 dark:text-slate-400"> — {item.detail}</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Goals & Deliverables lists */}
                {["goals", "deliverables", "process"].includes(section.type) && section.items && (
                  <ul className="space-y-2.5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm list-none pl-0">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <span className="text-slate-400 dark:text-slate-500 select-none">•</span>
                        <div>
                          <strong className="text-slate-900 dark:text-white">{item.title || item.name || `Step ${item.step}`}</strong>
                          {(item.description || item.detail || item.desc) && (
                            <span className="text-slate-500 dark:text-slate-400"> — {item.description || item.detail || item.desc}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Text / HTML content (Overview, Terms, stack, etc.) */}
                {["understanding", "terms", "thankyou", "about", "contact"].includes(section.type) && section.content && (
                  <div 
                    className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed space-y-3 prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                )}

                {/* Timeline display */}
                {section.type === "timeline" && section.items && (
                  <ul className="space-y-2.5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm list-none pl-0">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <span className="text-slate-400 dark:text-slate-500 select-none">•</span>
                        <div>
                          <strong className="text-slate-900 dark:text-white">{item.milestone || item.title}</strong>
                          {(item.duration || item.desc) && (
                            <span className="text-slate-500 dark:text-slate-400"> — {item.duration || item.desc}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Pricing / Cost Table (Render dark styled table like image) */}
                {section.type === "pricing" && section.items && (
                  <div className="overflow-hidden border border-slate-200 dark:border-slate-700 rounded-md shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[300px]">
                        <thead>
                          <tr className="dark-table-header bg-slate-900 text-white dark:bg-slate-800">
                            <th className="p-2.5 sm:p-3 font-semibold">
                              Item
                              {/* Project Type Chip */}
                              {proposal?.project_type && (
                                <span className="ml-2 inline-block px-2 py-0.5 text-xs font-semibold bg-slate-700 text-white rounded-md">
                                  {proposal.project_type}
                                </span>
                              )}
                            </th>
                            <th className="p-2.5 sm:p-3 font-semibold text-right">Cost</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                          {(() => {
                            const items = section.items.filter(item => {
                              const name = item.name.toLowerCase();
                              return !name.includes("total") && !name.includes("overall") && !name.includes("gst");
                            });

                            const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
                            const hasGST = section.config?.showGST;
                            const gstRate = section.config?.gstRate || 18;
                            const gstAmount = hasGST ? (subtotal * gstRate) / 100 : 0;
                            const grandTotal = subtotal + gstAmount;

                            return (
                              <>
                                {items.map((item, idx) => (
                                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                                    <td className="p-2.5 sm:p-3 font-medium text-slate-900 dark:text-white">{item.name}</td>
                                    <td className="p-2.5 sm:p-3 text-right font-bold text-slate-900 dark:text-white">
                                      ₹{Number(item.price || 0).toLocaleString("en-IN")}
                                    </td>
                                  </tr>
                                ))}

                                {hasGST && (
                                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                                    <td className="p-2.5 sm:p-3 font-medium text-slate-500 dark:text-slate-400">{gstRate}% GST</td>
                                    <td className="p-2.5 sm:p-3 text-right font-bold text-slate-500 dark:text-slate-400">
                                      ₹{gstAmount.toLocaleString("en-IN")}
                                    </td>
                                  </tr>
                                )}

                                <tr className="highlight-green-row bg-emerald-50 dark:bg-emerald-950/20 font-bold">
                                  <td className="p-2.5 sm:p-3 text-slate-900 dark:text-white">Overall Project Cost Summary</td>
                                  <td className="p-2.5 sm:p-3 text-right font-black text-slate-900 dark:text-white">
                                    ₹{grandTotal.toLocaleString("en-IN")}
                                  </td>
                                </tr>
                              </>
                            );
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Optional addons / additional services */}
                {section.type === "addons" && section.items && (
                  <div className="overflow-hidden border border-slate-200 dark:border-slate-700 rounded-md shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[300px]">
                        <thead>
                          <tr className="dark-table-header bg-slate-900 text-white dark:bg-slate-800">
                            <th className="p-2.5 sm:p-3 font-semibold">Service</th>
                            <th className="p-2.5 sm:p-3 font-semibold text-right">Cost</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                          {section.items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                              <td className="p-2.5 sm:p-3">
                                <span className="font-medium text-slate-900 dark:text-white">{item.name}</span>
                                {item.description && <span className="text-slate-500 dark:text-slate-400 block text-[10px] sm:text-xs mt-0.5">{item.description}</span>}
                              </td>
                              <td className="p-2.5 sm:p-3 text-right font-bold text-slate-900 dark:text-white">
                                {item.price > 0 ? `₹${item.price.toLocaleString("en-IN")}` : "Extra"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </section>
            );
          })}

          {/* Simple Signature Footer */}
          <section className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 print:border-slate-200">
            <div>
              <p className="font-bold text-slate-950 dark:text-white">{settings.legal_name || "Sridhar Silver"}</p>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">Visual Designer • UI/UX Designer • Digital Consultant</p>
            </div>
            
            <div className="flex items-center gap-2 notranslate no-print" translate="no">
              {proposal.status === "Approved" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold">
                  <Check className="h-3.5 w-3.5" /> Approved
                </span>
              )}
              {proposal.status === "Rejected" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-bold">
                  <X className="h-3.5 w-3.5" /> Rejected
                </span>
              )}
              {(proposal.status === "Sent" || proposal.status === "Viewed") && (
                <>
                  <button
                    onClick={() => setShowApproveModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-full hover:bg-emerald-700 transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-full hover:bg-red-700 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                </>
              )}
            </div>
          </section>

          {/* Approve Confirmation Modal */}
          {showApproveModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 no-print">
              <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full text-center relative shadow-2xl space-y-5">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="absolute top-4 right-4 h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                  <Check className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Approve Proposal</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    By approving, you agree to proceed with this project. An agreement will be generated automatically.
                  </p>
                </div>
                <div className="text-left">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Full Name (as signature)
                  </label>
                  <input
                    type="text"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    placeholder={proposal.client_name || "Enter your name"}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowApproveModal(false)}
                    className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateStatus("Approved")}
                    disabled={updating || !signatureName.trim()}
                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50 transition text-sm"
                  >
                    {updating ? "Processing..." : "Confirm Approval"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reject Modal */}
          {showRejectModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 no-print">
              <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full text-center relative shadow-2xl space-y-5">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="absolute top-4 right-4 h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="h-14 w-14 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto text-red-600 dark:text-red-400">
                  <X className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Reject Proposal</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    If you'd like to share feedback or request changes, please let us know.
                  </p>
                </div>
                <div className="text-left">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Reason (optional)
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    placeholder="Share your feedback or reason..."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-red-500 dark:focus:border-red-500 transition resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateStatus("Rejected")}
                    disabled={updating}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 transition text-sm"
                  >
                    {updating ? "Processing..." : "Confirm Rejection"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QR Share Overlay Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 no-print">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center relative shadow-2xl space-y-4">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center bg-background text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Proposal QR Code</h3>
            <div className="bg-white p-4 rounded-2xl inline-block border border-slate-200 shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`}
                alt="QR Code"
                className="w-44 h-44 mx-auto"
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 break-all">{shareUrl}</p>
            <button
              onClick={handleCopyLink}
              className="w-full py-3 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-xl font-semibold hover:opacity-90 transition-opacity text-sm"
            >
              Copy URL Link
            </button>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
}
