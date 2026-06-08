import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext.jsx";
import * as addressApi from "@/api/addresses";
import { checkout as checkoutApi } from "@/api/orders";
import { localPhone } from "@/lib/utils";
import {
  Minus, Plus, Trash2, ShoppingCart, Tag, ChevronRight,
  Lock, RotateCcw, Truck, ShieldCheck, Check, X, MapPin, Plus as PlusIcon, Loader2, Star,
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

// Link a cart line back to its product detail page (falls back gracefully).
const itemLink = (item) =>
  item.productSlug ? `/business-cards?slug=${encodeURIComponent(item.productSlug)}` : (item.link || "/products");

export default function Cart() {
  const { items, updateQty, removeItem, clear } = useCart();
  const { isAuthenticated, status } = useAuth();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState("standard");
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");

  // Saved addresses for checkout selection.
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  // Load the user's address book once signed in; preselect the default.
  useEffect(() => {
    if (status !== "authenticated") { setAddresses([]); setSelectedAddressId(null); return; }
    let cancelled = false;
    (async () => {
      try {
        const list = await addressApi.list();
        if (cancelled) return;
        setAddresses(list);
        const def = list.find((a) => a.isDefault) || list[0];
        setSelectedAddressId(def?.id || null);
      } catch { /* non-fatal — checkout will prompt to add one */ }
    })();
    return () => { cancelled = true; };
  }, [status]);

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

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || null;

  const handleCheckout = async () => {
    // Anonymous users must sign in first; bounce back to the cart afterwards.
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    if (!selectedAddress) {
      setCheckoutError("Please add and select a delivery address.");
      return;
    }
    setPlacing(true);
    setCheckoutError("");
    try {
      const order = await checkoutApi({
        promoCode: appliedPromo?.code,
        deliveryFee,
        address: {
          name: selectedAddress.name,
          line1: selectedAddress.line1,
          line2: selectedAddress.line2,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
          phone: `+91 ${localPhone(selectedAddress.phone)}`,
        },
      });
      await clear();
      setPlacedOrder(order);
    } catch (err) {
      setCheckoutError(err?.message || "Checkout failed. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  // Order placed — confirmation screen.
  if (placedOrder) {
    return (
      <div className="bg-surface-alt min-h-screen flex items-center">
        <div className="max-w-[520px] mx-auto px-4 py-16 w-full">
          <div className="bg-white border border-border-light rounded-2xl shadow-sm p-8 lg:p-10 text-center">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-vp-green/15 text-vp-green-dark flex items-center justify-center">
              <Check size={38} strokeWidth={2.5} />
            </div>
            <h2 className="text-[26px] font-bold text-text-dark tracking-tight mb-2">Order placed! 🎉</h2>
            <p className="text-[14px] text-text-light mb-4">Thank you — we've received your order.</p>
            <div className="inline-flex flex-col items-center bg-surface-alt rounded-xl px-6 py-3 mb-7">
              <span className="text-[11px] uppercase tracking-wide text-text-light font-semibold">Order number</span>
              <span className="text-[20px] font-bold text-vp-blue">{placedOrder.orderNumber}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Link to={`/account/orders/${placedOrder.id || placedOrder._id}`}>
                <Button size="lg">View order</Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="secondary">Continue shopping</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="bg-surface-alt min-h-screen">
        <div className="bg-white border-b border-border-light">
          <div className="max-w-[1400px] mx-auto px-4 py-3 text-[12px] text-text-light flex items-center gap-1.5">
            <Link to="/" className="hover:text-vp-blue">Home</Link>
            <ChevronRight size={12} />
            <span className="text-text-dark">Cart</span>
          </div>
        </div>
        <div className="max-w-[560px] mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-vp-blue-light text-vp-blue flex items-center justify-center">
            <ShoppingCart size={32} strokeWidth={1.5} />
          </div>
          <h2 className="text-[26px] font-bold text-text-dark tracking-tight mb-2">Your cart is empty</h2>
          <p className="text-[14px] text-text-light mb-7">Browse our products and start designing in minutes.</p>
          <Link to="/products">
            <Button size="lg" className="px-8">Continue shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-alt min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border-light">
        <div className="max-w-[1400px] mx-auto px-4 py-3 text-[12px] text-text-light flex items-center gap-1.5">
          <Link to="/" className="hover:text-vp-blue">Home</Link>
          <ChevronRight size={12} />
          <span className="text-text-dark">Cart</span>
        </div>
      </div>

      <section className="py-8 lg:py-12">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-baseline gap-3 mb-6">
            <h1 className="text-[26px] lg:text-[34px] font-bold text-text-dark tracking-tight">Shopping cart</h1>
            <span className="text-[14px] text-text-light">{items.length} {items.length === 1 ? "item" : "items"}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 lg:gap-8 items-start">
            {/* Items */}
            <div className="border border-border-light rounded-xl bg-white shadow-sm overflow-hidden">
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
                    <div className="p-4 lg:p-5 flex gap-4 lg:gap-5">
                      <Link to={itemLink(item)} className="w-28 h-28 lg:w-32 lg:h-32 shrink-0 rounded-lg overflow-hidden bg-surface ring-1 ring-border-light shadow-sm group/img">
                        {item.image ? (
                          <img src={item.image} alt={item.productName || item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105" />
                        ) : (
                          <PlaceholderImage label={null} small ratio="aspect-square" />
                        )}
                      </Link>
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link to={itemLink(item)} className="text-[16px] font-bold text-text-dark hover:text-vp-blue line-clamp-2 leading-snug tracking-tight">
                              {item.productName || item.name}
                            </Link>
                            {/* Structured option breakdown — what the customer chose */}
                            {item.options?.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {item.options.map((o, i) => (
                                  <span key={i} className="inline-flex items-center gap-1 text-[11px] bg-surface border border-border-light rounded-full px-2.5 py-1 text-text-medium">
                                    <span className="text-text-light">{o.label}:</span>
                                    <span className="font-semibold text-text-dark">{o.value}</span>
                                  </span>
                                ))}
                              </div>
                            ) : (
                              item.variant && <p className="text-[12px] text-text-light mt-1.5 line-clamp-1">{item.variant}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-text-light hover:text-vp-red hover:bg-vp-red-light w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors"
                            aria-label="Remove"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div className="flex items-end justify-between mt-auto pt-4">
                          <div className="flex items-center border border-border rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              disabled={item.qty <= 1}
                              className="w-9 h-9 flex items-center justify-center text-text-dark hover:bg-surface disabled:opacity-30 transition-colors"
                              aria-label="Decrease"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-11 text-center text-[14px] font-bold">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="w-9 h-9 flex items-center justify-center text-text-dark hover:bg-surface transition-colors"
                              aria-label="Increase"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="text-right">
                            <div className="text-[18px] font-bold text-text-dark">
                              ₹{(item.unitPrice * item.qty).toLocaleString("en-IN")}
                            </div>
                            {item.qty > 1 && (
                              <div className="text-[11px] text-text-light">{item.qty} × ₹{item.unitPrice.toLocaleString("en-IN")}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="border-t border-border-light px-4 lg:px-5 py-4 bg-surface-alt/40 flex items-center justify-between">
                <Link to="/products" className="text-[13px] font-semibold text-vp-blue hover:underline flex items-center gap-1">
                  <ChevronRight size={14} className="rotate-180" /> Continue shopping
                </Link>
              </div>
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-28 space-y-4">
              <div className="border border-border-light rounded-xl bg-white p-5 lg:p-6 shadow-sm">
                <h2 className="text-[17px] font-bold text-text-dark tracking-tight mb-5">Order summary</h2>

                {/* Delivery address (signed-in only) */}
                {isAuthenticated && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[12px] font-bold text-text-dark uppercase tracking-wide flex items-center gap-1.5">
                        <MapPin size={12} /> Deliver to
                      </h3>
                      <Link to="/account/addresses" className="text-[12px] text-vp-blue hover:underline inline-flex items-center gap-0.5">
                        <PlusIcon size={12} /> Add new
                      </Link>
                    </div>
                    {addresses.length === 0 ? (
                      <Link to="/account/addresses" className="block w-full p-3 border border-dashed border-border rounded-lg text-[13px] text-text-light hover:border-vp-blue hover:text-vp-blue text-center transition-colors">
                        Add a delivery address
                      </Link>
                    ) : (
                      <div className="space-y-2">
                        {addresses.map((a) => (
                          <button
                            key={a.id}
                            onClick={() => setSelectedAddressId(a.id)}
                            className={`w-full flex items-start gap-2 p-3 border rounded-lg text-left transition-colors ${
                              selectedAddressId === a.id ? "border-vp-blue bg-vp-blue-light ring-1 ring-vp-blue/20" : "border-border-light hover:border-text-light"
                            }`}
                          >
                            <span className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${selectedAddressId === a.id ? "border-vp-blue" : "border-border"}`}>
                              {selectedAddressId === a.id && <span className="w-2 h-2 rounded-full bg-vp-blue" />}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[13px] font-semibold text-text-dark">{a.name}</span>
                                <span className="text-[10px] font-bold uppercase text-text-medium bg-surface border border-border-light px-1.5 py-0.5 rounded-full">{a.label}</span>
                                {a.isDefault && <Star size={11} className="text-vp-blue fill-vp-blue" />}
                              </div>
                              <div className="text-[11px] text-text-light leading-snug mt-0.5 line-clamp-2">
                                {[a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(", ")}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Delivery */}
                <div className="mb-4">
                  <h3 className="text-[12px] font-bold text-text-dark uppercase tracking-wide mb-2">Delivery</h3>
                  <div className="space-y-2">
                    {deliveryOptions.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setDelivery(d.id)}
                        className={`w-full flex items-start justify-between p-3 border rounded-lg text-left transition-colors ${
                          delivery === d.id ? "border-vp-blue bg-vp-blue-light ring-1 ring-vp-blue/20" : "border-border-light hover:border-text-light"
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
                        className="flex-1 h-10 px-3 border border-border rounded-lg text-[13px] focus:border-vp-blue focus:ring-2 focus:ring-vp-blue/15 focus:outline-none transition-all"
                      />
                      <Button onClick={applyPromo} size="default">Apply</Button>
                    </div>
                  )}
                  {promoError && <p className="text-[11px] text-vp-red mt-1.5">{promoError}</p>}
                </div>

                {/* Totals */}
                <div className="space-y-2.5 pt-4 border-t border-border-light text-[13px]">
                  <div className="flex justify-between text-text-medium">
                    <span>Subtotal</span>
                    <span className="font-medium text-text-dark">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-text-medium">
                    <span>Delivery</span>
                    <span className={deliveryFee === 0 ? "text-vp-green font-semibold" : "font-medium text-text-dark"}>
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-vp-green font-semibold">
                      <span>Discount ({appliedPromo.code})</span>
                      <span>-₹{promoDiscount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-3 mt-1 border-t border-border-light">
                    <span className="text-[15px] font-bold text-text-dark">Total</span>
                    <div className="text-right">
                      <span className="text-[24px] font-bold text-vp-blue leading-none">₹{total.toLocaleString("en-IN")}</span>
                      <p className="text-[11px] text-text-light mt-0.5">Inclusive of all taxes</p>
                    </div>
                  </div>
                </div>

                {checkoutError && (
                  <p className="text-[12px] text-vp-red mt-3 flex items-center gap-1.5"><X size={13} /> {checkoutError}</p>
                )}

                <Button
                  size="lg"
                  className="w-full mt-5 h-12 flex items-center justify-center gap-2 text-[15px] shadow-[0_4px_14px_rgba(26,86,219,0.3)]"
                  disabled={placing}
                  onClick={handleCheckout}
                >
                  {placing ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}
                  {isAuthenticated ? "Place order" : "Sign in to checkout"}
                </Button>

                <div className="flex items-center justify-center gap-5 mt-5 pt-4 border-t border-border-light text-text-light">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium"><ShieldCheck size={14} className="text-vp-green" /> Secure</div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium"><Truck size={14} className="text-vp-blue" /> Fast delivery</div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium"><RotateCcw size={14} className="text-text-medium" /> Easy returns</div>
                </div>
              </div>

              <div className="border border-border-light rounded-xl bg-gradient-to-br from-vp-blue-light/40 to-white p-4 text-[12px] text-text-medium shadow-sm">
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
                className="group block bg-white border border-border-light hover:border-vp-blue hover:shadow-card-hover transition-all rounded-xl overflow-hidden"
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
