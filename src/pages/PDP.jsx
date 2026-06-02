import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight, ChevronLeft, Star, Heart, Share2,
  Truck, RotateCcw, ShieldCheck, Check, Info, ChevronDown,
} from "lucide-react";

// --- Data ---

const sizeOptions = [
  { id: "standard", label: "Standard", sub: '3.5" × 2"' },
  { id: "square", label: "Square", sub: '2.5" × 2.5"' },
  { id: "mini", label: "Slim", sub: '3.5" × 1.75"' },
];

const paperOptions = [
  { id: "matte", label: "Matte", sub: "Premium 350gsm", priceDelta: 0 },
  { id: "glossy", label: "Glossy", sub: "Vivid colors", priceDelta: 0 },
  { id: "soft", label: "Soft Touch", sub: "Velvet feel", priceDelta: 80 },
  { id: "recycled", label: "Recycled", sub: "Eco-friendly", priceDelta: 40 },
];

const qtyOptions = [
  { q: 100, price: 149, save: null },
  { q: 250, price: 299, save: "20%" },
  { q: 500, price: 499, save: "30%", popular: true },
  { q: 1000, price: 899, save: "40%" },
  { q: 2500, price: 1899, save: "50%" },
];

const thumbnails = [
  { label: "Front view" },
  { label: "Back view" },
  { label: "Stacked" },
  { label: "In hand" },
  { label: "Close-up" },
];

const RELATED = [
  { name: "A5 Flyers", price: "499", old: "699", reviews: 2341, rating: 4.6 },
  { name: "Letterheads A4", price: "199", old: "299", reviews: 723, rating: 4.5 },
  { name: "Roll-up Banner", price: "1,299", old: "1,899", reviews: 1102, rating: 4.9 },
  { name: "Custom Envelopes", price: "349", old: "499", reviews: 412, rating: 4.6 },
];

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

// --- Page ---

export default function PDP() {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState("standard");
  const [selectedPaper, setSelectedPaper] = useState("matte");
  const [selectedQty, setSelectedQty] = useState(500);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const qtyOpt = qtyOptions.find((o) => o.q === selectedQty);
  const paperOpt = paperOptions.find((p) => p.id === selectedPaper);
  const basePrice = qtyOpt.price;
  const finishCost = paperOpt.priceDelta;
  const total = basePrice + finishCost;

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-surface-alt border-b border-border-light">
        <div className="max-w-[1400px] mx-auto px-4 py-3 text-[12px] text-text-light flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-vp-blue">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-vp-blue">Products</Link>
          <ChevronRight size={12} />
          <Link to="/products?category=Visiting%20Cards" className="hover:text-vp-blue">Visiting Cards</Link>
          <ChevronRight size={12} />
          <span className="text-text-dark">Premium Visiting Cards</span>
        </div>
      </div>

      {/* Main */}
      <section className="py-6 lg:py-10">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-8 lg:gap-12 items-start">
          {/* Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-3 lg:sticky lg:top-28">
            {/* Thumbnails */}
            <div className="order-2 sm:order-1 flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible no-scrollbar">
              {thumbnails.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 border rounded-sm overflow-hidden transition-colors ${
                    selectedImage === i ? "border-vp-blue" : "border-border-light hover:border-text-light"
                  }`}
                  aria-label={`View ${t.label}`}
                >
                  <PlaceholderImage label={null} ratio="aspect-square" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="order-1 sm:order-2 relative border border-border-light rounded-sm overflow-hidden">
              <PlaceholderImage label={thumbnails[selectedImage].label} ratio="aspect-square" />
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`w-9 h-9 border rounded-sm flex items-center justify-center transition-colors ${
                    isLiked ? "bg-vp-red-light border-vp-red text-vp-red" : "bg-white border-border text-text-medium hover:border-vp-blue hover:text-vp-blue"
                  }`}
                  aria-label="Save to wishlist"
                >
                  <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                </button>
                <button className="w-9 h-9 bg-white border border-border rounded-sm flex items-center justify-center text-text-medium hover:border-vp-blue hover:text-vp-blue" aria-label="Share">
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Configurator */}
          <div>
            <Badge variant="red" className="mb-3">Best Seller</Badge>
            <h1 className="text-[26px] lg:text-[32px] font-bold text-text-dark leading-tight tracking-tight mb-2">
              Premium Visiting Cards
            </h1>
            <div className="flex items-center gap-3 mb-4">
              <StarRow rating={4.8} />
              <span className="text-[13px] text-text-dark font-semibold">4.8</span>
              <a href="#reviews" className="text-[13px] text-vp-blue hover:underline">12,847 reviews</a>
            </div>
            <p className="text-[14px] text-text-medium leading-relaxed mb-6">
              High-quality double-sided business cards printed on premium 350gsm card stock. Choose from matte, glossy, soft-touch and eco-friendly finishes.
            </p>

            {/* Price summary */}
            <div className="bg-surface-alt border border-border-light rounded-sm px-4 py-3 mb-6 flex items-baseline justify-between">
              <div>
                <span className="text-[12px] text-text-light">Total for {selectedQty} cards</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-[24px] font-bold text-vp-blue">₹{total.toLocaleString("en-IN")}</span>
                  <span className="text-[13px] text-text-light line-through">₹{Math.round(total * 1.4).toLocaleString("en-IN")}</span>
                </div>
              </div>
              {qtyOpt.save && (
                <Badge variant="green">Save {qtyOpt.save}</Badge>
              )}
            </div>

            {/* Size */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-bold text-text-dark">Size</label>
                <button className="text-[12px] text-vp-blue hover:underline flex items-center gap-1">
                  <Info size={12} /> Size guide
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {sizeOptions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSize(s.id)}
                    className={`text-left px-3 py-2.5 border rounded-sm transition-colors ${
                      selectedSize === s.id
                        ? "border-vp-blue bg-vp-blue-light"
                        : "border-border hover:border-text-light"
                    }`}
                  >
                    <div className="text-[13px] font-semibold text-text-dark">{s.label}</div>
                    <div className="text-[11px] text-text-light">{s.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Paper / Finish */}
            <div className="mb-6">
              <label className="block text-[13px] font-bold text-text-dark mb-2">Paper &amp; Finish</label>
              <div className="grid grid-cols-2 gap-2">
                {paperOptions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPaper(p.id)}
                    className={`text-left px-3 py-2.5 border rounded-sm transition-colors ${
                      selectedPaper === p.id
                        ? "border-vp-blue bg-vp-blue-light"
                        : "border-border hover:border-text-light"
                    }`}
                  >
                    <div className="flex items-baseline justify-between">
                      <div className="text-[13px] font-semibold text-text-dark">{p.label}</div>
                      {p.priceDelta > 0 && <span className="text-[11px] text-text-light">+₹{p.priceDelta}</span>}
                    </div>
                    <div className="text-[11px] text-text-light">{p.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-[13px] font-bold text-text-dark mb-2">Quantity</label>
              <div className="border border-border-light rounded-sm overflow-hidden">
                {qtyOptions.map((o, idx) => (
                  <button
                    key={o.q}
                    onClick={() => setSelectedQty(o.q)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                      idx > 0 ? "border-t border-border-light" : ""
                    } ${selectedQty === o.q ? "bg-vp-blue-light" : "hover:bg-surface-alt"}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedQty === o.q ? "border-vp-blue" : "border-border"
                      }`}>
                        {selectedQty === o.q && <span className="w-2 h-2 rounded-full bg-vp-blue" />}
                      </span>
                      <span className="text-[14px] font-medium text-text-dark">{o.q} cards</span>
                      {o.popular && <Badge variant="yellow">Most Popular</Badge>}
                      {o.save && !o.popular && <Badge variant="green">Save {o.save}</Badge>}
                    </div>
                    <span className="text-[14px] font-bold text-vp-blue">₹{o.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Button
              size="lg"
              className="w-full text-[15px]"
              onClick={() => navigate("/design?product=" + encodeURIComponent("Premium Visiting Cards"))}
            >
              Start designing
            </Button>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                variant="secondary"
                size="default"
                onClick={() => navigate("/design?product=" + encodeURIComponent("Premium Visiting Cards") + "&tool=uploads")}
              >
                Upload your design
              </Button>
              <Button variant="ghost" size="default">Hire a designer</Button>
            </div>

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

            {/* Details accordions */}
            <div className="mt-8">
              <AccordionRow title="Product details" defaultOpen>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>Premium 350gsm card stock with double-sided full-color print</li>
                  <li>Sizes: Standard 3.5×2", Square 2.5×2.5", Slim 3.5×1.75"</li>
                  <li>Finishes: Matte, Glossy, Soft Touch, Recycled</li>
                  <li>Optional spot UV and foil upgrades available at checkout</li>
                </ul>
              </AccordionRow>
              <AccordionRow title="Design &amp; file requirements">
                <p>Upload PDF, JPG, PNG or AI files up to 100MB. We recommend 300 DPI with 3mm bleed on all sides. Our team reviews every file before printing.</p>
              </AccordionRow>
              <AccordionRow title="Shipping &amp; returns">
                <p>Express delivery 2–3 business days, standard 5–7 days. Returns accepted within 30 days for unused, undamaged products. Custom-printed items are non-refundable unless defective.</p>
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
              <span className="text-[36px] font-bold text-text-dark leading-none">4.8</span>
              <div>
                <StarRow rating={4.8} size={16} />
                <p className="text-[12px] text-text-light mt-1">Based on 12,847 reviews</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="mt-3">Write a review</Button>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Rohan K.", date: "12 May 2026", rating: 5, text: "Print quality is excellent. Edges are crisp and the matte finish feels premium. Will reorder." },
              { name: "Sneha P.", date: "08 May 2026", rating: 5, text: "Designed online in 10 minutes, arrived in 4 days exactly as previewed. Recommended." },
              { name: "Arjun V.", date: "01 May 2026", rating: 4, text: "Good quality cards. Colors are slightly different from screen but still acceptable." },
              { name: "Anita S.", date: "28 Apr 2026", rating: 5, text: "Best prints I've used so far for client meetings. The soft-touch finish is a standout." },
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
      <section className="border-t border-border-light py-10 bg-white">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-end justify-between mb-5">
            <h2 className="text-[22px] font-bold text-text-dark tracking-tight">You might also like</h2>
            <Link to="/products" className="text-[13px] font-semibold text-vp-blue hover:underline flex items-center gap-1">
              See all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            {RELATED.map((p) => (
              <Link
                key={p.name}
                to="/products"
                className="group block bg-white border border-border-light hover:border-vp-blue hover:shadow-card-hover transition-all rounded-sm overflow-hidden"
              >
                <PlaceholderImage label={p.name} ratio="aspect-square" />
                <div className="p-3 lg:p-4">
                  <h3 className="text-[14px] font-semibold text-text-dark group-hover:text-vp-blue leading-tight mb-1.5 min-h-[36px] line-clamp-2">
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
    </div>
  );
}
