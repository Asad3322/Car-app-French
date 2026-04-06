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
    <div className="relative flex h-full flex-col overflow-hidden bg-[#EEF3F8] px-6 py-10">
      <div className="pointer-events-none absolute left-1/2 top-10 h-52 w-52 -translate-x-1/2 rounded-full bg-[#5BA3F0]/20 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-white/70 blur-[120px]" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-12 mt-10 flex flex-col items-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#CFE0F2] bg-white shadow-[0_10px_30px_rgba(74,144,226,0.10)]">
            <ShieldCheck size={32} className="text-[#4A90E2]" />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-[#1F2A37]">
            Welcome Back
          </h1>

          <p className="mt-2 max-w-[260px] text-center text-sm font-medium text-[#6B7A90]">
            {isEmail
              ? 'Enter your email to continue'
              : 'Enter your phone number to continue'}
          </p>
        </div>

        <form onSubmit={handleVerify} className="flex flex-1 flex-col">
          <label className="mb-3 ml-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#6B7A90]">
            {isEmail ? 'Email Address' : 'Phone Number'}
          </label>

          <div className="relative mb-10">
            <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#9AA8BC] transition-colors duration-300">
              {isEmail ? <Mail size={20} /> : <Phone size={20} />}
            </span>

            <input
              type={isEmail ? 'email' : 'tel'}
              placeholder={isEmail ? 'name@example.com' : '+92 300 1234567'}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              autoFocus
              className="h-[62px] w-full rounded-[22px] border border-[#D9E5F1] bg-white pl-12 pr-4 text-[15px] font-medium text-[#1F2A37] placeholder:text-[#9AA8BC] outline-none shadow-sm transition-all duration-300 focus:border-[#5BA3F0] focus:ring-4 focus:ring-[#5BA3F0]/15"
            />
          </div>

          <button
            type="submit"
            disabled={!contact.trim() || isVerifying}
            className={`mt-auto h-[58px] w-full rounded-full border-b-4 border-[#E09E00] bg-[#F4B400] text-sm font-black text-white shadow-[0_14px_28px_rgba(244,180,0,0.25)] transition-all duration-300 active:scale-[0.97] ${
              !contact.trim() || isVerifying ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {isVerifying ? 'Sending...' : 'Continue'}
          </button>

          <div className="mt-6 text-center text-sm">
            {countdown > 0 ? (
              <span className="text-[#9AA8BC]">
                Resend in <span className="font-bold text-[#1F2A37]">{countdown}</span>s
              </span>
            ) : (
              <button
                type="button"
                className="font-bold text-[#4A90E2]"
                onClick={() => setCountdown(30)}
              >
                Resend code
              </button>
            )}
          </div>
        </form>

        <div className="mt-10 text-center">
          <a
            href="mailto:support@carapp.com"
            className="text-xs font-medium text-[#9AA8BC] transition-colors hover:text-[#4A90E2]"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default Auth;