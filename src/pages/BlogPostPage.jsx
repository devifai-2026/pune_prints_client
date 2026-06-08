import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, ChevronLeft, Loader2, Calendar, ImageIcon } from "lucide-react";
import { publicMap as fetchSettings } from "@/api/settings";

function fmtDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogPostPage() {
  const { idx } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchSettings().then((m) => { if (!cancelled) setBlog(m?.site_pages?.blog || {}); }).catch(() => {}).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-text-light"><Loader2 size={18} className="animate-spin mr-2" /> Loading…</div>;

  const posts = blog?.posts || [];
  const i = parseInt(idx, 10);
  const post = posts[i];

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center px-4">
        <h1 className="text-[20px] font-bold text-text-dark">Post not found</h1>
        <Link to="/blog" className="text-vp-blue hover:underline text-[14px]">← Back to all posts</Link>
      </div>
    );
  }

  // Split body into paragraphs (blank-line separated).
  const paras = (post.text || "").split(/\n{2,}/);
  const more = posts.map((p, j) => ({ ...p, j })).filter((p) => p.j !== i).slice(0, 3);

  return (
    <div className="bg-white">
      <div className="bg-surface-alt border-b border-border-light">
        <div className="max-w-[760px] mx-auto px-4 py-3 text-[12px] text-text-light flex items-center gap-1.5">
          <Link to="/" className="hover:text-vp-blue">Home</Link><ChevronRight size={12} />
          <Link to="/blog" className="hover:text-vp-blue">Blog</Link><ChevronRight size={12} />
          <span className="text-text-dark truncate">{post.title}</span>
        </div>
      </div>

      <article className="max-w-[760px] mx-auto px-4 py-10">
        <div className="inline-flex items-center gap-1.5 text-[12.5px] text-text-light mb-3"><Calendar size={14} /> {fmtDate(post.date)}</div>
        <h1 className="text-[30px] lg:text-[40px] font-bold text-text-dark tracking-tight leading-[1.1] mb-6">{post.title}</h1>
        {post.coverImage && (
          <div className="rounded-xl overflow-hidden shadow-card-hover aspect-[16/9] bg-surface mb-8">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="space-y-4 text-[16px] text-text-medium leading-[1.8]">
          {paras.map((p, k) => <p key={k}>{p}</p>)}
        </div>

        <div className="mt-10 pt-6 border-t border-border-light">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-vp-blue hover:underline"><ChevronLeft size={16} /> All posts</Link>
        </div>
      </article>

      {more.length > 0 && (
        <section className="border-t border-border-light bg-surface-alt py-10">
          <div className="max-w-[1100px] mx-auto px-4">
            <h2 className="text-[20px] font-bold text-text-dark tracking-tight mb-5">More from the blog</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {more.map((p) => (
                <Link key={p.j} to={`/blog/${p.j}`} className="block bg-white border border-border-light rounded-xl overflow-hidden hover:shadow-card-hover transition-all">
                  <div className="aspect-[16/10] bg-surface">
                    {p.coverImage ? <img src={p.coverImage} alt={p.title} loading="lazy" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-text-muted"><ImageIcon size={26} /></div>}
                  </div>
                  <div className="p-4">
                    <div className="text-[11.5px] text-text-light mb-1">{fmtDate(p.date)}</div>
                    <h3 className="text-[15px] font-bold text-text-dark leading-tight line-clamp-2">{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
