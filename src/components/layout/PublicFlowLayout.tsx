import { Outlet, useLocation } from 'react-router-dom';

const PublicFlowLayout = () => {
  const location = useLocation();
  const isOnboarding = location.pathname === '/';

  if (isOnboarding) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-charcoal px-0 sm:p-6">
      <main
        className="
          relative flex min-h-[100dvh] w-full flex-col overflow-hidden
          bg-charcoal
          sm:min-h-[844px] sm:max-w-[390px]
          sm:rounded-[44px]
          sm:border sm:border-white/10
          sm:shadow-[0_20px_60px_rgba(0,0,0,0.5)]
        "
      >
        {/* premium cyan glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(98,216,255,0.12),_transparent_35%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(98,216,255,0.08),_transparent_40%)]" />

        <div className="relative z-10 flex-1 overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PublicFlowLayout;