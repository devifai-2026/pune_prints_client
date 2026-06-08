import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight, ChevronLeft, Star, Heart, Share2,
  Truck, RotateCcw, ShieldCheck, Check, Info, ChevronDown, Loader2, ImageIcon, ShoppingCart,
} from "lucide-react";
import { detail as fetchProduct, list as listProducts, share as shareProduct } from "@/api/products";
import HireDesignerModal from "@/components/HireDesignerModal.jsx";
import { useCart } from "@/context/CartContext.jsx";
import { useWishlist } from "@/context/WishlistContext.jsx";

const DEFAULT_SLUG = "premium-visiting-cards";

// Map an option's tagStyle to a Badge variant.
const TAG_VARIANT = { green: "green", yellow: "yellow", blue: "blue", red: "red" };

// --- Unit handling for size sublabels (e.g. '3.5" × 2"', "3.5cm x 2cm", "89mm x 51mm") ---
// To mm: inch ×25.4, cm ×10, mm ×1. Display rounds sensibly per unit.
const UNIT_TO_MM = { in: 25.4, cm: 10, mm: 1 };
const UNIT_LABEL = { in: '"', cm: "cm", mm: "mm" };

// Detect a unit token in a string. Returns "in" | "cm" | "mm" | null.
function detectUnit(str = "") {
  const s = str.toLowerCase();
  if (/(inch|in\b|")/.test(s)) return "in";
  if (/mm/.test(s)) return "mm";
  if (/cm/.test(s)) return "cm";
  return null;
}

// Convert a dimension sublabel to the target unit. Parses numbers + the
// separator (× or x) and re-renders them in `target`. Falls back to original.
function convertSublabel(sublabel, target) {
  if (!sublabel || !target) return sublabel;
  const from = detectUnit(sublabel);
  if (!from || from === target) return sublabel;
  const nums = sublabel.match(/[\d.]+/g);
  if (!nums || !nums.length) return sublabel;
  const conv = nums.map((n) => {
    const mm = parseFloat(n) * UNIT_TO_MM[from];
    const val = mm / UNIT_TO_MM[target];
    const rounded = target === "mm" ? Math.round(val) : Math.round(val * 100) / 100;
    return `${rounded}${UNIT_LABEL[target]}`;
  });
  return conv.join(" × ");
}

// --- Components ---

function PlaceholderImage({ label, ratio = "aspect-square" }) {
  return (
    <div className={`${ratio} ph-image-solid relative overflow-hidden`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-text-muted px-2">
          <div className="w-12 h-12 mx-auto mb-1 border-2 border-text-muted/40 rounded-sm flex items-center justify-center text-[11px] font-semibold">IMG</div>
          {label && <div className="text-[12px] font-medium">{label}</div>}
        </div>
      </div>
    </div>
  );
}

function StarRow({ rating, size = 14 }) {
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

function AccordionRow({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border-light">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-[14px] font-semibold text-text-dark">{title}</span>
        <ChevronDown size={16} className={`text-text-light transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-4 text-[13px] text-text-medium leading-relaxed">{children}</div>}
    </div>
  );
}

// Cartesian-match: find the variant matching the current option selection.
function findVariant(product, sel) {
  if (!product?.variants?.length) return null;
  const keys = (product.optionGroups || []).map((g) => g.key);
  return (
    product.variants.find((v) => keys.every((k) => String(v.combo?.[k]) === String(sel[k]))) ||
    product.variants.reduce((m, v) => (Number(v.price) < Number(m.price) ? v : m), product.variants[0])
  );
}

// --- Page ---

export default function PDP() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("slug") || DEFAULT_SLUG;

  const { addItem } = useCart();
  const { isSaved, toggle: toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [sel, setSel] = useState({});           // groupKey -> optionValue
  const [selectedImage, setSelectedImage] = useState(0);
  const [unitOverride, setUnitOverride] = useState(null); // null = show as-authored
  const [hireOpen, setHireOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [shareMsg, setShareMsg] = useState("");

  const isLiked = product ? isSaved(product.id) : false;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr("");
      setSelectedImage(0);
      try {
        const p = await fetchProduct(slug);
        if (cancelled) return;
        setProduct(p);
        // Default selection = first option of each group.
        const next = {};
        (p.optionGroups || []).forEach((g) => {
          const first = g.options?.[0];
          if (first) next[g.key] = first.value;
        });
        setSel(next);
        // Related = other products in the same category.
        listProducts({ category: p.category?.slug || p.categoryName, limit: 5 })
          .then((list) => !cancelled && setRelated((list || []).filter((x) => x.slug !== p.slug).slice(0, 4)))
          .catch(() => {});
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Product not found");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const variant = useMemo(() => findVariant(product, sel), [product, sel]);
  const price = variant ? Number(variant.price) : product?.basePrice || 0;
  const oldPrice = variant?.oldPrice ? Number(variant.oldPrice) : null;
  const savePct = price && oldPrice && oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : null;

  // Structured breakdown of the chosen options: [{ label, value }].
  const selectedOptions = useMemo(() => {
    if (!product?.optionGroups?.length) return [];
    return product.optionGroups
      .map((g) => {
        const opt = g.options?.find((o) => o.value === sel[g.key]);
        return opt ? { label: g.label, value: opt.label } : null;
      })
      .filter(Boolean);
  }, [product, sel]);

  // Human-readable variant label (e.g. "500 · Matte").
  const variantLabel = useMemo(() => selectedOptions.map((o) => o.value).join(" · "), [selectedOptions]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addItem({ product: product.id, variant: variantLabel, options: selectedOptions, unitPrice: price, qty: 1 });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    } catch {
      /* surfaced via the cart; keep the button usable */
    } finally {
      setAdding(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    const res = await toggleWishlist(product.id);
    if (res?.requiresAuth) navigate("/login", { state: { from: `/business-cards?slug=${slug}` } });
  };

  const handleShare = async () => {
    if (!product) return;
    try {
      // Record the share + get the canonical link from the backend.
      const { url, name } = await shareProduct(product.slug);
      const shareData = { title: name, text: `Check out ${name} on Pune Prints`, url };
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard?.writeText(url);
        setShareMsg("Link copied!");
        setTimeout(() => setShareMsg(""), 2000);
      }
    } catch {
      /* user cancelled the share sheet, or clipboard blocked — ignore */
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-[60vh] flex items-center justify-center text-text-light">
        <Loader2 size={20} className="animate-spin mr-2" /> Loading product…
      </div>
    );
  }
  if (err || !product) {
    return (
      <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-[20px] font-bold text-text-dark">{err || "Product not found"}</h1>
        <Link to="/products" className="text-vp-blue hover:underline text-[14px]">← Back to all products</Link>
      </div>
    );
  }

  // Gallery ALWAYS shows every photo: product photos first (no badge), then
  // every option's photos, each tagged with the option's label (e.g. "500
  // cards", "Rounded"). De-duplicated by src; the badge of the first owner wins.
  const gallery = (() => {
    const out = [];
    const seen = new Set();
    const push = (src, label) => {
      if (!src || seen.has(src)) return;
      seen.add(src);
      out.push({ src, label });
    };
    (product.images || []).forEach((src) => push(src, ""));
    (product.optionGroups || []).forEach((g) => {
      (g.options || []).forEach((o) => {
        (o.images || []).forEach((src) => push(src, o.label || o.value));
      });
    });
    return out;
  })();
  const safeIndex = selectedImage < gallery.length ? selectedImage : 0;

  // Picking an option jumps the gallery to that option's first photo so the
  // shopper sees it immediately (the photo was already visible in the strip).
  const selectOption = (groupKey, opt) => {
    setSel((s) => ({ ...s, [groupKey]: opt.value }));
    if (opt.images?.length) {
      const i = gallery.findIndex((g) => g.src === opt.images[0]);
      if (i >= 0) setSelectedImage(i);
    }
  };
  const primaryBadge = product.badges?.[0];
  const designUrl = `/design?product=${encodeURIComponent(product.name)}`;

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-surface-alt border-b border-border-light">
        <div className="max-w-[1400px] mx-auto px-4 py-3 text-[12px] text-text-light flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-vp-blue">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-vp-blue">Products</Link>
          {product.categoryName && (
            <>
              <ChevronRight size={12} />
              <Link to={`/products?category=${encodeURIComponent(product.categoryName)}`} className="hover:text-vp-blue">{product.categoryName}</Link>
            </>
          )}
          <ChevronRight size={12} />
          <span className="text-text-dark">{product.name}</span>
        </div>
      </div>

      {/* Main */}
      <section className="py-6 lg:py-10">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-8 lg:gap-12 items-start">
          {/* Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-3 lg:sticky lg:top-28">
            {/* Thumbnails — every option photo is always shown, with its tag */}
            <div className="order-2 sm:order-1 flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible no-scrollbar">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 border rounded-sm overflow-hidden transition-colors ${
                    safeIndex === i ? "border-vp-blue" : "border-border-light hover:border-text-light"
                  }`}
                  aria-label={g.label ? `View ${g.label}` : `View image ${i + 1}`}
                  title={g.label || undefined}
                >
                  <img src={g.src} alt="" className="w-full h-full object-cover" />
                  {g.label && (
                    <span className="absolute bottom-0 inset-x-0 bg-text-dark/70 text-white text-[8px] font-semibold leading-tight px-1 py-0.5 truncate text-center">
                      {g.label}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="order-1 sm:order-2 relative border border-border-light rounded-sm overflow-hidden">
              {gallery[safeIndex] ? (
                <div className="aspect-square bg-surface">
                  <img src={gallery[safeIndex].src} alt={product.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-square ph-image-solid flex items-center justify-center text-text-muted">
                  <ImageIcon size={36} />
                </div>
              )}
              {/* Badge on the main image telling which option this photo is for */}
              {gallery[safeIndex]?.label && (
                <span className="absolute top-3 left-3 inline-flex items-center rounded-sm bg-vp-blue text-white text-[11px] font-semibold px-2 py-1 shadow-sm">
                  {gallery[safeIndex].label}
                </span>
              )}
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button
                  onClick={handleToggleWishlist}
                  className={`w-9 h-9 border rounded-sm flex items-center justify-center transition-colors ${
                    isLiked ? "bg-vp-red-light border-vp-red text-vp-red" : "bg-white border-border text-text-medium hover:border-vp-blue hover:text-vp-blue"
                  }`}
                  aria-label="Save to wishlist"
                >
                  <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                </button>
                <div className="relative">
                  <button onClick={handleShare} className="w-9 h-9 bg-white border border-border rounded-sm flex items-center justify-center text-text-medium hover:border-vp-blue hover:text-vp-blue" aria-label="Share">
                    <Share2 size={16} />
                  </button>
                  {shareMsg && (
                    <span className="absolute right-0 top-full mt-1 whitespace-nowrap text-[11px] font-semibold text-vp-green-dark bg-white border border-border-light rounded-sm px-2 py-1 shadow-sm">
                      {shareMsg}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Configurator */}
          <div>
            {product.badges?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {product.badges.map((b, i) => (
                  <span key={i} className="inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-semibold leading-none"
                    style={{ background: b.color || "#1a56db", color: b.textColor || "#ffffff" }}>
                    {b.label || b.type}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-[26px] lg:text-[32px] font-bold text-text-dark leading-tight tracking-tight mb-2">
              {product.name}
            </h1>
            {(product.rating > 0 || product.reviewCount > 0) && (
              <div className="flex items-center gap-3 mb-4">
                <StarRow rating={product.rating} />
                <span className="text-[13px] text-text-dark font-semibold">{Number(product.rating).toFixed(1)}</span>
                <a href="#reviews" className="text-[13px] text-vp-blue hover:underline">{Number(product.reviewCount).toLocaleString("en-IN")} reviews</a>
              </div>
            )}
            {product.description && (
              <p className="text-[14px] text-text-medium leading-relaxed mb-6">{product.description}</p>
            )}

            {/* Price summary */}
            <div className="bg-surface-alt border border-border-light rounded-sm px-4 py-3 mb-6 flex items-baseline justify-between">
              <div>
                <span className="text-[12px] text-text-light">Total</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-[24px] font-bold text-vp-blue">₹{price.toLocaleString("en-IN")}</span>
                  {oldPrice && oldPrice > price && (
                    <span className="text-[13px] text-text-light line-through">₹{oldPrice.toLocaleString("en-IN")}</span>
                  )}
                </div>
              </div>
              {savePct != null && <Badge variant="green">Save {savePct}%</Badge>}
            </div>

            {/* Dynamic option groups */}
            {(product.optionGroups || []).map((g) => {
              // Detect which units appear across this group's sublabels.
              const unitsPresent = [...new Set((g.options || []).map((o) => detectUnit(o.sublabel)).filter(Boolean))];
              const showUnitSwap = unitsPresent.length > 1;
              const activeUnit = unitOverride || unitsPresent[0] || null;
              return (
              <div key={g.key} className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[13px] font-bold text-text-dark">{g.label}</label>
                  {showUnitSwap && (
                    <div className="inline-flex border border-border rounded-sm overflow-hidden">
                      {["in", "cm", "mm"].map((u) => (
                        <button key={u} onClick={() => setUnitOverride(u)}
                          className={`px-2 py-0.5 text-[11px] font-semibold transition-colors ${activeUnit === u ? "bg-vp-blue text-white" : "text-text-medium hover:bg-surface"}`}>
                          {u === "in" ? "inch" : u}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Quantity-style groups render as a radio list; others as a grid. */}
                {g.key === "quantity" ? (
                  <div className="border border-border-light rounded-sm overflow-hidden">
                    {g.options.map((o, idx) => {
                      const active = sel[g.key] === o.value;
                      const optPrice = findVariant(product, { ...sel, [g.key]: o.value })?.price;
                      return (
                        <button
                          key={o.value}
                          onClick={() => selectOption(g.key, o)}
                          className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${idx > 0 ? "border-t border-border-light" : ""} ${active ? "bg-vp-blue-light" : "hover:bg-surface-alt"}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${active ? "border-vp-blue" : "border-border"}`}>
                              {active && <span className="w-2 h-2 rounded-full bg-vp-blue" />}
                            </span>
                            <span className="text-[14px] font-medium text-text-dark">{o.label}</span>
                            {o.tag && <Badge variant={TAG_VARIANT[o.tagStyle] || "green"}>{o.tag}</Badge>}
                          </div>
                          {optPrice != null && <span className="text-[14px] font-bold text-vp-blue">₹{Number(optPrice).toLocaleString("en-IN")}</span>}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className={`grid gap-2 ${g.options.length >= 4 ? "grid-cols-2" : "grid-cols-3"}`}>
                    {g.options.map((o) => {
                      const active = sel[g.key] === o.value;
                      return (
                        <button
                          key={o.value}
                          onClick={() => selectOption(g.key, o)}
                          className={`text-left px-3 py-2.5 border rounded-sm transition-colors ${active ? "border-vp-blue bg-vp-blue-light" : "border-border hover:border-text-light"}`}
                        >
                          <div className="flex items-baseline justify-between gap-1">
                            <div className="text-[13px] font-semibold text-text-dark">{o.label}</div>
                            {Number(o.priceDelta) > 0 && <span className="text-[11px] text-text-light">+₹{o.priceDelta}</span>}
                          </div>
                          {o.sublabel && <div className="text-[11px] text-text-light">{showUnitSwap ? convertSublabel(o.sublabel, activeUnit) : o.sublabel}</div>}
                          {o.tag && <div className="mt-1"><Badge variant={TAG_VARIANT[o.tagStyle] || "green"}>{o.tag}</Badge></div>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              );
            })}

            {/* CTA */}
            <Button size="lg" className="w-full text-[15px]" onClick={() => navigate(designUrl)}>
              Start designing
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full text-[15px] mt-2 flex items-center justify-center gap-2"
              onClick={handleAddToCart}
              disabled={adding || addedToCart}
            >
              {adding ? <Loader2 size={16} className="animate-spin" /> : addedToCart ? <Check size={16} /> : <ShoppingCart size={16} />}
              {addedToCart ? "Added to cart" : `Add to cart · ₹${price.toLocaleString("en-IN")}`}
            </Button>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button variant="secondary" size="default" onClick={() => navigate(designUrl + "&tool=uploads")}>
                Upload your design
              </Button>
              <Button variant="ghost" size="default" onClick={() => setHireOpen(true)}>Hire a designer</Button>
            </div>
            <HireDesignerModal open={hireOpen} onClose={() => setHireOpen(false)} productType={product.name} />

            {/* Delivery */}
            <div className="mt-6 space-y-2 text-[13px]">
              <div className="flex items-center gap-2 text-text-medium">
                <Truck size={16} className="text-vp-blue shrink-0" />
                <span>Free delivery on orders above ₹500 · Express in 2–3 days</span>
              </div>
              <div className="flex items-center gap-2 text-text-medium">
                <RotateCcw size={16} className="text-vp-blue shrink-0" />
                <span>30-day satisfaction guarantee or reprint</span>
              </div>
              <div className="flex items-center gap-2 text-text-medium">
                <ShieldCheck size={16} className="text-vp-blue shrink-0" />
                <span>Secure payment · UPI, cards, net banking</span>
              </div>
            </div>

            {/* Details accordions — product details per-product, others global */}
            <div className="mt-8">
              <AccordionRow title="Product details" defaultOpen>
                {product.details?.length ? (
                  <ul className="space-y-1.5 list-disc list-inside">
                    {product.details.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                ) : <p>{product.description}</p>}
              </AccordionRow>
              <AccordionRow title="Design &amp; file requirements">
                <p className="whitespace-pre-line">{product.global?.designFileRequirements || "Contact us for file specifications."}</p>
              </AccordionRow>
              <AccordionRow title="Shipping &amp; returns">
                <p className="whitespace-pre-line">{product.global?.shippingReturns || "Standard shipping and returns apply."}</p>
              </AccordionRow>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews snapshot */}
      <section id="reviews" className="border-t border-border-light py-10 bg-surface-alt">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <h2 className="text-[22px] font-bold text-text-dark tracking-tight mb-2">Customer reviews</h2>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[36px] font-bold text-text-dark leading-none">{Number(product.rating || 0).toFixed(1)}</span>
              <div>
                <StarRow rating={product.rating} size={16} />
                <p className="text-[12px] text-text-light mt-1">Based on {Number(product.reviewCount || 0).toLocaleString("en-IN")} reviews</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="mt-3">Write a review</Button>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Rohan K.", date: "12 May 2026", rating: 5, text: "Print quality is excellent. Edges are crisp and the matte finish feels premium. Will reorder." },
              { name: "Sneha P.", date: "08 May 2026", rating: 5, text: "Designed online in 10 minutes, arrived in 4 days exactly as previewed. Recommended." },
              { name: "Arjun V.", date: "01 May 2026", rating: 4, text: "Good quality. Colors are slightly different from screen but still acceptable." },
              { name: "Anita S.", date: "28 Apr 2026", rating: 5, text: "Best prints I've used so far for client meetings. The finish is a standout." },
            ].map((r) => (
              <div key={r.name} className="bg-white border border-border-light rounded-sm p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-semibold text-text-dark">{r.name}</span>
                  <span className="text-[11px] text-text-light">{r.date}</span>
                </div>
                <StarRow rating={r.rating} size={12} />
                <p className="text-[13px] text-text-medium mt-2 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-border-light py-10 bg-white">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex items-end justify-between mb-5">
              <h2 className="text-[22px] font-bold text-text-dark tracking-tight">You might also like</h2>
              <Link to="/products" className="text-[13px] font-semibold text-vp-blue hover:underline flex items-center gap-1">
                See all <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/business-cards?slug=${encodeURIComponent(p.slug)}`}
                  className="group block bg-white border border-border-light hover:border-vp-blue hover:shadow-card-hover transition-all rounded-sm overflow-hidden"
                >
                  {p.images?.[0] ? (
                    <div className="aspect-square overflow-hidden bg-surface">
                      <img src={p.images[0]} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <PlaceholderImage label={p.name} ratio="aspect-square" />
                  )}
                  <div className="p-3 lg:p-4">
                    <h3 className="text-[14px] font-semibold text-text-dark group-hover:text-vp-blue leading-tight mb-1.5 min-h-[36px] line-clamp-2">{p.name}</h3>
                    <div className="flex items-center gap-1.5 mb-2">
                      <StarRow rating={p.rating} />
                      <span className="text-[11px] text-text-light">({Number(p.reviewCount || 0).toLocaleString("en-IN")})</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[15px] font-bold text-vp-blue">₹{p.basePrice}</span>
                      {p.oldPrice > p.basePrice && <span className="text-[12px] text-text-light line-through">₹{p.oldPrice}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
