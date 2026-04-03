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
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-charcoal sm:p-6">
      <main
        className="
          relative flex h-[100dvh] w-full flex-col overflow-hidden
          bg-charcoal
          sm:h-[844px] sm:max-w-[390px]
          sm:rounded-[44px]
          sm:border sm:border-white/10
          sm:shadow-[0_20px_60px_rgba(0,0,0,0.5)]
        "
      >
        {/* 🔥 PREMIUM GLOW BACKGROUND */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(98,216,255,0.12),_transparent_35%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(98,216,255,0.08),_transparent_40%)]" />

        {/* Content */}
        <div className="scrollbar-hide relative z-10 flex-1 overflow-y-auto pb-32">
          <Outlet />
        </div>

        {/* 🔥 PREMIUM FLOATING NAV */}
        <div className="absolute bottom-4 left-1/2 z-50 w-[94%] -translate-x-1/2">
          <nav
            className="
              flex items-center justify-between
              rounded-[34px]
              border border-white/10
              bg-white/5 backdrop-blur-2xl
              px-2 py-3
              shadow-[0_10px_40px_rgba(0,0,0,0.6)]
            "
          >
            <NavItem
              to="/app/home"
              icon={HomeNavIcon}
              label="Home"
            />

            <NavItem
              to="/app/vehicles"
              icon={VehiclesNavIcon}
              label="Vehicles"
            />

            <NavItem
              to="/app/history"
              icon={ReportNavIcon}
              label="Reports"
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