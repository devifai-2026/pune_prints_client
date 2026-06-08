import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Mail, Phone, MessageCircle, MapPin, Clock, Check, Loader2, Send } from "lucide-react";
import { publicMap as fetchSettings } from "@/api/settings";
import { submit as submitContact } from "@/api/contact";
import { useAuth } from "@/context/AuthContext.jsx";
import { contactPrefillFromUser } from "@/lib/utils";

export default function ContactPage() {
  const { user } = useAuth();
  const [info, setInfo] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchSettings().then((m) => { if (!cancelled) setInfo(m?.site_pages?.contact || {}); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Prefill identity fields from the signed-in user (without clobbering edits).
  useEffect(() => {
    if (user) setForm((f) => ({ ...f, ...contactPrefillFromUser(user) }));
  }, [user]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) { setError("Please fill name, email and a message."); return; }
    setSubmitting(true);
    try { await submitContact(form); setDone(true); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }
    catch (err) { setError(err?.message || "Something went wrong."); }
    finally { setSubmitting(false); }
  };

  const c = info || {};
  const channels = [
    c.email && { icon: Mail, label: "Email", value: c.email, href: `mailto:${c.email}` },
    c.phone && { icon: Phone, label: "Call us", value: c.phone, href: `tel:${c.phone}` },
    c.whatsapp && { icon: MessageCircle, label: "WhatsApp", value: c.whatsapp, href: `https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}` },
  ].filter(Boolean);

  return (
    <div className="bg-white">
      <div className="bg-surface-alt border-b border-border-light">
        <div className="max-w-[1100px] mx-auto px-4 py-3 text-[12px] text-text-light flex items-center gap-1.5">
          <Link to="/" className="hover:text-vp-blue">Home</Link><ChevronRight size={12} /><span className="text-text-dark">Contact</span>
        </div>
      </div>

      <section className="bg-gradient-to-b from-vp-blue-light/50 to-white">
        <div className="max-w-[900px] mx-auto px-4 pt-12 pb-8 text-center">
          <h1 className="text-[32px] lg:text-[40px] font-bold text-text-dark tracking-tight">{c.title || "Contact Us"}</h1>
          {c.subtitle && <p className="text-[16px] text-text-medium mt-3 max-w-[620px] mx-auto">{c.subtitle}</p>}
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10">
        {/* Left: contact details */}
        <div className="space-y-4">
          {channels.map((ch, i) => (
            <a key={i} href={ch.href} className="flex items-center gap-4 p-4 border border-border-light rounded-xl hover:border-vp-blue hover:shadow-card transition-all">
              <div className="w-11 h-11 rounded-lg bg-vp-blue-light text-vp-blue flex items-center justify-center shrink-0"><ch.icon size={20} /></div>
              <div>
                <div className="text-[12px] text-text-light">{ch.label}</div>
                <div className="text-[15px] font-semibold text-text-dark">{ch.value}</div>
              </div>
            </a>
          ))}
          {c.address && (
            <div className="flex items-start gap-4 p-4 border border-border-light rounded-xl">
              <div className="w-11 h-11 rounded-lg bg-vp-blue-light text-vp-blue flex items-center justify-center shrink-0"><MapPin size={20} /></div>
              <div>
                <div className="text-[12px] text-text-light">Visit us</div>
                <div className="text-[14px] font-medium text-text-dark leading-relaxed">{c.address}</div>
              </div>
            </div>
          )}
          {c.hours && (
            <div className="flex items-center gap-4 p-4 border border-border-light rounded-xl">
              <div className="w-11 h-11 rounded-lg bg-vp-blue-light text-vp-blue flex items-center justify-center shrink-0"><Clock size={20} /></div>
              <div>
                <div className="text-[12px] text-text-light">Hours</div>
                <div className="text-[14px] font-semibold text-text-dark">{c.hours}</div>
              </div>
            </div>
          )}
        </div>

        {/* Right: message form */}
        <div className="bg-surface-alt border border-border-light rounded-2xl p-6 lg:p-8">
          {done ? (
            <div className="py-12 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-vp-green/15 text-vp-green-dark flex items-center justify-center mb-3"><Check size={28} /></div>
              <h3 className="text-[18px] font-bold text-text-dark mb-1">Message sent!</h3>
              <p className="text-[14px] text-text-light">We'll get back to you within one business day.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-[20px] font-bold text-text-dark">Send us a message</h2>
              {error && <div className="px-3.5 py-2.5 bg-vp-red-light border border-vp-red/20 text-vp-red text-[13px] rounded-lg">{error}</div>}
              <div className="grid grid-cols-2 gap-3.5">
                <Field label="Name" required><input value={form.name} onChange={(e) => set({ name: e.target.value })} className={inp} placeholder="Your name" /></Field>
                <Field label="Phone"><input value={form.phone} onChange={(e) => set({ phone: e.target.value })} className={inp} placeholder="+91…" /></Field>
              </div>
              <Field label="Email" required><input type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} className={inp} placeholder="you@example.com" /></Field>
              <Field label="Subject"><input value={form.subject} onChange={(e) => set({ subject: e.target.value })} className={inp} placeholder="What's this about?" /></Field>
              <Field label="Message" required><textarea value={form.message} onChange={(e) => set({ message: e.target.value })} rows={4} className={inp} placeholder="How can we help?" /></Field>
              <button type="submit" disabled={submitting} className="w-full h-12 bg-vp-blue text-white rounded-lg text-[15px] font-semibold hover:bg-vp-blue-hover disabled:opacity-60 inline-flex items-center justify-center gap-2">
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Send message</>}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

const inp = "w-full h-11 px-3.5 border border-border rounded-lg text-[14px] bg-white focus:outline-none focus:border-vp-blue focus:ring-2 focus:ring-vp-blue/15 transition-all";
function Field({ label, required, children }) {
  return <label className="block"><span className="block text-[12.5px] font-semibold text-text-dark mb-1.5">{label}{required && <span className="text-vp-red ml-0.5">*</span>}</span>{children}</label>;
}
