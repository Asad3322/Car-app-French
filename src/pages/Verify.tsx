import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  Phone,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../utils/store';

const Verify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useStore();

  const state = location.state as { contact?: string; role?: string } | null;
  const initialContact = state?.contact || '';
  const isEmail = state?.role !== 'owner';

  const [contact, setContact] = useState(initialContact);
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(initialContact ? 30 : 0);
  const [codeSent, setCodeSent] = useState(!!initialContact);
  const [error, setError] = useState('');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const handleSendCode = () => {
    if (!contact.trim()) return;
    setCodeSent(true);
    setCountdown(30);
    setError('');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim() || !code.trim()) return;

    setIsVerifying(true);
    setError('');

    setTimeout(() => {
      if (code === '1234' || code.length === 6) {
        setIsSuccess(true);
        setIsVerifying(false);

        setUser((prev) => ({
          ...prev,
          verifiedEmail: isEmail ? contact : prev.verifiedEmail,
          email: isEmail ? contact : prev.email,
          phone: !isEmail ? contact : prev.phone,
        }));

        setTimeout(() => {
          navigate('/complete-profile');
        }, 1400);
      } else {
        setError('Invalid code. Use 1234 for testing.');
        setIsVerifying(false);
      }
    }, 1200);
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-charcoal px-6 pt-8">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 right-[-90px] h-72 w-72 rounded-full bg-silicon-cyan/18 blur-3xl" />
        <div className="absolute left-[-80px] top-1/3 h-56 w-56 rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="absolute bottom-[-90px] left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-white/[0.05] blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#11161D] shadow-[0_10px_25px_rgba(0,0,0,0.3)] transition-all active:scale-95"
        >
          <ChevronLeft size={22} className="text-silicon-cyan" />
        </button>

        <h1 className="text-[14px] font-black uppercase tracking-[0.18em] text-white">
          Verify Account
        </h1>

        <div className="w-12" />
      </header>

      {/* Hero */}
      <section className="relative z-10 mb-8 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-silicon-cyan/25 bg-gradient-to-br from-silicon-cyan/20 to-white/5 shadow-[0_0_40px_rgba(53,215,255,0.2)]">
          <ShieldCheck
            size={34}
            className="text-silicon-cyan"
            strokeWidth={2.5}
          />
        </div>

        <h2 className="text-[26px] font-black uppercase tracking-[0.06em] text-white">
          Secure Verification
        </h2>

        <p className="mx-auto mt-3 max-w-[300px] text-[14px] leading-relaxed text-white/80">
          Enter the code sent to your {isEmail ? 'email address' : 'phone number'} to continue.
        </p>
      </section>

      {/* Card */}
      <main className="relative z-10 flex-1">
        <div className="rounded-[34px] border border-white/10 bg-[#11161D]/95 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <form onSubmit={handleVerify} className="flex h-full flex-col">
            {/* Contact Input */}
            <div className="mb-6">
              <label className="mb-2 ml-1 block text-[11px] font-black uppercase tracking-[0.18em] text-white/85">
                {isEmail ? 'Email Address' : 'Phone Number'}
              </label>

              <div className="group relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/55 transition-colors group-focus-within:text-silicon-cyan">
                  {isEmail ? <Mail size={18} /> : <Phone size={18} />}
                </span>

                <input
                  type={isEmail ? 'email' : 'tel'}
                  placeholder={isEmail ? 'name@example.com' : '+92 300 1234567'}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  disabled={codeSent}
                  className="h-[62px] w-full rounded-[22px] border border-white/12 bg-charcoal/90 pl-12 pr-4 text-[15px] font-medium text-white placeholder:text-white/45 outline-none transition-all focus:border-silicon-cyan focus:shadow-[0_0_0_1px_rgba(53,215,255,0.22),0_0_25px_rgba(53,215,255,0.08)] disabled:text-white/75 disabled:opacity-80"
                />
              </div>
            </div>

            {!codeSent ? (
              <div className="mt-auto pb-2">
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={!contact.trim()}
                  className="flex h-[66px] w-full items-center justify-center gap-3 rounded-[24px] bg-gradient-to-r from-[#62D8FF] to-[#38C8F5] text-[15px] font-black uppercase tracking-[0.14em] text-charcoal shadow-[0_15px_35px_rgba(53,215,255,0.3)] transition-all duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>Send Code</span>
                  <ArrowRight size={18} strokeWidth={2.8} />
                </button>
              </div>
            ) : (
              <>
                {/* Verification Input */}
                <div className="mb-5 rounded-[28px] border border-white/10 bg-charcoal/75 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                  <div className="mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white">
                      Verification Code
                    </p>
                    <p className="mt-1 text-[11px] text-white/65">
                      Enter 4 to 6 digits
                    </p>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="000000"
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                      }
                      disabled={isVerifying || isSuccess}
                      className={`h-[68px] w-full rounded-[20px] border bg-[#0B1117] px-5 text-center text-[28px] font-black tracking-[0.32em] text-white outline-none transition-all placeholder:text-white/20 ${
                        error
                          ? 'border-red-500/70 focus:border-red-500 focus:shadow-[0_0_0_1px_rgba(239,68,68,0.22),0_0_24px_rgba(239,68,68,0.12)]'
                          : isSuccess
                          ? 'border-emerald-500/70 focus:border-emerald-500 focus:shadow-[0_0_0_1px_rgba(16,185,129,0.22),0_0_24px_rgba(16,185,129,0.12)]'
                          : 'border-white/12 focus:border-silicon-cyan focus:shadow-[0_0_0_1px_rgba(53,215,255,0.22),0_0_24px_rgba(53,215,255,0.12)]'
                      }`}
                    />
                  </div>

                  {error && (
                    <p className="mt-3 text-[11px] font-bold text-red-400">
                      {error}
                    </p>
                  )}

                  {isSuccess && (
                    <p className="mt-3 flex items-center gap-2 text-[11px] font-bold text-emerald-400">
                      <CheckCircle2 size={14} /> Code verified successfully
                    </p>
                  )}
                </div>

                {/* Resend */}
                <div className="mb-6 rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-center">
                  <p className="text-[12px] text-white/75">
                    Didn’t receive the code?
                  </p>

                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={countdown > 0 || isSuccess}
                    className="mt-1 text-[12px] font-bold text-silicon-cyan transition-opacity disabled:opacity-40"
                  >
                    {countdown > 0
                      ? `Resend available in ${countdown}s`
                      : 'Resend Verification Code'}
                  </button>
                </div>

                {/* Submit */}
                <div className="mt-auto pb-2">
                  <button
                    type="submit"
                    disabled={code.length < 4 || isVerifying || isSuccess}
                    className="flex h-[66px] w-full items-center justify-center gap-3 rounded-[24px] bg-gradient-to-r from-[#62D8FF] to-[#38C8F5] text-[15px] font-black uppercase tracking-[0.14em] text-charcoal shadow-[0_15px_35px_rgba(53,215,255,0.3)] transition-all duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-charcoal border-t-transparent" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Continue</span>
                        <ArrowRight size={18} strokeWidth={2.8} />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-7 pb-8 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/55">
          Protected access
        </p>
      </footer>
    </div>
  );
};

export default Verify;