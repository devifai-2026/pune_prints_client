import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Loader2, Calendar, ImageIcon } from "lucide-react";
import { publicMap as fetchSettings } from "@/api/settings";

function fmtDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogPage() {
  const [page, setPage] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchSettings().then((m) => { if (!cancelled) setPage(m?.site_pages?.blog || {}); }).catch(() => {}).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const posts = page.posts || [];
  const [featured, ...rest] = posts;

  return (
    <div className="bg-white min-h-[60vh]">
      <div className="bg-surface-alt border-b border-border-light">
        <div className="max-w-[1100px] mx-auto px-4 py-3 text-[12px] text-text-light flex items-center gap-1.5">
          <Link to="/" className="hover:text-vp-blue">Home</Link><ChevronRight size={12} /><span className="text-text-dark">Blog</span>
        </div>
      </div>

      <section className="bg-gradient-to-b from-vp-blue-light/50 to-white">
        <div className="max-w-[900px] mx-auto px-4 pt-12 pb-8 text-center">
          <h1 className="text-[32px] lg:text-[40px] font-bold text-text-dark tracking-tight">{page.title || "Blog"}</h1>
          {page.subtitle && <p className="text-[16px] text-text-medium mt-3">{page.subtitle}</p>}
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-4 py-10">
        {loading ? (
          <div className="flex items-center gap-2 text-text-light"><Loader2 size={16} className="animate-spin" /> Loading…</div>
        ) : posts.length === 0 ? (
          <p className="text-[14px] text-text-light text-center py-10">No posts yet — check back soon.</p>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <Link to="/blog/0" className="group grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12 pb-12 border-b border-border-light">
                <div className="rounded-xl overflow-hidden shadow-card aspect-[16/10] bg-surface">
                  {featured.coverImage ? <img src={featured.coverImage} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center text-text-muted"><ImageIcon size={32} /></div>}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[12px] text-text-light mb-3"><Calendar size={13} /> {fmtDate(featured.date)}</div>
                  <h2 className="text-[26px] lg:text-[30px] font-bold text-text-dark tracking-tight leading-tight mb-3 group-hover:text-vp-blue">{featured.title}</h2>
                  <p className="text-[15px] text-text-medium leading-relaxed line-clamp-3">{featured.text}</p>
                  <span className="inline-block mt-4 text-[14px] font-semibold text-vp-blue">Read more →</span>
                </div>
              </Link>
            )}

            {/* Rest grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post, i) => (
                  <Link to={`/blog/${i + 1}`} key={i} className="group border border-border-light rounded-xl overflow-hidden hover:shadow-card-hover hover:border-vp-blue transition-all flex flex-col">
                    <div className="aspect-[16/10] bg-surface overflow-hidden">
                      {post.coverImage ? <img src={post.coverImage} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center text-text-muted"><ImageIcon size={28} /></div>}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="inline-flex items-center gap-1.5 text-[11.5px] text-text-light mb-2"><Calendar size={12} /> {fmtDate(post.date)}</div>
                      <h3 className="text-[16px] font-bold text-text-dark leading-tight mb-2 group-hover:text-vp-blue">{post.title}</h3>
                      <p className="text-[13.5px] text-text-medium leading-relaxed line-clamp-3">{post.text}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
