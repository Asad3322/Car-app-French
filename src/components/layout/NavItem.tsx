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
      className="flex flex-col items-center justify-center text-xs"
    >
      {({ isActive }) => (
        <div
          className={`
            flex flex-col items-center gap-1
            rounded-xl px-3 py-2
            transition-all duration-200

            ${
              isActive
                ? 'bg-[#2F93F6] text-white shadow-[0_6px_16px_rgba(47,147,246,0.35)]'
                : 'text-[#7A8FA6]'
            }
          `}
        >
          <Icon active={isActive} />

          <span
            className={`text-[10px] font-semibold tracking-wide ${
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