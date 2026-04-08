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
      className="flex min-w-0 flex-1 items-center justify-center"
    >
      {({ isActive }) => (
        <div
          className={`
            flex min-w-[58px] flex-col items-center justify-center gap-[3px]
            rounded-[18px] px-2 py-2
            transition-all duration-200

            ${
              isActive
                ? 'bg-[#2F93F6] text-white shadow-[0_6px_16px_rgba(47,147,246,0.28)]'
                : 'text-[#7A8FA6]'
            }
          `}
        >
          <Icon active={isActive} />

          <span
            className={`text-[9px] font-semibold leading-none tracking-[0.02em] sm:text-[10px] ${
              isActive ? 'text-white' : 'text-[#7A8FA6]'
            }`}
          >
            {label}
          </span>
        </div>
      )}
    </NavLink>
  );
};

export default NavItem;