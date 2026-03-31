import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, ArrowRight } from 'lucide-react';

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
    if (!contact) return;
    
    setIsVerifying(true);
    
    // Simulate prep/sending of code for prototype
    setTimeout(() => {
      setIsVerifying(false);
      navigate('/verify', { state: { contact, role } });
    }, 1500);
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="flex flex-col h-full bg-public-bg relative pb-4 sm:rounded-[40px] px-6">
      
      {/* Header */}
      <div className="pt-16 pb-12 flex flex-col items-center">
        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary-dark mb-6 shadow-sm">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-3xl font-black text-public-textPrimary tracking-tight">
          CARAPP
        </h1>
        <p className="text-public-textSecondary font-medium mt-2 text-center text-sm px-4">
          {isEmail ? "Secure your rewards and track your latest reports." : "Register your vehicle to claim reports and get alerts."}
        </p>
      </div>

      {/* Form Area */}
      <div className="w-full bg-public-surface rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-public-border flex-1 flex flex-col pt-8">
        <form onSubmit={handleVerify} className="flex flex-col flex-1">
          <label className="text-base font-black mb-3 text-public-textSecondary uppercase tracking-wider ml-1">
            Enter your contact mode
          </label>
          
          <div className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-public-textSecondary">
              {isEmail ? <Mail size={20} /> : <Phone size={20} />}
            </span>
            <input 
              type={isEmail ? "email" : "tel"}
              placeholder={isEmail ? "name@example.com" : "+1 (555) 000-0000"}
              className="w-full bg-public-bg border-2 border-public-border rounded-2xl pl-12 pr-4 py-4 font-bold text-public-textPrimary placeholder:text-public-textSecondary focus:outline-none focus:border-primary transition-all shadow-inner"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              autoFocus
            />
          </div>

          <button 
            type="submit"
            disabled={!contact || isVerifying}
            className={`waze-btn-primary py-4 text-lg mt-auto shadow-lg shadow-blue-600/20 ${(!contact || isVerifying) ? 'opacity-50 grayscale' : ''}`}
          >
            {isVerifying ? 'Sending...' : 'Send Verification'}
            {!isVerifying && <ArrowRight size={20} />}
          </button>
          
          <div className="mt-6 text-center text-sm font-medium">
            {countdown > 0 ? (
              <span className="text-public-textSecondary">Resend code in <span className="text-public-textPrimary w-4 inline-block">{countdown}</span>s</span>
            ) : (
              <button type="button" className="text-blue-600 hover:text-blue-700 underline" onClick={() => setCountdown(30)}>
                Resend verification code
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="w-full text-center pb-8 pt-6">
        <a href="mailto:support@carapp.com" className="font-bold text-public-textSecondary hover:text-public-textPrimary transition-colors text-xs">
          Contact Support Team
        </a>
      </div>
    </div>
  );
};

export default Auth;
