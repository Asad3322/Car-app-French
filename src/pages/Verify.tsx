import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { sendVerification } from '../services/authService';

const API_BASE_URL = import.meta.env.VITE_API_URL;

type VerifyMode = 'reporter' | 'owner';

type VerifyLocationState = {
  mode?: VerifyMode;
  vehicleId?: string | null;
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
  const { t } = useTranslation();

  const state = location.state as VerifyLocationState | null;
  const searchParams = new URLSearchParams(location.search);

  const urlRole = searchParams.get('role');

  const mode: VerifyMode =
    state?.mode || (urlRole === 'owner' ? 'owner' : 'reporter');

  const isOwner = mode === 'owner';

  const vehicleId =
    state?.vehicleId ||
    searchParams.get('vehicleId') ||
    localStorage.getItem('vehicleId') ||
    null;

  const storageKey = isOwner ? 'pendingPhone' : 'pendingEmail';

  const storedContact =
    localStorage.getItem(storageKey) || '';

  const [contact, setContact] =
    useState<string>(storedContact);

  const [linkSent, setLinkSent] =
    useState<boolean>(false);

  const [loading, setLoading] =
    useState<boolean>(false);

  useEffect(() => {
    if (isOwner && !vehicleId) {
      console.error(
        '❌ Missing vehicleId in owner verify flow'
      );

      alert(
        'Vehicle registration failed. Please add vehicle again.'
      );

      navigate('/vehicle/add', {
        replace: true,
      });
    }
  }, [isOwner, vehicleId, navigate]);

  const handleSendLink = async (): Promise<void> => {
    if (!contact.trim()) return;

    if (isOwner && !vehicleId) {
      alert(
        'Vehicle ID is missing. Please add vehicle again.'
      );

      navigate('/vehicle/add', {
        replace: true,
      });

      return;
    }

    if (isOwner && !isValidFrenchIntl(contact)) {
      alert(
        'Enter valid French number (e.g. +33 6 12 34 56 78)'
      );

      return;
    }

    try {
      setLoading(true);

      localStorage.setItem(
        storageKey,
        contact.trim()
      );

      // REPORTER FLOW
      if (!isOwner) {
        localStorage.setItem('role', 'reporter');

        await sendVerification(contact.trim());

        setLinkSent(true);

        alert(
          'Login link sent successfully. Please check your email.'
        );

        return;
      }

      // OWNER FLOW
      localStorage.setItem(
        'role',
        'vehicle_owner'
      );

      localStorage.setItem(
        'vehicleId',
        vehicleId || ''
      );

      const payload = {
        contact: contact.trim(),
        role: 'vehicle_owner',
        vehicleId,
      };

      console.log(
        '🚀 OWNER VERIFY PAYLOAD:',
        payload
      );

      const response = await fetch(
        `${API_BASE_URL}/api/auth/send-verification`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      console.log(
        'Owner verification API response:',
        result
      );

      if (!response.ok) {
        throw new Error(
          result?.message ||
            'Failed to send verification'
        );
      }

      setLinkSent(true);

      if (result?.data?.verificationLink) {
        window.location.href =
          result.data.verificationLink;

        return;
      }

      alert(
        result?.message ||
          'Verification sent successfully'
      );
    } catch (error: any) {
      console.error(
        'Send verification error:',
        error
      );

      alert(
        error?.message ||
          'Failed to send verification'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangeContact = (): void => {
    localStorage.removeItem(storageKey);

    setContact('');

    setLinkSent(false);

    if (isOwner) {
      navigate('/vehicle/add');
    } else {
      navigate('/auth?role=reporter');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.target.value;

    if (isOwner) {
      setContact(
        formatFrenchInternational(value)
      );
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
          {t('verify.verifyAccount')}
        </h1>

        <div className="w-11" />
      </header>

      <main className="flex flex-1 flex-col px-6 pb-8">
        <div className="flex flex-1 flex-col rounded-t-[34px] border border-[#B8C9D6] bg-[#EEF4F8] px-6 pt-8 pb-8 shadow">
          <div className="mx-auto flex w-full max-w-[420px] flex-col">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-[#D9E5F1] bg-white shadow">
                <ShieldCheck
                  size={36}
                  className="text-[#2F93F6]"
                />
              </div>

              <h2 className="text-[26px] font-black">
                {t('verify.secureVerification')}
              </h2>

              <p className="mt-3 text-[14px] text-[#6F8194]">
                {!linkSent
                  ? isOwner
                    ? t('verify.ownerDescription')
                    : t(
                        'verify.reporterDescription'
                      )
                  : isOwner
                  ? t('verify.ownerVerified')
                  : t(
                      'verify.reporterVerified'
                    )}
              </p>
            </div>

            {!linkSent ? (
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase text-[#6F8194]">
                  {isOwner
                    ? t('auth.phoneNumber')
                    : t(
                        'auth.emailAddress'
                      )}
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA8BC]">
                    {isOwner ? (
                      <Phone size={18} />
                    ) : (
                      <Mail size={18} />
                    )}
                  </span>

                  <input
                    type={
                      isOwner
                        ? 'tel'
                        : 'email'
                    }
                    value={contact}
                    onChange={
                      handleInputChange
                    }
                    placeholder={
                      isOwner
                        ? '+33 6 12 34 56 78'
                        : 'name@example.com'
                    }
                    autoComplete="off"
                    className="h-[58px] w-full rounded-[18px] border border-[#D9E5F1] bg-white pl-12 pr-4 text-[15px] outline-none"
                  />
                </div>

                <p className="mt-3 text-[13px] text-[#6F8194]">
                  {isOwner
                    ? t(
                        'verify.ownerSecureText'
                      )
                    : t(
                        'verify.reporterSecureText'
                      )}
                </p>

                <button
                  onClick={handleSendLink}
                  disabled={
                    !contact.trim() ||
                    loading
                  }
                  className="mt-6 h-[58px] w-full rounded-full bg-[#2F93F6] font-black text-white disabled:opacity-50"
                >
                  {loading
                    ? t('auth.sending')
                    : isOwner
                    ? t(
                        'auth.sendVerification'
                      )
                    : t(
                        'verify.sendLoginLink'
                      )}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-[11px] font-black uppercase text-[#7A8B9D]">
                  {isOwner
                    ? t(
                        'verify.verificationFor'
                      )
                    : t(
                        'verify.linkSentTo'
                      )}
                </p>

                <p className="mt-2 break-all text-[17px] font-black">
                  {contact}
                </p>

                <div className="mt-4">
                  <p className="text-[14px] font-semibold text-[#2F93F6]">
                    {t('verify.nextStep')}
                  </p>

                  <p className="text-[14px] text-[#6F8194]">
                    {isOwner
                      ? t(
                          'verify.ownerNextStep'
                        )
                      : t(
                          'verify.reporterNextStep'
                        )}
                  </p>
                </div>

                <button
                  onClick={
                    handleChangeContact
                  }
                  className="mt-6 text-sm font-bold text-[#2F93F6]"
                >
                  {isOwner
                    ? t(
                        'verify.changePhone'
                      )
                    : t(
                        'verify.changeEmail'
                      )}
                </button>
              </div>
            )}

            <div className="mt-auto pt-6 text-center">
              <p className="text-[11px] uppercase text-[#8EA1B3]">
                {t(
                  'verify.protectedAccess'
                )}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Verify;