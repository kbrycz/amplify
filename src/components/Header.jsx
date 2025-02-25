import React, { useState, useRef, useEffect } from 'react';
import { useSidebar } from '../context/SidebarContext';
import { Moon, Sun, Bell, Search, X } from 'lucide-react';
import UserDropdown from './UserDropdown';

function Header() {
  const [isDark, setIsDark] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggle = () => {
    if (window.innerWidth >= 991) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="flex w-full bg-white border-gray-200 z-40 dark:border-gray-800 dark:bg-gray-900 border-b">
      <div className="flex items-center justify-between w-full px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center justify-center w-10 h-10 text-gray-500 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800"
            onClick={handleToggle}
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileOpen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="hidden lg:block flex-1 min-w-[400px]">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <Search className="w-5 h-5" />
              </span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search or type command..."
                className="w-full h-11 pl-12 pr-14 rounded-lg border border-gray-200 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400">
                <span>⌘</span>
                <span>K</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
            <Bell className="w-5 h-5" />
          </button>
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}

export default Header