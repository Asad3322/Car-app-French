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

const getIconClass = (active: boolean, onDark: boolean) => {
  if (active) {
    return onDark ? 'text-[#62D8FF]' : 'text-[#0F5D7A]';
  }

  return onDark ? 'text-white/40' : 'text-[#94A3B8]';
};

export const MapNavIcon = ({
  active = false,
  onDark = false,
}: NavIconProps) => (
  <IoCompass
    size={22}
    className={`transition-colors duration-300 ${getIconClass(active, onDark)}`}
  />
);

export const HomeNavIcon = ({
  active = false,
  onDark = false,
}: NavIconProps) => (
  <IoHome
    size={22}
    className={`transition-colors duration-300 ${getIconClass(active, onDark)}`}
  />
);

export const VehiclesNavIcon = ({
  active = false,
  onDark = false,
}: NavIconProps) => (
  <IoCar
    size={24}
    className={`transition-colors duration-300 ${getIconClass(active, onDark)}`}
  />
);

export const ReportNavIcon = ({
  active = false,
  onDark = false,
}: NavIconProps) => (
  <IoShieldCheckmark
    size={22}
    className={`transition-colors duration-300 ${getIconClass(active, onDark)}`}
  />
);

export const LeaderboardNavIcon = ({
  active = false,
  onDark = false,
}: NavIconProps) => (
  <IoTrophy
    size={22}
    className={`transition-colors duration-300 ${getIconClass(active, onDark)}`}
  />
);

export const ProfileNavIcon = ({
  active = false,
  onDark = false,
}: NavIconProps) => (
  <IoIdCard
    size={22}
    className={`transition-colors duration-300 ${getIconClass(active, onDark)}`}
  />
);

// Backward compatibility
export const IncidentsNavIcon = ReportNavIcon;
export const ReportsTabNavIcon = LeaderboardNavIcon;