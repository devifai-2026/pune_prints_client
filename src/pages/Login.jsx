import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

export default function Login() {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setHasError(true);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-body">
      {/* Left Panel: Form */}
      <div className="w-full lg:w-[45%] flex flex-col px-8 sm:px-16 lg:px-24 py-10 h-full overflow-y-auto no-scrollbar">
        <div className="w-full max-w-md mx-auto pt-4 mb-8 flex-shrink-0">
          <Link to="/" className="inline-flex items-center gap-2 text-text-light hover:text-text-dark transition-colors font-medium text-sm">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
        
        <div className="w-full max-w-md mx-auto my-auto pb-10">
          <div className="mb-10">
            <h2 className="font-display font-black text-4xl text-text-dark mb-3 tracking-tight">Welcome back.</h2>
            <p className="text-text-light text-lg">Log in to your account to continue.</p>
          </div>
          
          <div className="flex flex-col gap-4 mb-8">
            <button className="w-full h-12 rounded-xl border border-border bg-white hover:bg-gray-50 flex items-center justify-center gap-3 font-bold text-text-dark transition-all shadow-sm">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
            <button className="w-full h-12 rounded-xl border border-border bg-white hover:bg-gray-50 flex items-center justify-center gap-3 font-bold text-text-dark transition-all shadow-sm">
              <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Continue with Facebook
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-border flex-1"></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">or login with email</span>
            <div className="h-px bg-border flex-1"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {hasError && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-3">
                <ShieldCheck size={18} className="text-red-500" />
                Invalid credentials. Please try again.
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-dark">Email Address</label>
              <Input
                type="email"
                placeholder="hello@company.com"
                className="h-14 rounded-xl border-gray-200 bg-gray-50/50"
                leftIcon={<Mail size={18} className="text-gray-400" />}
                error={hasError}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-text-dark">Password</label>
                <a href="#" className="text-sm font-bold text-primary-blue hover:text-blue-700 transition-colors">Forgot password?</a>
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-14 rounded-xl border-gray-200 bg-gray-50/50"
                leftIcon={<Lock size={18} className="text-gray-400" />}
                error={hasError}
                rightIcon={
                  showPassword ? 
                  <EyeOff size={18} className="text-gray-400 hover:text-text-dark cursor-pointer transition-colors" onClick={() => setShowPassword(false)} /> : 
                  <Eye size={18} className="text-gray-400 hover:text-text-dark cursor-pointer transition-colors" onClick={() => setShowPassword(true)} />
                }
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-xl text-base font-black tracking-wide mt-4 shadow-xl shadow-primary-blue/20">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : "Sign In"}
            </Button>
          </form>

          <p className="mt-8 text-center text-text-light font-medium">
            Don't have an account? <Link to="/signup" className="text-primary-blue font-bold hover:underline">Sign up for free</Link>
          </p>
        </div>
      </div>

      {/* Right Panel: Showcase */}
      <div className="hidden lg:flex flex-1 relative bg-surface overflow-hidden p-8">
        <div className="absolute inset-0 bg-[#F4F7FB]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(209,213,219,0.5)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"></div>
        
        {/* Abstract shapes */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[80px]"></div>

        <div className="relative z-10 w-full h-full bg-white/40 backdrop-blur-3xl rounded-[40px] border border-white/60 shadow-[0_30px_60px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col items-center justify-center p-16">
          <div className="text-center mb-12">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border shadow-sm mb-6">
               <Sparkles size={14} className="text-primary-blue" />
               <span className="text-xs font-bold uppercase tracking-widest text-text-dark">Premium Quality</span>
             </div>
             <h3 className="font-display font-black text-5xl leading-tight text-text-dark tracking-tighter mb-4">
               Crafting Your<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Brand's Legacy.</span>
             </h3>
             <p className="text-lg text-text-light font-medium max-w-md mx-auto">
               Access our world-class design studio and turn your ideas into premium print products.
             </p>
          </div>

          <div className="relative w-full max-w-lg aspect-video rounded-3xl bg-white shadow-2xl border border-white/50 overflow-hidden group">
            <img src="/assets/hero-banner.png" alt="Showcase" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
