import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, X, Star, ShoppingBag, ChevronRight, Zap, ShieldCheck, Truck, Sparkles, Clock, ChevronLeft, ArrowUpRight } from "lucide-react";

// ─── Data & Variants ──────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const HERO_SLIDES = [
  {
    id: 1,
    tag: "⭐ Trusted by 10M+ Businesses",
    title: "Professional Printing,\nMade Simple.",
    desc: "Design online or upload your file. Premium quality print materials delivered fast — business cards, flyers, banners & more.",
    cta: "Start Designing",
    img: "/assets/business-cards.png",
    priceTag: "Starting ₹299",
    theme: "blue",
    accent: "text-primary-blue",
    bg: "from-blue-50/40",
    number: "01"
  },
  {
    id: 2,
    tag: "🚀 Next Day Delivery",
    title: "Marketing That\nActually Pops.",
    desc: "Vibrant flyers, high-impact banners, and posters designed to grab attention and drive results for your business.",
    cta: "Explore Marketing",
    img: "/assets/flyers.png",
    priceTag: "Starting ₹499",
    theme: "orange",
    accent: "text-accent-orange",
    bg: "from-orange-50/40",
    number: "02"
  },
  {
    id: 3,
    tag: "✨ Premium Branding",
    title: "Your Brand,\nEverywhere.",
    desc: "From custom mugs to apparel, turn every interaction into a branding opportunity with museum-quality printing.",
    cta: "Browse Collection",
    img: "/assets/hero-banner.png",
    priceTag: "Starting ₹199",
    theme: "purple",
    accent: "text-purple-600",
    bg: "from-purple-50/40",
    number: "03"
  }
];

// ─── Component ────────────────────────────────────────────────────────────

export default function Home() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 45, s: 12 });
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Carousel Auto-play
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(slideTimer);
  }, []);

  useEffect(() => {
    if (!quickViewProduct) return;
    const onKey = (e) => { if (e.key === "Escape") setQuickViewProduct(null); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [quickViewProduct]);

  const pad = (n) => n.toString().padStart(2, "0");
  const slide = HERO_SLIDES[activeSlide];

  return (
    <div className="bg-[#fcfcfd]">
      {/* S1: Premium Apple-Inspired Hero Carousel */}
      <section className="relative w-full min-h-[100svh] lg:h-[95vh] lg:min-h-[750px] flex items-center justify-center overflow-hidden bg-[#fafafa]">
        {/* Dynamic Background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className={`absolute inset-0 transition-colors duration-1000 ${
              slide.theme === 'blue' ? 'bg-[#F4F7FB]' : 
              slide.theme === 'orange' ? 'bg-[#FFF6F0]' : 
              'bg-[#F8F5FF]'
            }`} />
            {/* Elegant light beams */}
            <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-b from-white/60 to-transparent blur-3xl transform -skew-x-12 opacity-50 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/40 blur-[100px] rounded-full pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        <div className="max-w-[1400px] w-full mx-auto px-4 md:px-8 xl:px-12 relative z-10 h-full flex flex-col justify-center pt-24 pb-32 lg:py-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-24 h-full mt-8 lg:mt-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Left Content */}
              <div className="flex-1 w-full max-w-2xl z-20 flex flex-col justify-center text-center lg:text-left">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-6 lg:mb-8 inline-flex items-center gap-3 lg:gap-4 mx-auto lg:mx-0"
                >
                  <div className={`h-[3px] w-8 lg:w-12 rounded-full ${slide.theme === 'blue' ? 'bg-blue-600' : slide.theme === 'orange' ? 'bg-orange-500' : 'bg-purple-600'}`}></div>
                  <span className="text-[11px] lg:text-[13px] font-black uppercase tracking-[0.25em] text-text-dark/70">{slide.tag}</span>
                </motion.div>

                <motion.h1 
                  className="font-display font-black text-[42px] sm:text-[56px] md:text-[80px] lg:text-[96px] leading-[1.05] lg:leading-[0.95] text-text-dark mb-6 lg:mb-8 tracking-tighter"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  {slide.title.split('\n').map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </motion.h1>

                <motion.p 
                  className="text-[16px] sm:text-[18px] md:text-[22px] text-text-light/90 mb-8 lg:mb-12 max-w-[540px] mx-auto lg:mx-0 font-medium leading-[1.6]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  {slide.desc}
                </motion.p>

                <motion.div 
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Button size="lg" className="h-16 px-10 text-[15px] font-black uppercase tracking-widest rounded-full shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:scale-105 hover:-translate-y-1 transition-all duration-300 bg-text-dark text-white hover:bg-black">
                    {slide.cta}
                  </Button>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/50 border border-white flex items-center justify-center shadow-sm">
                      <Zap size={18} className={slide.theme === 'blue' ? 'text-blue-600' : slide.theme === 'orange' ? 'text-orange-500' : 'text-purple-600'} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-light/60">{slide.theme === 'blue' ? 'Fast Turnaround' : 'Starting from'}</span>
                      <span className="font-display font-black text-xl text-text-dark tracking-tighter">{slide.theme === 'blue' ? '24hr Dispatch' : slide.priceTag.split(' ')[1]}</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Media */}
              <div className="flex-[1.2] w-full relative h-full flex items-center justify-center">
                <motion.div
                  className="relative w-full max-w-[700px] flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Glowing backdrop */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square rounded-full blur-[100px] opacity-30 ${
                    slide.theme === 'blue' ? 'bg-blue-400' : slide.theme === 'orange' ? 'bg-orange-400' : 'bg-purple-400'
                  }`}></div>
                  
                  <img 
                    src={slide.img} 
                    alt="Hero product" 
                    className="relative z-10 w-full h-auto max-h-[300px] md:max-h-[400px] lg:max-h-[500px] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.15)] hover:scale-105 hover:-translate-y-4 transition-all duration-700 ease-out" 
                  />
                  
                  {/* Floating Elements */}
                  <motion.div
                    className="absolute -bottom-8 -left-8 bg-white/80 backdrop-blur-xl rounded-[28px] p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/60 z-20 hidden md:flex items-center gap-5"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${
                      slide.theme === 'blue' ? 'bg-blue-600' : slide.theme === 'orange' ? 'bg-orange-500' : 'bg-purple-600'
                    }`}>
                      <Star size={24} fill="currentColor" />
                    </div>
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-widest text-text-light/60 mb-1">Top Rated</div>
                      <div className="font-display font-black text-2xl text-text-dark leading-none">4.9/5</div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute top-10 -right-10 bg-white/80 backdrop-blur-xl rounded-full px-6 py-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/60 z-20 hidden md:flex items-center gap-3"
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <div className="flex gap-2 items-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    </div>
                    <span className="text-[12px] font-black uppercase tracking-widest text-text-dark">In Stock</span>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Centralized Premium Navigation */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4">
            <div className="bg-white/70 backdrop-blur-2xl border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] rounded-full p-2.5 flex items-center justify-between">
              <button 
                onClick={() => setActiveSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                className="w-12 h-12 rounded-full flex items-center justify-center text-text-dark hover:bg-white hover:shadow-md transition-all group"
              >
                <ChevronLeft size={20} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>

              <div className="flex items-center gap-4 px-4">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className="relative group py-2"
                  >
                    <div className={`h-[4px] rounded-full transition-all duration-500 overflow-hidden ${
                      activeSlide === i ? 'w-14 bg-text-dark' : 'w-6 bg-text-dark/15 group-hover:bg-text-dark/30'
                    }`}>
                      {activeSlide === i && (
                         <motion.div 
                         className="h-full bg-white/60" 
                         initial={{ x: "-100%" }} 
                         animate={{ x: "0%" }} 
                         transition={{ duration: 8, ease: "linear" }}
                       />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setActiveSlide(prev => (prev + 1) % HERO_SLIDES.length)}
                className="w-12 h-12 rounded-full flex items-center justify-center text-text-dark hover:bg-white hover:shadow-md transition-all group"
              >
                <ChevronRight size={20} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* S2: Trust & Proof Grid (Floating Bar) */}
      <section className="relative z-20 -mt-10 mb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-8">
          <div className="bg-white border border-border/60 rounded-[40px] shadow-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: "10M+", label: "Happy Clients", icon: "🤝" },
              { val: "24h", label: "Fast Dispatch", icon: "⚡" },
              { val: "100%", label: "Quality Check", icon: "🛡️" },
              { val: "⭐ 4.9", label: "Trust Score", icon: "✨" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <span className="text-2xl mb-2 group-hover:scale-125 transition-transform">{stat.icon}</span>
                <span className="font-display font-black text-2xl text-text-dark tracking-tighter leading-none mb-1">{stat.val}</span>
                <span className="text-[10px] font-black text-text-light/50 uppercase tracking-[0.2em]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S3: Flash Sale Area */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-orange/5 rounded-full blur-[100px] -mr-64 -mt-64"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-8">
          <div className="bg-gradient-to-r from-accent-orange to-orange-400 rounded-[48px] p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgNDBsNDAtNDBIMzBMMCAzMHYxMHptNDAgMEwzMCA0MGgxMHptMC0zMEwxMCAwaDEwTDMwIDIwaDEwek0wIDIwdjEwaDMwTDAgMHptMC0xMEwwIDEwaDEwTDAgMHoiIGZpbGw9IiNmZmZiIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-10"></div>
            
            <div className="relative z-10 flex flex-col text-center lg:text-left gap-6">
              <Badge className="w-max mx-auto lg:mx-0 bg-white text-accent-orange border-none px-6 py-2 rounded-full font-black uppercase tracking-widest text-[11px] shadow-xl animate-bounce">
                Limited Time Offer
              </Badge>
              <h2 className="font-display font-black text-[42px] md:text-[56px] text-white tracking-tighter leading-none">
                Flash Sale:<br />Up to 50% OFF
              </h2>
              <div className="flex items-center justify-center lg:justify-start gap-4">
                {[
                  { val: timeLeft.h, label: "Hrs" },
                  { val: timeLeft.m, label: "Min" },
                  { val: timeLeft.s, label: "Sec" },
                ].map(({ val, label }, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[24px] flex items-center justify-center text-3xl font-black text-white shadow-xl">
                      {pad(val)}
                    </div>
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest mt-2">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center lg:items-end gap-8">
              <div className="text-right flex flex-col items-center lg:items-end">
                <span className="text-white/60 text-lg font-bold uppercase tracking-widest mb-1">Ends Sunday Night</span>
                <span className="text-white text-2xl font-black italic">Use Code: PRINT50</span>
              </div>
              <Button size="lg" className="h-20 px-12 bg-white text-accent-orange hover:bg-surface rounded-3xl font-black uppercase tracking-widest text-lg shadow-2xl shadow-black/20">
                Claim Offer Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* S4: Product Category Grid */}
      <section className="py-24 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-8 text-center">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="font-display font-black text-[42px] md:text-[56px] text-text-dark mb-4 tracking-tighter leading-none">
              Explore Our <span className="text-gradient">Collection.</span>
            </h3>
            <p className="text-lg text-text-light max-w-2xl mx-auto font-medium">
              Choose from 100+ premium customizable products designed to make your brand stand out.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {[
              { icon: "🪪", name: "Business Cards", pop: true, color: "bg-blue-50" },
              { icon: "📄", name: "Flyers", pop: true, color: "bg-red-50" },
              { icon: "📋", name: "Brochures", color: "bg-green-50" },
              { icon: "🏷️", name: "Banners", color: "bg-yellow-50" },
              { icon: "📮", name: "Postcards", color: "bg-purple-50" },
              { icon: "🖼️", name: "Posters", color: "bg-indigo-50" },
              { icon: "👕", name: "T-Shirts", color: "bg-orange-50" },
              { icon: "☕", name: "Mugs", color: "bg-pink-50" },
              { icon: "🔖", name: "Stickers", pop: true, color: "bg-emerald-50" },
              { icon: "📦", name: "Packaging", color: "bg-cyan-50" },
              { icon: "🪟", name: "Window Signs", color: "bg-teal-50" },
              { icon: "🎁", name: "Gifts & More", color: "bg-violet-50" },
            ].map((cat, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Link to={cat.name === "Business Cards" ? "/business-cards" : "/products"} className="group flex flex-col items-center p-8 bg-white border border-border rounded-[32px] shadow-sm hover:shadow-card-hover hover:border-primary-blue/30 transition-all relative overflow-hidden">
                  {cat.pop && <Badge className="absolute top-3 right-3 scale-75 bg-accent-orange/10 text-accent-orange border-none px-2 py-0.5 font-black text-[9px]">Popular</Badge>}
                  <div className={`w-[80px] h-[80px] rounded-2xl ${cat.color} flex items-center justify-center text-4xl mb-5 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>{cat.icon}</div>
                  <div className="font-display font-black text-[13px] text-text-dark uppercase tracking-widest">{cat.name}</div>
                  <div className="mt-4 flex items-center text-[10px] text-primary-blue font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Explore <ArrowRight size={12} className="ml-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-16"
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            <Button variant="ghost" className="h-16 px-10 text-[13px] font-black uppercase tracking-[0.2em] hover:bg-primary-blue/5 rounded-2xl group transition-all">
              Browse All 100+ Products <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* S5: Featured Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-8">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            <div>
              <h3 className="font-display font-black text-[42px] md:text-[56px] text-text-dark mb-4 tracking-tighter leading-none">Best <span className="text-gradient">Sellers.</span></h3>
              <p className="text-lg text-text-light font-medium">Hand-picked premium products that our customers love the most.</p>
            </div>
            <div className="flex gap-2 bg-surface p-1.5 rounded-2xl border border-border">
              {["All", "Popular", "New", "Eco"].map((tab, i) => (
                <button
                  key={tab}
                  className={`px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${i === 0 ? "bg-white shadow-sm text-primary-blue" : "text-text-light hover:text-text-medium"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {[
              { id: 1, name: "Premium Business Cards", desc: "Double-sided · Glossy · 100+ options", price: "299", old: "499", badge: "🔥 Trending", bColor: "bg-orange-500", img: "/assets/business-cards.png" },
              { id: 3, name: "Full-color Flyers A5", desc: "150gsm · Gloss/Matte · Custom sizes", price: "499", old: "699", badge: "⭐ Best Seller", bColor: "bg-blue-500", img: "/assets/flyers.png" },
              { id: 7, name: "Roll-up Banner 85×200", desc: "Premium vinyl · Carry case included", price: "1,299", old: "1,899", badge: null, bColor: "", img: "/assets/hero-banner.png" },
              { id: 11, name: "Ceramic Mug 11oz", desc: "Microwave safe · Full wrap print", price: "699", old: "899", badge: "🎁 Gift Idea", bColor: "bg-emerald-500", img: null },
            ].map((p, i) => (
              <motion.div key={i} variants={fadeUp} className="group bg-white border border-border rounded-[32px] overflow-hidden shadow-sm hover:shadow-card-hover hover:border-primary-blue/20 transition-all duration-500 flex flex-col relative">
                <div className={`h-[200px] w-full relative flex items-center justify-center overflow-hidden bg-surface`}>
                  {p.img ? (
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-4xl opacity-50">🖼️</div>
                  )}
                  
                  {p.badge && <Badge className={`absolute top-4 left-4 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white border-none shadow-lg ${p.bColor}`}>{p.badge}</Badge>}
                  
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickViewProduct(p); }}
                      className="bg-white text-text-dark font-black text-[13px] px-6 py-2.5 rounded-xl shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-primary-blue hover:text-white uppercase tracking-widest"
                    >
                      Quick View
                    </button>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h4 className="font-display font-black text-[17px] text-text-dark mb-1.5 leading-tight group-hover:text-primary-blue transition-colors truncate">{p.name}</h4>
                  <p className="font-body text-[13px] text-text-light mb-4 line-clamp-1 font-medium">{p.desc}</p>
                  
                  <div className="flex items-center gap-1.5 mb-4">
                    <div className="flex text-yellow-400 text-[10px]">
                      {[1,2,3,4,5].map(s => <Star key={s} size={10} fill="currentColor" />)}
                    </div>
                    <span className="font-black text-[13px] text-text-dark ml-1">4.8</span>
                  </div>
                  
                  <div className="mt-auto pt-5 border-t border-border flex items-center justify-between mb-5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-text-light/40 uppercase tracking-widest mb-0.5">Starting from</span>
                      <div className="font-display font-black text-xl text-primary-blue tracking-tighter">₹{p.price}</div>
                    </div>
                    <div className="text-base text-text-light/40 line-through font-bold">₹{p.old}</div>
                  </div>
                  
                  <Link to={p.id === 1 ? "/business-cards" : "/products"}>
                    <Button className="w-full h-14 rounded-2xl text-[13px] font-black uppercase tracking-widest shadow-lg shadow-primary-blue/5 group-hover:shadow-primary-blue/20 transition-all">Customize</Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* S6: Design Experience (New Beautiful Section) */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <motion.div 
              className="flex-1 order-2 lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-primary-blue/10 text-primary-blue border-none px-4 py-1.5 font-black uppercase tracking-[0.2em] text-[10px] mb-8">Design Studio</Badge>
              <h3 className="font-display font-black text-[42px] md:text-[56px] text-text-dark mb-8 tracking-tighter leading-none">Design Like a Pro. <span className="text-gradient">No Skills Required.</span></h3>
              <p className="text-xl text-text-light font-medium leading-relaxed mb-10">
                Our intuitive design studio gives you the power to create professional branding in minutes. Drag, drop, and customize every detail with real-time 3D previews.
              </p>
              
              <div className="space-y-8">
                {[
                  { title: "1,000+ Premium Templates", desc: "Expertly crafted layouts for every industry.", icon: <Sparkles className="text-primary-blue" /> },
                  { title: "Real-time 3D Mockups", desc: "See exactly how your print will look before ordering.", icon: <Zap className="text-accent-orange" /> },
                  { title: "AI Image Enhancement", desc: "Automatically fix low-res photos for crisp printing.", icon: <ShieldCheck className="text-success-green" /> },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-5 group">
                    <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-display font-black text-[16px] text-text-dark mb-1">{item.title}</h4>
                      <p className="text-[14px] text-text-light font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button size="lg" className="mt-12 h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-[13px] shadow-2xl shadow-primary-blue/20">
                Launch Design Studio
              </Button>
            </motion.div>

            <motion.div 
              className="flex-1 order-1 lg:order-2 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-[48px] overflow-hidden shadow-2xl border-8 border-white group">
                <img src="/assets/hero-banner.png" alt="Design Studio" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-primary-blue/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-primary-blue border-b-[10px] border-b-transparent ml-2"></div>
                  </div>
                </div>
              </div>
              {/* Floating interface elements */}
              <div className="absolute -top-10 -right-10 bg-white rounded-3xl shadow-2xl p-6 border border-border hidden xl:block animate-bounce-slow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500"></div>
                  <div className="h-2 w-24 bg-gray-100 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-32 bg-gray-50 rounded-full"></div>
                  <div className="h-2 w-20 bg-gray-50 rounded-full"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* S7: Premium Standards (Quality Showcase) */}
      <section className="py-24 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-8 text-center mb-20">
          <Badge className="bg-accent-orange/10 text-accent-orange border-none px-4 py-1.5 font-black uppercase tracking-[0.2em] text-[10px] mb-8">Craftsmanship</Badge>
          <h3 className="font-display font-black text-[42px] md:text-[56px] text-text-dark mb-4 tracking-tighter leading-none">Museum-Quality Printing. <br /><span className="text-gradient">No Compromises.</span></h3>
          <p className="text-lg text-text-light max-w-2xl mx-auto font-medium">We combine state-of-the-art offset technology with sustainable materials to deliver prints that feel as good as they look.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Eco-Friendly Stocks", desc: "100% recycled paper options that don't sacrifice texture or durability.", img: "/assets/flyers.png", color: "bg-emerald-500" },
            { title: "Offset Precision", desc: "Ultra-sharp 2400 DPI printing for crisp text and vibrant photography.", img: "/assets/business-cards.png", color: "bg-blue-500" },
            { title: "Premium Finishes", desc: "Luxurious soft-touch, high-gloss, and spot UV coatings for a tactile impact.", img: "/assets/hero-banner.png", color: "bg-purple-500" },
          ].map((item, i) => (
            <motion.div 
              key={i}
              className="group bg-white rounded-[40px] overflow-hidden border border-border hover:shadow-card-hover transition-all duration-500 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="h-64 relative overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/40 to-transparent`}></div>
                <div className={`absolute bottom-6 left-6 w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-xl`}>
                  <Sparkles size={20} />
                </div>
              </div>
              <div className="p-10">
                <h4 className="font-display font-black text-2xl text-text-dark mb-4 leading-tight">{item.title}</h4>
                <p className="text-text-light font-medium leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* S8: Client Success (Testimonials) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-8">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-4 py-1.5 font-black uppercase tracking-[0.2em] text-[10px] mb-8">Client Success</Badge>
              <h3 className="font-display font-black text-[42px] md:text-[56px] text-text-dark mb-4 tracking-tighter leading-none">Join 10M+ <span className="text-gradient">Happy Brand Owners.</span></h3>
              <p className="text-lg text-text-light font-medium leading-relaxed">Don't just take our word for it. Here's how PrintCraft is helping businesses around the globe make their mark.</p>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="font-display font-black text-[48px] text-primary-blue leading-none tracking-tighter">4.9/5</span>
                <span className="text-[11px] font-black text-text-light uppercase tracking-widest mt-2">Global Trust Score</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Jenkins", role: "Creative Director", text: "The print quality is absolutely breathtaking. Our business cards arrived in 3 days and they feel like museum pieces. Customer support was incredibly helpful with our complex spot-UV design.", avatar: "👩‍🎨" },
              { name: "David Chen", role: "Startup Founder", text: "PrintCraft changed the game for our launch. We ordered 1000 flyers and 5 roll-up banners. The color accuracy across different materials is perfect. Truly professional service.", avatar: "👨‍💻" },
              { name: "Elena Rossi", role: "Luxury Retailer", text: "Finally, a printing service that understands premium branding. The soft-touch finish on our gift boxes is unlike anything we've seen. Simply the best in the business.", avatar: "👸" },
            ].map((t, i) => (
              <motion.div 
                key={i}
                className="p-10 rounded-[40px] bg-surface/50 border border-border relative group hover:bg-white hover:shadow-card-hover transition-all duration-500"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex text-yellow-400 mb-8 gap-1">
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <p className="text-[17px] text-text-dark font-medium leading-relaxed mb-10 italic">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-border flex items-center justify-center text-3xl">{t.avatar}</div>
                  <div>
                    <h5 className="font-display font-black text-lg text-text-dark leading-none mb-1">{t.name}</h5>
                    <span className="text-[11px] font-black text-text-light/50 uppercase tracking-widest">{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* S9: Final CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-8">
          <div className="bg-primary-blue rounded-[56px] p-16 md:p-24 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] -ml-48 -mb-48"></div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10 max-w-3xl"
            >
              <Badge className="bg-white/10 text-white border-none px-6 py-2 rounded-full font-black uppercase tracking-widest text-[11px] mb-8">Ready to Start?</Badge>
              <h2 className="font-display font-black text-[48px] md:text-[72px] text-white tracking-tighter leading-none mb-10">
                Let's Make Something <span className="text-white/40">Beautiful Together.</span>
              </h2>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/products">
                  <Button size="lg" className="h-20 px-12 bg-white text-primary-blue hover:bg-surface rounded-3xl font-black uppercase tracking-widest text-lg shadow-2xl shadow-black/20">
                    Create Your Design <ArrowRight size={24} className="ml-3" />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button variant="ghost" size="lg" className="h-20 px-12 text-white border-2 border-white/20 hover:bg-white/10 rounded-3xl font-black uppercase tracking-widest text-lg">
                    Browse Collection
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-[140] backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setQuickViewProduct(null)}
            />
            <motion.div
              className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white w-full max-w-[900px] rounded-[48px] shadow-overlay pointer-events-auto overflow-hidden flex flex-col md:flex-row h-auto max-h-[92vh]"
                initial={{ y: 100, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 100, opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image area */}
                <div className={`relative w-full md:w-1/2 min-h-[340px] flex items-center justify-center bg-surface overflow-hidden`}>
                  {quickViewProduct.img ? (
                    <img src={quickViewProduct.img} alt={quickViewProduct.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-8xl opacity-20">🖼️</div>
                  )}
                  <button
                    onClick={() => setQuickViewProduct(null)}
                    className="absolute top-8 right-8 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl text-text-dark hover:bg-white transition-all group md:hidden"
                  >
                    <X size={20} className="group-hover:rotate-90 transition-transform" />
                  </button>
                </div>

                {/* Info area */}
                <div className="flex-1 p-8 md:p-14 flex flex-col relative overflow-y-auto no-scrollbar">
                  <button
                    onClick={() => setQuickViewProduct(null)}
                    className="absolute top-10 right-10 w-12 h-12 bg-surface rounded-full hidden md:flex items-center justify-center shadow-sm text-text-medium hover:text-primary-blue hover:bg-white transition-all group"
                  >
                    <X size={20} className="group-hover:rotate-90 transition-transform" />
                  </button>

                  <div className="mb-10">
                    <Badge className="bg-primary-blue/10 text-primary-blue border-none px-4 py-1.5 font-black uppercase tracking-[0.2em] text-[10px] mb-6">BEST SELLER</Badge>
                    <h3 className="font-display font-black text-[32px] md:text-[42px] text-text-dark mb-4 leading-none tracking-tighter">{quickViewProduct.name}</h3>
                    <p className="text-lg text-text-light leading-relaxed font-medium">{quickViewProduct.desc}</p>
                  </div>

                  <div className="flex items-center gap-4 mb-12">
                    <div className="flex text-yellow-400">
                      {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                    </div>
                    <span className="font-display font-black text-xl text-text-dark">4.9</span>
                    <span className="text-[13px] text-text-light font-bold uppercase tracking-widest">(12,847 Reviews)</span>
                  </div>

                  <div className="flex flex-col gap-8 py-10 border-y border-border mb-12">
                    <div className="flex items-end gap-6">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-text-light/40 uppercase tracking-widest mb-1">Price starting from</span>
                        <span className="font-display font-black text-[48px] text-primary-blue leading-none tracking-tighter">₹{quickViewProduct.price}</span>
                      </div>
                      <span className="text-2xl text-text-light/20 line-through font-bold pb-1">₹{quickViewProduct.old}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                    <Link
                      to={quickViewProduct.id === 1 ? "/business-cards" : "/products"}
                      className="flex-[2]"
                      onClick={() => setQuickViewProduct(null)}
                    >
                      <Button className="w-full h-20 text-lg font-black uppercase tracking-widest rounded-3xl shadow-2xl shadow-primary-blue/20">
                        Customize Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
