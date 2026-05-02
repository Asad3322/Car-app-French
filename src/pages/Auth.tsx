import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail } from 'lucide-react';
import { sendVerification } from '../services/authService';

const Auth = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Email is required');
      return;
    }

    setError('');
    setIsSending(true);

    try {
      localStorage.setItem('role', 'reporter'); // force email flow
      localStorage.setItem('pendingEmail', trimmedEmail);

      await sendVerification(trimmedEmail);

      navigate('/verify?role=reporter');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to send verification link');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#EEF3F8] px-6 py-10">
      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-12 mt-10 flex flex-col items-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#CFE0F2] bg-white">
            <ShieldCheck size={32} className="text-[#4A90E2]" />
          </div>

          <h1 className="text-3xl font-black text-[#1F2A37]">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-[#6B7A90]">
            Enter your email to continue
          </p>
        </div>

        <form onSubmit={handleVerify} className="flex flex-1 flex-col">
          <label className="mb-3 text-xs font-black text-[#6B7A90]">
            Email Address
          </label>

          <div className="relative mb-3">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA8BC]">
              <Mail size={20} />
            </span>

            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              className="h-[62px] w-full rounded-[22px] border border-[#D9E5F1] bg-white pl-12 pr-4"
            />
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={!email.trim() || isSending}
            className="mt-auto h-[58px] w-full rounded-full bg-[#F4B400] text-white"
          >
            {isSending ? 'Sending...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;