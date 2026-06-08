import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Search, Package, Loader2, CheckCircle2, Circle } from "lucide-react";
import { publicStatus } from "@/api/orders";

const STAGES = [
  { key: "pending", label: "Placed" },
  { key: "paid", label: "Paid" },
  { key: "in_production", label: "In production" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

export default function OrderStatusPage() {
  const [id, setId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lookup = async (e) => {
    e.preventDefault();
    if (!id.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try { setResult(await publicStatus(id.trim())); }
    catch (err) { setError(err?.message || "No order found with that ID."); }
    finally { setLoading(false); }
  };

  const currentIdx = result ? STAGES.findIndex((s) => s.key === result.status) : -1;
  const cancelled = result?.status === "cancelled";

  return (
    <div className="bg-white min-h-[60vh]">
      <div className="bg-surface-alt border-b border-border-light">
        <div className="max-w-[760px] mx-auto px-4 py-3 text-[12px] text-text-light flex items-center gap-1.5">
          <Link to="/" className="hover:text-vp-blue">Home</Link><ChevronRight size={12} /><span className="text-text-dark">Order Status</span>
        </div>
      </div>

      <section className="bg-gradient-to-b from-vp-blue-light/50 to-white">
        <div className="max-w-[760px] mx-auto px-4 pt-12 pb-8 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-vp-blue text-white flex items-center justify-center mb-4"><Package size={24} /></div>
          <h1 className="text-[32px] lg:text-[38px] font-bold text-text-dark tracking-tight">Track your order</h1>
          <p className="text-[16px] text-text-medium mt-3">Enter your order ID to see its current status.</p>
        </div>
      </section>

      <section className="max-w-[680px] mx-auto px-4 py-8">
        <form onSubmit={lookup} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light" />
            <input value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. PP-260608-AB12"
              className="w-full h-12 pl-10 pr-3 border border-border rounded-lg text-[14px] bg-white focus:outline-none focus:border-vp-blue focus:ring-2 focus:ring-vp-blue/15 uppercase" />
          </div>
          <button type="submit" disabled={loading} className="h-12 px-6 bg-vp-blue text-white rounded-lg text-[14px] font-semibold hover:bg-vp-blue-hover disabled:opacity-60 inline-flex items-center gap-2">
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Track"}
          </button>
        </form>

        {error && <div className="mt-5 px-4 py-3 bg-vp-red-light border border-vp-red/20 text-vp-red text-[13px] rounded-lg">{error}</div>}

        {result && (
          <div className="mt-7 border border-border-light rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
              <div>
                <div className="text-[12px] text-text-light">Order</div>
                <div className="text-[18px] font-bold text-text-dark">{result.orderNumber}</div>
              </div>
              <div className="text-right">
                <div className="text-[12px] text-text-light">{result.itemCount} item{result.itemCount === 1 ? "" : "s"}</div>
                <div className="text-[16px] font-bold text-vp-blue">₹{Number(result.total).toLocaleString("en-IN")}</div>
              </div>
            </div>

            {cancelled ? (
              <div className="px-4 py-3 bg-vp-red-light text-vp-red text-[14px] font-semibold rounded-lg text-center">This order was cancelled.</div>
            ) : (
              <ol className="relative">
                {STAGES.map((s, i) => {
                  const doneOrNow = i <= currentIdx;
                  const isNow = i === currentIdx;
                  return (
                    <li key={s.key} className="flex items-start gap-3 pb-6 last:pb-0">
                      <div className="flex flex-col items-center">
                        {doneOrNow ? <CheckCircle2 size={22} className={isNow ? "text-vp-blue" : "text-vp-green-dark"} /> : <Circle size={22} className="text-border" />}
                        {i < STAGES.length - 1 && <span className={`w-0.5 flex-1 min-h-[24px] ${i < currentIdx ? "bg-vp-green" : "bg-border-light"}`} />}
                      </div>
                      <div className="pt-0.5">
                        <div className={`text-[14px] font-semibold ${doneOrNow ? "text-text-dark" : "text-text-light"}`}>{s.label}</div>
                        {isNow && <div className="text-[12px] text-vp-blue font-medium">Current status</div>}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
