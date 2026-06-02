import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Outlet, Link } from "react-router-dom";
import { Search, ShoppingCart, X, ChevronDown, ChevronRight, Menu, User, Phone, HelpCircle, MapPin, Heart, Facebook, Instagram, Twitter, Youtube, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext.jsx";

const megaMenu = {
  "View All": [
    {
      heading: "Business Essentials",
      links: ["Visiting Cards", "Signs & Posters", "Marketing Materials", "Stationery, Letterheads & Billbooks", "Labels & Stickers", "Office Supplies"],
    },
    {
      heading: "Love Your New Look",
      links: ["Clothing", "Caps", "Bags", "T-Shirts", "Polo T-Shirts", "Custom Office Shirts"],
    },
    {
      heading: "Made By You",
      links: ["Photo Albums", "Personalized Pens", "Calendars"],
    },
    {
      heading: "Home & Gifts",
      links: ["Mugs", "Drinkware", "Gift Hampers"],
    },
  ],
  "Visiting Cards": [
    { heading: "Visiting Cards", links: ["Standard VC", "Classic VC", "Round Corner VC", "Square VC", "Shape VC"] },
    { heading: "Digital Visiting Cards", links: ["QR Code VC"] },
    { heading: "Brilliant Finishes", links: ["Spot UV Visiting Cards", "Foil Visiting Cards"] },
    { heading: "Standard Papers", links: ["Glossy Visiting Cards", "Matte Visiting Cards"] },
    { heading: "Premium Papers", links: ["Non Tearable Visiting Cards", "Metallic Sparkle Visiting Cards", "Kraft Visiting Cards"] },
  ],
  "Stationery & Letterheads": [
    { heading: "Custom Stationery", links: ["Letterheads", "Billbooks", "Custom Mouse Pads", "Bulk Letterheads", "Custom Pens"] },
    { heading: "Office Supplies", links: ["Lanyards", "ID Cards", "Invoice Books", "Custom Certificates", "Cash Vouchers", "Paper Identity Cards", "Employee Welcome Kit"] },
    { heading: "Custom Keychain", links: ["Acrylic Keychain", "Metal Keychains", "Custom Keychains"] },
    { heading: "Wedding Stationery", links: ["Wedding Invitations", "Save the Date Cards", "Wedding Menu"] },
    { heading: "Invitations & Announcements", links: ["Thank You Cards", "Invitations (Wedding, Birthday, Party)", "Gift Tags"] },
  ],
  "Signs, Posters & Marketing": [
    { heading: "Signs and Posters", links: ["Standees", "Posters", "Banners", "Foam Boards", "Tabletop Signs", "Tent Cards"] },
    { heading: "Marketing Materials", links: ["Flyers", "Brochures", "Booklets", "Postcards", "Bookmarks"] },
    { heading: "More in Marketing", links: ["Menu Cards", "Loyalty Cards", "Paper Bags", "Custom Keychains", "QR Code Stand"] },
    { heading: "More in Signs", links: ["Outdoor Signs"] },
  ],
  "Labels, Stickers & Packaging": [
    { heading: "Custom Packaging", links: ["Custom Paper Bags", "Printed Carry Bags"] },
    { heading: "Custom Stickers", links: ["Sheet Stickers", "Shape Stickers", "QR Code Stickers", "Visiting Cards Stickers", "Transparent Stickers"] },
    { heading: "Tags", links: ["Hand Tags", "Baggage Tags", "Name Tags"] },
  ],
  "Clothing & Caps": [
    { heading: "T-Shirts", links: ["Mens T-Shirts", "Womens T-Shirts", "Kids T-Shirts"] },
    { heading: "Polo T-Shirts", links: ["Mens Polo T-Shirts", "Womens Polo T-Shirts"] },
    { heading: "Shirts", links: ["Mens Embroidered Shirts", "Womens Embroidered Shirts"] },
    { heading: "Caps", links: ["Embroidered Caps", "Printed Caps"] },
  ],
  "Mugs, Albums & Gifts": [
    { heading: "Mugs", links: ["Personalised Mugs", "Color Changing Mugs"] },
    { heading: "Drinkware", links: ["Bottle", "Tumbler", "Thermos Bottle"] },
    { heading: "Pen", links: ["Customised Pen"] },
    { heading: "Calendars", links: ["Desk Calendars", "Wall Calendars", "Flip Desk Calendars", "Poster Calendars", "Photo Calendars"] },
  ],
};

const navItems = Object.keys(megaMenu);

export default function Layout() {
  const [showBanner, setShowBanner] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileExpanded(null);
  };

  // Click-outside for the user menu
  useEffect(() => {
    if (!userMenuOpen) return;
    const onClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [userMenuOpen]);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Promo strip (red) */}
      {showBanner && (
        <div className="bg-vp-red text-white text-[12px] relative">
          <div className="max-w-[1400px] mx-auto px-4 py-2 flex items-center justify-center text-center">
            <span className="font-semibold">Get 30% OFF your first order. Use code <span className="underline">PRINT30</span> at checkout.</span>
            <button
              onClick={() => setShowBanner(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1"
              aria-label="Close announcement"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* Utility bar */}
      <div className="hidden lg:block bg-white border-b border-border-light">
        <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-end gap-6 h-8 text-[12px] text-text-light">
          <a href="#" className="flex items-center gap-1.5 hover:text-vp-blue"><Phone size={12} /> 1800-419-2007</a>
          <a href="#" className="flex items-center gap-1.5 hover:text-vp-blue"><HelpCircle size={12} /> Help &amp; FAQ</a>
          <a href="#" className="flex items-center gap-1.5 hover:text-vp-blue"><MapPin size={12} /> Track Order</a>
          <span className="flex items-center gap-1.5">EN · INR</span>
        </div>
      </div>

      {/* Main header */}
      <header
        className="sticky top-0 z-50 bg-white border-b border-border-light"
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center gap-6 h-16">
            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-text-dark"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 bg-vp-blue text-white flex items-center justify-center font-bold text-lg rounded-sm">
                P
              </div>
              <span className="font-bold text-[20px] text-vp-blue tracking-tight hidden sm:inline">Pune Prints</span>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-[640px] mx-auto hidden md:block">
              <div className="relative flex h-10 border border-border rounded-sm overflow-hidden focus-within:border-vp-blue">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="flex-1 px-4 text-[14px] outline-none placeholder:text-text-muted"
                />
                <button className="bg-vp-blue text-white px-5 hover:bg-vp-blue-hover flex items-center" aria-label="Search">
                  <Search size={18} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2 ml-auto">
              {isAuthenticated ? (
                <div className="relative hidden lg:block" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 px-3 py-2 text-[13px] text-text-dark hover:text-vp-blue"
                  >
                    <span className="w-7 h-7 bg-vp-blue text-white rounded-full flex items-center justify-center text-[12px] font-semibold">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </span>
                    <span className="font-medium max-w-[120px] truncate">{user?.name?.split(" ")[0]}</span>
                    <ChevronDown size={14} className={userMenuOpen ? "rotate-180" : ""} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-border-light rounded-sm shadow-card-hover py-1 z-50">
                      <div className="px-4 py-2 border-b border-border-light">
                        <div className="text-[13px] font-semibold text-text-dark truncate">{user?.name}</div>
                        <div className="text-[11px] text-text-light truncate">{user?.email}</div>
                      </div>
                      <Link
                        to="/cart"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-[13px] text-text-dark hover:bg-vp-blue-light"
                      >
                        <ShoppingCart size={14} /> My cart
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-[13px] text-text-dark hover:bg-vp-red-light hover:text-vp-red border-t border-border-light"
                      >
                        <LogOut size={14} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="hidden lg:flex items-center gap-2 px-3 py-2 text-[13px] text-text-dark hover:text-vp-blue">
                  <User size={18} strokeWidth={1.75} />
                  <span className="font-medium">Sign In</span>
                </Link>
              )}
              <button className="hidden md:flex items-center gap-2 px-3 py-2 text-[13px] text-text-dark hover:text-vp-blue" aria-label="Wishlist">
                <Heart size={18} strokeWidth={1.75} />
              </button>
              <Link to="/cart" className="relative flex items-center gap-2 px-3 py-2 text-[13px] text-text-dark hover:text-vp-blue">
                <ShoppingCart size={20} strokeWidth={1.75} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 min-w-[18px] h-[18px] bg-vp-red text-white text-[10px] font-bold flex items-center justify-center rounded-full px-1">
                    {totalItems}
                  </span>
                )}
                <span className="hidden sm:inline font-medium">Cart</span>
              </Link>
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden pb-3">
            <div className="relative flex h-10 border border-border rounded-sm overflow-hidden focus-within:border-vp-blue">
              <input
                type="text"
                placeholder="What are you looking for?"
                className="flex-1 px-4 text-[14px] outline-none placeholder:text-text-muted"
              />
              <button className="bg-vp-blue text-white px-4" aria-label="Search">
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Category nav (desktop) */}
        <nav className="hidden lg:block border-t border-border-light relative bg-white">
          <div className="max-w-[1400px] mx-auto px-4">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li
                  key={item}
                  onMouseEnter={() => setActiveMenu(item)}
                  className="relative"
                >
                  <button
                    className={`relative h-11 px-3 text-[13px] font-medium whitespace-nowrap transition-colors ${
                      activeMenu === item
                        ? "text-vp-blue"
                        : "text-text-dark hover:text-vp-blue"
                    }`}
                  >
                    {item}
                    {activeMenu === item && (
                      <span className="absolute bottom-0 left-2 right-2 h-[3px] bg-vp-blue" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Mega menu */}
          <AnimatePresence>
            {activeMenu && (
              <motion.div
                key={activeMenu}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full bg-white border-t border-border-light shadow-lg z-40"
              >
                <div className="max-w-[1400px] mx-auto px-4 py-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {megaMenu[activeMenu].map((col) => (
                      <div key={col.heading}>
                        <h4 className="text-[13px] font-bold text-text-dark mb-3 pb-2 border-b border-border-light">
                          {col.heading}
                        </h4>
                        <ul className="space-y-2">
                          {col.links.map((link) => (
                            <li key={link}>
                              <Link
                                to={`/products?category=${encodeURIComponent(link)}`}
                                onClick={() => setActiveMenu(null)}
                                className="text-[13px] text-text-medium hover:text-vp-blue hover:underline block"
                              >
                                {link}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-border-light">
                    <Link
                      to={`/products?category=${encodeURIComponent(activeMenu)}`}
                      onClick={() => setActiveMenu(null)}
                      className="inline-flex items-center gap-1 text-[13px] font-semibold text-vp-blue hover:underline"
                    >
                      See All {activeMenu}
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-[110] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            <motion.div
              className="fixed top-0 left-0 h-full w-[320px] bg-white z-[120] shadow-2xl flex flex-col lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25 }}
            >
              <div className="p-4 border-b border-border-light flex items-center justify-between bg-vp-blue text-white">
                <span className="font-bold text-lg">Menu</span>
                <button onClick={closeMobileMenu} className="p-2" aria-label="Close menu">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="py-2">
                  {navItems.map((item) => (
                    <div key={item} className="border-b border-border-light">
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === item ? null : item)}
                        className="w-full flex items-center justify-between px-4 py-3 text-[14px] font-semibold text-text-dark"
                      >
                        {item}
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${mobileExpanded === item ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileExpanded === item && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden bg-surface-alt"
                          >
                            <div className="px-4 py-3 space-y-4">
                              {megaMenu[item].map((col) => (
                                <div key={col.heading}>
                                  <h5 className="text-[11px] font-bold text-text-light uppercase tracking-wide mb-2">
                                    {col.heading}
                                  </h5>
                                  <ul className="space-y-2">
                                    {col.links.map((link) => (
                                      <li key={link}>
                                        <Link
                                          to={`/products?category=${encodeURIComponent(link)}`}
                                          onClick={closeMobileMenu}
                                          className="text-[13px] text-text-dark hover:text-vp-blue block"
                                        >
                                          {link}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border-light px-4 py-4 space-y-3">
                  {isAuthenticated ? (
                    <>
                      <div className="text-[13px] text-text-light">
                        Signed in as <span className="font-semibold text-text-dark">{user?.email}</span>
                      </div>
                      <button
                        onClick={() => { handleLogout(); closeMobileMenu(); }}
                        className="flex items-center gap-2 text-[14px] text-vp-red"
                      >
                        <LogOut size={16} /> Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={closeMobileMenu} className="flex items-center gap-2 text-[14px] text-text-dark">
                        <User size={16} /> Sign In
                      </Link>
                      <Link to="/signup" onClick={closeMobileMenu} className="flex items-center gap-2 text-[14px] text-text-dark">
                        <User size={16} /> Create Account
                      </Link>
                    </>
                  )}
                  <a href="#" className="flex items-center gap-2 text-[14px] text-text-dark">
                    <Phone size={16} /> 1800-419-2007
                  </a>
                  <a href="#" className="flex items-center gap-2 text-[14px] text-text-dark">
                    <HelpCircle size={16} /> Help &amp; FAQ
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 bg-white">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-vp-blue text-white">
        <div className="max-w-[1400px] mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {[
              { title: "Shop", links: ["Visiting Cards", "Marketing Materials", "Signs &amp; Posters", "Stationery", "Labels &amp; Stickers", "Clothing", "Mugs &amp; Gifts"] },
              { title: "Help", links: ["Contact Us", "Help &amp; FAQ", "Order Status", "Shipping Info", "Returns", "Design Help"] },
              { title: "Company", links: ["About Us", "Careers", "Press", "Sustainability", "Investor Relations"] },
              { title: "Resources", links: ["Design Tips", "Blog", "Templates", "File Setup", "Bulk Orders"] },
            ].map((group) => (
              <div key={group.title}>
                <h4 className="text-[13px] font-bold uppercase tracking-wide mb-4">{group.title}</h4>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[13px] text-white/80 hover:text-white hover:underline" dangerouslySetInnerHTML={{ __html: link }} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <h4 className="text-[13px] font-bold uppercase tracking-wide mb-4">Stay Updated</h4>
              <p className="text-[13px] text-white/80 mb-3">Get exclusive offers &amp; design tips in your inbox.</p>
              <form className="flex h-10 mb-4">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 text-[13px] text-text-dark rounded-l-sm outline-none bg-white"
                />
                <button className="bg-vp-yellow text-vp-blue px-4 text-[13px] font-semibold rounded-r-sm hover:bg-yellow-400">
                  Subscribe
                </button>
              </form>
              <div className="flex gap-3">
                {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 border border-white/30 hover:border-white hover:bg-white/10 flex items-center justify-center rounded-sm"
                    aria-label="Social"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/15">
          <div className="max-w-[1400px] mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-[12px] text-white/70">
            <p>© 2026 Pune Prints. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Cookies</a>
              <a href="#" className="hover:text-white">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
