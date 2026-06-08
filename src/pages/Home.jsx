import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronLeft, Truck, ShieldCheck, RotateCcw, Headphones, Star, ImageIcon } from "lucide-react";
import { list as listProducts } from "@/api/products";
import { list as listCategories } from "@/api/categories";
import { publicMap as fetchSettings } from "@/api/settings";
import HireDesignerModal from "@/components/HireDesignerModal.jsx";

// --- Components ---

function PlaceholderImage({ label, className = "", ratio = "aspect-[4/3]" }) {
  return (
    <div className={`${ratio} ph-image-solid relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-text-muted">
          <ImageIcon size={28} className="mx-auto mb-1 opacity-50" />
          {label && <div className="text-[11px] font-medium px-2">{label}</div>}
        </div>
      </div>
    </div>
  );
}

function StarRow({ rating, size = 12 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= Math.round(rating) ? "text-vp-yellow fill-vp-yellow" : "text-border"} />
      ))}
    </div>
  );
}

// --- Hero tile (auto-playing carousel inside each tile) ---
// A "tile" is one slide; it cross-fades through `frames[]`. Each frame carries
// its own image AND its own text/button, so the copy changes with the image.
// Falls back to the old per-slide shape (slide.images + slide.title…) if present.

function framesFromSlide(slide) {
  if (Array.isArray(slide.frames) && slide.frames.length) return slide.frames;
  // Back-compat: build frames from the old images[] + slide-level text.
  const imgs = slide.images?.length ? slide.images : [null];
  return imgs.map((image) => ({ image, eyebrow: slide.eyebrow, title: slide.title, subtitle: slide.subtitle, cta: slide.cta, href: slide.href }));
}

function HeroTileCarousel({ slide, autoStartMs = 0 }) {
  const [index, setIndex] = useState(0);
  const frames = framesFromSlide(slide);
  const total = frames.length;

  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % total), 5000 + autoStartMs);
    return () => clearInterval(id);
  }, [autoStartMs, total]);

  const frame = frames[Math.min(index, total - 1)] || {};
  const cta = frame.cta || "Shop now";
  const href = frame.href || "/products";

  return (
    <div className="relative overflow-hidden aspect-[16/11] md:aspect-[5/3] lg:aspect-[16/9]" style={{ background: slide.bg || "#eaf0fb" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/25 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-black/10 blur-3xl" />
      </div>

      {/* Full-bleed cross-faded image (per frame) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {frame.image ? (
            <img src={frame.image} alt={frame.title || ""} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-text-light/70">
              <ImageIcon size={32} className="opacity-50 mb-1" />
              <div className="text-[12px] font-medium">{frame.title}</div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Foreground content card — text/button come from the CURRENT frame; admin can hide via showText */}
      {slide.showText !== false && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent pointer-events-none" />
          <AnimatePresence mode="wait">
            <motion.div
              key={`txt-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-5 left-5 right-5 md:right-auto md:max-w-[360px] bg-white/95 backdrop-blur-sm rounded-md p-5 shadow-card-hover"
            >
              {frame.eyebrow && <p className="text-[11px] font-semibold uppercase tracking-wide mb-1.5 text-text-medium">{frame.eyebrow}</p>}
              <h2 className="text-[22px] md:text-[26px] font-bold text-text-dark leading-tight mb-1.5">{frame.title}</h2>
              {frame.subtitle && <p className="text-[13px] text-text-medium mb-4">{frame.subtitle}</p>}
              <Link to={href}>
                <Button size="sm" className="bg-text-dark hover:bg-black">{cta}</Button>
              </Link>
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {/* Dots */}
      {total > 1 && (
        <div className="absolute bottom-5 right-5 flex items-center gap-1.5">
          {frames.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} aria-label={`Frame ${i + 1}`}
              className={`h-1.5 rounded-full transition-all shadow ${i === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"}`} />
          ))}
        </div>
      )}
    </div>
  );
}

// --- Page ---

export default function Home() {
  const [home, setHome] = useState(null);
  const [categories, setCategories] = useState([]);
  const [popular, setPopular] = useState([]);
  const [hireOpen, setHireOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [settings, cats, prods] = await Promise.all([
        fetchSettings().catch(() => ({})),
        listCategories().catch(() => []),
        listProducts({ limit: 8 }).catch(() => []),
      ]);
      if (cancelled) return;
      setHome(settings?.home_content || null);
      setCategories(cats || []);
      setPopular(prods || []);
    })();
    return () => { cancelled = true; };
  }, []);

  const promo = home?.promo;
  const heroSlides = home?.hero?.slides || [];
  const promos = home?.promos || [];
  const design = home?.designStrip;
  const testimonials = home?.testimonials;
  const reviews = testimonials?.items || [];
  const trust = home?.trust;
  const TRUST_ICONS = { truck: Truck, shield: ShieldCheck, returns: RotateCcw, support: Headphones };
  const trustItems = (trust?.items?.length ? trust.items : [
    { icon: "truck", title: "Free delivery", desc: "On orders above ₹500" },
    { icon: "shield", title: "100% guarantee", desc: "Or we'll reprint your order" },
    { icon: "returns", title: "Easy returns", desc: "Within 30 days" },
    { icon: "support", title: "Expert help", desc: "Free design support" },
  ]);

  return (
    <div className="bg-white">
      {/* Promo strip */}
      {promo?.enabled !== false && promo?.text && (
        <div className="bg-text-dark text-white text-center py-2 text-[13px]">
          {promo.text}
          {promo.code && <> <span className="mx-2">|</span> Code: <span className="font-bold">{promo.code}</span></>}
        </div>
      )}

      {/* Hero — slides side by side, each cross-fading its images.
          layout: "full" = full page width · "centered" = constrained max width */}
      {heroSlides.length > 0 && (
        <section className="bg-gradient-to-b from-vp-blue-light/60 via-vp-blue-light/30 to-white">
          <div className={home?.hero?.layout === "centered" ? "max-w-[1400px] mx-auto px-4 py-6" : ""}>
            <div className={`grid grid-cols-1 ${heroSlides.length > 1 ? "md:grid-cols-2" : ""} gap-0 ${home?.hero?.layout === "centered" ? "gap-4 md:gap-4 rounded-lg overflow-hidden" : ""}`}>
              {heroSlides.map((slide, i) => (
                <div key={i} className={`group ${home?.hero?.layout === "centered" ? "rounded-lg overflow-hidden shadow-card" : ""}`}>
                  <HeroTileCarousel slide={slide} autoStartMs={i * 1200} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust strip — dynamic, admin can hide via home_content.trust.enabled */}
      {trust?.enabled !== false && trustItems.length > 0 && (
        <section className="border-b border-border-light bg-white">
          <div className="max-w-[1400px] mx-auto px-4 py-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            {trustItems.map((item, i) => {
              const Icon = TRUST_ICONS[item.icon] || Truck;
              return (
                <div key={i} className="flex items-center justify-center lg:justify-start gap-3 py-2">
                  <Icon size={28} strokeWidth={1.5} className="text-vp-blue shrink-0" />
                  <div className="text-left">
                    <div className="text-[13px] font-semibold text-text-dark leading-tight">{item.title}</div>
                    <div className="text-[12px] text-text-light leading-tight">{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Shop by category — live from /categories */}
      <section className="py-10 lg:py-14">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-[24px] lg:text-[28px] font-bold text-text-dark tracking-tight">Explore all categories</h2>
              <p className="text-[14px] text-text-light mt-1">Customize anything you can imagine</p>
            </div>
            <Link to="/products" className="hidden md:flex items-center gap-1 text-[13px] font-semibold text-vp-blue hover:underline">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group block bg-white border border-border-light hover:border-vp-blue hover:shadow-card-hover transition-all rounded-sm overflow-hidden">
                {cat.image ? (
                  <div className="aspect-square overflow-hidden bg-surface">
                    <img src={cat.image} alt={cat.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                ) : <PlaceholderImage label={cat.name} ratio="aspect-square" />}
                <div className="p-3 lg:p-4">
                  <h3 className="text-[14px] font-semibold text-text-dark group-hover:text-vp-blue leading-tight">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Two-up promo banners — from home_content */}
      {promos.length > 0 && (
        <section className="py-6 lg:py-10 bg-surface-alt">
          <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {promos.map((deal, i) => (
              <div key={i} className="bg-white border border-border-light rounded-sm overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/2">
                  {deal.image ? (
                    <div className="aspect-[4/3] h-full bg-surface"><img src={deal.image} alt={deal.title} className="w-full h-full object-cover" /></div>
                  ) : <PlaceholderImage label={deal.title} ratio="aspect-[4/3]" />}
                </div>
                <div className="p-5 md:p-6 md:w-1/2 flex flex-col justify-center">
                  {deal.eyebrow && <p className="text-[12px] font-semibold text-vp-red uppercase tracking-wide mb-2">{deal.eyebrow}</p>}
                  <h3 className="text-[20px] font-bold text-text-dark leading-tight mb-2">{deal.title}</h3>
                  {deal.desc && <p className="text-[13px] text-text-light mb-4">{deal.desc}</p>}
                  <Link to={deal.href || "/products"}><Button variant="secondary" size="sm">{deal.cta || "Shop"}</Button></Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Popular products — live from /products */}
      {popular.length > 0 && (
        <section className="py-10 lg:py-14">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-[24px] lg:text-[28px] font-bold text-text-dark tracking-tight">Top-rated products</h2>
                <p className="text-[14px] text-text-light mt-1">Loved by customers across India</p>
              </div>
              <Link to="/products" className="hidden md:flex items-center gap-1 text-[13px] font-semibold text-vp-blue hover:underline">
                See all products <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
              {popular.map((p) => {
                const badge = p.badges?.[0];
                return (
                  <Link key={p.id} to={`/business-cards?slug=${encodeURIComponent(p.slug)}`}
                    className="group block bg-white border border-border-light hover:border-vp-blue hover:shadow-card-hover transition-all rounded-sm overflow-hidden">
                    <div className="relative">
                      {p.images?.[0] ? (
                        <div className="aspect-square overflow-hidden bg-surface"><img src={p.images[0]} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div>
                      ) : <PlaceholderImage label={p.name} ratio="aspect-square" />}
                      {badge && <span className="absolute top-2 left-2 inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-semibold leading-none shadow-sm" style={{ background: badge.color || "#db1a3f", color: badge.textColor || "#ffffff" }}>{badge.label || badge.type}</span>}
                    </div>
                    <div className="p-3 lg:p-4">
                      <h3 className="text-[14px] font-semibold text-text-dark group-hover:text-vp-blue leading-tight mb-1.5 line-clamp-2 min-h-[36px]">{p.name}</h3>
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
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Design services strip — from home_content */}
      {design?.enabled !== false && (
        <section className="bg-vp-blue text-white py-10 lg:py-14">
          <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              {design?.eyebrow && <p className="text-[12px] font-semibold text-vp-yellow uppercase tracking-wide mb-3">{design.eyebrow}</p>}
              <h2 className="text-[28px] lg:text-[36px] font-bold leading-[1.15] mb-4">{design?.title || "Free design consultation with every order"}</h2>
              {design?.desc && <p className="text-[14px] text-white/85 mb-6 max-w-md">{design.desc}</p>}
              <div className="flex flex-wrap gap-3">
                {design?.primaryCta?.label && (
                  <Link to={design.primaryCta.href || "/design"}><Button variant="yellow" size="lg">{design.primaryCta.label}</Button></Link>
                )}
                {design?.secondaryCta?.label && (
                  /^(#hire|\/hire)/.test(design.secondaryCta.href || "") || /design|hire/i.test(design.secondaryCta.label) ? (
                    <Button size="lg" className="bg-transparent border border-white hover:bg-white hover:text-vp-blue" onClick={() => setHireOpen(true)}>
                      {design.secondaryCta.label}
                    </Button>
                  ) : (
                    <Link to={design.secondaryCta.href || "/products"}>
                      <Button size="lg" className="bg-transparent border border-white hover:bg-white hover:text-vp-blue">{design.secondaryCta.label}</Button>
                    </Link>
                  )
                )}
              </div>
            </div>
            {design?.image ? (
              <div className="aspect-[5/4] rounded-sm overflow-hidden"><img src={design.image} alt="" className="w-full h-full object-cover" /></div>
            ) : <PlaceholderImage label="Designer at work" ratio="aspect-[5/4]" className="rounded-sm" />}
          </div>
        </section>
      )}

      {/* Testimonials — from home_content */}
      {testimonials?.enabled !== false && reviews.length > 0 && (
        <section className="py-10 lg:py-14 bg-white">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-[24px] lg:text-[28px] font-bold text-text-dark tracking-tight">{testimonials?.heading || "What our customers say"}</h2>
              <div className="flex items-center justify-center gap-2 mt-2 text-[13px] text-text-light">
                <StarRow rating={testimonials?.rating || 5} size={14} />
                <span className="font-semibold text-text-dark">{Number(testimonials?.rating || 0).toFixed(1)} / 5</span>
                {testimonials?.reviewCount > 0 && <span>· Based on {Number(testimonials.reviewCount).toLocaleString("en-IN")} reviews</span>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reviews.map((t, i) => (
                <div key={i} className="border border-border-light rounded-sm p-5 bg-white">
                  <StarRow rating={t.rating || 5} />
                  <p className="text-[14px] text-text-dark mt-3 mb-4 leading-relaxed">"{t.text}"</p>
                  <div className="text-[13px] font-semibold text-text-dark">{t.name}</div>
                  {t.role && <div className="text-[12px] text-text-light">{t.role}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <HireDesignerModal open={hireOpen} onClose={() => setHireOpen(false)} />
    </div>
  );
}
