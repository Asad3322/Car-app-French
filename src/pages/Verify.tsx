import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  Phone,
  ChevronLeft,
} from 'lucide-react';

type VerifyMode = 'reporter' | 'owner';

type VerifyLocationState = {
  mode?: VerifyMode;
};

const formatFrenchInternational = (value: string): string => {
  let digits = value.replace(/\D/g, '');

  if (digits.startsWith('0')) {
    digits = '33' + digits.slice(1);
  }

  if (!digits.startsWith('33')) {
    digits = '33' + digits;
  }

  digits = digits.slice(0, 11);

  return (
    '+' +
    digits
      .replace(/^33/, '33 ')
      .replace(/(\d{1})(?=\d{2})/, '$1 ')
      .replace(/(\d{2})(?=\d)/g, '$1 ')
      .trim()
  );
};

const isValidFrenchIntl = (num: string): boolean => {
  return /^\+33\s?[67](\s?\d{2}){4}$/.test(num);
};

const Verify = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as VerifyLocationState | null;
  const mode: VerifyMode = state?.mode || 'reporter';
  const isOwner = mode === 'owner';

  const storageKey = isOwner ? 'pendingPhone' : 'pendingEmail';
  const storedContact = localStorage.getItem(storageKey) || '';

  const [contact, setContact] = useState<string>(storedContact);
  const [linkSent, setLinkSent] = useState<boolean>(!!storedContact);

  const handleSendLink = (): void => {
    if (!contact.trim()) return;

    if (isOwner && !isValidFrenchIntl(contact)) {
      alert('Enter valid French number (e.g. +33 6 12 34 56 78)');
      return;
    }

    localStorage.setItem(storageKey, contact.trim());
    setLinkSent(true);
  };

  const handleChangeContact = (): void => {
    localStorage.removeItem(storageKey);
    setContact('');
    setLinkSent(false);

    if (isOwner) {
      navigate('/add-vehicle-onboarding');
    } else {
      navigate('/auth');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;

    if (isOwner) {
      setContact(formatFrenchInternational(value));
    } else {
      setContact(value);
    }
  };

  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-[#D6E2EC] text-[#0B1A2B]">
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

      <main className="flex flex-1 flex-col px-6 pb-8">
        <div className="flex flex-1 flex-col rounded-t-[34px] border border-[#B8C9D6] bg-[#EEF4F8] px-6 pt-8 pb-8 shadow">
          <div className="mx-auto flex w-full max-w-[420px] flex-col">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-[#D9E5F1] bg-white shadow">
                <ShieldCheck size={36} className="text-[#2F93F6]" />
              </div>

              <h2 className="text-[26px] font-black">Secure Verification</h2>

              <p className="mt-3 text-[14px] text-[#6F8194]">
                {!linkSent
                  ? isOwner
                    ? 'Enter your phone number to receive a secure verification link.'
                    : 'Enter your email to receive a secure login link.'
                  : isOwner
                    ? 'We sent a secure verification link to your phone. Open it to continue.'
                    : 'We sent a secure login link to your email. Open it to continue.'}
              </p>
            </div>

            {!linkSent ? (
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase text-[#6F8194]">
                  {isOwner ? 'Phone Number' : 'Email Address'}
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA8BC]">
                    {isOwner ? <Phone size={18} /> : <Mail size={18} />}
                  </span>

                  <input
                    type={isOwner ? 'tel' : 'email'}
                    value={contact}
                    onChange={handleInputChange}
                    placeholder={isOwner ? '+33 6 12 34 56 78' : 'name@example.com'}
                    autoComplete="off"
                    className="h-[58px] w-full rounded-[18px] border border-[#D9E5F1] bg-white pl-12 pr-4 text-[15px] outline-none"
                  />
                </div>

                <p className="mt-3 text-[13px] text-[#6F8194]">
                  {isOwner
                    ? 'We will send a secure verification link to your phone number.'
                    : 'We will send a secure sign-in link to your email.'}
                </p>

                <button
                  onClick={handleSendLink}
                  disabled={!contact.trim()}
                  className="mt-6 h-[58px] w-full rounded-full bg-[#2F93F6] font-black text-white disabled:opacity-50"
                >
                  {isOwner ? 'Send Verification' : 'Send Login Link'}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-[11px] font-black uppercase text-[#7A8B9D]">
                  {isOwner ? 'Verification sent to' : 'Link sent to'}
                </p>

                <p className="mt-2 break-all text-[17px] font-black">{contact}</p>

                <div className="mt-4">
                  <p className="text-[14px] font-semibold text-[#2F93F6]">
                    Next step
                  </p>

                  <p className="text-[14px] text-[#6F8194]">
                    {isOwner
                      ? 'Open the secure link and continue to complete your vehicle owner account.'
                      : 'Open the secure link from your inbox and continue to your profile setup.'}
                  </p>
                </div>

                <button
                  onClick={handleChangeContact}
                  className="mt-6 text-sm font-bold text-[#2F93F6]"
                >
                  {isOwner ? 'Change phone number' : 'Change email'}
                </button>
              </div>
            )}

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