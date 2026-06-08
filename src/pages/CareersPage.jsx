import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, MapPin, Briefcase, Loader2, X, Check, Send, Rocket } from "lucide-react";
import { publicMap as fetchSettings } from "@/api/settings";
import { jobs as fetchJobs, apply as applyJob } from "@/api/careers";

const TYPE_LABEL = { full_time: "Full-time", part_time: "Part-time", internship: "Internship", contract: "Contract" };

function ApplyModal({ open, job, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", education: "", cvUrl: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (open) { setDone(false); setError(""); } }, [open]);
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
    if (!form.name.trim() || !form.email.trim()) { setError("Please add your name and email."); return; }
    setSubmitting(true);
    try {
      await applyJob({ ...form, jobId: job?.id, jobTitle: job?.title || "" });
      setDone(true); setForm({ name: "", email: "", phone: "", education: "", cvUrl: "", message: "" });
    } catch (err) { setError(err?.message || "Something went wrong."); }
    finally { setSubmitting(false); }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-text-dark/60 backdrop-blur-[2px] z-[300]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="fixed inset-0 z-[310] flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.98 }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[540px] pointer-events-auto overflow-hidden max-h-[94vh] overflow-y-auto no-scrollbar">
              <div className="relative px-7 pt-7 pb-6 text-white" style={{ background: "linear-gradient(135deg, #1a56db 0%, #11317f 100%)" }}>
                <button type="button" onClick={onClose} className="absolute top-4 right-4 z-20 w-9 h-9 inline-flex items-center justify-center rounded-full bg-white/20 hover:bg-white/35"><X size={17} /></button>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 text-[11px] font-semibold mb-3"><Rocket size={12} className="text-vp-yellow" /> Apply now</div>
                <h2 className="text-[22px] font-bold leading-tight">{job ? job.title : "Join our team"}</h2>
                {job && <p className="text-[13px] text-white/85 mt-1">{[TYPE_LABEL[job.type], job.location, job.department].filter(Boolean).join(" · ")}</p>}
              </div>
              {done ? (
                <div className="px-7 py-12 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-vp-green/15 text-vp-green-dark flex items-center justify-center mb-4"><Check size={30} /></div>
                  <h3 className="text-[19px] font-bold text-text-dark mb-1.5">Application sent! 🎉</h3>
                  <p className="text-[14px] text-text-light mb-6">Thanks for applying. We'll review and reach out if there's a fit.</p>
                  <button onClick={onClose} className="h-11 px-7 bg-vp-blue text-white rounded-lg text-[14px] font-semibold hover:bg-vp-blue-hover">Done</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">
                  {error && <div className="px-3.5 py-2.5 bg-vp-red-light border border-vp-red/20 text-vp-red text-[12.5px] rounded-lg">{error}</div>}
                  <div className="grid grid-cols-2 gap-3.5">
                    <Field label="Full name" required><input value={form.name} onChange={(e) => set({ name: e.target.value })} className={inp} placeholder="Your name" /></Field>
                    <Field label="Phone"><input value={form.phone} onChange={(e) => set({ phone: e.target.value })} className={inp} placeholder="+91…" /></Field>
                  </div>
                  <Field label="Email" required><input type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} className={inp} placeholder="you@example.com" /></Field>
                  <Field label="Education / College"><input value={form.education} onChange={(e) => set({ education: e.target.value })} className={inp} placeholder="e.g. B.Des, MIT Pune" /></Field>
                  <Field label="CV link" hint="Paste a link to your CV (Google Drive, Dropbox, LinkedIn).">
                    <input value={form.cvUrl} onChange={(e) => set({ cvUrl: e.target.value })} className={inp} placeholder="https://drive.google.com/…" />
                  </Field>
                  <Field label="Why you?"><textarea value={form.message} onChange={(e) => set({ message: e.target.value })} rows={3} className={inp} placeholder="A short note about yourself…" /></Field>
                  <button type="submit" disabled={submitting} className="w-full h-12 bg-vp-blue text-white rounded-lg text-[15px] font-semibold hover:bg-vp-blue-hover disabled:opacity-60 inline-flex items-center justify-center gap-2">
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Submit application</>}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function CareersPage() {
  const [page, setPage] = useState({});
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyFor, setApplyFor] = useState(undefined); // undefined = closed; null = general; job = specific

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchSettings().catch(() => ({})), fetchJobs().catch(() => [])])
      .then(([s, j]) => { if (!cancelled) { setPage(s?.site_pages?.careers || {}); setJobs(j || []); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="bg-white min-h-[60vh]">
      <div className="bg-surface-alt border-b border-border-light">
        <div className="max-w-[1000px] mx-auto px-4 py-3 text-[12px] text-text-light flex items-center gap-1.5">
          <Link to="/" className="hover:text-vp-blue">Home</Link><ChevronRight size={12} /><span className="text-text-dark">Careers</span>
        </div>
      </div>

      <section className="bg-gradient-to-b from-vp-blue-light/50 to-white">
        <div className="max-w-[820px] mx-auto px-4 pt-12 pb-8 text-center">
          <h1 className="text-[32px] lg:text-[40px] font-bold text-text-dark tracking-tight">{page.title || "Careers"}</h1>
          {page.subtitle && <p className="text-[17px] text-text-medium mt-3">{page.subtitle}</p>}
          {page.intro && <p className="text-[15px] text-text-light mt-4 max-w-[640px] mx-auto leading-relaxed">{page.intro}</p>}
          <button onClick={() => setApplyFor(null)} className="mt-6 h-12 px-7 bg-vp-blue text-white rounded-lg text-[15px] font-semibold hover:bg-vp-blue-hover">Send your details</button>
        </div>
      </section>

      <section className="max-w-[1000px] mx-auto px-4 py-12">
        <h2 className="text-[22px] font-bold text-text-dark tracking-tight mb-6">Current openings</h2>
        {loading ? (
          <div className="flex items-center gap-2 text-text-light"><Loader2 size={16} className="animate-spin" /> Loading…</div>
        ) : jobs.length === 0 ? (
          <div className="border border-border-light rounded-xl p-10 text-center">
            <Briefcase size={28} className="mx-auto text-text-light mb-2" />
            <p className="text-[15px] font-semibold text-text-dark">No open roles right now</p>
            <p className="text-[13px] text-text-light mt-1 mb-4">But we're always glad to meet great people.</p>
            <button onClick={() => setApplyFor(null)} className="h-10 px-5 bg-vp-blue text-white rounded-lg text-[13px] font-semibold hover:bg-vp-blue-hover">Send your details</button>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((j) => (
              <div key={j.id} className="border border-border-light rounded-xl p-5 hover:border-vp-blue hover:shadow-card transition-all flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[16px] font-bold text-text-dark">{j.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[12.5px] text-text-light">
                    <span className="inline-flex items-center gap-1"><Briefcase size={13} /> {TYPE_LABEL[j.type] || j.type}</span>
                    {j.location && <span className="inline-flex items-center gap-1"><MapPin size={13} /> {j.location}</span>}
                    {j.department && <span className="px-2 py-0.5 rounded-sm bg-vp-blue-light text-vp-blue text-[11px] font-semibold">{j.department}</span>}
                  </div>
                  {j.description && <p className="text-[13px] text-text-medium mt-2 line-clamp-2">{j.description}</p>}
                </div>
                <button onClick={() => setApplyFor(j)} className="shrink-0 h-10 px-5 bg-vp-blue text-white rounded-lg text-[13px] font-semibold hover:bg-vp-blue-hover">Apply</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <ApplyModal open={applyFor !== undefined} job={applyFor || null} onClose={() => setApplyFor(undefined)} />
    </div>
  );
}

const inp = "w-full h-11 px-3.5 border border-border rounded-lg text-[14px] bg-surface-alt focus:bg-white focus:outline-none focus:border-vp-blue focus:ring-2 focus:ring-vp-blue/15 transition-all placeholder:text-text-muted";
function Field({ label, hint, required, children }) {
  return <label className="block"><span className="block text-[12.5px] font-semibold text-text-dark mb-1.5">{label}{required && <span className="text-vp-red ml-0.5">*</span>}</span>{children}{hint && <span className="block text-[11px] text-text-light mt-1">{hint}</span>}</label>;
}
