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
            flex min-w-[60px] flex-col items-center justify-center
            rounded-[20px] px-2.5 pt-[8px] pb-[7px]
            transition-all duration-200
            ${
              isActive
                ? 'bg-[#2F93F6] text-white shadow-[0_8px_18px_rgba(47,147,246,0.28)]'
                : 'text-[#7A8FA6]'
            }
          `}
        >
          <div className="flex h-[21px] items-center justify-center">
            <Icon active={isActive} />
          </div>

          <span
            className={`mt-[4px] text-[9px] font-semibold leading-none tracking-[0.02em] sm:text-[10px] ${
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