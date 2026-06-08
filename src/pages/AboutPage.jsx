import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Loader2, ImageIcon } from "lucide-react";
import { publicMap as fetchSettings } from "@/api/settings";

export default function AboutPage() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchSettings()
      .then((map) => { if (!cancelled) setPage(map?.site_pages?.about || null); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-text-light"><Loader2 size={18} className="animate-spin mr-2" /> Loading…</div>;

  const p = page || {};
  const sections = p.sections || [];
  const stats = p.stats || [];

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-surface-alt border-b border-border-light">
        <div className="max-w-[1100px] mx-auto px-4 py-3 text-[12px] text-text-light flex items-center gap-1.5">
          <Link to="/" className="hover:text-vp-blue">Home</Link>
          <ChevronRight size={12} />
          <span className="text-text-dark">About</span>
        </div>
      </div>

      {/* Hero header */}
      <section className="bg-gradient-to-b from-vp-blue-light/50 to-white">
        <div className="max-w-[900px] mx-auto px-4 pt-12 pb-8 text-center">
          <h1 className="text-[32px] lg:text-[42px] font-bold text-text-dark tracking-tight leading-[1.1]">{p.title || "About Us"}</h1>
          {p.subtitle && <p className="text-[16px] lg:text-[18px] text-text-medium mt-4 max-w-[680px] mx-auto leading-relaxed">{p.subtitle}</p>}
        </div>
      </section>

      {/* Cover photo */}
      {p.coverImage && (
        <div className="max-w-[1100px] mx-auto px-4">
          <div className="rounded-xl overflow-hidden shadow-card-hover aspect-[21/9] bg-surface">
            <img src={p.coverImage} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Intro */}
      {p.intro && (
        <div className="max-w-[760px] mx-auto px-4 py-12 text-center">
          <p className="text-[17px] text-text-medium leading-relaxed">{p.intro}</p>
        </div>
      )}

      {/* Stats */}
      {stats.length > 0 && (
        <div className="max-w-[1100px] mx-auto px-4 pb-4">
          <div className="grid grid-cols-3 gap-4 border-y border-border-light py-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-[26px] lg:text-[34px] font-bold text-vp-blue leading-none">{s.value}</div>
                <div className="text-[12px] lg:text-[13px] text-text-light mt-1.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo + text sections (alternating left/right) */}
      <section className="max-w-[1100px] mx-auto px-4 py-12 space-y-16">
        {sections.map((sec, i) => {
          const right = sec.side === "right";
          return (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className={`rounded-xl overflow-hidden shadow-card aspect-[4/3] bg-surface ${right ? "md:order-2" : ""}`}>
                {sec.image
                  ? <img src={sec.image} alt={sec.heading} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-text-muted"><ImageIcon size={32} /></div>}
              </div>
              <div className={right ? "md:order-1" : ""}>
                <h2 className="text-[24px] lg:text-[28px] font-bold text-text-dark tracking-tight mb-3">{sec.heading}</h2>
                <p className="text-[15px] text-text-medium leading-relaxed">{sec.text}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* CTA */}
      <section className="bg-vp-blue text-white">
        <div className="max-w-[1100px] mx-auto px-4 py-12 text-center">
          <h2 className="text-[24px] lg:text-[30px] font-bold mb-3">Ready to create something great?</h2>
          <p className="text-[15px] text-white/85 mb-6">Browse our products or start a design in minutes.</p>
          <Link to="/products"><button className="h-12 px-7 bg-vp-yellow text-vp-blue rounded-lg text-[15px] font-semibold hover:bg-yellow-400">Shop all products</button></Link>
        </div>
      </section>
    </div>
  );
}
