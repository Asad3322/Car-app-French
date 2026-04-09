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
  return active ? 'text-white' : 'text-[#7A8FA6]';
};

const baseIconClass =
  'transition-all duration-200 leading-none shrink-0 align-middle';

export const MapNavIcon = ({ active = false }: NavIconProps) => (
  <IoCompass
    size={18}
    className={`${baseIconClass} ${getIconClass(active)}`}
  />
);

export const HomeNavIcon = ({ active = false }: NavIconProps) => (
  <IoHome
    size={18}
    className={`${baseIconClass} ${getIconClass(active)}`}
  />
);

export const VehiclesNavIcon = ({ active = false }: NavIconProps) => (
  <IoCar
    size={18}
    className={`${baseIconClass} ${getIconClass(active)}`}
  />
);

export const ReportNavIcon = ({ active = false }: NavIconProps) => (
  <IoShieldCheckmark
    size={18}
    className={`${baseIconClass} ${getIconClass(active)}`}
  />
);

export const LeaderboardNavIcon = ({ active = false }: NavIconProps) => (
  <IoTrophy
    size={18}
    className={`${baseIconClass} ${getIconClass(active)}`}
  />
);

export const ProfileNavIcon = ({ active = false }: NavIconProps) => (
  <IoIdCard
    size={18}
    className={`${baseIconClass} ${getIconClass(active)}`}
  />
);

// Backward compatibility
export const IncidentsNavIcon = ReportNavIcon;
export const ReportsTabNavIcon = LeaderboardNavIcon;