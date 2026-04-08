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

const getIconClass = (active: boolean) => {
  if (active) {
    return 'text-white';
  }

  return 'text-[#7A8FA6]';
};

export const MapNavIcon = ({ active = false }: NavIconProps) => (
  <IoCompass
    className={`text-[17px] transition-all duration-200 ${
      getIconClass(active)
    } ${active ? 'scale-100' : 'scale-100'}`}
  />
);

export const HomeNavIcon = ({ active = false }: NavIconProps) => (
  <IoHome
    className={`text-[17px] transition-all duration-200 ${
      getIconClass(active)
    } ${active ? 'scale-100' : 'scale-100'}`}
  />
);

export const VehiclesNavIcon = ({ active = false }: NavIconProps) => (
  <IoCar
    className={`text-[17px] transition-all duration-200 ${
      getIconClass(active)
    } ${active ? 'scale-100' : 'scale-100'}`}
  />
);

export const ReportNavIcon = ({ active = false }: NavIconProps) => (
  <IoShieldCheckmark
    className={`text-[17px] transition-all duration-200 ${
      getIconClass(active)
    } ${active ? 'scale-100' : 'scale-100'}`}
  />
);

export const LeaderboardNavIcon = ({ active = false }: NavIconProps) => (
  <IoTrophy
    className={`text-[17px] transition-all duration-200 ${
      getIconClass(active)
    } ${active ? 'scale-100' : 'scale-100'}`}
  />
);

export const ProfileNavIcon = ({ active = false }: NavIconProps) => (
  <IoIdCard
    className={`text-[17px] transition-all duration-200 ${
      getIconClass(active)
    } ${active ? 'scale-100' : 'scale-100'}`}
  />
);

// Backward compatibility
export const IncidentsNavIcon = ReportNavIcon;
export const ReportsTabNavIcon = LeaderboardNavIcon;