import React from 'react';
import { NavLink } from 'react-router-dom';

type NavIconProps = {
  active?: boolean;
};

type NavItemProps = {
  to: string;
  icon: React.ComponentType<NavIconProps>;
  label: string;
};

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center text-xs transition-all duration-200 ${
          isActive ? 'text-[#62D8FF]' : 'text-white/50'
        }`
      }
    >
      {({ isActive }) => (
        <div
          className={`
            flex flex-col items-center gap-1
            rounded-xl px-3 py-1.5
            transition-all duration-200
            ${
              isActive
                ? 'bg-white/5 text-[#62D8FF]'
                : 'text-white/50'
            }
          `}
        >
          <Icon active={isActive} />

          <span className="text-[10px] font-medium tracking-wide">
            {label}
          </span>
        </div>
      )}
    </NavLink>
  );
};

export default NavItem;