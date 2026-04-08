import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  Phone,
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
  const [linkSent, setLinkSent] = useState(!!initialContact);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSendLink = () => {
    if (!contact.trim()) return;
    setLinkSent(true);
  };

  const handleSimulateClick = () => {
    setIsSuccess(true);

    setUser((prev) => ({
      ...prev,
      verifiedEmail: isEmail ? contact : prev.verifiedEmail,
      email: isEmail ? contact : prev.email,
      phone: !isEmail ? contact : prev.phone,
    }));

    setTimeout(() => {
      navigate('/complete-profile');
    }, 1400);
  };

  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-[#D6E2EC] text-[#0B1A2B]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-8 pb-5">
        <button
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#B8C9D6] bg-[#EEF4F8] text-[#6B7A90] shadow-sm hover:bg-white active:scale-95"
        >
          <ChevronLeft size={22} />
        </button>

        <h1 className="text-[14px] font-black uppercase tracking-[0.18em] text-[#1F2A37]">
          Verify Account
        </h1>

        <div className="w-11" />
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col px-6 pb-8">
        <div className="flex flex-1 flex-col rounded-t-[34px] border border-[#B8C9D6] bg-[#EEF4F8] px-6 pt-8 pb-8 shadow">
          <div className="mx-auto w-full max-w-[420px] flex flex-col">

            {/* Top */}
            <div className="mb-6 text-center">
              <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-[#D9E5F1] bg-white shadow">
                <ShieldCheck size={36} className="text-[#2F93F6]" />
              </div>

              <h2 className="text-[26px] font-black">
                Secure Verification
              </h2>

              <p className="mt-3 text-[14px] text-[#6F8194]">
                {!linkSent
                  ? `Enter your ${isEmail ? 'email' : 'phone'} to receive a secure login link.`
                  : `We sent a secure login link to your ${isEmail ? 'email' : 'phone'}. Open it to continue.`}
              </p>
            </div>

            {/* FORM / RESULT (NO CARD) */}
            {!linkSent ? (
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase text-[#6F8194]">
                  {isEmail ? 'Email Address' : 'Phone Number'}
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA8BC]">
                    {isEmail ? <Mail size={18} /> : <Phone size={18} />}
                  </span>

                  <input
                    type={isEmail ? 'email' : 'tel'}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder={isEmail ? 'name@example.com' : '+92 300 1234567'}
                    className="h-[58px] w-full rounded-[18px] border border-[#D9E5F1] bg-white pl-12 pr-4 text-[15px]"
                  />
                </div>

                <p className="mt-3 text-[13px] text-[#6F8194]">
                  We will send a secure sign-in link instead of a verification code.
                </p>

                <button
                  onClick={handleSendLink}
                  disabled={!contact.trim()}
                  className="mt-6 h-[58px] w-full rounded-full bg-[#2F93F6] text-white font-black"
                >
                  Send Login Link
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-[11px] font-black uppercase text-[#7A8B9D]">
                  Link sent to
                </p>

                <p className="mt-2 break-all text-[17px] font-black">
                  {contact}
                </p>

                {!isSuccess ? (
                  <>
                    <div className="mt-4">
                      <p className="text-[14px] font-semibold text-[#2F93F6]">
                        Next step
                      </p>

                      <p className="text-[14px] text-[#6F8194]">
                        Open the secure link from your inbox or message and continue to your profile setup.
                      </p>
                    </div>

                    <button
                      onClick={handleSimulateClick}
                      className="mt-6 h-[58px] w-full rounded-full bg-[#2F93F6] text-white font-black"
                    >
                      I Opened the Link
                    </button>
                  </>
                ) : (
                  <div className="mt-6 flex items-center justify-center gap-2 text-emerald-600">
                    <CheckCircle2 size={18} />
                    <span className="font-bold">
                      Verified Successfully
                    </span>
                  </div>
                )}

                <button
                  onClick={() => {
                    setLinkSent(false);
                    setIsSuccess(false);
                  }}
                  className="mt-4 text-sm font-bold text-[#2F93F6]"
                >
                  Change {isEmail ? 'email' : 'phone'}
                </button>
              </div>
            )}

            {/* Footer */}
            <div className="mt-auto pt-6 text-center">
              <p className="text-[11px] uppercase text-[#8EA1B3]">
                Protected access
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Verify;