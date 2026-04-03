import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Mail, Phone } from 'lucide-react';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'reporter';
  const navigate = useNavigate();

  const [contact, setContact] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const isEmail = role === 'reporter';

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      navigate('/verify', { state: { contact, role } });
    }, 1200);
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="flex h-full flex-col bg-charcoal px-6 py-10 text-white">
      {/* Header */}
      <div className="mt-10 mb-12 flex flex-col items-center">
        <div
          className="
            mb-6 flex h-20 w-20 items-center justify-center rounded-full
            border border-[#62D8FF]/30 bg-[#62D8FF]/10
            shadow-[0_0_30px_rgba(98,216,255,0.15)]
          "
        >
          <ShieldCheck size={32} className="text-[#62D8FF]" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>

        <p className="mt-2 max-w-[260px] text-center text-sm text-white/60">
          {isEmail
            ? 'Enter your email to continue'
            : 'Enter your phone number to continue'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleVerify} className="flex flex-1 flex-col">
        <label className="mb-3 ml-1 text-[11px] font-black uppercase tracking-[0.18em] text-white/70">
          {isEmail ? 'Email Address' : 'Phone Number'}
        </label>

        {/* Beautiful Input */}
        <div className="relative mb-10">
          <span
            className="
              pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2
              text-white/50 transition-colors duration-300
            "
          >
            {isEmail ? <Mail size={20} /> : <Phone size={20} />}
          </span>

          <input
            type={isEmail ? 'email' : 'tel'}
            placeholder={isEmail ? 'name@example.com' : '+92 300 1234567'}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            autoFocus
            className="
              h-[62px] w-full rounded-[22px]
              border border-white/12 bg-white/[0.04]
              pl-12 pr-4
              text-[15px] font-medium text-white
              placeholder:text-white/35
              outline-none backdrop-blur-sm
              transition-all duration-300
              focus:border-[#62D8FF]
              focus:bg-[#0f1722]
              focus:shadow-[0_0_0_1px_rgba(98,216,255,0.25),0_0_30px_rgba(98,216,255,0.10)]
            "
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={!contact.trim() || isVerifying}
          className={`
            mt-auto h-[58px] w-full rounded-full
            bg-gradient-to-r from-[#62D8FF] to-[#38C8F5]
            text-sm font-semibold text-black
            shadow-[0_10px_25px_rgba(98,216,255,0.25)]
            transition-all duration-300 active:scale-[0.97]
            ${!contact.trim() || isVerifying ? 'cursor-not-allowed opacity-50' : ''}
          `}
        >
          {isVerifying ? 'Sending...' : 'Continue'}
        </button>

        {/* Resend */}
        <div className="mt-6 text-center text-sm">
          {countdown > 0 ? (
            <span className="text-white/50">
              Resend in <span className="text-white">{countdown}</span>s
            </span>
          ) : (
            <button
              type="button"
              className="font-medium text-[#62D8FF]"
              onClick={() => setCountdown(30)}
            >
              Resend code
            </button>
          )}
        </div>
      </form>

      {/* Footer */}
      <div className="mt-10 text-center">
        <a
          href="mailto:support@carapp.com"
          className="text-xs text-white/50 transition-colors hover:text-white"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default Auth;