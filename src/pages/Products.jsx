import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SlidersHorizontal, X, ChevronDown, ChevronUp,
  Home, ChevronRight, Grid3X3, LayoutList, Star, ArrowRight, ShoppingBag, Search, Filter, Sparkles
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────

const PRODUCTS = [
  { id: 1,  name: "Premium Business Cards",   category: "Business Cards", desc: "Double-sided · 350gsm · 100+ designs",                price: 299,  old: 499,  rating: 4.8, reviews: 1247, badge: "🔥 Trending",  badgeV: "orange", imgBg: "bg-blue-50",    accent: "#1a56db", finish: ["glossy","matte","soft-touch"], link: "/business-cards", pop: true  },
  { id: 2,  name: "Square Business Cards",    category: "Business Cards", desc: "2.5×2.5\" · Premium stock · Modern look",              price: 349,  old: 549,  rating: 4.6, reviews: 523,  badge: null,            badgeV: "",       imgBg: "bg-indigo-50",  accent: "#4f46e5", finish: ["matte","soft-touch"],          link: "/business-cards", pop: false },
  { id: 3,  name: "Full-color Flyers A5",     category: "Flyers",         desc: "150gsm · Gloss/Matte · Custom sizes",                 price: 499,  old: 699,  rating: 4.7, reviews: 892,  badge: "⭐ Popular",   badgeV: "green",  imgBg: "bg-red-50",     accent: "#ef4444", finish: ["glossy","matte"],              link: "/business-cards", pop: true  },
  { id: 4,  name: "Double-sided Flyers A4",   category: "Flyers",         desc: "Full color · 130gsm silk · Qty discounts",            price: 699,  old: 999,  rating: 4.5, reviews: 341,  badge: null,            badgeV: "",       imgBg: "bg-rose-50",    accent: "#f43f5e", finish: ["glossy"],                      link: "/business-cards", pop: false },
  { id: 5,  name: "Tri-fold Brochure",        category: "Brochures",      desc: "6-panel · 170gsm · Professional finish",              price: 799,  old: 1099, rating: 4.6, reviews: 456,  badge: null,            badgeV: "",       imgBg: "bg-amber-50",   accent: "#f59e0b", finish: ["glossy","matte"],              link: "/business-cards", pop: false },
  { id: 6,  name: "Z-fold Brochure DL",       category: "Brochures",      desc: "Compact size · 3 panels · Crisp colors",              price: 899,  old: 1199, rating: 4.4, reviews: 221,  badge: null,            badgeV: "",       imgBg: "bg-yellow-50",  accent: "#eab308", finish: ["glossy","matte"],              link: "/business-cards", pop: false },
  { id: 7,  name: "Roll-up Banner 85×200cm",  category: "Banners",        desc: "Premium vinyl · Carry case included",                 price: 1299, old: 1899, rating: 4.9, reviews: 1102, badge: "⭐ Popular",   badgeV: "green",  imgBg: "bg-green-50",   accent: "#10b981", finish: ["matte"],                       link: "/business-cards", pop: true  },
  { id: 8,  name: "Outdoor PVC Banner 1m×3m", category: "Banners",        desc: "Weatherproof · Eyelets · UV-print",                   price: 1999, old: 2799, rating: 4.7, reviews: 345,  badge: null,            badgeV: "",       imgBg: "bg-emerald-50", accent: "#059669", finish: ["matte"],                       link: "/business-cards", pop: false },
  { id: 9,  name: "Vinyl Sticker Sheet A4",   category: "Stickers",       desc: "Waterproof · Cut-to-shape · Vivid colors",            price: 249,  old: 399,  rating: 4.8, reviews: 2341, badge: "🔥 Trending",  badgeV: "orange", imgBg: "bg-cyan-50",    accent: "#06b6d4", finish: ["glossy","matte"],              link: "/business-cards", pop: true  },
  { id: 10, name: "Die-Cut Custom Stickers",  category: "Stickers",       desc: "Any shape · Premium vinyl · Bulk deals",              price: 399,  old: 599,  rating: 4.7, reviews: 1562, badge: null,            badgeV: "",       imgBg: "bg-sky-50",     accent: "#0ea5e9", finish: ["glossy","matte","soft-touch"], link: "/business-cards", pop: false },
  { id: 11, name: "Ceramic Mug 11oz",         category: "Mugs & Gifts",   desc: "Microwave safe · Full wrap · Dishwasher safe",        price: 699,  old: 899,  rating: 4.7, reviews: 785,  badge: "⭐ Popular",   badgeV: "green",  imgBg: "bg-purple-50",  accent: "#9333ea", finish: ["glossy"],                      link: "/business-cards", pop: true  },
  { id: 12, name: "Travel Tumbler 450ml",     category: "Mugs & Gifts",   desc: "Stainless steel · Double wall · 12h warm",           price: 999,  old: 1299, rating: 4.5, reviews: 342,  badge: null,            badgeV: "",       imgBg: "bg-violet-50",  accent: "#7c3aed", finish: ["matte"],                       link: "/business-cards", pop: false },
  { id: 13, name: "Custom Round-Neck Tee",    category: "T-Shirts",       desc: "100% cotton · Full-color DTG · S–3XL",               price: 499,  old: 699,  rating: 4.6, reviews: 1834, badge: "🔥 Trending",  badgeV: "orange", imgBg: "bg-pink-50",    accent: "#ec4899", finish: ["matte"],                       link: "/business-cards", pop: true  },
  { id: 14, name: "Premium Polo T-Shirt",     category: "T-Shirts",       desc: "Pique fabric · Embroidery/print · Corporate",        price: 799,  old: 1099, rating: 4.5, reviews: 523,  badge: null,            badgeV: "",       imgBg: "bg-fuchsia-50", accent: "#d946ef", finish: ["matte"],                       link: "/business-cards", pop: false },
  { id: 15, name: "A3 Gloss Poster",          category: "Posters",        desc: "170gsm silk · Vivid color · Fast turnaround",        price: 199,  old: 299,  rating: 4.7, reviews: 892,  badge: null,            badgeV: "",       imgBg: "bg-orange-50",  accent: "#ff6b2b", finish: ["glossy","matte"],              link: "/business-cards", pop: false },
  { id: 16, name: "A2 Premium Poster",        category: "Posters",        desc: "200gsm · Soft-touch laminate · Frame-ready",         price: 349,  old: 499,  rating: 4.8, reviews: 445,  badge: "⭐ Popular",   badgeV: "green",  imgBg: "bg-amber-50",   accent: "#f97316", finish: ["glossy","matte","soft-touch"], link: "/business-cards", pop: true  },
];

const ALL_CATEGORIES = ["Business Cards","Flyers","Brochures","Banners","Stickers","Mugs & Gifts","T-Shirts","Posters"];
const CAT_ICONS = { "Business Cards":"🪪","Flyers":"📋","Brochures":"📚","Banners":"🎌","Stickers":"🔖","Mugs & Gifts":"☕","T-Shirts":"👕","Posters":"🖼️" };
const PRICE_RANGES = [
  { label: "Under ₹500",        min: 0,    max: 499  },
  { label: "₹500 – ₹1,000",    min: 500,  max: 1000 },
  { label: "₹1,000 – ₹2,000",  min: 1001, max: 2000 },
  { label: "Above ₹2,000",      min: 2001, max: Infinity },
];
const FINISHES = ["Glossy", "Matte", "Soft Touch"];
const SORT_OPTS = [
  { label: "Trending Now", value: "trending" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Customer Rating", value: "rating" },
  { label: "Best Sellers", value: "popular" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────

function toggle(set, val) {
  const next = new Set(set);
  if (next.has(val)) next.delete(val);
  else               next.add(val);
  return next;
}

function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5 text-yellow-400">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={10} fill={i <= Math.floor(rating) ? "currentColor" : "none"} strokeWidth={i <= Math.floor(rating) ? 0 : 2} />
      ))}
    </div>
  );
}

// ─── Components ───────────────────────────────────────────────────────────

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="py-5 border-b border-border last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between mb-4 group">
        <span className="font-display font-black text-[11px] text-text-dark uppercase tracking-[0.2em]">{title}</span>
        {open ? <ChevronUp size={14} className="text-text-light/50 group-hover:text-primary-blue" /> : <ChevronDown size={14} className="text-text-light/50 group-hover:text-primary-blue" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-3">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductCard({ p, view }) {
  const isList = view === "list";
  const imgUrl = p.id === 1 ? "/assets/business-cards.png" : p.id === 3 ? "/assets/flyers.png" : p.id === 7 ? "/assets/hero-banner.png" : null;

  return (
    <motion.div
      layout
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      className={`group bg-white border border-border rounded-[32px] overflow-hidden shadow-sm hover:shadow-card-hover hover:border-primary-blue/20 transition-all duration-500 flex ${isList ? 'flex-row' : 'flex-col'} relative`}
    >
      <div className={`${isList ? 'w-[240px] shrink-0' : 'h-[200px] w-full'} relative flex items-center justify-center overflow-hidden ${p.imgBg}`}>
        {imgUrl ? (
          <img src={imgUrl} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-4xl opacity-30">
            {CAT_ICONS[p.category] || "📦"}
          </div>
        )}
        
        {p.badge && (
          <Badge className={`absolute top-4 left-4 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white border-none shadow-lg ${p.badgeV === 'orange' ? 'bg-accent-orange' : 'bg-primary-blue'}`}>
            {p.badge}
          </Badge>
        )}
        
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none md:pointer-events-auto">
          <Link to={p.link} className="bg-white text-text-dark font-black text-[13px] px-6 py-2.5 rounded-xl shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-primary-blue hover:text-white uppercase tracking-widest">
            Customize
          </Link>
        </div>
      </div>
      
      <div className={`flex-1 p-6 flex flex-col`}>
        <h4 className="font-display font-black text-[17px] text-text-dark mb-1.5 leading-tight group-hover:text-primary-blue transition-colors truncate">{p.name}</h4>
        <p className="font-body text-[13px] text-text-light mb-4 line-clamp-1 font-medium">{p.desc}</p>
        
        <div className="flex items-center gap-2 mb-4">
          <StarRow rating={p.rating} />
          <span className="font-black text-[12px] text-text-dark ml-1">{p.rating}</span>
          <span className="text-[11px] text-text-light/50 font-bold">({p.reviews})</span>
        </div>
        
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between mb-5">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-text-light/40 uppercase tracking-widest mb-0.5">From</span>
            <div className="font-display font-black text-xl text-primary-blue tracking-tighter">₹{p.price}</div>
          </div>
          <div className="text-sm text-text-light/40 line-through font-bold">₹{p.old}</div>
        </div>
        
        <Link to={p.link} className="md:hidden">
          <Button className="w-full h-12 rounded-xl text-[13px] font-black uppercase tracking-widest">Customize</Button>
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function Products() {
  const [searchParams] = useSearchParams();

  const [activeCats,    setActiveCats]    = useState(() => {
    const c = searchParams.get("category");
    return c ? new Set([c]) : new Set();
  });
  const [activePrices,  setActivePrices]  = useState(new Set());
  const [activeFinishes,setActiveFinishes]= useState(new Set());
  const [minRating,     setMinRating]     = useState(0);
  const [sortBy,        setSortBy]        = useState("trending");
  const [view,          setView]          = useState("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOpen,      setSortOpen]      = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const c = searchParams.get("category");
    if (c) setActiveCats(new Set([c]));
    else    setActiveCats(new Set());
  }, [searchParams]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCats, activePrices, activeFinishes, minRating, sortBy]);

  const filtered = useMemo(() => {
    let list = PRODUCTS;
    if (activeCats.size) list = list.filter(p => activeCats.has(p.category));
    if (activePrices.size) {
      const ranges = PRICE_RANGES.filter(r => activePrices.has(r.label));
      list = list.filter(p => ranges.some(r => p.price >= r.min && p.price <= r.max));
    }
    if (activeFinishes.size) list = list.filter(p => p.finish.some(f => activeFinishes.has(f.toLowerCase().replace(" ", "-"))));
    if (minRating > 0) list = list.filter(p => p.rating >= minRating);

    return [...list].sort((a, b) => {
      if (sortBy === "price-asc")  return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating")     return b.rating - a.rating;
      if (sortBy === "popular")    return b.reviews - a.reviews;
      return (b.pop ? 1 : 0) - (a.pop ? 1 : 0);
    });
  }, [activeCats, activePrices, activeFinishes, minRating, sortBy]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const activeFilterCount = activeCats.size + activePrices.size + activeFinishes.size + (minRating > 0 ? 1 : 0);
  function clearAll() { setActiveCats(new Set()); setActivePrices(new Set()); setActiveFinishes(new Set()); setMinRating(0); }
  const pageTitle = activeCats.size === 1 ? [...activeCats][0] : "Explore Collection";

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2 pb-6 border-b border-border">
        <span className="font-display font-black text-[13px] text-text-dark uppercase tracking-[0.2em] flex items-center gap-2">
          <Filter size={16} className="text-primary-blue" /> Filter Results
        </span>
        {activeFilterCount > 0 && (
          <button onClick={clearAll} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">Reset</button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
        <FilterSection title="Categories">
          {ALL_CATEGORIES.map(cat => {
            const active = activeCats.has(cat);
            return (
              <button key={cat} onClick={() => setActiveCats(s => toggle(s, cat))} className="w-full flex items-center justify-between group/item py-1">
                <span className={`text-[13px] font-bold transition-colors ${active ? "text-primary-blue" : "text-text-light group-hover/item:text-text-dark"}`}>{cat}</span>
                <div className={`w-2 h-2 rounded-full transition-all ${active ? "bg-primary-blue scale-125" : "bg-border group-hover/item:bg-primary-blue/30"}`}></div>
              </button>
            );
          })}
        </FilterSection>

        <FilterSection title="Price Range">
          {PRICE_RANGES.map(r => {
            const active = activePrices.has(r.label);
            return (
              <button key={r.label} onClick={() => setActivePrices(s => toggle(s, r.label))} className="w-full flex items-center justify-between group/item py-1">
                <span className={`text-[13px] font-bold transition-colors ${active ? "text-primary-blue" : "text-text-light group-hover/item:text-text-dark"}`}>{r.label}</span>
                <div className={`w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center ${active ? "border-primary-blue bg-primary-blue" : "border-border group-hover/item:border-primary-blue/30"}`}>
                  {active && <Check size={12} className="text-white" strokeWidth={4} />}
                </div>
              </button>
            );
          })}
        </FilterSection>

        <FilterSection title="Premium Finish">
          {FINISHES.map(f => {
            const key = f.toLowerCase().replace(" ", "-");
            const active = activeFinishes.has(key);
            return (
              <button key={f} onClick={() => setActiveFinishes(s => toggle(s, key))} className="w-full flex items-center justify-between group/item py-1">
                <span className={`text-[13px] font-bold transition-colors ${active ? "text-primary-blue" : "text-text-light group-hover/item:text-text-dark"}`}>{f}</span>
                <div className={`w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center ${active ? "border-primary-blue bg-primary-blue" : "border-border group-hover/item:border-primary-blue/30"}`}>
                  {active && <Check size={12} className="text-white" strokeWidth={4} />}
                </div>
              </button>
            );
          })}
        </FilterSection>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfd]">
      {/* S1: Premium Hero Header */}
      <section className="mesh-gradient border-b border-border pt-12 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-[100px] -mr-64 -mt-64"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Link to="/" className="text-[11px] font-black text-text-light/50 uppercase tracking-[0.2em] hover:text-primary-blue transition-colors">Home</Link>
            <ChevronRight size={10} className="text-text-light/20" />
            <span className="text-[11px] font-black text-primary-blue uppercase tracking-[0.2em]">Products</span>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-display font-black text-[48px] md:text-[64px] text-text-dark tracking-tighter leading-none mb-6">
              {pageTitle}
            </h1>
            <p className="text-lg text-text-light font-medium max-w-2xl leading-relaxed">
              Explore our curated selection of high-end print solutions designed to elevate your professional presence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* S2: Product Catalog Area */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-8">
          <div className="flex gap-12 items-start">
            
            {/* Sidebar — Desktop */}
            <aside className="hidden lg:block w-[260px] shrink-0 sticky top-28 h-fit bg-white/40 backdrop-blur-xl border border-border/50 rounded-[40px] p-8 shadow-xl shadow-gray-200/50">
              {sidebarContent}
            </aside>

            {/* Main Listing */}
            <div className="flex-1">
              
              {/* Controls Bar */}
              <div className="flex items-center justify-between mb-10 gap-6 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="text-[12px] font-black text-text-light/50 uppercase tracking-[0.2em]">{filtered.length} Results</div>
                  <div className="h-4 w-px bg-border"></div>
                  <button onClick={() => setMobileFiltersOpen(true)} className="lg:hidden flex items-center gap-2 text-[12px] font-black text-primary-blue uppercase tracking-widest">
                    <Filter size={14} /> Filter
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {/* View Toggles */}
                  <div className="flex bg-surface p-1 rounded-2xl border border-border">
                    <button onClick={() => setView("grid")} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${view === "grid" ? "bg-white shadow-sm text-primary-blue" : "text-text-light hover:text-text-dark"}`}>
                      <Grid3X3 size={18} />
                    </button>
                    <button onClick={() => setView("list")} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${view === "list" ? "bg-white shadow-sm text-primary-blue" : "text-text-light hover:text-text-dark"}`}>
                      <LayoutList size={18} />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <button onClick={() => setSortOpen(!sortOpen)} className="flex items-center gap-3 h-12 px-6 bg-white border border-border rounded-2xl text-[13px] font-black uppercase tracking-widest text-text-dark hover:border-primary-blue transition-all">
                      {SORT_OPTS.find(o => o.value === sortBy)?.label}
                      <ChevronDown size={14} strokeWidth={3} className={`transition-transform duration-300 ${sortOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {sortOpen && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-full mt-3 w-64 bg-white border border-border rounded-3xl shadow-2xl z-50 overflow-hidden p-2">
                          {SORT_OPTS.map(o => (
                            <button key={o.value} onClick={() => { setSortBy(o.value); setSortOpen(false); }} className={`w-full text-left px-5 py-3.5 rounded-2xl text-[13px] font-bold transition-all ${sortBy === o.value ? "bg-blue-50 text-primary-blue" : "text-text-light hover:bg-surface hover:text-text-dark"}`}>
                              {o.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {filtered.length === 0 ? (
                <div className="py-32 flex flex-col items-center text-center bg-surface/30 rounded-[40px] border border-dashed border-border">
                  <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center text-5xl mb-8">🔍</div>
                  <h3 className="font-display font-black text-2xl text-text-dark mb-4">No Matches Found</h3>
                  <p className="text-text-light max-w-xs mx-auto mb-10 font-medium leading-relaxed">Try adjusting your filters or resetting to explore the full collection.</p>
                  <Button onClick={clearAll} className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest">Reset Filters</Button>
                </div>
              ) : (
                <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }} initial="hidden" animate="show" className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8" : "flex flex-col gap-6"}>
                  {paginatedProducts.map(p => <ProductCard key={p.id} p={p} view={view} />)}
                </motion.div>
              )}

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="mt-20 flex items-center justify-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="w-12 h-12 rounded-2xl border border-border flex items-center justify-center text-text-dark hover:border-primary-blue hover:text-primary-blue disabled:opacity-30 disabled:hover:border-border disabled:hover:text-text-dark transition-all"
                  >
                    <ChevronRight className="rotate-180" size={20} strokeWidth={3} />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${
                          currentPage === page 
                            ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/20" 
                            : "bg-white border border-border text-text-light hover:border-primary-blue hover:text-primary-blue"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="w-12 h-12 rounded-2xl border border-border flex items-center justify-center text-text-dark hover:border-primary-blue hover:text-primary-blue disabled:opacity-30 disabled:hover:border-border disabled:hover:text-text-dark transition-all"
                  >
                    <ChevronRight size={20} strokeWidth={3} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* S3: Mobile Filter Sidebar */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileFiltersOpen(false)} />
            <motion.div className="fixed top-0 right-0 h-full w-[320px] bg-white z-[210] shadow-2xl flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex items-center justify-between mb-8">
                <span className="font-display font-black text-2xl text-text-dark">Filters</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-2 bg-surface rounded-xl">
                  <X size={20} strokeWidth={3} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {sidebarContent}
              </div>
              <div className="pt-8 flex flex-col gap-4">
                <Button className="w-full h-16 rounded-2xl font-black uppercase tracking-widest" onClick={() => setMobileFiltersOpen(false)}>Show Results</Button>
                <button onClick={clearAll} className="text-[11px] font-black text-red-500 uppercase tracking-widest text-center">Reset All</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Click outside sort closer */}
      {sortOpen && <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />}
    </div>
  );
}

function Check({ size, className, strokeWidth }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
