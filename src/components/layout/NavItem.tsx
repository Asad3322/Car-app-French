import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavItemProps {
  to: string;
  icon: React.ComponentType<{ active?: boolean; isPrimary?: boolean }>;
  label?: string;
  isPrimary?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  to,
  icon: Icon,
  label,
  isPrimary = false,
}) => {
  return (
    <NavLink
      to={to}
      className={`flex flex-col items-center justify-center ${
        isPrimary ? 'relative min-w-[72px]' : 'min-w-[58px]'
      }`}
    >
      {({ isActive }) => (
        <>
          <motion.div
            initial={false}
            animate={{
              y: 0,
              scale: isActive ? 1.05 : 1,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="flex items-center justify-center relative h-[44px] w-[58px] transition-all duration-200"
          >
            <div className="relative z-10 flex items-center justify-center">
              <Icon active={isActive} isPrimary={isPrimary} />
            </div>
          </motion.div>

          {label && (
            <span
              className={`mt-1 text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#1A516E] font-bold' : 'text-[#94A3B8]'
              }`}
            >
              {label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};

export default NavItem;