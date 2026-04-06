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
    <div className="min-h-screen w-full bg-[#C9D6E2]">
      <div className="flex min-h-screen w-full items-center justify-center sm:p-6">
        <main
          className="
            relative flex h-[100dvh] w-full flex-col overflow-hidden
            bg-[#D6E2EC]
            sm:h-[844px] sm:max-w-[390px]
            sm:rounded-[44px]
            sm:border sm:border-[#B8C9D6]
            sm:shadow-[0_24px_70px_rgba(73,101,130,0.18)]
          "
        >
          {/* Soft light background layers */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(90,157,255,0.10),_transparent_36%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(90,157,255,0.05),_transparent_42%)]" />

          {/* Content */}
          <div className="scrollbar-hide relative z-10 flex-1 overflow-y-auto pb-32">
            <Outlet />
          </div>

          {/* Floating Nav */}
          <div className="absolute bottom-4 left-1/2 z-50 w-[94%] -translate-x-1/2">
            <nav
              className="
                flex items-center justify-between
                rounded-[34px]
                border border-[#C5D3DE]
                bg-[#DCE7F0]/95
                px-2 py-3
                backdrop-blur-2xl
                shadow-[0_12px_30px_rgba(70,106,140,0.14)]
              "
            >
              <NavItem to="/app/home" icon={HomeNavIcon} label="Home" />
              <NavItem to="/app/vehicles" icon={VehiclesNavIcon} label="Vehicles" />
              <NavItem to="/app/history" icon={ReportNavIcon} label="Reports" />
              <NavItem
                to="/app/leaderboard"
                icon={LeaderboardNavIcon}
                label="Leaderboard"
              />
              <NavItem to="/app/profile" icon={ProfileNavIcon} label="Profile" />
            </nav>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;