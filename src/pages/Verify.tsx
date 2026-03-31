import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, KeyRound, ArrowRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
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
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendCode = () => {
    if (!contact) return;
    setCodeSent(true);
    setCountdown(30);
    setError('');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact || !code) return;

    setIsVerifying(true);
    setError('');

    // Simulate verification for prototype
    setTimeout(() => {
      if (code === '1234' || code.length === 6) {
        setIsSuccess(true);
        setIsVerifying(false);

        setUser(prev => ({
          ...prev,
          verifiedEmail: isEmail ? contact : prev.verifiedEmail,
          email: isEmail ? contact : prev.email,
          phone: !isEmail ? contact : prev.phone,
        }));

        setTimeout(() => {
          navigate('/complete-profile');
        }, 1500);
      } else {
        setError('Invalid code. Try 1234 for testing.');
        setIsVerifying(false);
      }
    }, 1200);
  };

  return (
    <div className="flex h-full flex-col bg-public-bg px-6 pt-10 sm:rounded-[40px] relative">
      {/* Header */}
      <header className="mb-10 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-public-surface border border-public-border shadow-sm active:scale-90"
        >
          <ChevronLeft size={20} className="text-public-textPrimary" strokeWidth={3} />
        </button>
        <h1 className="text-lg font-black tracking-tight text-public-textPrimary uppercase">
          Verify Account
        </h1>
        <div className="w-11"></div>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center text-center px-4 mb-10">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[32px] bg-public-surface border border-public-border text-blue-600 shadow-sm">
          <ShieldCheck size={36} strokeWidth={2.5} />
        </div>
        <p className="text-[17px] font-bold leading-relaxed text-public-textSecondary">
          Enter the code sent to your {isEmail ? 'email' : 'phone'} to verify your identity.
        </p>
      </div>

      {/* Form Area */}
      <main className="flex-1 flex flex-col">
        <form onSubmit={handleVerify} className="flex-1 flex flex-col">

          <div className="mb-6">
            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-public-textSecondary ml-1 mb-2 block">
              {isEmail ? 'Email Address' : 'Phone Number'}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-public-textSecondary">
                {isEmail ? <Mail size={18} /> : <Phone size={18} />}
              </span>
              <input
                type={isEmail ? "email" : "tel"}
                placeholder={isEmail ? "name@example.com" : "+1 (555) 000-0000"}
                className="waze-input pl-12 h-[60px]"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                disabled={codeSent}
              />
            </div>
          </div>

          {!codeSent ? (
            <div className="mt-auto mb-10">
              <button
                type="button"
                onClick={handleSendCode}
                disabled={!contact}
                className="waze-btn-primary h-[64px]"
              >
                Send Code
              </button>
            </div>
          ) : (
            <>
              {/* Code Input */}
              <div className="mb-3">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-public-textSecondary ml-1 mb-2 block">Verification Code</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-public-textSecondary">
                    <KeyRound size={18} />
                  </span>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    className={`waze-input pl-12 h-[60px] tracking-[0.5em] font-black text-center ${error ? 'border-red-400 focus:border-red-500' :
                        isSuccess ? 'border-emerald-400 focus:border-emerald-500' : ''
                      }`}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={isVerifying || isSuccess}
                  />
                </div>
                {error && <p className="mt-2 text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">{error}</p>}
                {isSuccess && (
                  <p className="mt-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1 flex items-center gap-1.5 animate-bounce">
                    <CheckCircle2 size={12} strokeWidth={3} /> Code Verified!
                  </p>
                )}
              </div>

              <div className="mt-auto mb-10 flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={code.length < 4 || isVerifying || isSuccess}
                  className="waze-btn-primary h-[64px] flex items-center justify-center gap-3"
                >
                  {isVerifying ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : null}
                  <span>{isVerifying ? 'Verifying...' : 'Verify & Continue'}</span>
                  {!isVerifying && !isSuccess && <ArrowRight size={20} />}
                </button>

                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={countdown > 0 || isSuccess}
                  className="text-[11px] font-black uppercase tracking-widest text-public-textSecondary hover:text-blue-600 disabled:opacity-50"
                >
                  {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend Verification Code'}
                </button>
              </div>
            </>
          )}
        </form>
      </main>
    </div>
  );
};

export default Verify;
