import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";
import { publicMap as fetchSettings } from "@/api/settings";

/**
 * Generic content page driven by the admin-editable `site_pages` setting.
 * `slug` selects which page; `fallbackTitle` shows while loading / if missing.
 * Body format: blank line = new paragraph; lines starting with "- " = bullets.
 */
export default function InfoPage({ slug, fallbackTitle }) {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchSettings()
      .then((map) => { if (!cancelled) setPage(map?.site_pages?.[slug] || null); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  const title = page?.title || fallbackTitle || "";
  const body = page?.body || "";

  // Split into blocks: bullet runs become <ul>, everything else paragraphs.
  const blocks = [];
  body.split(/\n{2,}/).forEach((para) => {
    const lines = para.split("\n");
    const bullets = lines.filter((l) => l.trim().startsWith("- "));
    if (bullets.length && bullets.length === lines.filter((l) => l.trim()).length) {
      blocks.push({ type: "ul", items: bullets.map((l) => l.replace(/^\s*-\s*/, "")) });
    } else {
      blocks.push({ type: "p", lines });
    }
  });

  return (
    <div className="bg-white min-h-[60vh]">
      <div className="bg-surface-alt border-b border-border-light">
        <div className="max-w-[860px] mx-auto px-4 py-3 text-[12px] text-text-light flex items-center gap-1.5">
          <Link to="/" className="hover:text-vp-blue">Home</Link>
          <ChevronRight size={12} />
          <span className="text-text-dark">{title}</span>
        </div>
        <div className="max-w-[860px] mx-auto px-4 pb-6">
          <h1 className="text-[28px] lg:text-[34px] font-bold text-text-dark tracking-tight">{title}</h1>
        </div>
      </div>

      <div className="max-w-[860px] mx-auto px-4 py-10">
        {loading ? (
          <div className="flex items-center gap-2 text-text-light text-[14px]"><Loader2 size={16} className="animate-spin" /> Loading…</div>
        ) : !body ? (
          <p className="text-[14px] text-text-light">This page is being prepared. Please check back soon.</p>
        ) : (
          <div className="space-y-4 text-[15px] text-text-medium leading-relaxed">
            {blocks.map((b, i) =>
              b.type === "ul" ? (
                <ul key={i} className="space-y-2 list-disc list-inside">
                  {b.items.map((it, j) => <li key={j}>{it}</li>)}
                </ul>
              ) : (
                <div key={i} className="space-y-1.5">
                  {b.lines.map((ln, j) => (
                    // A standalone first line that reads like a question/heading gets emphasis.
                    j === 0 && b.lines.length > 1 && !ln.startsWith("-")
                      ? <p key={j} className="text-[16px] font-semibold text-text-dark">{ln}</p>
                      : <p key={j}>{ln}</p>
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
