import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasError = Boolean(errorMsg);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);
    try {
      const user = await login({ email, password });
      // Send admins straight to their dashboard; otherwise honour the redirect
      // hint set by route guards (state.from) or fall back to home.
      const redirectTo = user.role === "admin"
        ? "/admin"
        : (location.state?.from || "/");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setErrorMsg(err?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Form panel */}
      <div className="w-full lg:w-1/2 flex flex-col px-6 sm:px-12 lg:px-16 py-6">
        <div className="max-w-[420px] w-full mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-[13px] text-text-light hover:text-vp-blue mb-8">
            <ArrowLeft size={14} /> Back to home
          </Link>

          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-vp-blue text-white flex items-center justify-center font-bold text-lg rounded-sm">P</div>
            <span className="font-bold text-[20px] text-vp-blue">Pune Prints</span>
          </div>

          <h1 className="text-[28px] font-bold text-text-dark tracking-tight mb-1">Sign in</h1>
          <p className="text-[14px] text-text-light mb-6">to your Pune Prints account</p>

          <div className="flex flex-col gap-2 mb-5">
            <button className="w-full h-11 border border-border rounded-sm bg-white hover:bg-surface flex items-center justify-center gap-3 text-[14px] font-medium text-text-dark">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="" className="w-5 h-5" />
              Continue with Google
            </button>
            <button className="w-full h-11 border border-border rounded-sm bg-white hover:bg-surface flex items-center justify-center gap-3 text-[14px] font-medium text-text-dark">
              <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              Continue with Facebook
            </button>
          </div>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-border-light flex-1" />
            <span className="text-[11px] text-text-light uppercase tracking-wide">or with email</span>
            <div className="h-px bg-border-light flex-1" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {hasError && (
              <div className="px-3 py-2.5 bg-vp-red-light border border-vp-red/20 text-vp-red text-[13px] rounded-sm flex items-center gap-2">
                <ShieldCheck size={14} />
                {errorMsg}
              </div>
            )}
            <div>
              <label className="block text-[13px] font-semibold text-text-dark mb-1.5">Email address</label>
              <Input
                type="email"
                placeholder="name@example.com"
                leftIcon={<Mail size={16} />}
                error={hasError}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-semibold text-text-dark">Password</label>
                <a href="#" className="text-[12px] text-vp-blue hover:underline">Forgot?</a>
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                leftIcon={<Lock size={16} />}
                rightIcon={
                  showPassword
                    ? <EyeOff size={16} className="cursor-pointer hover:text-text-dark" onClick={() => setShowPassword(false)} />
                    : <Eye size={16} className="cursor-pointer hover:text-text-dark" onClick={() => setShowPassword(true)} />
                }
                error={hasError}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <label className="flex items-center gap-2 text-[13px] text-text-medium cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-vp-blue" />
              Keep me signed in
            </label>

            <Button type="submit" disabled={isLoading} size="lg" className="w-full">
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-[13px] text-text-medium">
            New to Pune Prints? <Link to="/signup" className="text-vp-blue font-semibold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>

      {/* Side panel */}
      <div className="hidden lg:flex w-1/2 bg-vp-blue text-white items-center justify-center p-12 relative">
        <div className="max-w-md">
          <h2 className="text-[32px] font-bold leading-tight mb-4">Welcome back to Pune Prints</h2>
          <p className="text-[15px] text-white/85 mb-8 leading-relaxed">
            Pick up where you left off — your saved designs, recent orders and reorder lists are all here.
          </p>
          <ul className="space-y-3 text-[14px]">
            {[
              { icon: Truck, text: "Track open orders and shipments" },
              { icon: RotateCcw, text: "One-click reorder of favourites" },
              { icon: ShieldCheck, text: "Save designs and edit any time" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <Icon size={18} className="text-vp-yellow" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
