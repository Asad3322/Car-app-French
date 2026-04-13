import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  ChevronLeft,
} from 'lucide-react';

const Verify = () => {
  const navigate = useNavigate();

  const storedEmail = localStorage.getItem('pendingEmail') || '';

  const [contact, setContact] = useState(storedEmail);
  const [linkSent, setLinkSent] = useState(!!storedEmail);

  const handleSendLink = () => {
    if (!contact.trim()) return;

    localStorage.setItem('pendingEmail', contact.trim());
    setLinkSent(true);
  };

  const handleChangeEmail = () => {
    localStorage.removeItem('pendingEmail');
    setContact('');
    setLinkSent(false);
    navigate('/auth');
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
          <div className="mx-auto flex w-full max-w-[420px] flex-col">
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
                  ? 'Enter your email to receive a secure login link.'
                  : 'We sent a secure login link to your email. Open it to continue.'}
              </p>
            </div>

            {!linkSent ? (
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase text-[#6F8194]">
                  Email Address
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA8BC]">
                    <Mail size={18} />
                  </span>

                  <input
                    type="email"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="name@example.com"
                    className="h-[58px] w-full rounded-[18px] border border-[#D9E5F1] bg-white pl-12 pr-4 text-[15px] outline-none"
                  />
                </div>

                <p className="mt-3 text-[13px] text-[#6F8194]">
                  We will send a secure sign-in link to your email.
                </p>

                <button
                  onClick={handleSendLink}
                  disabled={!contact.trim()}
                  className="mt-6 h-[58px] w-full rounded-full bg-[#2F93F6] font-black text-white disabled:opacity-50"
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

                <div className="mt-4">
                  <p className="text-[14px] font-semibold text-[#2F93F6]">
                    Next step
                  </p>

                  <p className="text-[14px] text-[#6F8194]">
                    Open the secure link from your inbox and continue to your profile setup.
                  </p>
                </div>

                <button
                  onClick={handleChangeEmail}
                  className="mt-6 text-sm font-bold text-[#2F93F6]"
                >
                  Change email
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