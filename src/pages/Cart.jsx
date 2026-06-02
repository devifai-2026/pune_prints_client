import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import {
  Minus, Plus, Trash2, ShoppingCart, Tag, ChevronRight,
  Lock, RotateCcw, Truck, ShieldCheck, Check, X,
} from "lucide-react";

function PlaceholderImage({ label, ratio = "aspect-square", small = false }) {
  return (
    <div className={`${ratio} ph-image-solid relative overflow-hidden`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-text-muted px-1">
          <div className={`${small ? "w-7 h-7" : "w-10 h-10"} mx-auto mb-1 border-2 border-text-muted/40 rounded-sm flex items-center justify-center text-[10px] font-semibold`}>IMG</div>
          {label && !small && <div className="text-[11px] font-medium line-clamp-2">{label}</div>}
        </div>
      </div>
    </div>
  );
}

const deliveryOptions = [
  { id: "standard", name: "Standard delivery", desc: "5–7 business days", price: 0 },
  { id: "express", name: "Express delivery", desc: "2–3 business days", price: 149 },
  { id: "priority", name: "Priority delivery", desc: "Next business day", price: 299 },
];

const SUGGESTIONS = [
  { name: "A5 Flyers", price: "499", old: "699" },
  { name: "Custom Mugs", price: "249", old: "399" },
  { name: "Roll-up Banners", price: "1,299", old: "1,899" },
];

export default function Cart() {
  const { items, updateQty, removeItem } = useCart();
  const [delivery, setDelivery] = useState("standard");
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");

  const applyPromo = () => {
    if (promoInput.trim().toUpperCase() === "PRINT30") {
      setAppliedPromo({ code: "PRINT30", pct: 0.3 });
      setPromoError("");
    } else {
      setPromoError("Invalid code. Try PRINT30.");
      setAppliedPromo(null);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoError("");
  };

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const deliveryFee = deliveryOptions.find((d) => d.id === delivery)?.price ?? 0;
  const promoDiscount = appliedPromo ? Math.round(subtotal * appliedPromo.pct) : 0;
  const total = subtotal + deliveryFee - promoDiscount;

  // Empty state
  if (items.length === 0) {
    return (
      <div className="bg-white">
        <div className="bg-surface-alt border-b border-border-light">
          <div className="max-w-[1400px] mx-auto px-4 py-3 text-[12px] text-text-light flex items-center gap-1.5">
            <Link to="/" className="hover:text-vp-blue">Home</Link>
            <ChevronRight size={12} />
            <span className="text-text-dark">Cart</span>
          </div>
        </div>
        <div className="max-w-[700px] mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-2 border-border rounded-sm flex items-center justify-center text-text-light">
            <ShoppingCart size={28} strokeWidth={1.5} />
          </div>
          <h2 className="text-[24px] font-bold text-text-dark tracking-tight mb-2">Your cart is empty</h2>
          <p className="text-[14px] text-text-light mb-6">Browse our products and start designing in minutes.</p>
          <Link to="/products">
            <Button size="lg">Continue shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-surface-alt border-b border-border-light">
        <div className="max-w-[1400px] mx-auto px-4 py-3 text-[12px] text-text-light flex items-center gap-1.5">
          <Link to="/" className="hover:text-vp-blue">Home</Link>
          <ChevronRight size={12} />
          <span className="text-text-dark">Cart</span>
        </div>
      </div>

      <section className="py-8 lg:py-12">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-baseline gap-3 mb-6">
            <h1 className="text-[26px] lg:text-[32px] font-bold text-text-dark tracking-tight">Shopping cart</h1>
            <span className="text-[14px] text-text-light">({items.length} {items.length === 1 ? "item" : "items"})</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
            {/* Items */}
            <div className="border border-border-light rounded-sm bg-white">
              <AnimatePresence initial={false}>
                {items.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`overflow-hidden ${idx > 0 ? "border-t border-border-light" : ""}`}
                  >
                    <div className="p-4 lg:p-5 flex gap-4">
                      <Link to={item.link || "/business-cards"} className="w-20 h-20 lg:w-24 lg:h-24 shrink-0 border border-border-light rounded-sm overflow-hidden">
                        <PlaceholderImage label={null} small ratio="aspect-square" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link to={item.link || "/business-cards"} className="text-[15px] font-semibold text-text-dark hover:text-vp-blue line-clamp-1">
                              {item.name}
                            </Link>
                            <p className="text-[12px] text-text-light mt-0.5 line-clamp-1">{item.variant}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-text-light hover:text-vp-red p-1 -m-1"
                            aria-label="Remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex items-end justify-between mt-3">
                          <div className="flex items-center border border-border rounded-sm">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              disabled={item.qty <= 1}
                              className="w-8 h-8 flex items-center justify-center text-text-dark hover:bg-surface disabled:opacity-30"
                              aria-label="Decrease"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-10 text-center text-[13px] font-semibold">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="w-8 h-8 flex items-center justify-center text-text-dark hover:bg-surface"
                              aria-label="Increase"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="text-right">
                            <div className="text-[16px] font-bold text-vp-blue">
                              ₹{(item.unitPrice * item.qty).toLocaleString("en-IN")}
                            </div>
                            <div className="text-[11px] text-text-light">₹{item.unitPrice.toLocaleString("en-IN")} each</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-[12px]">
                          <Link to={item.link || "/business-cards"} className="text-vp-blue hover:underline">Edit design</Link>
                          <button onClick={() => removeItem(item.id)} className="text-text-light hover:text-vp-red">Remove</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="border-t border-border-light px-4 lg:px-5 py-4 flex items-center justify-between">
                <Link to="/products" className="text-[13px] font-semibold text-vp-blue hover:underline flex items-center gap-1">
                  <ChevronRight size={14} className="rotate-180" /> Continue shopping
                </Link>
                <span className="text-[12px] text-text-light flex items-center gap-1.5">
                  <RotateCcw size={12} /> Prices saved for 7 days
                </span>
              </div>
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-28 space-y-4">
              <div className="border border-border-light rounded-sm bg-white p-5">
                <h2 className="text-[15px] font-bold text-text-dark mb-4">Order summary</h2>

                {/* Delivery */}
                <div className="mb-4">
                  <h3 className="text-[12px] font-bold text-text-dark uppercase tracking-wide mb-2">Delivery</h3>
                  <div className="space-y-2">
                    {deliveryOptions.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setDelivery(d.id)}
                        className={`w-full flex items-start justify-between p-3 border rounded-sm text-left transition-colors ${
                          delivery === d.id ? "border-vp-blue bg-vp-blue-light" : "border-border-light hover:border-text-light"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            delivery === d.id ? "border-vp-blue" : "border-border"
                          }`}>
                            {delivery === d.id && <span className="w-2 h-2 rounded-full bg-vp-blue" />}
                          </span>
                          <div>
                            <div className="text-[13px] font-semibold text-text-dark">{d.name}</div>
                            <div className="text-[11px] text-text-light">{d.desc}</div>
                          </div>
                        </div>
                        <span className={`text-[13px] font-semibold ${d.price === 0 ? "text-vp-green" : "text-text-dark"}`}>
                          {d.price === 0 ? "FREE" : `+₹${d.price}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Promo */}
                <div className="mb-4 pt-4 border-t border-border-light">
                  <h3 className="text-[12px] font-bold text-text-dark uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Tag size={12} /> Promo code
                  </h3>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-green-50 border border-vp-green/20 rounded-sm px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-vp-green" />
                        <div>
                          <span className="text-[13px] font-semibold text-vp-green">{appliedPromo.code}</span>
                          <span className="text-[11px] text-text-light ml-2">-₹{promoDiscount.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                      <button onClick={removePromo} className="text-[11px] text-vp-red hover:underline">Remove</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
                        placeholder="Enter code"
                        className="flex-1 h-9 px-3 border border-border rounded-sm text-[13px] focus:border-vp-blue focus:outline-none"
                      />
                      <Button onClick={applyPromo} size="sm">Apply</Button>
                    </div>
                  )}
                  {promoError && <p className="text-[11px] text-vp-red mt-1.5">{promoError}</p>}
                </div>

                {/* Totals */}
                <div className="space-y-2 pt-4 border-t border-border-light text-[13px]">
                  <div className="flex justify-between text-text-medium">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-text-medium">
                    <span>Delivery</span>
                    <span className={deliveryFee === 0 ? "text-vp-green font-semibold" : ""}>
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-vp-green font-semibold">
                      <span>Discount ({appliedPromo.code})</span>
                      <span>-₹{promoDiscount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-3 border-t border-border-light">
                    <span className="text-[14px] font-bold text-text-dark">Total</span>
                    <span className="text-[20px] font-bold text-vp-blue">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                  <p className="text-[11px] text-text-light text-right">Inclusive of all taxes</p>
                </div>

                <Button size="lg" className="w-full mt-4 flex items-center gap-2">
                  <Lock size={14} /> Secure checkout
                </Button>

                <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border-light text-text-light">
                  <div className="flex items-center gap-1.5 text-[11px]"><ShieldCheck size={14} /> Secure</div>
                  <div className="flex items-center gap-1.5 text-[11px]"><Truck size={14} /> Fast delivery</div>
                  <div className="flex items-center gap-1.5 text-[11px]"><RotateCcw size={14} /> Easy returns</div>
                </div>
              </div>

              <div className="border border-border-light rounded-sm bg-surface-alt p-4 text-[12px] text-text-medium">
                <strong className="text-text-dark">Need design help?</strong> Our designers can polish your file before printing. Free for orders above ₹2,000.
                <a href="#" className="block mt-2 text-vp-blue hover:underline font-semibold">Talk to a designer →</a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Suggestions */}
      <section className="border-t border-border-light py-10 bg-white">
        <div className="max-w-[1400px] mx-auto px-4">
          <h2 className="text-[20px] font-bold text-text-dark tracking-tight mb-5">Complete your order with</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
            {SUGGESTIONS.map((s) => (
              <Link
                key={s.name}
                to="/products"
                className="group block bg-white border border-border-light hover:border-vp-blue hover:shadow-card-hover transition-all rounded-sm overflow-hidden"
              >
                <PlaceholderImage label={s.name} ratio="aspect-[4/3]" />
                <div className="p-3 lg:p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-[14px] font-semibold text-text-dark group-hover:text-vp-blue leading-tight">{s.name}</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-[14px] font-bold text-vp-blue">₹{s.price}</span>
                      <span className="text-[11px] text-text-light line-through">₹{s.old}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary">Add</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
