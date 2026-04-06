import {
  IoHome,
  IoCar,
  IoShieldCheckmark,
  IoTrophy,
  IoIdCard,
  IoCompass,
} from 'react-icons/io5';

type NavIconProps = {
  active?: boolean;
  isPrimary?: boolean;
  onDark?: boolean;
};

// ✅ FIXED: Active = WHITE (for blue button background)
const getIconClass = (active: boolean) => {
  if (active) {
    return 'text-white'; // 🔥 THIS IS THE FIX
  }

  return 'text-[#7A8FA6]'; // soft gray for inactive
};

export const MapNavIcon = ({ active = false }: NavIconProps) => (
  <IoCompass
    size={20}
    className={`transition-all duration-300 ${
      getIconClass(active)
    } ${active ? 'scale-110' : 'scale-100'}`}
  />
);

export const HomeNavIcon = ({ active = false }: NavIconProps) => (
  <IoHome
    size={20}
    className={`transition-all duration-300 ${
      getIconClass(active)
    } ${active ? 'scale-110' : 'scale-100'}`}
  />
);

export const VehiclesNavIcon = ({ active = false }: NavIconProps) => (
  <IoCar
    size={21}
    className={`transition-all duration-300 ${
      getIconClass(active)
    } ${active ? 'scale-110' : 'scale-100'}`}
  />
);

export const ReportNavIcon = ({ active = false }: NavIconProps) => (
  <IoShieldCheckmark
    size={20}
    className={`transition-all duration-300 ${
      getIconClass(active)
    } ${active ? 'scale-110' : 'scale-100'}`}
  />
);

export const LeaderboardNavIcon = ({ active = false }: NavIconProps) => (
  <IoTrophy
    size={20}
    className={`transition-all duration-300 ${
      getIconClass(active)
    } ${active ? 'scale-110' : 'scale-100'}`}
  />
);

export const ProfileNavIcon = ({ active = false }: NavIconProps) => (
  <IoIdCard
    size={20}
    className={`transition-all duration-300 ${
      getIconClass(active)
    } ${active ? 'scale-110' : 'scale-100'}`}
  />
);

// Backward compatibility
export const IncidentsNavIcon = ReportNavIcon;
export const ReportsTabNavIcon = LeaderboardNavIcon;