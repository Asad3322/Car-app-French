import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const PlainAppLayout: React.FC = () => {
  const location = useLocation();

  const isDarkScreen =
    location.pathname === '/auth' ||
    location.pathname === '/verify' ||
    location.pathname === '/complete-profile' ||
    location.pathname === '/app/reports' ||
    location.pathname === '/app/report-details' ||
    location.pathname === '/app/vehicles/add' ||
    location.pathname.startsWith('/app/incidents/');

  return (
    <div
      className={`flex min-h-[100dvh] w-full items-center justify-center transition-colors duration-500 ${
        isDarkScreen ? 'bg-charcoal' : 'bg-[#EEF3F8]'
      } sm:p-6`}
    >
      <main
        className={`
          relative flex h-[100dvh] w-full flex-col overflow-hidden transition-colors duration-500
          ${isDarkScreen ? 'bg-charcoal' : 'bg-[#EEF3F8]'}
          sm:h-[844px] sm:max-w-[390px]
          sm:rounded-[44px]
          ${
            isDarkScreen
              ? 'sm:border sm:border-white/10 sm:shadow-[0_20px_60px_rgba(0,0,0,0.28)]'
              : 'sm:shadow-[0_20px_60px_rgba(0,0,0,0.15)] sm:ring-1 sm:ring-black/10'
          }
        `}
      >
        <div className="scrollbar-hide flex-1 overflow-y-auto pb-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PlainAppLayout;