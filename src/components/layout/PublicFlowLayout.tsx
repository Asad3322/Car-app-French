import { Outlet, useLocation } from 'react-router-dom';

const PublicFlowLayout = () => {
  const location = useLocation();
  const isOnboarding = location.pathname === '/';

  if (isOnboarding) {
    return <Outlet />;
  }

  return (
    // ✅ OUTER = DARK
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#020B16] px-0 sm:p-6">
      
      {/* ✅ INNER = LIGHT */}
      <main
        className="
          relative flex min-h-[100dvh] w-full flex-col overflow-hidden
          bg-[#EEF3F8]
          sm:min-h-[844px] sm:max-w-[390px]
          sm:rounded-[44px]
          sm:border sm:border-[#D9E5F1]
          sm:shadow-[0_25px_70px_rgba(0,0,0,0.55)]
        "
      >
        {/* light glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(91,163,240,0.18),_transparent_35%)]" />

        <div className="relative z-10 flex-1 overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PublicFlowLayout;