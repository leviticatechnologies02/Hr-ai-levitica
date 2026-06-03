import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from "../../shared/utils/auth";
import {
  HiOutlineHome,
  HiOutlineBuildingOffice2,
  HiOutlineUsers,
  HiOutlineShieldCheck,
  HiOutlineCog6Tooth,
  HiOutlineLockClosed,
  HiOutlineArrowRightOnRectangle,
  HiOutlineUser
} from 'react-icons/hi2';
import DashboardLayoutBase from "../../shared/components/DashboardLayoutBase";

const SuperAdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: HiOutlineHome,
      link: '/super-admin'
    },
    {
      title: 'Tenant Management',
      icon: HiOutlineBuildingOffice2,
      link: '/super-admin/tenants'
    },
    {
      title: 'User Management',
      icon: HiOutlineUsers,
      link: '/super-admin/users'
    },
    {
      title: 'Roles & Permissions',
      icon: HiOutlineShieldCheck,
      link: '/super-admin/roles'
    },
    {
      title: 'Company Settings',
      icon: HiOutlineCog6Tooth,
      link: '/super-admin/settings'
    },
    {
      title: 'Authentication',
      icon: HiOutlineLockClosed,
      link: '/super-admin/authentication'
    }
  ];

  // Convert menuItems to structure required by DashboardLayoutBase
  const sidebarItems = menuItems.map(item => ({
    type: 'link',
    to: item.link,
    label: item.title,
    icon: item.icon
  }));

  const userEmail = localStorage.getItem('userEmail') || 'Super Admin';

  const topbarLeftContent = (
    <div className="hidden md:block leading-tight">
      <h1 className="text-sm font-semibold text-slate-800">Super Admin Portal</h1>
      <span className="text-xs text-slate-500 font-medium block mt-0.5">
        Manage system-wide recruitment access
      </span>
    </div>
  );

  const topbarRightContent = (
    <div className="flex items-center gap-3.5">
      <div className="hidden md:flex items-center gap-1.5 text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/50">
        <HiOutlineUser className="w-3.5 h-3.5 text-slate-500" />
        <span
          className="text-xs font-medium truncate max-w-[200px]"
          title={userEmail}
        >
          {userEmail}
        </span>
      </div>
      <button
        type="button"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-lg shadow-sm transition-all duration-150"
        onClick={handleLogout}
      >
        <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
        Logout
      </button>
    </div>
  );

  return (
    <DashboardLayoutBase
      sidebarItems={sidebarItems}
      companyLogo="/assets/images/leviticalogo.png"
      logoLink="/super-admin"
      topbarLeftContent={topbarLeftContent}
      topbarRightContent={topbarRightContent}
    >
      {children}
    </DashboardLayoutBase>
  );
};

export default SuperAdminLayout;
