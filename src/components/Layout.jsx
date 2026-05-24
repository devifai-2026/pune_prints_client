import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Outlet, Link } from "react-router-dom";
import { Search, ShoppingBag, X, ChevronDown, Menu, MapPin, User, ArrowRight, ShieldCheck, Zap, Badge } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/context/CartContext";

const categories = [
  "Business Cards", "Flyers", "Brochures", "Banners",
  "Stickers", "Mugs & Gifts", "T-Shirts", "Posters",
];

export default function Layout() {
  const [showBanner, setShowBanner] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* S0: Premium Announcement Bar */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            className="bg-primary-blue relative px-4 overflow-hidden z-[100]"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-blue via-blue-500 to-primary-blue opacity-50"></div>
            <div className="max-w-7xl mx-auto py-2.5 relative flex items-center justify-center">
              <p className="text-white text-[11px] sm:text-[13px] font-display font-black uppercase tracking-[0.1em] text-center flex items-center gap-2">
                <Zap size={14} fill="currentColor" />
                <span>Launch Offer: Get 30% OFF Your First Order</span>
                <span className="hidden sm:inline opacity-30 mx-2">|</span>
                <span className="bg-white/20 px-2 py-0.5 rounded font-mono">PRINT30</span>
              </p>
              <button
                onClick={() => setShowBanner(false)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-1 transition-colors"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* S1: Modern Glassmorphism Navbar */}
      <header
        className={`sticky top-0 w-full z-[90] transition-all duration-500 ${isScrolled ? "bg-white/80 backdrop-blur-xl shadow-lg py-2" : "bg-white py-4"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-20">
          <div className="flex items-center justify-between gap-8">

            {/* Left: Mobile Menu + Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-text-dark hover:bg-surface rounded-2xl transition-all"
              >
                <Menu size={24} strokeWidth={2.5} />
              </button>
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-2xl bg-primary-blue text-white flex items-center justify-center text-xl font-black shadow-lg shadow-primary-blue/20 transform group-hover:scale-110 transition-transform">
                  P
                </div>
                <div className="flex flex-col -gap-1">
                  <span className="font-display font-black text-2xl text-primary-blue tracking-tighter">PrintCraft</span>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-text-light/50 -mt-1 ml-0.5">Professional</span>
                </div>
              </Link>
            </div>

            {/* Center: Interactive Search (Desktop) */}
            <div className="hidden lg:flex flex-1 max-w-[500px] relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-light/40">
                <Search size={20} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder="Find business cards, flyers..."
                className="w-full h-14 bg-surface border border-transparent rounded-[20px] pl-14 pr-32 text-[15px] font-bold text-text-dark placeholder:text-text-light/30 focus:outline-none focus:bg-white focus:border-primary-blue/20 focus:ring-4 focus:ring-primary-blue/5 transition-all"
              />
              <button className="absolute right-2 top-2 bottom-2 px-6 bg-primary-blue text-white text-[13px] font-black uppercase tracking-widest rounded-[14px] hover:bg-blue-600 shadow-lg shadow-primary-blue/10 active:scale-95 transition-all">
                Search
              </button>
            </div>

            {/* Right: Actions & User */}
            <div className="flex items-center gap-2 sm:gap-6">
              <div className="hidden xl:flex items-center gap-6">
                <div className="flex items-center gap-2 text-[12px] font-black text-text-light/60 uppercase tracking-widest cursor-pointer hover:text-primary-blue transition-colors">
                  <MapPin size={16} /> IN
                </div>
                <div className="h-6 w-px bg-border/50"></div>
                <Link to="/login" className="text-[13px] font-black text-text-dark uppercase tracking-widest hover:text-primary-blue transition-colors">Sign In</Link>
              </div>

              <div className="flex items-center gap-2">
                <Link to="/cart" className="relative w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-surface transition-colors group">
                  <ShoppingBag size={24} strokeWidth={2} className="text-text-dark group-hover:text-primary-blue" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-accent-orange text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-lg">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <Link to="/signup" className="hidden sm:block">
                  <Button className="h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary-blue/10">Start Project</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* S2: Elegant Sub-navigation (Desktop) */}
        <nav className="hidden lg:block border-t border-border/30 mt-4">
          <div className="max-w-7xl mx-auto px-8 xl:px-20">
            <ul className="flex items-center justify-center gap-10">
              {categories.map((item) => (
                <li key={item} className="relative group/nav">
                  <Link
                    to={`/products?category=${encodeURIComponent(item)}`}
                    className="h-14 flex items-center text-[13px] font-black text-text-light/70 uppercase tracking-widest hover:text-primary-blue transition-colors relative"
                  >
                    {item}
                    <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-blue rounded-full scale-x-0 group-hover/nav:scale-x-100 transition-transform origin-left" />
                  </Link>
                </li>
              ))}
              <li className="relative group cursor-pointer">
                <div className="h-14 flex items-center gap-2 text-[13px] font-black text-primary-blue uppercase tracking-widest">
                  Explore All
                  <ChevronDown size={14} strokeWidth={3} className="group-hover:rotate-180 transition-transform duration-300" />
                </div>

                {/* Modern Mega Menu */}
                <div className="absolute top-full right-0 w-[840px] bg-white rounded-[40px] shadow-2xl border border-border/50 overflow-hidden opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-500 z-50">
                  <div className="grid grid-cols-[1.2fr_1fr] h-[500px]">
                    <div className="p-10 grid grid-cols-2 gap-10">
                      <div>
                        <h4 className="text-[11px] font-black text-text-light uppercase tracking-[0.2em] mb-6">Visual Marketing</h4>
                        <div className="space-y-4">
                          {["Business Cards", "Flyers", "Posters", "Brochures"].map(item => (
                            <Link key={item} to="/" className="flex items-center justify-between group/link">
                              <span className="text-[15px] font-bold text-text-dark group-hover/link:text-primary-blue transition-colors">{item}</span>
                              <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-primary-blue" />
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-text-light uppercase tracking-[0.2em] mb-6">Events & Apparel</h4>
                        <div className="space-y-4">
                          {["T-Shirts", "Tote Bags", "Hoodies", "Cap Designs"].map(item => (
                            <Link key={item} to="/" className="flex items-center justify-between group/link">
                              <span className="text-[15px] font-bold text-text-dark group-hover/link:text-primary-blue transition-colors">{item}</span>
                              <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-primary-blue" />
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="col-span-2 pt-6 border-t border-border/30">
                        <Link to="/" className="flex items-center gap-4 p-5 bg-surface rounded-3xl group/cta">
                          <div className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🏷️</div>
                          <div className="flex-1">
                            <h5 className="font-black text-text-dark text-[15px] uppercase tracking-widest">Seasonal Discounts</h5>
                            <p className="text-[13px] text-text-light font-medium">Save up to 40% on bulk signage orders this week.</p>
                          </div>
                          <ArrowRight size={20} className="text-primary-blue group-hover:translate-x-2 transition-transform" />
                        </Link>
                      </div>
                    </div>

                    <div className="bg-surface p-10 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[100px] opacity-50 -mr-32 -mt-32"></div>
                      <div>
                        <Badge className="bg-primary-blue text-white border-none px-4 py-1.5 font-black uppercase tracking-widest text-[10px] mb-6">Featured This Month</Badge>
                        <h3 className="font-display font-black text-3xl text-text-dark mb-4 leading-tight">Digital to <span className="text-gradient">Physical.</span></h3>
                        <p className="text-text-light font-medium leading-relaxed">Turn your brand assets into premium tactile experiences with our museum-quality printing.</p>
                      </div>
                      <Link to="/" className="mt-8">
                        <Button className="w-full h-16 rounded-[24px] font-black uppercase tracking-widest shadow-2xl shadow-primary-blue/20">Browse All Categories</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* S3: Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-text-dark/40 backdrop-blur-sm z-[110]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            <motion.div
              className="fixed top-0 left-0 h-full w-[320px] bg-white z-[120] shadow-2xl flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="p-8 border-b border-border/50 flex items-center justify-between">
                <span className="font-display font-black text-2xl text-primary-blue">Menu</span>
                <button onClick={closeMobileMenu} className="p-2 bg-surface rounded-xl">
                  <X size={20} strokeWidth={3} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-text-light uppercase tracking-[0.2em]">Top Categories</h4>
                  {categories.map(item => (
                    <Link key={item} to={`/products?category=${encodeURIComponent(item)}`} onClick={closeMobileMenu} className="block text-xl font-black text-text-dark hover:text-primary-blue transition-colors">
                      {item}
                    </Link>
                  ))}
                </div>
                <div className="h-px bg-border/50"></div>
                <div className="space-y-6">
                  <Link to="/login" onClick={closeMobileMenu} className="block text-[15px] font-black text-text-dark uppercase tracking-widest">Account Details</Link>
                  <Link to="/signup" onClick={closeMobileMenu} className="block text-[15px] font-black text-text-dark uppercase tracking-widest">Order History</Link>
                </div>
              </div>
              <div className="p-8 bg-surface">
                <Link to="/products" onClick={closeMobileMenu} className="block">
                  <Button className="w-full h-16 rounded-[24px] font-black uppercase tracking-widest">Get Started</Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* S4: Premium Footer */}
      <footer className="bg-text-dark pt-24 pb-12 overflow-hidden relative">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-blue/10 rounded-full blur-[120px] -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-white text-text-dark flex items-center justify-center text-xl font-black shadow-xl">P</div>
                <span className="font-display font-black text-2xl text-white tracking-tighter">PrintCraft</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Building the future of physical brand presence. Premium quality, delivered globally.
              </p>
              <div className="flex gap-4">
                {['fb', 'ig', 'tw', 'in'].map(i => (
                  <div key={i} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-primary-blue hover:text-white transition-all cursor-pointer">
                    <span className="text-xs font-black uppercase">{i}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 lg:col-span-3 gap-12 sm:gap-16">
              {[
                { title: "Products", links: ["Business Cards", "Marketing Material", "Signage", "Promotional"] },
                { title: "Company", links: ["About Vision", "Sustainability", "Careers", "Press"] },
                { title: "Support", links: ["Help Center", "Design Guide", "Shipping", "Refunds"] },
                { title: "Contact", links: ["Sales Inquiry", "Customer Support", "Partnerships", "Locations"] },
              ].map(group => (
                <div key={group.title}>
                  <h4 className="text-white font-black uppercase tracking-widest text-[11px] mb-8">{group.title}</h4>
                  <div className="flex flex-col gap-5">
                    {group.links.map(link => (
                      <Link key={link} to="/" className="text-gray-400 hover:text-white font-medium transition-colors">{link}</Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-gray-500 text-sm font-medium">© 2025 PrintCraft Systems Inc. All rights reserved.</p>
            <div className="flex items-center gap-8 text-gray-500 text-sm font-medium">
              <Link to="/" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/" className="hover:text-white transition-colors">Cookies</Link>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-success-green" />
              <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em]">SSL Encrypted</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
