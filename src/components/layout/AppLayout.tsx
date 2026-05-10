import React from 'react';
import { Outlet } from 'react-router-dom';
import NavItem from './NavItem';
import en from '../../i18n/en';
import fr from '../../i18n/fr';
import {
  HomeNavIcon,
  VehiclesNavIcon,
  ReportNavIcon,
  LeaderboardNavIcon,
  ProfileNavIcon,
} from '../Icons';

const translations = {
  en,
  fr,
};

const AppLayout: React.FC = () => {
  const savedLanguage = localStorage.getItem('language');

  const language: keyof typeof translations =
    savedLanguage === 'en' || savedLanguage === 'fr' ? savedLanguage : 'fr';

  
  const navLabels =
    language === 'fr'
      ? {
          home: 'Accueil',
          vehicles: 'Véhicules',
          reports: 'Rapports',
          leaderboard: 'Classement',
          profile: 'Profil',
        }
      : {
          home: 'Home',
          vehicles: 'Vehicles',
          reports: 'Reports',
          leaderboard: 'Leaderboard',
          profile: 'Profile',
        };

  return (
    <div className="min-h-[100svh] w-full overflow-x-hidden bg-[#D6E2EC]">
      <div className="flex min-h-[100svh] w-full justify-center sm:min-h-screen sm:items-center sm:p-6">
        <main
          className="
            relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden
            bg-[#D6E2EC]
            sm:h-[844px] sm:min-h-0 sm:max-w-[390px]
            sm:rounded-[44px]
            sm:border sm:border-[#B8C9D6]
            sm:shadow-[0_24px_70px_rgba(73,101,130,0.18)]
          "
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(90,157,255,0.10),_transparent_36%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(90,157,255,0.05),_transparent_42%)]" />

          <div
            className="scrollbar-hide relative z-10 flex-1 overflow-y-auto"
            style={{
              paddingBottom: 'calc(110px + env(safe-area-inset-bottom, 0px))',
            }}
          >
            <Outlet />
          </div>
        </main>
      </div>

      <div
        className="pointer-events-none fixed inset-x-0 z-[999] flex justify-center px-4 sm:px-0"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)',
        }}
      >
        <nav
          className="
            pointer-events-auto
            flex w-full max-w-[360px] items-center justify-between
            rounded-[32px]
            border border-[#C5D3DE]
            bg-[#DCE7F0]/96
            px-2 py-[9px]
            backdrop-blur-2xl
            shadow-[0_12px_30px_rgba(70,106,140,0.14)]
          "
        >
          <NavItem to="/app/home" icon={HomeNavIcon} label={navLabels.home} />
          <NavItem
            to="/app/vehicles"
            icon={VehiclesNavIcon}
            label={navLabels.vehicles}
          />
          <NavItem
            to="/app/history"
            icon={ReportNavIcon}
            label={navLabels.reports}
          />
          <NavItem
            to="/app/leaderboard"
            icon={LeaderboardNavIcon}
            label={navLabels.leaderboard}
          />
          <NavItem
            to="/app/profile"
            icon={ProfileNavIcon}
            label={navLabels.profile}
          />
        </nav>
      </div>
    </div>
  );
};

export default AppLayout;