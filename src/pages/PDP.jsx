import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Info, Home, ChevronRight, ZoomIn, 
  Check, ShieldCheck, Truck, Zap, 
  Share2, Heart, Star, Sparkles,
  Layers, Maximize2, Trash2, ArrowRight, X
} from "lucide-react";

const sizeOptions = [
  { id: "standard", label: 'Standard', sub: '3.5×2"', desc: "Most popular choice" },
  { id: "square", label: 'Square', sub: '2.5×2.5"', desc: "Modern & creative" },
  { id: "mini", label: 'Mini', sub: '3.5×1.75"', desc: "Slim & elegant" },
];

const finishOptions = [
  { id: "glossy", icon: "✨", name: "Glossy", desc: "Shiny & vibrant" },
  { id: "matte", icon: "🖤", name: "Matte", desc: "Smooth & elegant" },
  { id: "soft", icon: "🤍", name: "Soft Touch", desc: "Velvet-like feel" },
  { id: "eco", icon: "🌿", name: "Recycled", desc: "Eco-friendly" },
];

const thumbnails = [
  { label: "Front Preview", face: "front", bg: "bg-blue-50/50", img: "/assets/business-cards.png" },
  { label: "Back Concept", face: "back", bg: "bg-indigo-50/50", img: null },
  { label: "Close-up", face: "front", bg: "bg-gray-50/50", img: "/assets/business-cards.png" },
  { label: "Perspective", face: "front", bg: "bg-sky-50/50", img: "/assets/business-cards.png" },
  { label: "In context", face: "front", bg: "bg-orange-50/50", img: "/assets/business-cards.png" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function PDP() {
  const [selectedQty, setSelectedQty] = useState(250);
  const [selectedDelivery, setSelectedDelivery] = useState("express");
  const [selectedFinish, setSelectedFinish] = useState("matte");
  const [selectedSize, setSelectedSize] = useState("standard");
  const [selectedFace, setSelectedFace] = useState("front");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const qtyOptions = [
    { q: 50, price: 8.00, total: 400, save: null },
    { q: 100, price: 5.00, total: 500, save: "10%" },
    { q: 250, price: 3.20, total: 800, save: "25%", pop: true },
    { q: 500, price: 2.00, total: 1000, save: "37%" },
    { q: 1000, price: 1.20, total: 1200, save: "50%" },
  ];

  const subtotal = qtyOptions.find((o) => o.q === selectedQty)?.total || 800;
  const deliveryPrice = selectedDelivery === "express" ? 150 : selectedDelivery === "next" ? 300 : 0;
  const discount = Math.round(subtotal * 0.30);
  const total = subtotal + deliveryPrice - discount;

  const activeThumbnail = thumbnails[selectedImage];

  const handleThumbnailClick = (i) => {
    setSelectedImage(i);
    setSelectedFace(thumbnails[i].face);
  };

  useEffect(() => {
    if (isZoomed) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isZoomed]);

  return (
    <div className="bg-white min-h-screen">
      {/* S1: Breadcrumb */}
      <div className="bg-white border-b border-border py-4 px-4 md:px-8 xl:px-8 overflow-x-auto whitespace-nowrap hidden sm:block">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-2 text-[12px] font-display font-bold uppercase tracking-widest text-text-light/60">
          <Link to="/" className="hover:text-primary-blue transition-colors flex items-center">Home</Link>
          <ChevronRight size={12} className="text-gray-300" />
          <Link to="/" className="hover:text-primary-blue transition-colors">Products</Link>
          <ChevronRight size={12} className="text-gray-300" />
          <Link to="/" className="hover:text-primary-blue transition-colors">Cards & Stationery</Link>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="text-text-dark cursor-default">Business Cards</span>
        </div>
      </div>

      {/* S2: Main Product Section */}
      <section className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-8 flex flex-col lg:flex-row gap-12 xl:gap-20 items-start">

          {/* Left: Product Visualizer */}
          <div className="w-full lg:w-[55%] lg:sticky top-8 lg:top-24">
            <div className={`relative w-full aspect-[4/3] md:aspect-square ${activeThumbnail.bg} rounded-[32px] sm:rounded-[40px] border border-border/50 flex items-center justify-center overflow-hidden transition-all duration-700`}>
              
              <div className="absolute top-8 left-8 flex flex-col gap-3 z-20">
                <Badge className="w-max bg-white/80 backdrop-blur-md text-accent-orange border-orange-100 shadow-xl py-1.5 px-4 font-black uppercase tracking-widest text-[10px]">
                  ⭐ Best Seller
                </Badge>
              </div>

              <div className="absolute top-8 right-8 flex flex-col gap-3 z-20">
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all border border-white/50 backdrop-blur-md ${isLiked ? 'bg-red-50 text-red-500' : 'bg-white/80 text-text-medium hover:text-red-500'}`}
                >
                  <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                </button>
                <button className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl text-text-medium hover:text-primary-blue transition-all border border-white/50">
                  <Share2 size={20} />
                </button>
                <button 
                  onClick={() => setIsZoomed(true)}
                  className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl text-text-medium hover:text-primary-blue transition-all border border-white/50"
                >
                  <Maximize2 size={20} />
                </button>
              </div>

              {/* Main Card Mockup Container */}
              <motion.div
                key={`${selectedImage}-${selectedFace}-${selectedSize}`}
                className="relative z-10 w-full flex items-center justify-center perspective-1000 h-full"
                initial={{ opacity: 0, scale: 0.9, rotateY: selectedFace === 'back' ? 90 : -90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div 
                  className={`w-[85%] max-w-[480px] shadow-2xl transition-all duration-700 bg-white rounded-2xl overflow-hidden relative border border-white/50 cursor-zoom-in`}
                  onClick={() => setIsZoomed(true)}
                  style={{ 
                    aspectRatio: selectedSize === "square" ? "1/1" : selectedSize === "mini" ? "2/1" : "1.75/1",
                    boxShadow: "0 50px 100px -20px rgba(0,0,0,0.15), 0 30px 60px -30px rgba(0,0,0,0.2)"
                  }}
                >
                  {selectedFace === "front" && activeThumbnail.img ? (
                    <img src={activeThumbnail.img} alt="Product Mockup" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col p-8 sm:p-16 bg-white relative overflow-hidden">
                      {/* Suble geometric pattern for back side */}
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-blue/5 rounded-bl-full"></div>
                      
                      <div className="mt-auto border-t-2 border-primary-blue/20 pt-8">
                        <div className="w-24 h-24 rounded-2xl mb-8 flex items-center justify-center text-4xl shadow-sm border border-gray-100 bg-surface">
                          ✨
                        </div>
                        <div className="space-y-4">
                          <div className="h-2 w-48 bg-text-dark/10 rounded-full"></div>
                          <div className="h-2 w-32 bg-text-dark/5 rounded-full"></div>
                        </div>
                      </div>
                      
                      <div className="absolute center inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-[120px] opacity-[0.02] font-black uppercase tracking-[0.5em] -rotate-12">PRINTCRAFT</span>
                      </div>
                    </div>
                  )}

                  {/* Finish Overlays */}
                  {selectedFinish === 'glossy' && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none"></div>
                  )}
                  {selectedFinish === 'soft' && (
                    <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/felt.png')]"></div>
                  )}
                </div>
              </motion.div>

              {/* View Selector */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center p-1.5 bg-white/80 backdrop-blur-xl rounded-full shadow-2xl border border-white/50 z-20">
                <button
                  onClick={() => setSelectedFace("front")}
                  className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${selectedFace === "front" ? "bg-primary-blue text-white shadow-lg" : "text-text-medium hover:bg-white"}`}
                >
                  Front View
                </button>
                <button
                  onClick={() => setSelectedFace("back")}
                  className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${selectedFace === "back" ? "bg-primary-blue text-white shadow-lg" : "text-text-medium hover:bg-white"}`}
                >
                  Back Side
                </button>
              </div>
            </div>

            {/* Thumbnail Scroll */}
            <div className="mt-8 flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {thumbnails.map((thumb, i) => (
                <motion.button
                  key={i}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleThumbnailClick(i)}
                  className={`flex-shrink-0 w-24 h-24 rounded-3xl ${thumb.bg} flex items-center justify-center overflow-hidden transition-all relative border-2 ${
                    selectedImage === i ? "border-primary-blue shadow-lg" : "border-transparent hover:bg-white hover:border-border/50"
                  }`}
                >
                  {thumb.img ? (
                    <img src={thumb.img} alt={thumb.label} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl opacity-40">📄</span>
                  )}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </motion.button>
              ))}
              <div className="flex-shrink-0 w-48 rounded-3xl bg-surface border border-dashed border-border flex flex-col items-center justify-center gap-2 p-4 cursor-pointer hover:bg-white hover:border-primary-blue/30 transition-all group">
                <Sparkles size={20} className="text-primary-blue group-hover:scale-125 transition-transform" />
                <span className="text-[11px] font-black text-text-dark/40 text-center uppercase tracking-widest">Browse Designs</span>
              </div>
            </div>
          </div>

          {/* Right: Order Configurator */}
          <div className="w-full lg:w-[45%] flex flex-col">
            <motion.div
              variants={fadeUp} initial="hidden" animate="show"
            >
              <div className="flex items-center gap-3 mb-6">
                <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-widest">
                  <ShieldCheck size={14} /> Certified Quality
                </Badge>
                <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                <span className="text-[12px] font-black text-text-light uppercase tracking-widest">Premium 350gsm</span>
              </div>

              <h1 className="font-display font-black text-[36px] sm:text-[42px] md:text-[52px] leading-[1.1] text-text-dark mb-4 sm:mb-6 tracking-tight">
                Premium <span className="text-gradient">Business Cards</span>
              </h1>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <span className="font-display font-black text-lg text-text-dark">4.9</span>
                <span className="text-[14px] font-bold text-text-light/60 uppercase tracking-widest">(12,847 Reviews)</span>
              </div>

              <p className="text-lg text-text-light leading-relaxed mb-10 font-medium">
                Make a statement with our signature business cards. High-definition offset printing on museum-grade cardstock. Perfect for professionals who value every detail.
              </p>

              {/* Selection Grids... (Keeping the rest of the configurator) */}
              <div className="space-y-12">
                {/* 1. Size Selection */}
                <div>
                  <h4 className="font-display font-black text-[13px] text-text-dark uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
                    <Maximize2 size={16} className="text-primary-blue" /> 1. Select Dimensions
                  </h4>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {sizeOptions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSize(s.id)}
                        className={`p-3 sm:p-4 rounded-[20px] sm:rounded-[24px] border-2 transition-all text-center sm:text-left flex flex-col items-center sm:items-start gap-1 ${
                          selectedSize === s.id ? "border-primary-blue bg-blue-50/50" : "border-border/60 hover:border-primary-blue/20"
                        }`}
                      >
                        <span className={`text-[13px] sm:text-[15px] font-black ${selectedSize === s.id ? "text-primary-blue" : "text-text-dark"}`}>{s.label}</span>
                        <span className="text-[10px] sm:text-[11px] font-bold text-text-light/60 uppercase">{s.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Finish Selection */}
                <div>
                  <h4 className="font-display font-black text-[13px] text-text-dark uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
                    <Sparkles size={16} className="text-primary-blue" /> 2. Premium Finish
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {finishOptions.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedFinish(f.id)}
                        className={`p-4 sm:p-5 rounded-[24px] sm:rounded-[28px] border-2 transition-all flex items-center sm:items-start gap-3 sm:gap-4 ${
                          selectedFinish === f.id ? "border-primary-blue bg-blue-50/50" : "border-border/60 hover:border-primary-blue/20"
                        }`}
                      >
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-inner ${selectedFinish === f.id ? 'bg-white' : 'bg-surface'}`}>
                          {f.icon}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className={`text-[15px] font-black ${selectedFinish === f.id ? "text-primary-blue" : "text-text-dark"}`}>{f.name}</span>
                          <span className="text-[11px] font-bold text-text-light/60 uppercase">{f.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Quantity Grid */}
                <div>
                  <h4 className="font-display font-black text-[13px] text-text-dark uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
                    <Layers size={16} className="text-primary-blue" /> 3. Select Quantity
                  </h4>
                  <div className="bg-surface/50 border border-border/50 rounded-[32px] overflow-hidden">
                    {qtyOptions.map((o) => (
                      <div
                        key={o.q}
                        onClick={() => setSelectedQty(o.q)}
                        className={`flex items-center justify-between px-8 py-5 cursor-pointer transition-all border-b last:border-b-0 border-border/30 relative ${
                          selectedQty === o.q ? "bg-white" : "hover:bg-white/40"
                        }`}
                      >
                        {selectedQty === o.q && <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary-blue rounded-r-full"></div>}
                        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedQty === o.q ? "border-primary-blue bg-primary-blue text-white" : "border-border"}`}>
                            {selectedQty === o.q && <Check size={10} strokeWidth={4} />}
                          </div>
                          <span className={`text-[15px] sm:text-[16px] font-black ${selectedQty === o.q ? "text-text-dark" : "text-text-medium"}`}>{o.q} Units</span>
                          {o.save && <Badge className={`text-[9px] font-black uppercase shrink-0 ${o.pop ? 'bg-accent-orange text-white' : 'bg-blue-50 text-primary-blue'}`}>Save {o.save}</Badge>}
                        </div>
                        <div className={`font-display font-black text-[16px] sm:text-[18px] ${selectedQty === o.q ? "text-primary-blue" : "text-text-dark"}`}>₹{o.total}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Checkout Card */}
                <div className="bg-white border border-border/60 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-blue/5 rounded-bl-[100px]"></div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-border/30">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-text-light uppercase tracking-widest mb-1">Total Amount</span>
                      <span className="font-display font-black text-4xl sm:text-5xl text-primary-blue tracking-tighter leading-none">₹{total}</span>
                    </div>
                    <div className="flex flex-col items-start sm:items-end mt-2 sm:mt-0">
                      <Badge className="bg-emerald-500 text-white border-none px-4 py-1.5 font-black text-[11px] rounded-full mb-2">
                        YOU SAVE ₹{discount}
                      </Badge>
                      <span className="text-[10px] font-bold text-text-light/40 uppercase tracking-widest">Incl. all taxes</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Button size="lg" className="w-full h-16 sm:h-20 text-lg sm:text-xl font-black rounded-2xl sm:rounded-3xl shadow-2xl shadow-primary-blue/20 flex items-center justify-center gap-3">
                      Start Designing <ArrowRight size={20} className="sm:w-6 sm:h-6" />
                    </Button>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <Button variant="secondary" className="h-14 sm:h-16 rounded-xl sm:rounded-[24px] bg-surface font-bold text-sm sm:text-base">Upload PDF</Button>
                      <Button variant="ghost" className="h-14 sm:h-16 rounded-xl sm:rounded-[24px] font-bold text-sm sm:text-base">Save Draft</Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* S3: Related Products */}
      <section className="py-24 border-t border-border bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-8">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <h3 className="font-display font-black text-[32px] md:text-[40px] text-text-dark mb-4 tracking-tighter">You Might <span className="text-gradient">Also Like</span></h3>
              <p className="text-lg text-text-light font-medium">Complement your business cards with these essential brand assets.</p>
            </div>
            <Link to="/">
              <Button variant="ghost" className="text-sm font-black uppercase tracking-widest hover:bg-white hover:shadow-sm px-8 py-6 rounded-2xl group">
                View All Products <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Full-color Flyers A5", desc: "150gsm · Gloss/Matte · Custom sizes", price: "499", badge: "⭐ Best Seller", bColor: "bg-blue-500", img: "/assets/flyers.png" },
              { name: "Premium Envelopes", desc: "Self-seal · Custom branding · DL size", price: "349", badge: "New", bColor: "bg-emerald-500", img: null },
              { name: "Roll-up Banners", desc: "Premium vinyl · Carry case included", price: "1,299", badge: null, bColor: "", img: "/assets/hero-banner.png" },
              { name: "Letterheads A4", desc: "Executive 120gsm bond · Soft white", price: "899", badge: "Hot", bColor: "bg-accent-orange", img: null },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white border border-border rounded-[32px] overflow-hidden shadow-sm hover:shadow-card-hover hover:border-primary-blue/20 transition-all duration-500 flex flex-col relative"
              >
                <div className="h-[200px] w-full relative flex items-center justify-center overflow-hidden bg-surface">
                  {p.img ? (
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-4xl opacity-50">🖼️</div>
                  )}
                  {p.badge && <Badge className={`absolute top-4 left-4 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white border-none shadow-lg ${p.bColor}`}>{p.badge}</Badge>}
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h4 className="font-display font-bold text-[17px] text-text-dark mb-1.5 leading-tight group-hover:text-primary-blue transition-colors">{p.name}</h4>
                  <p className="font-body text-[13px] text-text-light mb-4 line-clamp-1">{p.desc}</p>
                  
                  <div className="mt-auto pt-4 border-t border-border flex items-center justify-between mb-5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-text-light/40 uppercase tracking-widest mb-0.5">From</span>
                      <div className="font-display font-black text-xl text-text-dark">₹{p.price}</div>
                    </div>
                    <ArrowRight size={20} className="text-text-light/20 group-hover:text-primary-blue group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <Link to="/">
                    <Button className="w-full h-12 rounded-xl text-[13px] font-black uppercase tracking-widest shadow-lg shadow-primary-blue/5 group-hover:shadow-primary-blue/20 transition-all">View Details</Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            className="fixed inset-0 z-[200] bg-white flex flex-col"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="h-20 flex items-center justify-between px-8 border-b border-border">
              <div className="flex flex-col">
                <span className="font-display font-black text-xl text-text-dark tracking-tight">Image Preview</span>
                <span className="text-[11px] font-black text-text-light uppercase tracking-widest">Business Cards · {activeThumbnail.label}</span>
              </div>
              <button 
                onClick={() => setIsZoomed(false)}
                className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center text-text-dark hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>
            <div className="flex-1 p-4 md:p-12 overflow-hidden flex items-center justify-center bg-surface">
              <motion.div 
                className="relative max-w-full max-h-full aspect-[1.75/1] shadow-2xl rounded-3xl overflow-hidden bg-white"
                layoutId="product-image"
              >
                {activeThumbnail.img ? (
                  <img src={activeThumbnail.img} alt="Zoomed view" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[200px] opacity-10">📄</div>
                )}
              </motion.div>
            </div>
            <div className="p-8 border-t border-border flex justify-center gap-4">
              {thumbnails.map((thumb, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-primary-blue ring-4 ring-primary-blue/10 scale-110' : 'border-transparent opacity-50'}`}
                >
                  {thumb.img ? <img src={thumb.img} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center">📄</div>}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
