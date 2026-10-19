import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";

const filters = ["All", "Web Design", "Branding", "Print", "UI/UX", "Packaging"];

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image_url: string;
  tone: string;
  description: string;
  project_link: string;
}


const DEFAULT_PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 1,
    title: "Aurora Skincare",
    category: "Branding",
    image_url: "/assets/portfolio-skincare.webp",
    tone: "from-orange-400/30 to-pink-400/30",
    description: "A complete rebranding project including packaging and digital presence for a premium skincare line.",
    project_link: "https://example.com/aurora"
  },
  {
    id: 2,
    title: "Nimbus Fintech",
    category: "Web Design",
    image_url: "/assets/portfolio-fintech.webp",
    tone: "from-teal-400/30 to-blue-500/30",
    description: "Modern and secure web platform designed for a forward-thinking financial technology startup.",
    project_link: "https://example.com/nimbus"
  },
  {
    id: 3,
    title: "Verdant Foods",
    category: "Packaging",
    image_url: "/assets/portfolio-food.webp",
    tone: "from-green-400/30 to-emerald-500/30",
    description: "Sustainable and eye-catching packaging design for an organic food brand.",
    project_link: "https://example.com/verdant"
  },
  {
    id: 4,
    title: "Lumen Analytics",
    category: "UI/UX",
    image_url: "/assets/portfolio-analytics.webp",
    tone: "from-blue-400/30 to-indigo-500/30",
    description: "Intuitive dashboard and user interface design for complex data analytics software.",
    project_link: "https://example.com/lumen"
  }
];

export function Portfolio() {
  const [filter, setFilter] = useState("All");
  const [items, setItems] = useState<PortfolioItem[]>(DEFAULT_PORTFOLIO_ITEMS);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.data || []);
          if (list.length > 0) {
            setItems(list);
          }
        }
      } catch (e) {
        console.error("Failed to fetch portfolio");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const displayItems = items.length > 0 ? items : DEFAULT_PORTFOLIO_ITEMS;
  const filtered = filter === "All" ? displayItems : displayItems.filter((i) => i.category === filter);
  
  // Prevent scrolling when lightbox is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedItem]);

  return (
    <section id="portfolio" className="py-16 relative border-b border-[var(--divider)]/50 scroll-mt-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <p className="text-sm text-[color:var(--brand-green)] uppercase tracking-widest mb-4">
              Selected work
            </p>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Brands I've helped <span className="text-gradient">take flight</span>.
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  filter === f
                    ? "bg-gradient-brand text-primary-foreground"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.title}
                layout
                onClick={() => setSelectedItem(item)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className={`group relative aspect-[4/5] rounded-3xl overflow-hidden glass cursor-pointer`}
              >
                <img src={item.image_url} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 p-7 flex flex-col justify-between z-10">
                  <span className="text-xs text-white/80 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <div className="flex items-end justify-between">
                    <h3 className="text-2xl font-semibold pr-4 text-white">{item.title}</h3>
                    <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-gradient-brand group-hover:rotate-45 transition-all duration-500">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] min-h-[60vh] bg-card border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 h-10 w-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="w-full md:w-3/5 h-64 md:h-auto relative">
                <img src={selectedItem.image_url} alt={selectedItem.title} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
                <span className="text-sm font-semibold text-[color:var(--brand-orange)] tracking-widest uppercase mb-2">{selectedItem.category}</span>
                <h3 className="text-3xl md:text-4xl font-bold mb-6">{selectedItem.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {selectedItem.description}
                </p>
                <a 
                  href={selectedItem.project_link?.startsWith('http') ? selectedItem.project_link : `https://${selectedItem.project_link}`} 
                  target="_blank" 
                  rel="noreferrer noopener" 
                  className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90 transition w-fit"
                >
                  View Live Project
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
