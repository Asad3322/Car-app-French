import React from 'react';
import { Outlet } from 'react-router-dom';
import NavItem from './NavItem';
import {
  HomeNavIcon,
  VehiclesNavIcon,
  ReportNavIcon,
  LeaderboardNavIcon,
  ProfileNavIcon,
} from '../Icons';

const AppLayout: React.FC = () => {
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
        <div className="scrollbar-hide flex-1 overflow-y-auto pb-32">
          <Outlet />
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-4 left-1/2 z-50 w-[94%] -translate-x-1/2">
          <nav
            className="
              flex items-end justify-between
              rounded-[40px]
              bg-white/95 px-2 py-4 backdrop-blur-md
              shadow-[0_-4px_20px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.12)]
              border-t border-white/80
            "
          >
            <NavItem to="/app/home" icon={HomeNavIcon} label="Home" />

            <NavItem
              to="/app/vehicles"
              icon={VehiclesNavIcon}
              label="Vehicles"
            />

            {/* ✅ FIXED: No extra wrapper, no -top-6 */}
            <NavItem
              to="/app/incidents"
              icon={ReportNavIcon}
              label="Reports"
              isPrimary
            />

            <NavItem
              to="/app/leaderboard"
              icon={LeaderboardNavIcon}
              label="Leaderboard"
            />

            <NavItem
              to="/app/profile"
              icon={ProfileNavIcon}
              label="Profile"
            />
          </nav>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;