import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronLeft, Truck, ShieldCheck, RotateCcw, Headphones, Star } from "lucide-react";

// --- Hero tile data (each tile is its own auto-playing carousel) ---

const HERO_TILES = [
  {
    side: "left",
    bg: "linear-gradient(135deg, #f4ebe1 0%, #e8d9c4 50%, #d9c4a3 100%)",
    accent: "text-[#5a3a1a]",
    slides: [
      {
        eyebrow: "Bestseller",
        title: "Visiting Cards",
        priceLine: "100 cards starting at ₹200",
        cta: "Shop now",
        href: "/products?category=Visiting%20Cards",
        imageLabel: "Visiting cards",
      },
      {
        eyebrow: "Premium finish",
        title: "Spot UV Cards",
        priceLine: "Glossy highlights from ₹299",
        cta: "Explore",
        href: "/business-cards",
        imageLabel: "Spot UV cards",
      },
      {
        eyebrow: "New design",
        title: "Square Cards",
        priceLine: "Modern 2.5\" × 2.5\" from ₹249",
        cta: "Customise",
        href: "/business-cards",
        imageLabel: "Square cards",
      },
    ],
  },
  {
    side: "right",
    bg: "linear-gradient(135deg, #f5dad3 0%, #e8b4ac 45%, #b88078 100%)",
    accent: "text-[#5a2018]",
    slides: [
      {
        eyebrow: "Stay dry, look sharp",
        title: "Custom rainwear",
        priceLine: "Starting at ₹655",
        cta: "Shop rainwear",
        href: "/products?category=Umbrellas",
        imageLabel: "Custom rainwear",
        secondaryCtas: [
          { label: "Umbrellas", href: "/products?category=Umbrellas" },
          { label: "Raincoats", href: "/products?category=Raincoats" },
        ],
      },
      {
        eyebrow: "Wardrobe staples",
        title: "Custom T-Shirts",
        priceLine: "100% cotton from ₹399",
        cta: "Design yours",
        href: "/products?category=T-Shirts",
        imageLabel: "Custom t-shirts",
      },
      {
        eyebrow: "Corporate gifting",
        title: "Printed mugs",
        priceLine: "Ceramic mugs from ₹249",
        cta: "Shop mugs",
        href: "/products?category=Mugs",
        imageLabel: "Printed mugs",
      },
    ],
  },
];

// --- Data ---

const CATEGORY_TILES = [
  { name: "Visiting Cards", from: "₹149", to: "/products?category=Visiting%20Cards" },
  { name: "Flyers & Leaflets", from: "₹299", to: "/products?category=Flyers" },
  { name: "Banners & Posters", from: "₹499", to: "/products?category=Banners" },
  { name: "Letterheads", from: "₹199", to: "/products?category=Stationery" },
  { name: "Stickers & Labels", from: "₹99", to: "/products?category=Stickers" },
  { name: "Custom T-Shirts", from: "₹399", to: "/products?category=T-Shirts" },
  { name: "Mugs", from: "₹249", to: "/products?category=Mugs" },
  { name: "Brochures", from: "₹449", to: "/products?category=Brochures" },
];

const POPULAR_PRODUCTS = [
  { name: "Standard Visiting Cards", price: "149", old: "299", reviews: 4823, rating: 4.7 },
  { name: "Spot UV Visiting Cards", price: "299", old: "499", reviews: 1247, rating: 4.8, tag: "Popular" },
  { name: "A5 Flyers", price: "499", old: "699", reviews: 2341, rating: 4.6 },
  { name: "Tri-fold Brochures", price: "799", old: "1,099", reviews: 892, rating: 4.7 },
  { name: "Roll-up Banners", price: "1,299", old: "1,899", reviews: 1102, rating: 4.9, tag: "Best Seller" },
  { name: "Custom Mugs", price: "249", old: "399", reviews: 1532, rating: 4.6 },
  { name: "Vinyl Stickers", price: "99", old: "149", reviews: 3421, rating: 4.7 },
  { name: "Letterheads A4", price: "199", old: "299", reviews: 723, rating: 4.5 },
];

const DEALS = [
  { eyebrow: "Save 50%", title: "Premium Visiting Cards", desc: "Double-sided · 350gsm · Free design help", cta: "Shop cards" },
  { eyebrow: "New", title: "Custom Apparel", desc: "T-shirts, polos and caps from ₹299", cta: "Shop apparel" },
];

// --- Components ---

function PlaceholderImage({ label, className = "", ratio = "aspect-[4/3]" }) {
  return (
    <div className={`${ratio} ph-image-solid relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-text-muted">
          <div className="w-10 h-10 mx-auto mb-1 border-2 border-text-muted/40 rounded-sm flex items-center justify-center text-[10px] font-semibold">IMG</div>
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
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? "text-vp-yellow fill-vp-yellow" : "text-border"}
        />
      ))}
    </div>
  );
}

// --- Hero tile (auto-playing carousel inside each tile) ---

function HeroTileCarousel({ tile, autoStartMs = 0 }) {
  const [index, setIndex] = useState(0);
  const total = tile.slides.length;

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % total), 6000 + autoStartMs);
    return () => clearInterval(id);
  }, [autoStartMs, total]);

  const slide = tile.slides[index];

  return (
    <div
      className="relative overflow-hidden aspect-[16/11] md:aspect-[5/3] lg:aspect-[16/9]"
      style={{ background: tile.bg }}
    >
      {/* Decorative blurred orbs to add depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/25 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-black/10 blur-3xl" />
      </div>

      {/* Crossfaded slide imagery */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Stylised placeholder "product" — colored block + IMG label, layered so it doesn't read as gray emptiness */}
          <div className="relative w-[55%] aspect-[4/3] max-w-[440px]">
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-sm shadow-card-hover rotate-[-2deg]" />
            <div className="absolute inset-0 bg-white rounded-sm shadow-card flex flex-col items-center justify-center text-text-light translate-y-2 translate-x-2">
              <div className="w-14 h-14 mb-2 border-2 border-text-muted/40 rounded-sm flex items-center justify-center text-[11px] font-semibold">IMG</div>
              <div className="text-[12px] font-medium px-3 text-center">{slide.imageLabel}</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Foreground content card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`text-${index}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-5 left-5 right-5 md:right-auto md:max-w-[340px] bg-white rounded-sm p-5 shadow-card-hover"
        >
          <p className={`text-[11px] font-semibold uppercase tracking-wide mb-1.5 ${tile.accent}`}>
            {slide.eyebrow}
          </p>
          <h2 className="text-[22px] md:text-[24px] font-bold text-text-dark leading-tight mb-1.5">
            {slide.title}
          </h2>
          <p className="text-[13px] text-text-medium mb-4">{slide.priceLine}</p>
          {slide.secondaryCtas ? (
            <div className="flex gap-2">
              {slide.secondaryCtas.map((c) => (
                <Link key={c.label} to={c.href}>
                  <Button size="sm" className="bg-text-dark hover:bg-black">{c.label}</Button>
                </Link>
              ))}
            </div>
          ) : (
            <Link to={slide.href}>
              <Button size="sm" className="bg-text-dark hover:bg-black">{slide.cta}</Button>
            </Link>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="absolute bottom-5 right-5 flex items-center gap-1.5">
        {tile.slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-text-dark" : "w-1.5 bg-text-dark/30 hover:bg-text-dark/60"
            }`}
          />
        ))}
      </div>

      {/* Arrows (hover) */}
      <button
        onClick={() => setIndex((i) => (i - 1 + total) % total)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-white text-text-dark hover:bg-white shadow-card flex items-center justify-center opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={() => setIndex((i) => (i + 1) % total)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-white text-text-dark hover:bg-white shadow-card flex items-center justify-center opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// --- Page ---

export default function Home() {
  return (
    <div className="bg-white">
      {/* Promo strip */}
      <div className="bg-text-dark text-white text-center py-2 text-[13px]">
        Buy More, Save More! Flat 5% OFF on Orders ₹10,000+ <span className="mx-2">|</span> Code: <span className="font-bold">SAVE5</span>
      </div>

      {/* Hero — full-bleed two-up banner with internal carousels */}
      <section className="bg-gradient-to-b from-vp-blue-light/60 via-vp-blue-light/30 to-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {HERO_TILES.map((tile, i) => (
            <div key={tile.side} className="group">
              <HeroTileCarousel tile={tile} autoStartMs={i * 1500} />
            </div>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-border-light bg-white">
        <div className="max-w-[1400px] mx-auto px-4 py-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          {[
            { icon: Truck, title: "Free delivery", desc: "On orders above ₹500" },
            { icon: ShieldCheck, title: "100% guarantee", desc: "Or we'll reprint your order" },
            { icon: RotateCcw, title: "Easy returns", desc: "Within 30 days" },
            { icon: Headphones, title: "Expert help", desc: "Free design support" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center justify-center lg:justify-start gap-3 py-2">
              <Icon size={28} strokeWidth={1.5} className="text-vp-blue shrink-0" />
              <div className="text-left">
                <div className="text-[13px] font-semibold text-text-dark leading-tight">{title}</div>
                <div className="text-[12px] text-text-light leading-tight">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by category */}
      <section className="py-10 lg:py-14">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-[24px] lg:text-[28px] font-bold text-text-dark tracking-tight">
                Explore all categories
              </h2>
              <p className="text-[14px] text-text-light mt-1">Customize anything you can imagine</p>
            </div>
            <Link to="/products" className="hidden md:flex items-center gap-1 text-[13px] font-semibold text-vp-blue hover:underline">
              View all <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            {CATEGORY_TILES.map((cat) => (
              <Link
                key={cat.name}
                to={cat.to}
                className="group block bg-white border border-border-light hover:border-vp-blue hover:shadow-card-hover transition-all rounded-sm overflow-hidden"
              >
                <PlaceholderImage label={cat.name} ratio="aspect-square" />
                <div className="p-3 lg:p-4">
                  <h3 className="text-[14px] font-semibold text-text-dark group-hover:text-vp-blue leading-tight mb-0.5">
                    {cat.name}
                  </h3>
                  <p className="text-[12px] text-text-light">From {cat.from}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Two-up promo */}
      <section className="py-6 lg:py-10 bg-surface-alt">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEALS.map((deal) => (
            <div key={deal.title} className="bg-white border border-border-light rounded-sm overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <PlaceholderImage label={deal.title} ratio="aspect-[4/3]" />
              </div>
              <div className="p-5 md:p-6 md:w-1/2 flex flex-col justify-center">
                <p className="text-[12px] font-semibold text-vp-red uppercase tracking-wide mb-2">{deal.eyebrow}</p>
                <h3 className="text-[20px] font-bold text-text-dark leading-tight mb-2">{deal.title}</h3>
                <p className="text-[13px] text-text-light mb-4">{deal.desc}</p>
                <Link to="/products">
                  <Button variant="secondary" size="sm">{deal.cta}</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular products */}
      <section className="py-10 lg:py-14">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-[24px] lg:text-[28px] font-bold text-text-dark tracking-tight">
                Top-rated products
              </h2>
              <p className="text-[14px] text-text-light mt-1">Loved by 10 million+ customers worldwide</p>
            </div>
            <Link to="/products" className="hidden md:flex items-center gap-1 text-[13px] font-semibold text-vp-blue hover:underline">
              See all products <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {POPULAR_PRODUCTS.map((p) => (
              <Link
                key={p.name}
                to="/business-cards"
                className="group block bg-white border border-border-light hover:border-vp-blue hover:shadow-card-hover transition-all rounded-sm overflow-hidden"
              >
                <div className="relative">
                  <PlaceholderImage label={p.name} ratio="aspect-square" />
                  {p.tag && (
                    <Badge variant="red" className="absolute top-2 left-2">{p.tag}</Badge>
                  )}
                </div>
                <div className="p-3 lg:p-4">
                  <h3 className="text-[14px] font-semibold text-text-dark group-hover:text-vp-blue leading-tight mb-1.5 line-clamp-2 min-h-[36px]">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mb-2">
                    <StarRow rating={p.rating} />
                    <span className="text-[11px] text-text-light">({p.reviews.toLocaleString("en-IN")})</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[15px] font-bold text-vp-blue">₹{p.price}</span>
                    <span className="text-[12px] text-text-light line-through">₹{p.old}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Design services strip */}
      <section className="bg-vp-blue text-white py-10 lg:py-14">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-[12px] font-semibold text-vp-yellow uppercase tracking-wide mb-3">Need help designing?</p>
            <h2 className="text-[28px] lg:text-[36px] font-bold leading-[1.15] mb-4">
              Free design consultation with every order
            </h2>
            <p className="text-[14px] text-white/85 mb-6 max-w-md">
              Upload your file, choose a template, or work one-on-one with our designers. We'll make sure your project looks perfect before it prints.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="yellow" size="lg">Start designing</Button>
              <Button size="lg" className="bg-transparent border border-white hover:bg-white hover:text-vp-blue">
                Hire a designer
              </Button>
            </div>
          </div>
          <PlaceholderImage label="Designer at work" ratio="aspect-[5/4]" className="rounded-sm" />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 lg:py-14 bg-white">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-[24px] lg:text-[28px] font-bold text-text-dark tracking-tight">What our customers say</h2>
            <div className="flex items-center justify-center gap-2 mt-2 text-[13px] text-text-light">
              <StarRow rating={5} size={14} />
              <span className="font-semibold text-text-dark">4.8 / 5</span>
              <span>· Based on 84,392 reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Sarah J.", role: "Small Business Owner", text: "The visiting cards arrived in 3 days and the print quality is outstanding. Will order again." },
              { name: "Rohan K.", role: "Startup Founder", text: "Easy design tool, great prices, and they showed up exactly as previewed. Highly recommend." },
              { name: "Priya M.", role: "Event Planner", text: "I order flyers and banners every month — consistent quality and reliable delivery every time." },
            ].map((t) => (
              <div key={t.name} className="border border-border-light rounded-sm p-5 bg-white">
                <StarRow rating={5} />
                <p className="text-[14px] text-text-dark mt-3 mb-4 leading-relaxed">"{t.text}"</p>
                <div className="text-[13px] font-semibold text-text-dark">{t.name}</div>
                <div className="text-[12px] text-text-light">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
