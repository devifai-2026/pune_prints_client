import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User, Sparkles, CheckCircle2 } from "lucide-react";

export default function SignUp() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const getStrength = () => {
    if (!password) return 0;
    if (password.length < 6) return 25;
    if (password.length < 10) return 50;
    if (password.length >= 10 && /[A-Z]/.test(password)) return 75;
    return 100;
  };

  const strength = getStrength();

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
            <h2 className="font-display font-black text-4xl text-text-dark mb-3 tracking-tight">Create an account.</h2>
            <p className="text-text-light text-lg">Join 10M+ businesses building their brand.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button className="flex-1 h-12 rounded-xl border border-border bg-white hover:bg-gray-50 flex items-center justify-center gap-2 font-bold text-text-dark transition-all shadow-sm">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Google
            </button>
            <button className="flex-1 h-12 rounded-xl border border-border bg-white hover:bg-gray-50 flex items-center justify-center gap-2 font-bold text-text-dark transition-all shadow-sm">
              <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-border flex-1"></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">or sign up with email</span>
            <div className="h-px bg-border flex-1"></div>
          </div>

          <form className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-dark">First Name</label>
                <Input
                  placeholder="John"
                  className="h-14 rounded-xl border-gray-200 bg-gray-50/50"
                  leftIcon={<User size={18} className="text-gray-400" />}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-dark">Last Name</label>
                <Input
                  placeholder="Doe"
                  className="h-14 rounded-xl border-gray-200 bg-gray-50/50"
                  leftIcon={<User size={18} className="text-gray-400" />}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-text-dark">Email Address</label>
              <Input
                type="email"
                placeholder="hello@example.com"
                className="h-14 rounded-xl border-gray-200 bg-gray-50/50"
                leftIcon={<Mail size={18} className="text-gray-400" />}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-dark">Password</label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="h-14 rounded-xl border-gray-200 bg-gray-50/50"
                leftIcon={<Lock size={18} className="text-gray-400" />}
                rightIcon={
                  showPassword ? 
                  <EyeOff size={18} className="text-gray-400 hover:text-text-dark cursor-pointer transition-colors" onClick={() => setShowPassword(false)} /> : 
                  <Eye size={18} className="text-gray-400 hover:text-text-dark cursor-pointer transition-colors" onClick={() => setShowPassword(true)} />
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Password Strength */}
              <div className="w-full flex flex-col gap-1.5 pt-1">
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className={`h-full transition-all duration-500 ${
                    strength === 25 ? 'w-1/4 bg-red-500' :
                    strength === 50 ? 'w-2/4 bg-amber-500' :
                    strength === 75 ? 'w-3/4 bg-blue-500' :
                    strength === 100 ? 'w-full bg-emerald-500' : 'w-0'
                  }`}></div>
                </div>
                {strength > 0 && (
                  <div className="text-xs font-bold text-right" style={{
                    color: strength === 25 ? '#ef4444' : strength === 50 ? '#f59e0b' : strength === 75 ? '#3b82f6' : '#10b981'
                  }}>
                    {strength === 25 ? 'Weak' : strength === 50 ? 'Fair' : strength === 75 ? 'Good' : 'Strong'}
                  </div>
                )}
              </div>
            </div>

            <label className="flex items-start gap-3 pt-2 cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5 mt-0.5">
                <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[6px] checked:bg-primary-blue checked:border-primary-blue transition-all cursor-pointer" />
                <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
              </div>
              <span className="text-sm text-text-light font-medium leading-relaxed group-hover:text-text-dark transition-colors">
                I agree to the <a href="#" className="text-primary-blue font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-primary-blue font-bold hover:underline">Privacy Policy</a>
              </span>
            </label>

            <Button className="w-full h-14 rounded-xl text-base font-black tracking-wide mt-2 shadow-xl shadow-primary-blue/20">
              Create Account
            </Button>
          </form>

          <p className="mt-8 text-center text-text-light font-medium">
            Already have an account? <Link to="/login" className="text-primary-blue font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>

      {/* Right Panel: Showcase */}
      <div className="hidden lg:flex flex-1 relative bg-surface overflow-hidden p-8">
        <div className="absolute inset-0 bg-[#FFF6F0]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(209,213,219,0.5)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"></div>
        
        {/* Abstract shapes */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-400/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-yellow-400/20 rounded-full blur-[80px]"></div>

        <div className="relative z-10 w-full h-full bg-white/40 backdrop-blur-3xl rounded-[40px] border border-white/60 shadow-[0_30px_60px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col justify-between p-16">
          <div className="flex-1 flex flex-col justify-center">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border shadow-sm mb-6 w-max">
               <Sparkles size={14} className="text-accent-orange" />
               <span className="text-xs font-bold uppercase tracking-widest text-text-dark">All-in-one Platform</span>
             </div>
             <h3 className="font-display font-black text-5xl leading-tight text-text-dark tracking-tighter mb-6">
               Design, Print &<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Scale Globally.</span>
             </h3>
             <ul className="space-y-4">
              {[
                "10,000+ Premium Templates",
                "Next-day Global Delivery",
                "24/7 Dedicated Support",
                "Sustainable Printing Options"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-lg font-medium text-text-dark/80">
                  <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-accent-orange">
                    <CheckCircle2 size={16} />
                  </div>
                  {item}
                </li>
              ))}
             </ul>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white">
            <div className="flex text-amber-400 mb-3 gap-1">
              {[1,2,3,4,5].map(i => <Sparkles key={i} size={16} fill="currentColor" />)}
            </div>
            <p className="text-text-dark font-medium leading-relaxed italic mb-4">
              "The print quality is unmatched. I designed my business cards in 5 minutes and they arrived looking absolutely stunning."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-display font-black">SJ</div>
              <div>
                <div className="font-bold text-text-dark text-sm">Sarah Jenkins</div>
                <div className="text-xs font-bold uppercase tracking-widest text-text-light/60">Creative Director</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

