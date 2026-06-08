import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone, User, ShieldCheck, X, ArrowLeft, Pencil } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import { publicMap as fetchSettings } from "@/api/settings";

// Right-side carousel fallback if the admin hasn't configured login_content.
const FALLBACK_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1606166187734-a4cb74079037?w=1200&q=80",
    heading: "Welcome to Pune Prints",
    subtext: "Sign in with your mobile number to track orders, save designs and reorder in one tap.",
  },
];

// Side-panel image carousel, content-driven from the `login_content` setting.
function LoginCarousel({ content }) {
  const slides = content?.slides?.length ? content.slides : FALLBACK_SLIDES;
  const interval = Number(content?.interval) > 0 ? Number(content.interval) : 5000;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), interval);
    return () => clearInterval(t);
  }, [slides.length, interval]);

  // Reset if the slide set shrinks (e.g. admin removed slides via live preview).
  useEffect(() => {
    if (idx >= slides.length) setIdx(0);
  }, [slides.length, idx]);

  return (
    <div className="hidden lg:block w-1/2 relative overflow-hidden bg-vp-blue">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`}
        >
          {s.image && <img src={s.image} alt="" className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-text-dark/85 via-text-dark/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
            {s.heading && <h2 className="text-[30px] font-bold leading-tight mb-3">{s.heading}</h2>}
            {s.subtext && <p className="text-[15px] text-white/90 leading-relaxed max-w-md">{s.subtext}</p>}
          </div>
        </div>
      ))}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 right-12 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lookupPhone, requestOtp, verifyOtp } = useAuth();

  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [needsName, setNeedsName] = useState(false); // new number → collect name
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(null);
  const otpRef = useRef(null);

  const hasError = Boolean(errorMsg);
  const phoneValid = /^\d{10}$/.test(phone);
  const nameValid = firstName.trim() && lastName.trim();
  // The phone step's button is enabled once the phone is valid, and — when we're
  // collecting a name for a new number — once both names are filled.
  const canContinue = phoneValid && (!needsName || nameValid);

  // Load the admin-managed carousel content.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const map = await fetchSettings();
        if (!cancelled) setContent(map?.login_content || null);
      } catch {
        /* fall back to defaults */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Keep only the last 10 digits the user types. Re-checking a different number
  // hides any name fields revealed for the previous one.
  const onPhoneChange = (e) => {
    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
    if (needsName) setNeedsName(false);
  };

  // Actually dispatch the OTP and advance to the code step.
  const sendOtp = async () => {
    const res = await requestOtp({ phone, firstName: firstName.trim(), lastName: lastName.trim() });
    setDevCode(res?.devCode || "");
    setStep("otp");
    setCode("");
    setTimeout(() => otpRef.current?.focus(), 50);
  };

  // Phone-step submit. Existing numbers sign in straight away; new numbers
  // reveal the name fields first (server replies NEEDS_NAME), then send on the
  // next submit once a name is provided.
  const handleRequest = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);
    try {
      if (!needsName) {
        const { exists } = await lookupPhone(phone);
        if (!exists) {
          setNeedsName(true);
          return; // ask for the name before sending the code
        }
      }
      await sendOtp();
    } catch (err) {
      if (err?.details?.needsName || err?.code === "NEEDS_NAME") {
        setNeedsName(true);
      } else {
        setErrorMsg(err?.message || "Could not send the code");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Resend from the OTP step (names already known).
  const handleResend = async () => {
    setErrorMsg("");
    setIsLoading(true);
    try { await sendOtp(); }
    catch (err) { setErrorMsg(err?.message || "Could not resend the code"); }
    finally { setIsLoading(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);
    try {
      const user = await verifyOtp({ phone, code });
      const redirectTo = user.role === "admin" ? "/admin" : (location.state?.from || "/");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setErrorMsg(err?.message || "Incorrect code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Form panel */}
      <div className="w-full lg:w-1/2 flex flex-col px-6 sm:px-12 lg:px-16 py-6 relative">
        {/* Close → home (replaces the old "Back to home" text link) */}
        <Link
          to="/"
          aria-label="Back to store"
          className="absolute top-6 right-6 w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-light hover:text-text-dark hover:border-text-medium transition-colors"
        >
          <X size={16} />
        </Link>

        <div className="max-w-[420px] w-full mx-auto flex-1 flex flex-col justify-center">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-vp-blue text-white flex items-center justify-center font-bold text-lg rounded-sm">P</div>
            <span className="font-bold text-[20px] text-vp-blue">Pune Prints</span>
          </Link>

          {step === "phone" ? (
            <>
              <h1 className="text-[28px] font-bold text-text-dark tracking-tight mb-1">
                {needsName ? "Create your account" : "Sign in or create account"}
              </h1>
              <p className="text-[14px] text-text-light mb-6">
                {needsName ? "Looks like you're new here — tell us your name" : "Continue with your mobile number"}
              </p>

              <form onSubmit={handleRequest} className="space-y-4">
                {hasError && (
                  <div className="px-3 py-2.5 bg-vp-red-light border border-vp-red/20 text-vp-red text-[13px] rounded-sm flex items-center gap-2">
                    <ShieldCheck size={14} /> {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-[13px] font-semibold text-text-dark mb-1.5">Mobile number</label>
                  <div className="flex items-stretch gap-2">
                    <span className="inline-flex items-center px-3 h-11 border border-border rounded-sm bg-surface text-[14px] font-medium text-text-medium select-none">
                      +91
                    </span>
                    <div className="flex-1">
                      <Input
                        type="tel"
                        inputMode="numeric"
                        placeholder="10-digit number"
                        leftIcon={<Phone size={16} />}
                        value={phone}
                        onChange={onPhoneChange}
                        required
                        autoComplete="tel-national"
                      />
                    </div>
                  </div>
                  {!needsName && <p className="text-[11px] text-text-light mt-1.5">We'll text you a one-time code to verify.</p>}
                </div>

                {/* Name is only collected for first-time numbers (sign-up). */}
                {needsName && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[13px] font-semibold text-text-dark mb-1.5">First name</label>
                      <Input
                        placeholder="John"
                        leftIcon={<User size={16} />}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        autoFocus
                        autoComplete="given-name"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-text-dark mb-1.5">Last name</label>
                      <Input
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        autoComplete="family-name"
                      />
                    </div>
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full" disabled={isLoading || !canContinue}>
                  {isLoading ? "Please wait..." : needsName ? "Create account & send code" : "Continue"}
                </Button>
              </form>

              {/* Dev-only demo logins. The dev code is also shown on the OTP step. */}
              {import.meta.env.DEV && (
                <div className="mt-5 text-[12px] text-text-light bg-surface border border-border-light rounded-sm px-3 py-2.5">
                  <p className="font-semibold text-text-medium mb-1.5">Dev test logins</p>
                  <div className="space-y-1">
                    <button type="button" onClick={() => { setPhone("9876543210"); setNeedsName(false); }} className="flex w-full items-center justify-between hover:text-vp-blue">
                      <span>+91 98765 43210</span><span className="font-mono font-semibold">OTP 1234</span>
                    </button>
                    <button type="button" onClick={() => { setPhone("9999900000"); setNeedsName(false); }} className="flex w-full items-center justify-between hover:text-vp-blue">
                      <span>+91 99999 00000</span><span className="font-mono font-semibold">OTP 1111</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-text-muted mt-1.5">Tap a number to fill it in. Any other number works too — its code shows on the next step.</p>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => { setStep("phone"); setErrorMsg(""); }}
                className="inline-flex items-center gap-2 text-[13px] text-text-light hover:text-vp-blue mb-6 self-start"
              >
                <ArrowLeft size={14} /> Change details
              </button>

              <h1 className="text-[28px] font-bold text-text-dark tracking-tight mb-1">Enter code</h1>
              <p className="text-[14px] text-text-light mb-1">
                Sent to <span className="font-semibold text-text-dark">+91 {phone}</span>
                <button
                  type="button"
                  onClick={() => { setStep("phone"); setErrorMsg(""); }}
                  className="ml-2 inline-flex items-center gap-1 text-vp-blue hover:underline align-middle"
                >
                  <Pencil size={11} /> edit
                </button>
              </p>

              {devCode && (
                <p className="text-[12px] text-vp-blue bg-vp-blue-light/50 border border-vp-blue/20 rounded-sm px-3 py-2 my-3">
                  Dev mode: your code is <span className="font-bold tracking-widest">{devCode}</span>
                </p>
              )}

              <form onSubmit={handleVerify} className="space-y-4 mt-4">
                {hasError && (
                  <div className="px-3 py-2.5 bg-vp-red-light border border-vp-red/20 text-vp-red text-[13px] rounded-sm flex items-center gap-2">
                    <ShieldCheck size={14} /> {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-[13px] font-semibold text-text-dark mb-1.5">4-digit code</label>
                  <input
                    ref={otpRef}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="••••"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="w-full h-12 px-4 border border-border rounded-sm text-[22px] tracking-[0.6em] text-center font-semibold bg-white focus:outline-none focus:border-vp-blue"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isLoading || code.length !== 4}>
                  {isLoading ? "Verifying..." : "Verify & continue"}
                </Button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isLoading}
                  className="w-full text-[13px] text-text-medium hover:text-vp-blue"
                >
                  Didn't get it? <span className="text-vp-blue font-semibold">Resend code</span>
                </button>
              </form>
            </>
          )}

          <p className="mt-8 text-center text-[12px] text-text-light">
            By continuing you agree to our{" "}
            <Link to="/help" className="text-vp-blue hover:underline">Terms</Link> and{" "}
            <Link to="/help" className="text-vp-blue hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>

      {/* Side panel — admin-managed image carousel */}
      <LoginCarousel content={content} />
    </div>
  );
}
