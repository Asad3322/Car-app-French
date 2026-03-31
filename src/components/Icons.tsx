import {
  IoHome,
  IoCarSport,
  IoShieldCheckmark,
  IoIdCard,
  IoTrophy
} from 'react-icons/io5';

type NavIconProps = {
  active?: boolean;
  isPrimary?: boolean;
};

// Senior UI: Premium 3D-effect styling for SVGs 
// This avoids large binary assets and ensures perfect transparency on all devices.
const getIconStyle = (active: boolean) => ({
  filter: active
    ? 'drop-shadow(0 2px 3px rgba(26,81,110,0.4))'
    : 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
});

export const HomeNavIcon = ({ active = false }: NavIconProps) => (
  <div className={`relative ${active ? 'scale-110' : 'scale-100 opacity-70'}`}>
    <IoHome
      size={26}
      style={getIconStyle(active)}
      className={active ? 'text-[#1A516E]' : 'text-[#94A3B8]'}
    />
  </div>
);

export const VehiclesNavIcon = ({ active = false }: NavIconProps) => (
  <div className={`relative ${active ? 'scale-110' : 'scale-100 opacity-70'}`}>
    <IoCarSport
      size={28}
      style={getIconStyle(active)}
      className={active ? 'text-[#1A516E]' : 'text-[#94A3B8]'}
    />
  </div>
);

export const LeaderboardNavIcon = ({ active = false }: NavIconProps) => (
  <div className={`relative ${active ? 'scale-110' : 'scale-100 opacity-70'}`}>
    <IoTrophy
      size={26}
      style={getIconStyle(active)}
      className={active ? 'text-[#1A516E]' : 'text-[#94A3B8]'}
    />
  </div>
);

export const ProfileNavIcon = ({ active = false }: NavIconProps) => (
  <div className={`relative ${active ? 'scale-110' : 'scale-100 opacity-70'}`}>
    <IoIdCard
      size={24}
      style={getIconStyle(active)}
      className={active ? 'text-[#1A516E]' : 'text-[#94A3B8]'}
    />
  </div>
);

export const ReportNavIcon = ({ active = false }: NavIconProps) => (
  <div className={`relative ${active ? 'scale-110' : 'scale-100 opacity-70'}`}>
    <IoShieldCheckmark
      size={26}
      style={getIconStyle(active)}
      className={active ? 'text-[#1A516E]' : 'text-[#94A3B8]'}
    />
  </div>
);