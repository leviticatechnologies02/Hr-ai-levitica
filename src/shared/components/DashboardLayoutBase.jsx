import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import {
  HiXMark,
  HiBars3,
  HiChevronRight,
} from "react-icons/hi2";

const DashboardLayoutBase = ({
  sidebarItems = [],
  companyLogo = "",
  logoLink = "/dashboard",
  topbarLeftContent = null,
  topbarRightContent = null,
  activeTab = null,
  onTabChange = null,
  children,
}) => {
  const location = useLocation();

  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] =
    useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const [openDropdowns, setOpenDropdowns] = useState({});

  // =========================
  // ACTIVE ROUTE
  // =========================

  const isRouteActive = (item) => {
    if (activeTab !== null && onTabChange !== null) {
      return activeTab === item.tabKey;
    }

    if (!item.to) return false;

    if (item.isParent) {
      return location.pathname.startsWith(item.to);
    }

    return location.pathname === item.to;
  };

  // =========================
  // DROPDOWN ACTIVE
  // =========================

  const isDropdownActive = (dropdownItem) => {
    if (!dropdownItem.items) return false;

    return dropdownItem.items.some((child) =>
      isRouteActive(child)
    );
  };

  // =========================
  // TOGGLE DROPDOWN
  // =========================

  const toggleDropdown = (label) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // =========================
  // AUTO OPEN ACTIVE DROPDOWN
  // =========================

  useEffect(() => {
    const initialOpenStates = {};

    sidebarItems.forEach((item) => {
      if (
        item.type === "dropdown" &&
        isDropdownActive(item)
      ) {
        initialOpenStates[item.label] = true;
      }
    });

    setOpenDropdowns(initialOpenStates);
  }, [location.pathname, sidebarItems]);

  // =========================
  // CLOSE MOBILE SIDEBAR
  // =========================

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      {/* ========================= */}
      {/* MOBILE OVERLAY */}
      {/* ========================= */}

      <div
        onClick={closeMobileSidebar}
        className={`
          fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300 lg:hidden

          ${
            mobileSidebarOpen
              ? "visible opacity-100"
              : "invisible opacity-0"
          }
        `}
      />

      {/* ========================= */}
      {/* SIDEBAR */}
      {/* ========================= */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col
          overflow-hidden
          border-r border-slate-800
          bg-slate-950
          shadow-2xl
          transition-all duration-300 ease-in-out

          ${
            mobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }

          ${
            desktopSidebarCollapsed
              ? "lg:w-20"
              : "lg:w-72"
          }

          w-72
        `}
      >
        {/* ========================= */}
        {/* SIDEBAR HEADER */}
        {/* ========================= */}

        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
          <Link
            to={logoLink}
            className="flex items-center gap-3 overflow-hidden no-underline"
          >
            {companyLogo ? (
              <img
                src={companyLogo}
                alt="Company Logo"
                className={`
                  object-contain transition-all duration-300

                  ${
                    desktopSidebarCollapsed
                      ? "h-9 w-9"
                      : "h-10 w-auto max-w-[170px]"
                  }
                `}
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-600 text-lg font-bold text-white shadow-lg">
                HR
              </div>
            )}

            {!desktopSidebarCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-bold tracking-wide text-white">
                  Recruiter Panel
                </span>

                <span className="truncate text-xs text-slate-400">
                  HR Management System
                </span>
              </div>
            )}
          </Link>

          {/* MOBILE CLOSE */}

          <button
            type="button"
            onClick={closeMobileSidebar}
            className="rounded-xl p-2 text-slate-400 transition-all duration-200 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </div>

        {/* ========================= */}
        {/* SIDEBAR NAVIGATION */}
        {/* ========================= */}

        <nav className="flex-1 overflow-y-auto scrollbar-hide px-3 py-4">
          <div className="space-y-1">
            {sidebarItems.map((item, index) => {
              // =========================
              // TITLE
              // =========================

              if (item.type === "title") {
                return !desktopSidebarCollapsed ? (
                  <div
                    key={`title-${index}`}
                    className="px-3 pt-6 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500"
                  >
                    {item.label}
                  </div>
                ) : (
                  <div
                    key={`divider-${index}`}
                    className="my-5 h-px bg-slate-800"
                  />
                );
              }

              const IconComponent = item.icon;

              // =========================
              // DROPDOWN
              // =========================

              if (item.type === "dropdown") {
                const isOpen =
                  openDropdowns[item.label];

                const isChildActive =
                  isDropdownActive(item);

                return (
                  <div
                    key={`dropdown-${index}`}
                    className="space-y-1"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        toggleDropdown(item.label)
                      }
                      className={`
                        group flex w-full items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200

                        ${
                          isChildActive
                            ? "bg-slate-800 text-white shadow-lg"
                            : "text-slate-400 hover:bg-slate-900 hover:text-white"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {IconComponent && (
                          <IconComponent
                            className={`
                              h-5 w-5 flex-shrink-0 transition-all duration-200

                              ${
                                isChildActive
                                  ? "text-primary-400"
                                  : "text-slate-500 group-hover:text-white"
                              }
                            `}
                          />
                        )}

                        {!desktopSidebarCollapsed && (
                          <span className="truncate">
                            {item.label}
                          </span>
                        )}
                      </div>

                      {!desktopSidebarCollapsed && (
                        <HiChevronRight
                          className={`
                            h-4 w-4 flex-shrink-0 transition-all duration-300

                            ${
                              isOpen
                                ? "rotate-90"
                                : ""
                            }
                          `}
                        />
                      )}
                    </button>

                    {/* ========================= */}
                    {/* SUB MENU */}
                    {/* ========================= */}

                    {!desktopSidebarCollapsed &&
                      isOpen &&
                      item.items && (
                        <div className="ml-6 mt-2 border-l border-slate-800 pl-4">
                          <div className="space-y-1">
                            {item.items.map(
                              (
                                subItem,
                                subIndex
                              ) => {
                                const isActive =
                                  isRouteActive(
                                    subItem
                                  );

                                const SubIconComponent =
                                  subItem.icon;

                                const linkProps =
                                  onTabChange
                                    ? {
                                        to: "#",

                                        onClick:
                                          (
                                            e
                                          ) => {
                                            e.preventDefault();

                                            onTabChange(
                                              subItem.tabKey
                                            );

                                            closeMobileSidebar();
                                          },
                                      }
                                    : {
                                        to: subItem.to,
                                      };

                                return (
                                  <NavLink
                                    key={`sub-${subIndex}`}
                                    {...linkProps}
                                    onClick={() =>
                                      closeMobileSidebar()
                                    }
                                    className={`
                                      group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 no-underline

                                      ${
                                        isActive
                                          ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                                          : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                      }
                                    `}
                                  >
                                    {SubIconComponent && (
                                      <SubIconComponent
                                        className={`
                                          h-4 w-4 flex-shrink-0

                                          ${
                                            isActive
                                              ? "text-white"
                                              : "text-slate-500 group-hover:text-white"
                                          }
                                        `}
                                      />
                                    )}

                                    <span className="truncate">
                                      {
                                        subItem.label
                                      }
                                    </span>
                                  </NavLink>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                );
              }

              // =========================
              // NORMAL LINK
              // =========================

              const isActive =
                isRouteActive(item);

              const linkProps =
                onTabChange && item.tabKey
                  ? {
                      to: "#",

                      onClick: (e) => {
                        e.preventDefault();

                        onTabChange(item.tabKey);

                        closeMobileSidebar();
                      },
                    }
                  : {
                      to: item.to,
                    };

              return (
                <NavLink
                  key={`link-${index}`}
                  {...linkProps}
                  onClick={() =>
                    closeMobileSidebar()
                  }
                  className={`
                    group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200 no-underline

                    ${
                      isActive
                        ? "bg-primary-600 text-white shadow-xl shadow-primary-600/20"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }
                  `}
                >
                  {IconComponent && (
                    <IconComponent
                      className={`
                        h-5 w-5 flex-shrink-0 transition-all duration-200

                        ${
                          isActive
                            ? "text-white"
                            : "text-slate-500 group-hover:text-white"
                        }
                      `}
                    />
                  )}

                  {!desktopSidebarCollapsed && (
                    <span className="truncate">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* ========================= */}
      {/* CONTENT AREA */}
      {/* ========================= */}

      <div
        className={`
          flex min-h-screen flex-1 flex-col transition-all duration-300 ease-in-out

          ${
            desktopSidebarCollapsed
              ? "lg:pl-20"
              : "lg:pl-72"
          }
        `}
      >
        {/* ========================= */}
        {/* TOPBAR */}
        {/* ========================= */}

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {/* DESKTOP TOGGLE */}

            <button
              type="button"
              onClick={() =>
                setDesktopSidebarCollapsed(
                  !desktopSidebarCollapsed
                )
              }
              className="hidden rounded-xl p-2 text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 lg:flex"
            >
              <HiBars3
                className={`
                  h-5 w-5 transition-transform duration-300

                  ${
                    desktopSidebarCollapsed
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {/* MOBILE TOGGLE */}

            <button
              type="button"
              onClick={() =>
                setMobileSidebarOpen(true)
              }
              className="rounded-xl p-2 text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            >
              <HiBars3 className="h-5 w-5" />
            </button>

            {/* LEFT */}

            <div>{topbarLeftContent}</div>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-4">
            {topbarRightContent}
          </div>
        </header>

        {/* ========================= */}
        {/* MAIN CONTENT */}
        {/* ========================= */}

        <main className="flex-1 overflow-y-auto bg-slate-100 p-3 scrollbar-hide">
          {children}
        </main>

        {/* ========================= */}
        {/* FOOTER */}
        {/* ========================= */}

        <footer className="flex h-14 items-center justify-between border-t border-slate-200 bg-white px-6 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Dashboard.
            All Rights Reserved.
          </div>

          <div className="flex items-center gap-1">
            <span>Made by</span>

            <a
              href="https://leviticatechnologies.com/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-primary-600 no-underline transition-all duration-200 hover:text-primary-700"
            >
              Levitica Technologies
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayoutBase;