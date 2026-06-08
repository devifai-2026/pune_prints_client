import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Loader2, Palette, Sparkles, Clock, BadgeCheck, ArrowRight } from "lucide-react";
import { submit as submitDesignRequest } from "@/api/designRequests";
import { useAuth } from "@/context/AuthContext.jsx";
import { contactPrefillFromUser } from "@/lib/utils";

/**
 * Premium "Hire a designer" enquiry modal. Controlled via `open` / `onClose`.
 * `productType` pre-fills which product the enquiry is about.
 */
export default function HireDesignerModal({ open, onClose, productType = "" }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", budget: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  // Prefill name/email/phone from the signed-in user each time the modal opens.
  useEffect(() => {
    if (open) { setDone(false); setError(""); setForm((f) => ({ ...f, ...contactPrefillFromUser(user) })); }
  }, [open, user]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim()) { setError("Please add your name and email so we can reach you."); return; }
    setSubmitting(true);
    try {
      await submitDesignRequest({ ...form, productType });
      setDone(true);
      setForm({ name: "", email: "", phone: "", budget: "", message: "" });
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-text-dark/60 backdrop-blur-[2px] z-[300]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="fixed inset-0 z-[310] flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[560px] pointer-events-auto overflow-hidden max-h-[94vh] overflow-y-auto no-scrollbar">
              {/* Hero header */}
              <div className="relative px-7 pt-7 pb-6 text-white overflow-hidden"
                style={{ background: "linear-gradient(135deg, #1a56db 0%, #11317f 100%)" }}>
                <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-vp-yellow/20 blur-3xl pointer-events-none" />
                <button type="button" onClick={onClose} className="absolute top-4 right-4 z-20 w-9 h-9 inline-flex items-center justify-center rounded-full bg-white/20 hover:bg-white/35 text-white transition-colors"><X size={17} /></button>
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 text-[11px] font-semibold mb-3">
                    <Sparkles size={12} className="text-vp-yellow" /> Work with a pro designer
                  </div>
                  <h2 className="text-[24px] font-bold leading-tight">Let's design it together</h2>
                  <p className="text-[13px] text-white/85 mt-1.5">
                    {productType ? `Tell us about your ${productType} and ` : "Share your idea and "}
                    our designers will craft something you'll love.
                  </p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4 text-[12px] text-white/90">
                    <span className="inline-flex items-center gap-1.5"><BadgeCheck size={14} className="text-vp-yellow" /> Free consultation</span>
                    <span className="inline-flex items-center gap-1.5"><Clock size={14} className="text-vp-yellow" /> Reply within 1 business day</span>
                    <span className="inline-flex items-center gap-1.5"><Palette size={14} className="text-vp-yellow" /> Unlimited revisions*</span>
                  </div>
                </div>
              </div>

              {done ? (
                <div className="px-7 py-12 text-center">
                  <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }}
                    className="w-16 h-16 mx-auto rounded-full bg-vp-green/15 text-vp-green-dark flex items-center justify-center mb-4"><Check size={30} /></motion.div>
                  <h3 className="text-[19px] font-bold text-text-dark mb-1.5">Your request is in! 🎉</h3>
                  <p className="text-[14px] text-text-light mb-6 max-w-[360px] mx-auto">A designer from our team will reach out within one business day to get started.</p>
                  <button onClick={onClose} className="h-11 px-7 bg-vp-blue text-white rounded-lg text-[14px] font-semibold hover:bg-vp-blue-hover">Done</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">
                  {error && <div className="px-3.5 py-2.5 bg-vp-red-light border border-vp-red/20 text-vp-red text-[12.5px] rounded-lg">{error}</div>}
                  <div className="grid grid-cols-2 gap-3.5">
                    <FieldM label="Your name" required><input value={form.name} onChange={(e) => set({ name: e.target.value })} className={inp} placeholder="e.g. Aarav Sharma" /></FieldM>
                    <FieldM label="Phone"><input value={form.phone} onChange={(e) => set({ phone: e.target.value })} className={inp} placeholder="+91 98765 43210" /></FieldM>
                  </div>
                  <FieldM label="Email" required><input type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} className={inp} placeholder="you@example.com" /></FieldM>
                  <FieldM label="Budget" hint="Optional — helps us match the right designer."><input value={form.budget} onChange={(e) => set({ budget: e.target.value })} className={inp} placeholder="e.g. ₹2,000 – ₹5,000" /></FieldM>
                  <FieldM label="What would you like designed?"><textarea value={form.message} onChange={(e) => set({ message: e.target.value })} rows={3} className={inp} placeholder="Describe your brand, style you like, deadline, anything that helps…" /></FieldM>
                  <button type="submit" disabled={submitting}
                    className="group w-full h-12 bg-vp-blue text-white rounded-lg text-[15px] font-semibold hover:bg-vp-blue-hover disabled:opacity-60 inline-flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(26,86,219,0.35)]">
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <>Request my designer <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" /></>}
                  </button>
                  <p className="text-[11px] text-text-muted text-center">No spam, ever. We only use your details to discuss your project.</p>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const inp = "w-full h-11 px-3.5 border border-border rounded-lg text-[14px] bg-surface-alt focus:bg-white focus:outline-none focus:border-vp-blue focus:ring-2 focus:ring-vp-blue/15 transition-all placeholder:text-text-muted";

function FieldM({ label, hint, required, children }) {
  return (
    <label className="block">
      <span className="block text-[12.5px] font-semibold text-text-dark mb-1.5">{label}{required && <span className="text-vp-red ml-0.5">*</span>}</span>
      {children}
      {hint && <span className="block text-[11px] text-text-light mt-1">{hint}</span>}
    </label>
  );
}
