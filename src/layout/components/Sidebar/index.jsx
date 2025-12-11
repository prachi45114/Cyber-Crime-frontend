import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ICON, menuItems } from "./data/SidebarData"; // Import your menu data and icons
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen, sidebarCollapsed, setSidebarCollapsed }) {
  const { pathname } = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (id) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isActive = (path) => pathname === path || pathname.startsWith(path);

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 bg-white shadow-md dark:bg-[#252526] transition-all duration-300 ease-in-out ${sidebarCollapsed ? "w-16" : "w-64"} lg:relative`}>
      {/* Sidebar Header */}
        <div className="flex h-16 justify-between items-center p-4 border-b border-gray-200 dark:border-[#3e3e42]">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center">{ICON.C3IHUB}</div>
                {!sidebarCollapsed && (
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-[#cccccc] text-lg tracking-tight">CDR Investigator</span>
                    </div>
                )}
            </div>
            <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-gray-500 dark:text-[#cccccc] hover:text-gray-700 dark:hover:text-white"
            >
            {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </button>
            <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-gray-500 dark:text-[#cccccc] hover:text-gray-700 dark:hover:text-white">
            <ChevronLeft />
            </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-3">
            <ul>
            {menuItems.map((item) => (
                <li key={item.id} className="relative">
                <Link
                    to={item.path}
                    className={`flex items-center p-2 rounded-md text-gray-700 dark:text-[#cccccc] hover:bg-gray-100 dark:hover:bg-[#37373d] ${isActive(item.path) ? "bg-gray-100 dark:bg-[#37373d]" : ""}`}
                >
                    <item.icon className="h-5 w-5 mr-3" />
                    {!sidebarCollapsed && item.label}
                </Link>

                {/* Submenu (only visible when expanded) */}
                {item.subMenus && (
                    <div>
                    <button
                        onClick={() => toggleSubmenu(item.id)}
                        className="flex items-center p-2 text-gray-500 dark:text-[#cccccc] hover:bg-gray-100 dark:hover:bg-[#37373d]"
                    >
                        <ChevronDown className={`h-5 w-5 transition-transform ${expandedMenus[item.id] ? "rotate-180" : ""}`} />
                    </button>

                    {expandedMenus[item.id] && (
                        <ul className="pl-6">
                        {item.subMenus.map((subItem) => (
                            <li key={subItem.id}>
                            <Link
                                to={subItem.path}
                                className={`flex items-center p-2 text-sm text-gray-500 dark:text-[#cccccc] hover:bg-gray-100 dark:hover:bg-[#37373d] ${isActive(subItem.path) ? "bg-gray-100 dark:bg-[#37373d]" : ""}`}
                            >
                                {subItem.label}
                            </Link>
                            </li>
                        ))}
                        </ul>
                    )}
                    </div>
                )}
                </li>
            ))}
            </ul>
        </nav>

        {/* Sidebar Footer (e.g., logout button) */}
        {/* <div className="p-3">
            <button onClick={() => console.log("Logout")} className="w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-[#37373d] p-2 rounded-md">
            Logout
            </button>
        </div> */}
    </aside>
  );
}
