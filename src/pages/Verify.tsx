import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  Phone,
  ChevronLeft,
  CheckCircle2,
  ArrowRight,
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
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#B8C9D6] bg-[#EEF4F8] text-[#6B7A90] shadow-sm transition hover:bg-white active:scale-95"
        >
          <ChevronLeft size={22} />
        </button>

        <h1 className="text-[14px] font-black uppercase tracking-[0.18em] text-[#1F2A37]">
          Verify Account
        </h1>

        <div className="w-11" />
      </header>

      {/* Full Screen Content */}
      <main className="flex flex-1 flex-col px-6 pb-8">
        <div className="flex flex-1 flex-col rounded-t-[34px] border border-[#B8C9D6] bg-[#EEF4F8] px-6 pt-8 pb-8 shadow-[0_16px_40px_rgba(70,106,140,0.12)]">
          {/* Top Intro */}
          <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-[#D9E5F1] bg-white shadow-[0_10px_24px_rgba(70,106,140,0.10)]">
                <ShieldCheck size={36} className="text-[#2F93F6]" />
              </div>

              <h2 className="text-[26px] font-black tracking-tight text-[#0B1A2B]">
                Secure Verification
              </h2>

              <p className="mx-auto mt-3 max-w-[320px] text-[14px] leading-6 text-[#6F8194]">
                {!linkSent
                  ? `Enter your ${isEmail ? 'email' : 'phone'} to receive a secure login link.`
                  : `We sent a secure login link to your ${isEmail ? 'email' : 'phone'}. Open it to continue.`}
              </p>
            </div>

            {/* Main Card */}
            <div className="rounded-[30px] border border-[#C5D3DE] bg-white p-5 shadow-[0_12px_28px_rgba(70,106,140,0.08)]">
              {!linkSent ? (
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-[#6F8194]">
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
                      className="h-[58px] w-full rounded-[18px] border border-[#D9E5F1] bg-[#FCFEFF] pl-12 pr-4 text-[15px] font-medium text-[#0B1A2B] outline-none placeholder:text-[#9AA8BC] focus:border-[#2F93F6] focus:ring-2 focus:ring-[#2F93F6]/15"
                    />
                  </div>

                  <div className="mt-4 rounded-[18px] border border-[#D9E5F1] bg-[#F8FBFF] px-4 py-4">
                    <p className="text-[12px] font-semibold text-[#6F8194]">
                      Verification method
                    </p>
                    <p className="mt-1 text-[13px] leading-5 text-[#0B1A2B]">
                      We will send a secure sign-in link instead of a verification code.
                    </p>
                  </div>

                  <button
                    onClick={handleSendLink}
                    disabled={!contact.trim()}
                    className="mt-5 flex h-[58px] w-full items-center justify-center gap-2 rounded-full bg-[#2F93F6] text-[14px] font-black uppercase tracking-[0.05em] text-white shadow-[0_10px_20px_rgba(47,147,246,0.28)] transition active:scale-[0.98] disabled:opacity-50"
                  >
                    Send Login Link
                    <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="rounded-[20px] border border-[#D9E5F1] bg-[#F8FBFF] px-4 py-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6F8194]">
                      Link sent to
                    </p>
                    <p className="mt-2 break-all text-[15px] font-bold text-[#0B1A2B]">
                      {contact}
                    </p>
                  </div>

                  {!isSuccess ? (
                    <>
                      <div className="mt-4 rounded-[18px] border border-[#D9E5F1] bg-[#EEF6FF] px-4 py-4">
                        <p className="text-[13px] font-semibold text-[#2F93F6]">
                          Next step
                        </p>
                        <p className="mt-1 text-[13px] leading-5 text-[#5E7388]">
                          Open the secure link from your inbox or message and continue to your profile setup.
                        </p>
                      </div>

                      <button
                        onClick={handleSimulateClick}
                        className="mt-5 flex h-[58px] w-full items-center justify-center rounded-full bg-[#2F93F6] text-[14px] font-black uppercase tracking-[0.05em] text-white shadow-[0_10px_20px_rgba(47,147,246,0.28)] transition active:scale-[0.98]"
                      >
                        I Opened the Link
                      </button>
                    </>
                  ) : (
                    <div className="mt-5 flex items-center justify-center gap-2 rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-4 text-emerald-600">
                      <CheckCircle2 size={18} />
                      <span className="text-sm font-bold">
                        Verified Successfully
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setLinkSent(false);
                      setIsSuccess(false);
                    }}
                    className="mt-4 w-full text-center text-sm font-bold text-[#2F93F6]"
                  >
                    Change {isEmail ? 'email' : 'phone'}
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Spacer / Footer Feel */}
            <div className="mt-auto pt-6 text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8EA1B3]">
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