import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, NavLink, Navigate, Link, useParams, useNavigate } from "react-router-dom";
import {
  User, Package, MapPin, Heart, Settings as SettingsIcon, LogOut, ChevronRight,
  Loader2, Plus, Trash2, Pencil, Check, ArrowLeft, ShoppingBag, Star,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import { useWishlist } from "@/context/WishlistContext.jsx";
import { myOrders, myOrderDetail } from "@/api/orders";
import * as addressApi from "@/api/addresses";
import * as wishlistApi from "@/api/wishlist";
import { formatPhone, localPhone } from "@/lib/utils";

const ADDRESS_LABELS = ["Home", "Office", "Other"];

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-vp-blue-light text-vp-blue",
  in_production: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-vp-green/15 text-vp-green-dark",
  cancelled: "bg-vp-red-light text-vp-red",
};
const statusLabel = (s) => (s || "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const NAV = [
  { to: "/account/profile", label: "My Profile", icon: User },
  { to: "/account/orders", label: "My Orders", icon: Package },
  { to: "/account/addresses", label: "My Addresses", icon: MapPin },
  { to: "/account/wishlist", label: "Wishlist", icon: Heart },
  { to: "/account/settings", label: "Account Settings", icon: SettingsIcon },
];

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-[12px] text-text-light mb-5">
        <Link to="/" className="hover:text-vp-blue">Home</Link>
        <ChevronRight size={13} />
        <span className="text-text-dark font-medium">My Account</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        {/* Sidebar */}
        <aside>
          <div className="bg-white border border-border-light rounded-lg p-5 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-vp-blue text-white rounded-full flex items-center justify-center text-[18px] font-bold">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-bold text-text-dark truncate">{user?.name}</div>
                <div className="text-[12px] text-text-light truncate">
                  {user?.phone ? formatPhone(user.phone) : user?.email}
                </div>
              </div>
            </div>
          </div>

          <nav className="bg-white border border-border-light rounded-lg overflow-hidden">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-3 text-[14px] border-b border-border-light last:border-b-0 transition-colors ${
                    isActive ? "bg-vp-blue-light text-vp-blue font-semibold" : "text-text-dark hover:bg-surface"
                  }`
                }
              >
                <Icon size={17} /> {label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-3 text-[14px] text-vp-red hover:bg-vp-red-light transition-colors"
            >
              <LogOut size={17} /> Sign out
            </button>
          </nav>
        </aside>

        {/* Content */}
        <section className="min-h-[400px]">
          <Routes>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="*" element={<Navigate to="profile" replace />} />
          </Routes>
        </section>
      </div>
    </div>
  );
}

function PanelHeader({ title, subtitle }) {
  return (
    <div className="mb-5">
      <h1 className="text-[22px] font-bold text-text-dark tracking-tight">{title}</h1>
      {subtitle && <p className="text-[13px] text-text-light mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ── My Profile ──────────────────────────────────────────────────────────────
function Profile() {
  const { user } = useAuth();
  const rows = [
    { label: "First name", value: user?.firstName || user?.name?.split(" ")[0] || "—" },
    { label: "Last name", value: user?.lastName || user?.name?.split(" ").slice(1).join(" ") || "—" },
    { label: "Mobile number", value: user?.phone ? formatPhone(user.phone) : "—" },
    { label: "Email", value: user?.email || "Not added" },
  ];
  return (
    <div>
      <PanelHeader title="My Profile" subtitle="Your personal details" />
      <div className="bg-white border border-border-light rounded-lg divide-y divide-border-light">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between px-5 py-4">
            <span className="text-[13px] text-text-light">{r.label}</span>
            <span className="text-[14px] font-medium text-text-dark">{r.value}</span>
          </div>
        ))}
      </div>
      <p className="text-[12px] text-text-light mt-3">
        Your mobile number is the identifier for your account and can't be changed here.
      </p>
    </div>
  );
}

// ── My Orders ─────────────────────────────────────────────────────────────
function Orders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await myOrders();
        if (!cancelled) setOrders(Array.isArray(data) ? data : data?.items || []);
      } catch (err) {
        if (!cancelled) { setError(err?.message || "Could not load orders"); setOrders([]); }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (orders === null) {
    return <div className="flex items-center gap-2 text-text-light py-16 justify-center"><Loader2 size={18} className="animate-spin" /> Loading orders…</div>;
  }

  return (
    <div>
      <PanelHeader title="My Orders" subtitle={orders.length ? `${orders.length} order${orders.length === 1 ? "" : "s"}` : undefined} />
      {error && <div className="mb-4 px-4 py-3 bg-vp-red-light border border-vp-red/20 text-vp-red text-[13px] rounded-sm">{error}</div>}

      {orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          text="When you place an order it'll show up here so you can track and reorder it."
          cta={{ to: "/products", label: "Start shopping" }}
        />
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link
              key={o.id || o._id}
              to={`/account/orders/${o.id || o._id}`}
              className="block bg-white border border-border-light rounded-lg p-4 hover:border-vp-blue hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-text-dark">{o.orderNumber}</span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[o.status] || "bg-surface text-text-medium"}`}>
                      {statusLabel(o.status)}
                    </span>
                  </div>
                  <div className="text-[12px] text-text-light mt-1">
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
                    {" · "}
                    {o.items?.length || 0} item{(o.items?.length || 0) === 1 ? "" : "s"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[15px] font-bold text-text-dark">{inr(o.total)}</span>
                  <ChevronRight size={16} className="text-text-light" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await myOrderDetail(id);
        if (!cancelled) setOrder(data);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Order not found");
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (error) {
    return (
      <div>
        <BackLink to="/account/orders" label="Back to orders" />
        <div className="px-4 py-3 bg-vp-red-light border border-vp-red/20 text-vp-red text-[13px] rounded-sm">{error}</div>
      </div>
    );
  }
  if (!order) return <div className="flex items-center gap-2 text-text-light py-16 justify-center"><Loader2 size={18} className="animate-spin" /> Loading…</div>;

  return (
    <div>
      <BackLink to="/account/orders" label="Back to orders" />
      <div className="flex items-center gap-3 mb-1">
        <h1 className="text-[22px] font-bold text-text-dark tracking-tight">{order.orderNumber}</h1>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[order.status] || "bg-surface text-text-medium"}`}>
          {statusLabel(order.status)}
        </span>
      </div>
      <p className="text-[13px] text-text-light mb-5">
        Placed {order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
      </p>

      <div className="bg-white border border-border-light rounded-lg overflow-hidden mb-5">
        {order.items?.map((it, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-border-light last:border-b-0">
            <div>
              <div className="text-[14px] font-medium text-text-dark">{it.productName || "Item"}</div>
              {it.variant && <div className="text-[12px] text-text-light">{it.variant}</div>}
              <div className="text-[12px] text-text-light">Qty {it.qty} × {inr(it.unitPrice)}</div>
            </div>
            <span className="text-[14px] font-semibold text-text-dark">{inr(it.unitPrice * it.qty)}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border-light rounded-lg p-5 mb-5 max-w-[360px] ml-auto space-y-2 text-[13px]">
        <Row label="Subtotal" value={inr(order.subtotal)} />
        {order.discount > 0 && <Row label="Discount" value={`– ${inr(order.discount)}`} />}
        <Row label="Delivery" value={order.deliveryFee ? inr(order.deliveryFee) : "Free"} />
        <div className="border-t border-border-light pt-2 mt-2 flex justify-between text-[15px] font-bold text-text-dark">
          <span>Total</span><span>{inr(order.total)}</span>
        </div>
      </div>

      {order.address && (
        <div className="bg-white border border-border-light rounded-lg p-5">
          <h3 className="text-[13px] font-bold text-text-dark mb-2">Delivery address</h3>
          <p className="text-[13px] text-text-medium leading-relaxed">
            {order.address.name}<br />
            {[order.address.line1, order.address.line2].filter(Boolean).join(", ")}<br />
            {[order.address.city, order.address.state, order.address.pincode].filter(Boolean).join(", ")}<br />
            {order.address.phone && <>📞 {order.address.phone}</>}
          </p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return <div className="flex justify-between text-text-medium"><span>{label}</span><span className="font-medium text-text-dark">{value}</span></div>;
}

// ── My Addresses ──────────────────────────────────────────────────────────
const emptyAddress = () => ({ id: "", label: "Home", name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", isDefault: false });

function Addresses() {
  const { user } = useAuth();
  const [list, setList] = useState(null);
  const [editing, setEditing] = useState(null); // address object or null
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const reload = async () => {
    try { setList(await addressApi.list()); }
    catch (err) { setError(err?.message || "Could not load addresses"); setList([]); }
  };
  useEffect(() => { reload(); }, []);

  const startNew = () => setEditing({ ...emptyAddress(), name: user?.name || "", phone: user?.phone ? localPhone(user.phone) : "" });
  const startEdit = (a) => setEditing({ ...a });

  const save = async (addr) => {
    setBusy(true);
    setError("");
    try {
      const { id, ...payload } = addr;
      if (id) await addressApi.update(id, payload);
      else await addressApi.create(payload);
      setEditing(null);
      await reload();
    } catch (err) {
      setError(err?.message || "Could not save address");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => { await addressApi.remove(id); await reload(); };
  const makeDefault = async (id) => { await addressApi.setDefault(id); await reload(); };

  if (editing) {
    return <AddressForm initial={editing} busy={busy} error={error} onCancel={() => { setEditing(null); setError(""); }} onSave={save} />;
  }

  if (list === null) {
    return <div className="flex items-center gap-2 text-text-light py-16 justify-center"><Loader2 size={18} className="animate-spin" /> Loading addresses…</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-text-dark tracking-tight">My Addresses</h1>
          <p className="text-[13px] text-text-light mt-0.5">Saved delivery addresses for faster checkout</p>
        </div>
        <button onClick={startNew} className="h-10 px-4 bg-vp-blue text-white rounded-sm text-[13px] font-semibold hover:bg-vp-blue-hover inline-flex items-center gap-1.5">
          <Plus size={15} /> Add address
        </button>
      </div>

      {error && <div className="mb-4 px-4 py-3 bg-vp-red-light border border-vp-red/20 text-vp-red text-[13px] rounded-sm">{error}</div>}

      {list.length === 0 ? (
        <EmptyState icon={MapPin} title="No saved addresses" text="Add an address to check out faster next time." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {list.map((a) => (
            <div key={a.id} className="bg-white border border-border-light rounded-lg p-4 relative">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wide text-text-medium bg-surface border border-border-light px-2 py-0.5 rounded-full">{a.label}</span>
                {a.isDefault && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-vp-blue bg-vp-blue-light px-2 py-0.5 rounded-full">
                    <Star size={10} className="fill-vp-blue" /> Default
                  </span>
                )}
              </div>
              <div className="text-[14px] font-bold text-text-dark">{a.name}</div>
              <p className="text-[13px] text-text-medium mt-1 leading-relaxed">
                {[a.line1, a.line2].filter(Boolean).join(", ")}<br />
                {[a.city, a.state, a.pincode].filter(Boolean).join(", ")}<br />
                {a.phone && <>📞 +91 {a.phone}</>}
              </p>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border-light text-[12px]">
                <button onClick={() => startEdit(a)} className="inline-flex items-center gap-1 text-vp-blue hover:underline"><Pencil size={12} /> Edit</button>
                {!a.isDefault && <button onClick={() => makeDefault(a.id)} className="inline-flex items-center gap-1 text-text-medium hover:text-vp-blue"><Star size={12} /> Set default</button>}
                <button onClick={() => remove(a.id)} className="inline-flex items-center gap-1 text-vp-red hover:underline ml-auto"><Trash2 size={12} /> Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddressForm({ initial, busy, error, onCancel, onSave }) {
  const [a, setA] = useState(initial);
  const set = (patch) => setA((x) => ({ ...x, ...patch }));
  const valid = a.name.trim() && a.line1.trim() && a.city.trim() && /^\d{6}$/.test(a.pincode) && /^\d{10}$/.test(a.phone);

  const f = "w-full h-10 px-3 border border-border rounded-sm text-[14px] focus:outline-none focus:border-vp-blue";
  return (
    <div>
      <BackLink onClick={onCancel} label="Back to addresses" />
      <h1 className="text-[22px] font-bold text-text-dark tracking-tight mb-5">{a.id ? "Edit address" : "Add address"}</h1>
      {error && <div className="mb-4 px-4 py-3 bg-vp-red-light border border-vp-red/20 text-vp-red text-[13px] rounded-sm max-w-[560px]">{error}</div>}
      <form
        onSubmit={(e) => { e.preventDefault(); if (valid && !busy) onSave(a); }}
        className="bg-white border border-border-light rounded-lg p-5 space-y-4 max-w-[560px]"
      >
        <Labeled label="Address type">
          <div className="flex gap-2">
            {ADDRESS_LABELS.map((lbl) => (
              <button
                key={lbl}
                type="button"
                onClick={() => set({ label: lbl })}
                className={`h-9 px-4 rounded-sm text-[13px] font-medium border transition-colors ${a.label === lbl ? "bg-vp-blue text-white border-vp-blue" : "border-border text-text-dark hover:border-vp-blue"}`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </Labeled>
        <div className="grid grid-cols-2 gap-3">
          <Labeled label="Full name"><input className={f} value={a.name} onChange={(e) => set({ name: e.target.value })} /></Labeled>
          <Labeled label="Mobile (10 digit)"><input className={f} inputMode="numeric" value={a.phone} onChange={(e) => set({ phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} /></Labeled>
        </div>
        <Labeled label="Address line 1"><input className={f} value={a.line1} onChange={(e) => set({ line1: e.target.value })} /></Labeled>
        <Labeled label="Address line 2 (optional)"><input className={f} value={a.line2} onChange={(e) => set({ line2: e.target.value })} /></Labeled>
        <div className="grid grid-cols-3 gap-3">
          <Labeled label="City"><input className={f} value={a.city} onChange={(e) => set({ city: e.target.value })} /></Labeled>
          <Labeled label="State"><input className={f} value={a.state} onChange={(e) => set({ state: e.target.value })} /></Labeled>
          <Labeled label="PIN code"><input className={f} inputMode="numeric" value={a.pincode} onChange={(e) => set({ pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} /></Labeled>
        </div>
        <label className="flex items-center gap-2 text-[13px] text-text-medium cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-vp-blue" checked={a.isDefault} onChange={(e) => set({ isDefault: e.target.checked })} />
          Set as default address
        </label>
        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={!valid || busy} className="h-10 px-5 bg-vp-blue text-white rounded-sm text-[13px] font-semibold hover:bg-vp-blue-hover disabled:opacity-50 inline-flex items-center gap-1.5">
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Save address
          </button>
          <button type="button" onClick={onCancel} className="h-10 px-5 border border-border rounded-sm text-[13px] font-medium text-text-dark hover:bg-surface">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function Labeled({ label, children }) {
  return <label className="block"><span className="block text-[12px] font-semibold text-text-dark mb-1">{label}</span>{children}</label>;
}

// ── Wishlist ────────────────────────────────────────────────────────────────
function Wishlist() {
  const { refresh } = useWishlist();
  const [items, setItems] = useState(null);

  const load = async () => {
    try { setItems(await wishlistApi.list()); }
    catch { setItems([]); }
  };
  useEffect(() => { load(); }, []);

  const removeFromWishlist = async (id) => {
    await wishlistApi.remove(id);
    setItems((cur) => (cur || []).filter((p) => p.id !== id));
    refresh(); // keep header count + heart states in sync
  };

  if (items === null) {
    return <div className="flex items-center gap-2 text-text-light py-16 justify-center"><Loader2 size={18} className="animate-spin" /> Loading wishlist…</div>;
  }

  return (
    <div>
      <PanelHeader title="Wishlist" subtitle={items.length ? `${items.length} saved` : undefined} />
      {items.length === 0 ? (
        <EmptyState icon={Heart} title="Your wishlist is empty" text="Tap the heart on any product to save it here." cta={{ to: "/products", label: "Browse products" }} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((p) => (
            <div key={p.id} className="bg-white border border-border-light rounded-lg overflow-hidden group relative">
              <Link to={`/business-cards?slug=${encodeURIComponent(p.slug)}`} className="block">
                <div className="aspect-square bg-surface overflow-hidden">
                  {p.images?.[0]
                    ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    : <div className="w-full h-full flex items-center justify-center text-text-light"><ShoppingBag size={26} /></div>}
                </div>
                <div className="p-3">
                  <div className="text-[13px] font-semibold text-text-dark line-clamp-2 leading-tight min-h-[34px]">{p.name}</div>
                  <div className="text-[14px] font-bold text-vp-blue mt-1">{inr(p.basePrice)}</div>
                </div>
              </Link>
              <button
                onClick={() => removeFromWishlist(p.id)}
                aria-label="Remove from wishlist"
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-vp-red flex items-center justify-center shadow-sm hover:bg-white"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Account settings ────────────────────────────────────────────────────────
function AccountSettings() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div>
      <PanelHeader title="Account Settings" subtitle="Manage notifications and your session" />
      <div className="bg-white border border-border-light rounded-lg divide-y divide-border-light">
        <ToggleRow label="Order updates over SMS" desc="Get a text when your order ships." defaultOn />
        <ToggleRow label="Promotions & offers" desc="Occasional deals and discount codes." />
        <ToggleRow label="Design tips newsletter" desc="Monthly printing & design ideas." />
      </div>
      <button
        onClick={async () => { await logout(); navigate("/", { replace: true }); }}
        className="mt-5 h-10 px-5 border border-vp-red/30 text-vp-red rounded-sm text-[13px] font-semibold hover:bg-vp-red-light inline-flex items-center gap-2"
      >
        <LogOut size={15} /> Sign out of this device
      </button>
    </div>
  );
}

function ToggleRow({ label, desc, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div>
        <div className="text-[14px] font-medium text-text-dark">{label}</div>
        <div className="text-[12px] text-text-light">{desc}</div>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className={`w-11 h-6 rounded-full p-0.5 transition-colors ${on ? "bg-vp-blue" : "bg-border"}`}
        aria-pressed={on}
      >
        <span className={`block w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${on ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}

// ── Shared bits ─────────────────────────────────────────────────────────────
function EmptyState({ icon: Icon, title, text, cta }) {
  return (
    <div className="bg-white border border-border-light rounded-lg py-16 px-6 text-center">
      <div className="w-14 h-14 mx-auto rounded-full bg-surface flex items-center justify-center text-text-light mb-4"><Icon size={24} /></div>
      <h3 className="text-[16px] font-bold text-text-dark mb-1">{title}</h3>
      <p className="text-[13px] text-text-light max-w-[320px] mx-auto mb-5">{text}</p>
      {cta && <Link to={cta.to} className="inline-flex h-10 px-5 items-center bg-vp-blue text-white rounded-sm text-[13px] font-semibold hover:bg-vp-blue-hover">{cta.label}</Link>}
    </div>
  );
}

function BackLink({ to, onClick, label }) {
  const cls = "inline-flex items-center gap-1.5 text-[13px] text-text-light hover:text-vp-blue mb-4";
  return to
    ? <Link to={to} className={cls}><ArrowLeft size={14} /> {label}</Link>
    : <button onClick={onClick} className={cls}><ArrowLeft size={14} /> {label}</button>;
}
