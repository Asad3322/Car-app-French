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
    <div className="min-h-screen w-full overflow-x-hidden bg-[#C9D6E2]">
      <div className="flex min-h-screen w-full items-center justify-center sm:p-6">
        <main
          className="
            relative flex h-[100svh] min-h-[100svh] w-full flex-col overflow-hidden
            bg-[#D6E2EC]
            sm:h-[844px] sm:min-h-0 sm:max-w-[390px]
            sm:rounded-[44px]
            sm:border sm:border-[#B8C9D6]
            sm:shadow-[0_24px_70px_rgba(73,101,130,0.18)]
          "
        >
          {/* Soft light background layers */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(90,157,255,0.10),_transparent_36%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(90,157,255,0.05),_transparent_42%)]" />

          {/* Content */}
          <div
            className="scrollbar-hide relative z-10 flex-1 overflow-y-auto"
            style={{
              paddingBottom: 'calc(92px + env(safe-area-inset-bottom, 0px))',
            }}
          >
            <Outlet />
          </div>

          {/* Floating Nav */}
          <div
            className="absolute left-1/2 z-50 w-[92%] max-w-[360px] -translate-x-1/2"
            style={{
              bottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
            }}
          >
            <nav
              className="
                flex items-center justify-between
                rounded-[30px]
                border border-[#C5D3DE]
                bg-[#DCE7F0]/96
                px-2 py-2
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