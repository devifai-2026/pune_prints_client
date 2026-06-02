import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User, Check, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";

export default function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const hasError = Boolean(errorMsg);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);
    try {
      const name = `${firstName} ${lastName}`.trim() || firstName || email.split("@")[0];
      await signup({ name, email, password });
      navigate("/", { replace: true });
    } catch (err) {
      setErrorMsg(err?.message || "Could not create account");
    } finally {
      setIsLoading(false);
    }
  };

  const getStrength = () => {
    if (!password) return 0;
    if (password.length < 6) return 25;
    if (password.length < 10) return 50;
    if (password.length >= 10 && /[A-Z]/.test(password)) return 75;
    return 100;
  };

  const strength = getStrength();
  const strengthLabel = strength === 25 ? "Weak" : strength === 50 ? "Fair" : strength === 75 ? "Good" : strength === 100 ? "Strong" : "";
  const strengthColor = strength === 25 ? "bg-vp-red" : strength === 50 ? "bg-amber-500" : strength === 75 ? "bg-vp-blue" : "bg-vp-green";

  return (
    <div className="flex min-h-screen bg-white">
      {/* Form */}
      <div className="w-full lg:w-1/2 flex flex-col px-6 sm:px-12 lg:px-16 py-6">
        <div className="max-w-[420px] w-full mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-[13px] text-text-light hover:text-vp-blue mb-8">
            <ArrowLeft size={14} /> Back to home
          </Link>

          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-vp-blue text-white flex items-center justify-center font-bold text-lg rounded-sm">P</div>
            <span className="font-bold text-[20px] text-vp-blue">Pune Prints</span>
          </div>

          <h1 className="text-[28px] font-bold text-text-dark tracking-tight mb-1">Create account</h1>
          <p className="text-[14px] text-text-light mb-6">Join 10M+ small businesses worldwide</p>

          <div className="flex gap-2 mb-5">
            <button className="flex-1 h-11 border border-border rounded-sm bg-white hover:bg-surface flex items-center justify-center gap-2 text-[13px] font-medium text-text-dark">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="" className="w-5 h-5" />
              Google
            </button>
            <button className="flex-1 h-11 border border-border rounded-sm bg-white hover:bg-surface flex items-center justify-center gap-2 text-[13px] font-medium text-text-dark">
              <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              Facebook
            </button>
          </div>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-border-light flex-1" />
            <span className="text-[11px] text-text-light uppercase tracking-wide">or with email</span>
            <div className="h-px bg-border-light flex-1" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {hasError && (
              <div className="px-3 py-2.5 bg-vp-red-light border border-vp-red/20 text-vp-red text-[13px] rounded-sm flex items-center gap-2">
                <ShieldCheck size={14} /> {errorMsg}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-semibold text-text-dark mb-1.5">First name</label>
                <Input
                  placeholder="John"
                  leftIcon={<User size={16} />}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-text-dark mb-1.5">Last name</label>
                <Input
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-text-dark mb-1.5">Email address</label>
              <Input
                type="email"
                placeholder="name@example.com"
                leftIcon={<Mail size={16} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-text-dark mb-1.5">Password</label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                leftIcon={<Lock size={16} />}
                rightIcon={
                  showPassword
                    ? <EyeOff size={16} className="cursor-pointer hover:text-text-dark" onClick={() => setShowPassword(false)} />
                    : <Eye size={16} className="cursor-pointer hover:text-text-dark" onClick={() => setShowPassword(true)} />
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {strength > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-border-light rounded-full overflow-hidden">
                    <div className={`h-full ${strengthColor} transition-all`} style={{ width: `${strength}%` }} />
                  </div>
                  <span className="text-[11px] font-medium text-text-light">{strengthLabel}</span>
                </div>
              )}
            </div>

            <label className="flex items-start gap-2 text-[12px] text-text-medium cursor-pointer">
              <input type="checkbox" className="mt-0.5 w-4 h-4 accent-vp-blue" defaultChecked />
              <span>
                I agree to Pune Prints's{" "}
                <a href="#" className="text-vp-blue hover:underline">Terms</a> and{" "}
                <a href="#" className="text-vp-blue hover:underline">Privacy Policy</a>
              </span>
            </label>

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-[13px] text-text-medium">
            Already have an account? <Link to="/login" className="text-vp-blue font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Side panel */}
      <div className="hidden lg:flex w-1/2 bg-vp-blue text-white items-center justify-center p-12">
        <div className="max-w-md">
          <h2 className="text-[32px] font-bold leading-tight mb-4">Design, print, deliver — all in one place</h2>
          <p className="text-[15px] text-white/85 mb-8 leading-relaxed">
            Create a free account to save your designs, track orders and get exclusive offers reserved for members.
          </p>
          <ul className="space-y-3 text-[14px]">
            {[
              "10,000+ premium templates",
              "Free design help on every order",
              "Express delivery across India",
              "Save and reorder favourites",
            ].map((text) => (
              <li key={text} className="flex items-start gap-3">
                <div className="w-5 h-5 mt-0.5 bg-vp-yellow text-vp-blue rounded-full flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
