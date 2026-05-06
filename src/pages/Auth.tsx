import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Phone } from 'lucide-react';
import { sendVerification } from '../services/authService';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const roleParam = params.get('role');
  const storedRole = localStorage.getItem('role');
  const storedVehicleId = localStorage.getItem('vehicleId');

  const isReporterUrl = roleParam === 'reporter';

  const isOwner =
    !isReporterUrl &&
    (
      roleParam === 'owner' ||
      roleParam === 'vehicle_owner' ||
      (!!storedVehicleId && storedRole === 'vehicle_owner')
    );

  const vehicleId = useMemo(() => {
    return params.get('vehicleId') || localStorage.getItem('vehicleId') || '';
  }, [location.search]);

  const [contact, setContact] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedContact = contact.trim();

    if (!trimmedContact) {
      setError(isOwner ? 'Phone number is required' : 'Email is required');
      return;
    }

    setError('');
    setIsSending(true);

    try {
      // ================= OWNER FLOW =================
      if (isOwner) {
        if (!vehicleId) {
          throw new Error('Vehicle ID missing. Please register vehicle again.');
        }

        localStorage.removeItem('pendingEmail');

        localStorage.setItem('role', 'vehicle_owner');
        localStorage.setItem('pendingPhone', trimmedContact);
        localStorage.setItem('vehicleId', vehicleId);

        await sendVerification({
          contact: trimmedContact,
          role: 'vehicle_owner',
          vehicleId,
        });

        navigate('/verify?role=owner');
        return;
      }

      // ================= REPORTER FLOW =================
      localStorage.removeItem('vehicleId');
      localStorage.removeItem('pendingPhone');
      localStorage.removeItem('verifiedPhone');
      localStorage.removeItem('ownerAccess');

      localStorage.setItem('role', 'reporter');
      localStorage.setItem('pendingEmail', trimmedContact);

      await sendVerification({
        contact: trimmedContact,
        role: 'reporter',
      });

      navigate('/verify?role=reporter');
    } catch (err: any) {
      console.error('Auth verification error:', err);
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
            {isOwner ? 'Verify Your Phone' : 'Welcome Back'}
          </h1>

          <p className="mt-2 text-sm text-[#6B7A90]">
            {isOwner
              ? 'Enter your phone number to claim your vehicle'
              : 'Enter your email to continue'}
          </p>
        </div>

        <form onSubmit={handleVerify} className="flex flex-1 flex-col">
          <label className="mb-3 text-xs font-black text-[#6B7A90]">
            {isOwner ? 'Phone Number' : 'Email Address'}
          </label>

          <div className="relative mb-3">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA8BC]">
              {isOwner ? <Phone size={20} /> : <Mail size={20} />}
            </span>

            <input
              type={isOwner ? 'tel' : 'email'}
              placeholder={isOwner ? '+33678333292' : 'name@example.com'}
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                if (error) setError('');
              }}
              className="h-[62px] w-full rounded-[22px] border border-[#D9E5F1] bg-white pl-12 pr-4 outline-none focus:border-[#4A90E2]"
            />
          </div>

          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={!contact.trim() || isSending}
            className="mt-auto h-[58px] w-full rounded-full bg-[#F4B400] font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSending ? 'Sending...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;