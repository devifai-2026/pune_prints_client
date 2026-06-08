import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X, ChevronDown, ChevronRight, ChevronLeft,
  Grid3X3, LayoutList, Star, Filter, Check, SlidersHorizontal, Loader2, Heart
} from "lucide-react";
import { list as listProducts } from "@/api/products";
import { list as listCategories } from "@/api/categories";
import { useWishlist } from "@/context/WishlistContext.jsx";

// --- Data ---

// Normalise an API product into the flat shape this page renders.
function normalize(p) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.categoryName || "",
    subcategory: p.subcategory || "",
    subcategoryName: p.subcategoryName || "",
    desc: p.description || "",
    price: p.basePrice,
    old: p.oldPrice || null,
    rating: p.rating || 0,
    reviews: p.reviewCount || 0,
    badge: p.badges?.[0] || null,
    image: p.images?.[0] || null,
  };
}

const PRICE_RANGES = [
  { label: "Under ₹250", min: 0, max: 249 },
  { label: "₹250 – ₹500", min: 250, max: 500 },
  { label: "₹500 – ₹1,000", min: 501, max: 1000 },
  { label: "₹1,000 – ₹2,000", min: 1001, max: 2000 },
  { label: "Above ₹2,000", min: 2001, max: Infinity },
];

const FINISHES = ["Glossy", "Matte", "Soft Touch"];

const SORT_OPTS = [
  { label: "Most Popular", value: "popular" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Highest Rated", value: "rating" },
  { label: "Newest", value: "new" },
];

// --- Helpers ---

function toggle(set, val) {
  const next = new Set(set);
  if (next.has(val)) next.delete(val);
  else next.add(val);
  return next;
}

// --- Components ---

function PlaceholderImage({ label, ratio = "aspect-square" }) {
  return (
    <div className={`${ratio} ph-image-solid relative overflow-hidden`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-text-muted px-2">
          <div className="w-10 h-10 mx-auto mb-1 border-2 border-text-muted/40 rounded-sm flex items-center justify-center text-[10px] font-semibold">IMG</div>
          {label && <div className="text-[11px] font-medium line-clamp-2">{label}</div>}
        </div>
      </div>
    </div>
  );
}

function StarRow({ rating, size = 12 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? "text-vp-yellow fill-vp-yellow" : "text-border"}
        />
      ))}
    </div>
  );
}

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="py-4 border-b border-border-light last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between mb-3">
        <span className="text-[13px] font-bold text-text-dark">{title}</span>
        <ChevronDown size={14} className={`text-text-light transition-transform ${open ? "" : "-rotate-90"}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Checkbox({ checked, onChange, label, count }) {
  return (
    <button onClick={onChange} className="w-full flex items-center gap-2.5 group py-1 text-left">
      <span className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors shrink-0 ${
        checked ? "bg-vp-blue border-vp-blue" : "border-border group-hover:border-vp-blue"
      }`}>
        {checked && <Check size={12} className="text-white" strokeWidth={3} />}
      </span>
      <span className={`text-[13px] flex-1 ${checked ? "text-vp-blue font-medium" : "text-text-dark group-hover:text-vp-blue"}`}>
        {label}
      </span>
      {count !== undefined && <span className="text-[11px] text-text-muted">({count})</span>}
    </button>
  );
}

function ProductCard({ p, view }) {
  const isList = view === "list";
  const navigate = useNavigate();
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(p.id);

  const onHeart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await toggle(p.id);
    if (res?.requiresAuth) navigate("/login", { state: { from: "/products" } });
  };

  return (
    <Link
      to={`/business-cards?slug=${encodeURIComponent(p.slug)}`}
      className={`group bg-white border border-border-light hover:border-vp-blue hover:shadow-card-hover transition-all rounded-sm overflow-hidden flex ${
        isList ? "flex-col sm:flex-row" : "flex-col"
      }`}
    >
      <div className={`relative ${isList ? "sm:w-[220px] sm:shrink-0" : ""}`}>
        {p.image ? (
          <div className={`${isList ? "aspect-[4/3] sm:aspect-square" : "aspect-square"} overflow-hidden bg-surface`}>
            <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        ) : (
          <PlaceholderImage label={p.name} ratio={isList ? "aspect-[4/3] sm:aspect-square" : "aspect-square"} />
        )}
        {p.badge && (
          <span className="absolute top-2 left-2 inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-semibold leading-none shadow-sm"
            style={{ background: p.badge.color || "#db1a3f", color: p.badge.textColor || "#ffffff" }}>
            {p.badge.label || p.badge.type}
          </span>
        )}
        {/* Wishlist heart */}
        <button
          onClick={onHeart}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-colors ${
            saved ? "bg-vp-red-light text-vp-red" : "bg-white/90 text-text-medium hover:text-vp-red"
          }`}
        >
          <Heart size={15} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="p-3 lg:p-4 flex-1 flex flex-col">
        <h3 className="text-[14px] font-semibold text-text-dark group-hover:text-vp-blue leading-tight mb-1 line-clamp-2 min-h-[36px]">
          {p.name}
        </h3>
        <p className="text-[12px] text-text-light mb-2 line-clamp-1">{p.desc}</p>
        <div className="flex items-center gap-1.5 mb-2">
          <StarRow rating={p.rating} />
          <span className="text-[11px] text-text-light">({p.reviews.toLocaleString("en-IN")})</span>
        </div>
        <div className="mt-auto pt-2 flex items-baseline justify-between">
          <div>
            <span className="text-[11px] text-text-light">From </span>
            <span className="text-[16px] font-bold text-vp-blue">₹{p.price}</span>
            {p.old && <span className="text-[12px] text-text-light line-through ml-1.5">₹{p.old}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

// --- Main Page ---

export default function Products() {
  const [searchParams] = useSearchParams();

  const [activeCats, setActiveCats] = useState(() => {
    const c = searchParams.get("category");
    return c ? new Set([c]) : new Set();
  });
  const [subFilter, setSubFilter] = useState(() => searchParams.get("subcategory") || "");
  const [activePrices, setActivePrices] = useState(new Set());
  const [sortBy, setSortBy] = useState("popular");
  const [view, setView] = useState("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Live data from the API.
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // [{name, slug}]
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadErr("");
      try {
        const [prods, cats] = await Promise.all([
          listProducts({ limit: 60 }),
          listCategories().catch(() => []),
        ]);
        if (cancelled) return;
        setProducts((prods || []).map(normalize));
        setCategories((cats || []).map((c) => ({ name: c.name, slug: c.slug, subcategories: c.subcategories || [] })));
      } catch (err) {
        if (!cancelled) setLoadErr(err?.message || "Failed to load products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const c = searchParams.get("category");
    if (c) setActiveCats(new Set([c]));
    else setActiveCats(new Set());
    setSubFilter(searchParams.get("subcategory") || "");
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCats, activePrices, sortBy, subFilter]);

  const ALL_CATEGORIES = useMemo(() => categories.map((c) => c.name), [categories]);

  const filtered = useMemo(() => {
    let list = products;
    if (activeCats.size) list = list.filter((p) => activeCats.has(p.category));
    if (subFilter) list = list.filter((p) => p.subcategory === subFilter);
    if (activePrices.size) {
      const ranges = PRICE_RANGES.filter((r) => activePrices.has(r.label));
      list = list.filter((p) => ranges.some((r) => p.price >= r.min && p.price <= r.max));
    }

    return [...list].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return b.reviews - a.reviews;
    });
  }, [products, activeCats, activePrices, sortBy, subFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const activeFilterCount = activeCats.size + activePrices.size + (subFilter ? 1 : 0);
  const clearAll = () => {
    setActiveCats(new Set());
    setActivePrices(new Set());
    setSubFilter("");
  };

  // Resolve the subcategory name (for the page title) from the loaded categories.
  const subFilterName = useMemo(() => {
    if (!subFilter) return "";
    for (const c of categories) {
      const sc = (c.subcategories || []).find((s) => s.slug === subFilter);
      if (sc) return sc.name;
    }
    return subFilter;
  }, [categories, subFilter]);

  const pageTitle = subFilterName || (activeCats.size === 1 ? [...activeCats][0] : "All Products");

  // Counts per facet
  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const sidebar = (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-bold text-text-dark flex items-center gap-1.5">
          <SlidersHorizontal size={14} /> Filter
        </h3>
        {activeFilterCount > 0 && (
          <button onClick={clearAll} className="text-[12px] text-vp-blue hover:underline font-medium">
            Clear all
          </button>
        )}
      </div>

      <FilterSection title="Category">
        {ALL_CATEGORIES.map((cat) => (
          <Checkbox
            key={cat}
            checked={activeCats.has(cat)}
            onChange={() => setActiveCats((s) => toggle(s, cat))}
            label={cat}
            count={categoryCounts[cat] || 0}
          />
        ))}
      </FilterSection>

      <FilterSection title="Price">
        {PRICE_RANGES.map((r) => (
          <Checkbox
            key={r.label}
            checked={activePrices.has(r.label)}
            onChange={() => setActivePrices((s) => toggle(s, r.label))}
            label={r.label}
          />
        ))}
      </FilterSection>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb + page header */}
      <div className="bg-surface-alt border-b border-border-light">
        <div className="max-w-[1400px] mx-auto px-4 py-3 text-[12px] text-text-light flex items-center gap-1.5">
          <Link to="/" className="hover:text-vp-blue">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-vp-blue">Products</Link>
          {activeCats.size === 1 && (
            <>
              <ChevronRight size={12} />
              <span className="text-text-dark">{pageTitle}</span>
            </>
          )}
        </div>
        <div className="max-w-[1400px] mx-auto px-4 pb-6">
          <h1 className="text-[26px] lg:text-[32px] font-bold text-text-dark tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-[14px] text-text-light mt-1">
            {filtered.length} {filtered.length === 1 ? "result" : "results"}
          </p>
        </div>
      </div>

      {/* Catalog */}
      <section className="py-6 lg:py-8">
        <div className="max-w-[1400px] mx-auto px-4 flex gap-8 items-start">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block w-[240px] shrink-0">
            <div className="sticky top-28">{sidebar}</div>
          </aside>

          {/* Listing */}
          <div className="flex-1 min-w-0">
            {/* Controls */}
            <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-border-light flex-wrap">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 h-9 px-3 text-[13px] font-medium border border-border rounded-sm text-text-dark hover:border-vp-blue"
              >
                <Filter size={14} /> Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 bg-vp-blue text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="hidden lg:flex items-center gap-2 flex-wrap">
                {[...activeCats].map((c) => (
                  <Badge key={c} variant="gray" className="inline-flex items-center gap-1.5 py-1 px-2.5">
                    {c}
                    <button onClick={() => setActiveCats((s) => toggle(s, c))} aria-label={`Remove ${c}`}>
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
                {[...activePrices].map((p) => (
                  <Badge key={p} variant="gray" className="inline-flex items-center gap-1.5 py-1 px-2.5">
                    {p}
                    <button onClick={() => setActivePrices((s) => toggle(s, p))} aria-label={`Remove ${p}`}>
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <div className="hidden sm:flex border border-border rounded-sm overflow-hidden">
                  <button
                    onClick={() => setView("grid")}
                    className={`w-9 h-9 flex items-center justify-center ${view === "grid" ? "bg-vp-blue text-white" : "text-text-dark hover:bg-surface"}`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={`w-9 h-9 flex items-center justify-center ${view === "list" ? "bg-vp-blue text-white" : "text-text-dark hover:bg-surface"}`}
                    aria-label="List view"
                  >
                    <LayoutList size={16} />
                  </button>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center gap-2 h-9 px-3 text-[13px] border border-border rounded-sm text-text-dark hover:border-vp-blue"
                  >
                    <span className="text-text-light">Sort:</span>
                    <span className="font-medium">{SORT_OPTS.find((o) => o.value === sortBy)?.label}</span>
                    <ChevronDown size={14} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {sortOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute right-0 top-full mt-1 w-56 bg-white border border-border rounded-sm shadow-card-hover z-30 overflow-hidden"
                      >
                        {SORT_OPTS.map((o) => (
                          <button
                            key={o.value}
                            onClick={() => { setSortBy(o.value); setSortOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-[13px] hover:bg-vp-blue-light ${
                              sortBy === o.value ? "text-vp-blue font-medium bg-vp-blue-light" : "text-text-dark"
                            }`}
                          >
                            {o.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="border border-border-light rounded-sm overflow-hidden">
                    <div className="aspect-square bg-surface animate-pulse" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-surface rounded animate-pulse" />
                      <div className="h-3 w-2/3 bg-surface rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : loadErr ? (
              <div className="py-16 text-center border border-border-light rounded-sm bg-surface-alt">
                <h3 className="text-[18px] font-semibold text-text-dark mb-2">Couldn't load products</h3>
                <p className="text-[14px] text-text-light">{loadErr}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center border border-border-light rounded-sm bg-surface-alt">
                <h3 className="text-[18px] font-semibold text-text-dark mb-2">No results found</h3>
                <p className="text-[14px] text-text-light mb-6">Try adjusting your filters.</p>
                <Button onClick={clearAll}>Clear all filters</Button>
              </div>
            ) : (
              <div className={view === "grid" ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4" : "flex flex-col gap-3"}>
                {paginated.map((p) => <ProductCard key={p.id} p={p} view={view} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => { setCurrentPage((p) => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="w-9 h-9 border border-border rounded-sm flex items-center justify-center text-text-dark hover:border-vp-blue hover:text-vp-blue disabled:opacity-40 disabled:hover:border-border disabled:hover:text-text-dark"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className={`min-w-[36px] h-9 px-2 text-[13px] font-medium rounded-sm border transition-colors ${
                        currentPage === page
                          ? "bg-vp-blue text-white border-vp-blue"
                          : "bg-white text-text-dark border-border hover:border-vp-blue hover:text-vp-blue"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => { setCurrentPage((p) => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="w-9 h-9 border border-border rounded-sm flex items-center justify-center text-text-dark hover:border-vp-blue hover:text-vp-blue disabled:opacity-40 disabled:hover:border-border disabled:hover:text-text-dark"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile filters drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-[200]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 h-full w-[320px] bg-white z-[210] shadow-2xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25 }}
            >
              <div className="px-4 py-3 border-b border-border-light flex items-center justify-between bg-vp-blue text-white">
                <span className="font-bold text-[15px]">Filters</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1" aria-label="Close filters">
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-3">{sidebar}</div>
              <div className="border-t border-border-light px-4 py-3 flex gap-3">
                <Button variant="secondary" onClick={clearAll} className="flex-1">Clear</Button>
                <Button onClick={() => setMobileFiltersOpen(false)} className="flex-1">
                  Show {filtered.length} results
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {sortOpen && <div className="fixed inset-0 z-20" onClick={() => setSortOpen(false)} />}
    </div>
  );
}
