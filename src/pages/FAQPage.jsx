import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronDown, Loader2, HelpCircle } from "lucide-react";
import { publicMap as fetchSettings } from "@/api/settings";

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border-light rounded-xl overflow-hidden bg-white">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-alt">
        <span className="text-[15px] font-semibold text-text-dark">{q}</span>
        <ChevronDown size={18} className={`text-text-light shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-4 text-[14px] text-text-medium leading-relaxed">{a}</div>}
    </div>
  );
}

export default function FAQPage() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchSettings().then((m) => { if (!cancelled) setPage(m?.site_pages?.faq || {}); }).catch(() => {}).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const p = page || {};
  const items = p.items || [];

  return (
    <div className="bg-white min-h-[60vh]">
      <div className="bg-surface-alt border-b border-border-light">
        <div className="max-w-[820px] mx-auto px-4 py-3 text-[12px] text-text-light flex items-center gap-1.5">
          <Link to="/" className="hover:text-vp-blue">Home</Link><ChevronRight size={12} /><span className="text-text-dark">Help & FAQ</span>
        </div>
      </div>

      <section className="bg-gradient-to-b from-vp-blue-light/50 to-white">
        <div className="max-w-[820px] mx-auto px-4 pt-12 pb-8 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-vp-blue text-white flex items-center justify-center mb-4"><HelpCircle size={24} /></div>
          <h1 className="text-[32px] lg:text-[38px] font-bold text-text-dark tracking-tight">{p.title || "Help & FAQ"}</h1>
          {p.subtitle && <p className="text-[16px] text-text-medium mt-3 max-w-[560px] mx-auto">{p.subtitle}</p>}
        </div>
      </section>

      <section className="max-w-[820px] mx-auto px-4 py-10">
        {loading ? (
          <div className="flex items-center gap-2 text-text-light"><Loader2 size={16} className="animate-spin" /> Loading…</div>
        ) : (
          <div className="space-y-3">
            {items.map((it, i) => <FAQItem key={i} q={it.q} a={it.a} />)}
          </div>
        )}
        <div className="mt-8 text-center bg-surface-alt rounded-xl p-6 border border-border-light">
          <p className="text-[15px] font-semibold text-text-dark">Still have questions?</p>
          <p className="text-[13px] text-text-light mt-1 mb-4">Our team is happy to help.</p>
          <Link to="/contact" className="inline-flex h-11 px-6 items-center bg-vp-blue text-white rounded-lg text-[14px] font-semibold hover:bg-vp-blue-hover">Contact us</Link>
        </div>
      </section>
    </div>
  );
}
