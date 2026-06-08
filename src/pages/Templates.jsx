import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Search, LayoutTemplate, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { list as listTemplates } from "@/api/templates";

// Templates are authored on a 515×301 canvas (visiting-card aspect).
const BASE_W = 515, BASE_H = 301;

function TemplatePreview({ tpl, width = 260 }) {
  const scale = width / BASE_W;
  const height = width / (BASE_W / BASE_H);
  return (
    <div className="relative overflow-hidden border border-border-light rounded-sm" style={{ width, height, background: tpl.bg || "#fff" }}>
      {(tpl.layers || []).map((l, i) => {
        const base = { position: "absolute", left: l.x * scale, top: l.y * scale, width: l.w * scale, height: l.h * scale };
        if (l.type === "text") {
          return (
            <div key={i} style={{ ...base, fontSize: (l.fontSize || 14) * scale, color: l.color, textAlign: l.align, fontWeight: l.bold ? 700 : 400, fontStyle: l.italic ? "italic" : "normal", textDecoration: l.underline ? "underline" : "none", lineHeight: 1.1, overflow: "hidden" }}>
              {l.text}
            </div>
          );
        }
        if (l.type === "shape") {
          const r = l.shape === "circle" ? "50%" : 0;
          return <div key={i} style={{ ...base, background: l.fill, borderRadius: r }} />;
        }
        if (l.type === "image" && l.src) {
          return <img key={i} src={l.src} alt="" style={{ ...base, objectFit: "cover" }} />;
        }
        return null;
      })}
    </div>
  );
}

export default function Templates() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  useEffect(() => {
    let cancelled = false;
    listTemplates({ limit: 100 })
      .then((list) => { if (!cancelled) setItems(list || []); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(() => [...new Set(items.map((t) => t.category).filter(Boolean))], [items]);
  const filtered = useMemo(() => {
    let out = items;
    if (cat) out = out.filter((t) => t.category === cat);
    if (q.trim()) out = out.filter((t) => t.name.toLowerCase().includes(q.toLowerCase()));
    return out;
  }, [items, q, cat]);

  const useTemplate = (tpl) => navigate(`/design?template=${encodeURIComponent(tpl.slug || tpl.id)}`);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-surface-alt border-b border-border-light">
        <div className="max-w-[1400px] mx-auto px-4 py-3 text-[12px] text-text-light flex items-center gap-1.5">
          <Link to="/" className="hover:text-vp-blue">Home</Link>
          <ChevronRight size={12} />
          <span className="text-text-dark">Templates</span>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 pb-6">
          <h1 className="text-[26px] lg:text-[32px] font-bold text-text-dark tracking-tight">Design Templates</h1>
          <p className="text-[14px] text-text-light mt-1">
            {loading ? "Loading…" : `${filtered.length} ready-to-customise design${filtered.length === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      <section className="py-6 lg:py-8">
        <div className="max-w-[1400px] mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search templates…"
                className="w-full h-10 pl-9 pr-3 border border-border rounded-sm text-[13px] bg-white focus:outline-none focus:border-vp-blue" />
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setCat("")} className={`h-9 px-3 rounded-sm text-[12px] font-semibold border ${cat === "" ? "bg-vp-blue text-white border-vp-blue" : "bg-white border-border text-text-medium hover:border-vp-blue"}`}>All</button>
              {categories.map((c) => (
                <button key={c} onClick={() => setCat(c)} className={`h-9 px-3 rounded-sm text-[12px] font-semibold border ${cat === c ? "bg-vp-blue text-white border-vp-blue" : "bg-white border-border text-text-medium hover:border-vp-blue"}`}>{c}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[515/301] bg-surface rounded-sm animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center border border-border-light rounded-sm bg-surface-alt">
              <LayoutTemplate size={30} className="mx-auto text-text-light mb-2" />
              <h3 className="text-[16px] font-semibold text-text-dark mb-1">No templates found</h3>
              <p className="text-[13px] text-text-light">Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((tpl) => (
                <div key={tpl.id} className="group bg-white border border-border-light rounded-sm overflow-hidden hover:border-vp-blue hover:shadow-card-hover transition-all flex flex-col">
                  <div className="bg-surface p-5 flex items-center justify-center">
                    {tpl.thumbnailUrl
                      ? <img src={tpl.thumbnailUrl} alt={tpl.name} className="w-full rounded-sm border border-border-light" />
                      : <TemplatePreview tpl={tpl} width={260} />}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-[14px] font-semibold text-text-dark leading-tight">{tpl.name}</h3>
                    {tpl.category && <p className="text-[12px] text-text-light mt-0.5">{tpl.category}</p>}
                    <Button size="sm" className="mt-3 w-full" onClick={() => useTemplate(tpl)}>Customise this design</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
