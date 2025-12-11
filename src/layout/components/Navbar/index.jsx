import React from "react";
import { Menu, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function Navbar({ setMobileMenuOpen }) {
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-[#3e3e42] dark:bg-[#252526] shadow-sm">
      {/* Left section: sidebar toggle + search */}
      <div className="flex items-center gap-4">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden h-9 w-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2d2e] transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5 text-gray-500 dark:text-[#cccccc]" />
        </button>

        {/* Search input */}
        {/* <div className={`relative ${searchOpen ? "w-64" : "w-9 lg:w-64"} transition-all duration-200`}>
          {searchOpen || (typeof window !== "undefined" && window.innerWidth >= 1024) ? (
            <form className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-[#858585]" />
              <input
                type="text"
                placeholder="Search ..."
                className="h-9 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-[#3e3e42] dark:bg-[#1e1e1e] dark:text-[#cccccc] dark:focus:border-orange-500 transition-colors"
              />
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2d2e] transition-colors"
              aria-label="Open search"
            >
              <Search className="h-5 w-5 text-gray-500 dark:text-[#cccccc]" />
            </button>
          )}
        </div> */}
      </div>

      {/* Right section: theme toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2d2e] transition-colors relative overflow-hidden"
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {/* Sun Icon */}
          <Sun
            className={`h-5 w-5 text-amber-500 absolute transition-all duration-300 
            ${theme === "light" ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}
          />
          {/* Moon Icon */}
          <Moon
            className={`h-5 w-5 text-blue-500 absolute transition-all duration-300 
            ${theme === "dark" ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          />
        </button>
      </div>
    </header>
  );
}
