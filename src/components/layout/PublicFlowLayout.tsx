import { Outlet, useLocation } from 'react-router-dom';

const PublicFlowLayout = () => {
  const location = useLocation();
  const isOnboarding = location.pathname === '/';

  if (isOnboarding) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-[#0b1227] flex items-center justify-center">
      <main className="w-full max-w-[420px] min-h-screen sm:min-h-[844px] bg-charcoal rounded-[32px] shadow-xl overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicFlowLayout;