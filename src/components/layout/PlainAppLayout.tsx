import React from 'react';
import { Outlet } from 'react-router-dom';

const PlainAppLayout: React.FC = () => {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#EEF3F8] sm:p-6">
      <main
        className="
          relative flex h-[100dvh] w-full flex-col overflow-hidden
          bg-[#EEF3F8]
          sm:h-[844px] sm:max-w-[390px]
          sm:rounded-[44px]
          sm:shadow-[0_20px_60px_rgba(0,0,0,0.15)]
          sm:ring-1 sm:ring-black/10
        "
      >
        {/* Scroll Content */}
        <div className="scrollbar-hide flex-1 overflow-y-auto pb-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PlainAppLayout;
