import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import {
  Minus, Plus, Trash2, ArrowRight, ShoppingBag,
  Tag, ChevronRight, Home, Lock, RotateCcw, Truck,
  ShieldCheck, Gift, Zap, Sparkles, Check
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const suggestions = [
  { name: "Premium Ceramic Mug", price: "699", old: "899", bg: "bg-purple-50/50", accent: "#9333ea", desc: "Microwave safe · High gloss" },
  { name: "Pro Roll-up Banner", price: "1,299", old: "1,899", bg: "bg-emerald-50/50", accent: "#10b981", desc: "Anti-curl vinyl · Carry case" },
  { name: "Matte Custom Stickers", price: "399", old: "599", bg: "bg-amber-50/50", accent: "#f59e0b", desc: "Waterproof · 50pcs Pack" },
];

const deliveryOptions = [
  { id: "standard", icon: <Truck size={20} />, name: "Standard", desc: "5–7 business days", price: 0 },
  { id: "express", icon: <Zap size={20} />, name: "Express", desc: "2–3 business days", price: 149 },
  { id: "next", icon: <Sparkles size={20} />, name: "Priority", desc: "Next business day", price: 299 },
];

export default function Cart() {
  const { items, updateQty, removeItem } = useCart();
  const [delivery, setDelivery] = useState("standard");
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [promoOpen, setPromoOpen] = useState(false);

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

  /* ── Empty state ── */
  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-8 py-24 px-4 text-center bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-50/50 rounded-full blur-3xl opacity-50 -z-10"></div>
        
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-32 h-32 bg-surface rounded-[40px] flex items-center justify-center text-6xl shadow-xl border border-border"
        >
          🛒
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center gap-4"
        >
          <h2 className="font-display font-black text-4xl text-text-dark tracking-tight">Your cart feels lonely.</h2>
          <p className="text-lg text-text-light max-w-sm font-medium leading-relaxed">
            Ready to make a big impression? Browse our premium products and start designing today.
          </p>
          <Link to="/" className="mt-6">
            <Button size="lg" className="h-16 px-12 text-lg font-black rounded-3xl shadow-2xl shadow-primary-blue/20">
              Start Designing Now <ArrowRight size={20} className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* S1: Breadcrumb */}
      <div className="bg-white border-b border-border py-4 px-4 md:px-8 xl:px-8 overflow-x-auto whitespace-nowrap">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-2 text-[11px] font-display font-black uppercase tracking-[0.2em] text-text-light/50">
          <Link to="/" className="hover:text-primary-blue transition-colors">Home</Link>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="text-text-dark cursor-default">Your Shopping Cart</span>
        </div>
      </div>

      {/* S2: Main Cart Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-8">
          
          <motion.div
            variants={fadeUp} initial="hidden" animate="show"
            className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
          >
            <div className="max-w-xl">
              <h1 className="font-display font-black text-[40px] md:text-[52px] leading-tight text-text-dark tracking-tight">
                Review Your <span className="text-gradient">Cart</span>
              </h1>
              <p className="text-lg text-text-light font-medium mt-2">You're just one step away from premium professional prints.</p>
            </div>
            <Badge className="bg-blue-50 text-primary-blue border-blue-100 px-6 py-2.5 rounded-2xl font-black text-sm shadow-sm uppercase tracking-widest">
              {items.length} Item{items.length !== 1 ? "s" : ""} Selected
            </Badge>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 items-start">

            {/* Left: Cart Items List */}
            <div className="flex-1 w-full min-w-0 space-y-6">
              <AnimatePresence initial={false} mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40, transition: { duration: 0.3 } }}
                    className="group bg-white border border-border/60 rounded-[32px] p-6 md:p-8 hover:shadow-card-hover hover:border-primary-blue/20 transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      {/* Product Thumbnail */}
                      <Link to={item.link} className="relative w-full md:w-32 aspect-square rounded-[24px] overflow-hidden flex items-center justify-center shrink-0 shadow-inner" style={{ background: `${item.accent}08` }}>
                        <div
                          className="w-[60%] aspect-[1.75/1] rounded shadow-2xl border border-white/60 transform rotate-3 group-hover:rotate-0 transition-transform duration-500"
                          style={{ background: item.accent }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col min-w-0 text-center md:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                          <Link to={item.link} className="font-display font-black text-xl text-text-dark hover:text-primary-blue transition-colors line-clamp-1 leading-tight">
                            {item.name}
                          </Link>
                          <span className="font-display font-black text-2xl text-primary-blue">
                            ₹{(item.unitPrice * item.qty).toLocaleString("en-IN")}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                          <Badge variant="secondary" className="bg-surface text-text-light font-bold text-[11px] px-3 py-1 uppercase tracking-widest">{item.variant}</Badge>
                          {item.badge && <Badge className="bg-accent-orange text-white border-none font-bold text-[11px] px-3 py-1 uppercase tracking-widest shadow-lg shadow-orange-500/10">{item.badge}</Badge>}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-50">
                          {/* Qty Stepper */}
                          <div className="flex items-center bg-surface rounded-2xl p-1 border border-border/50">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              disabled={item.qty <= 1}
                              className="w-10 h-10 flex items-center justify-center text-text-medium hover:bg-white hover:text-primary-blue rounded-xl disabled:opacity-20 transition-all active:scale-90"
                            >
                              <Minus size={16} strokeWidth={3} />
                            </button>
                            <span className="w-12 text-center font-display font-black text-[16px] text-text-dark">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="w-10 h-10 flex items-center justify-center text-text-medium hover:bg-white hover:text-primary-blue rounded-xl transition-all active:scale-90"
                            >
                              <Plus size={16} strokeWidth={3} />
                            </button>
                          </div>

                          <div className="flex items-center gap-6">
                            <Link to={item.link} className="text-[13px] font-black text-text-light/60 hover:text-primary-blue flex items-center gap-2 transition-colors uppercase tracking-widest">
                              ✏️ Edit Design
                            </Link>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-[13px] font-black text-text-light/60 hover:text-red-500 flex items-center gap-2 transition-colors uppercase tracking-widest"
                            >
                              <Trash2 size={14} strokeWidth={3} /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 border-t border-border/50">
                <Link to="/" className="group text-[14px] font-black text-text-dark uppercase tracking-[0.2em] flex items-center gap-3 transition-colors hover:text-primary-blue">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-primary-blue group-hover:bg-blue-50 transition-all">
                    <ArrowRight size={16} className="rotate-180" />
                  </div>
                  Continue Shopping
                </Link>
                <div className="flex items-center gap-3 px-6 py-3 bg-surface rounded-2xl text-[12px] font-bold text-text-light border border-border/50 uppercase tracking-widest">
                  <RotateCcw size={14} className="text-primary-blue" />
                  Prices saved for 7 days
                </div>
              </div>
            </div>

            {/* Right: Checkout Summary */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="show"
              className="w-full lg:w-[420px] shrink-0 sticky top-8"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-blue via-accent-orange to-primary-blue rounded-[40px] blur opacity-10"></div>
                <div className="relative bg-white border border-border/60 rounded-[40px] shadow-2xl overflow-hidden">
                  
                  {/* Summary Header */}
                  <div className="px-10 pt-10 pb-6 flex items-center justify-between border-b border-border/30">
                    <h2 className="font-display font-black text-[22px] text-text-dark tracking-tight uppercase tracking-widest">Summary</h2>
                    <Badge className="bg-primary-blue/5 text-primary-blue border-none px-3 py-1 font-black">{items.length} Units</Badge>
                  </div>

                  <div className="p-10 flex flex-col gap-8">
                    {/* Delivery Logic */}
                    <div>
                      <h4 className="text-[11px] font-black text-text-light uppercase tracking-[0.2em] mb-4">Delivery Priority</h4>
                      <div className="space-y-3">
                        {deliveryOptions.map((d) => (
                          <div
                            key={d.id}
                            onClick={() => setDelivery(d.id)}
                            className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                              delivery === d.id ? "border-primary-blue bg-blue-50/50" : "border-border/60 hover:border-primary-blue/20"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${delivery === d.id ? 'bg-primary-blue text-white shadow-lg' : 'bg-surface text-text-medium'}`}>
                                {d.icon}
                              </div>
                              <div className="flex flex-col">
                                <span className={`text-[13px] font-black ${delivery === d.id ? "text-text-dark" : "text-text-medium"}`}>{d.name}</span>
                                <span className="text-[11px] font-medium text-text-light/60">{d.desc}</span>
                              </div>
                            </div>
                            <span className={`font-display font-black text-[13px] ${d.price === 0 ? "text-success-green" : "text-text-dark"}`}>
                              {d.price === 0 ? "FREE" : `+₹${d.price}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Promo Section */}
                    <div className="bg-surface/50 rounded-3xl p-5 border border-border/50">
                      <button
                        onClick={() => setPromoOpen((p) => !p)}
                        className="w-full flex items-center justify-between text-[13px] font-black text-text-dark uppercase tracking-widest"
                      >
                        <span className="flex items-center gap-3"><Tag size={16} className="text-primary-blue" /> Promo Codes</span>
                        <ChevronRight size={16} className={`transition-transform duration-300 ${promoOpen ? 'rotate-90' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {promoOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pt-4"
                          >
                            {appliedPromo ? (
                              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center"><Check size={14} strokeWidth={4} /></div>
                                  <div>
                                    <p className="text-[13px] font-black text-emerald-700 tracking-tight">{appliedPromo.code} Applied</p>
                                    <p className="text-[11px] font-bold text-emerald-600/70">-₹{promoDiscount.toLocaleString("en-IN")} saved</p>
                                  </div>
                                </div>
                                <button onClick={removePromo} className="text-[11px] font-black text-red-400 hover:text-red-600 uppercase transition-colors">Delete</button>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={promoInput}
                                  onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
                                  placeholder="Code (try PRINT30)"
                                  className="flex-1 h-12 px-5 bg-white border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-primary-blue transition-all"
                                />
                                <Button onClick={applyPromo} className="h-12 rounded-2xl px-6 font-black uppercase text-[11px]">Apply</Button>
                              </div>
                            )}
                            {promoError && <p className="text-[11px] text-red-500 mt-2 font-bold px-2">{promoError}</p>}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border/30">
                      <div className="flex justify-between text-lg text-text-medium font-medium">
                        <span>Cart Subtotal</span>
                        <span className="font-display font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-lg text-text-medium font-medium">
                        <span>Delivery Fee</span>
                        <span className={deliveryFee === 0 ? "text-success-green font-bold" : "font-display font-bold"}>
                          {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                        </span>
                      </div>
                      {promoDiscount > 0 && (
                        <div className="flex justify-between text-lg text-emerald-600 font-bold bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-100">
                          <span>🎁 Savings</span>
                          <span className="font-display font-black">-₹{promoDiscount.toLocaleString("en-IN")}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-end pt-8 border-t border-border/50">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-text-light uppercase tracking-widest mb-1">Total Amount</span>
                        <span className="font-display font-black text-[42px] text-primary-blue leading-none tracking-tighter">₹{total.toLocaleString("en-IN")}</span>
                      </div>
                      {promoDiscount > 0 && (
                        <Badge className="bg-emerald-500 text-white border-none px-4 py-1.5 font-black text-[11px] rounded-full shadow-lg shadow-emerald-500/20">
                          YOU SAVED ₹{promoDiscount.toLocaleString("en-IN")}
                        </Badge>
                      )}
                    </div>

                    <Button size="lg" className="w-full h-20 text-xl font-black rounded-3xl shadow-2xl shadow-primary-blue/30 bg-primary-blue hover:bg-blue-600 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4">
                      <Lock size={22} /> Proceed to Secure Checkout
                    </Button>

                    <div className="flex justify-center gap-10 pt-4 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                      {[<ShieldCheck size={24} />, <RotateCcw size={24} />, <Lock size={24} />].map((icon, i) => (
                        <div key={i} className="text-text-dark">{icon}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Gift Message Card */}
              <div className="mt-8 relative group cursor-pointer overflow-hidden rounded-[32px]">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 group-hover:scale-105 transition-transform duration-700"></div>
                <div className="relative p-8 flex items-center gap-6 border border-orange-100">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-orange-500/10 flex items-center justify-center text-3xl">🎁</div>
                  <div className="flex-1">
                    <h4 className="font-display font-black text-[15px] text-text-dark uppercase tracking-widest">Add Gift Message</h4>
                    <p className="text-[12px] text-text-light font-bold">Include a personal note for free.</p>
                  </div>
                  <ArrowRight size={20} className="text-orange-300 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* S3: Recommended Section */}
      <section className="py-24 bg-surface border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <h3 className="font-display font-black text-3xl text-text-dark tracking-tight uppercase tracking-widest">Complete the Look</h3>
            <div className="h-px flex-1 mx-8 bg-border hidden sm:block"></div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {suggestions.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-white border border-border/60 rounded-[32px] overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-500 flex flex-col"
              >
                <div className={`h-[220px] w-full ${s.bg} flex items-center justify-center relative overflow-hidden`}>
                  <div className="w-[55%] aspect-square rounded-full shadow-2xl border-4 border-white transform scale-90 group-hover:scale-100 group-hover:rotate-12 transition-all duration-700" style={{ background: s.accent }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h4 className="font-display font-black text-xl text-text-dark mb-2 leading-tight">{s.name}</h4>
                  <p className="text-[13px] text-text-light font-bold mb-6">{s.desc}</p>
                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex flex-col">
                      <span className="font-display font-black text-xl text-primary-blue">₹{s.price}</span>
                      <span className="text-[12px] text-text-light/50 line-through font-bold">₹{s.old}</span>
                    </div>
                    <Button size="sm" className="h-12 rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary-blue/10">Add Item</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
