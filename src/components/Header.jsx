import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Bell, Play } from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';
import UserDropdown from './UserDropdown';
import AlertsDropdown from './AlertsDropdown';
import { VideoModal } from './ui/VideoModal';

function Header() {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage for saved theme; fallback to system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggle = () => {
    if (window.innerWidth >= 991) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  return (
    <>
      <header className="flex w-full bg-white border-gray-200 z-50 dark:border-gray-800 dark:bg-gray-900 border-b">
        <div className="flex items-center justify-between w-full px-4 py-4">
          <div>
            <button
              className="flex items-center justify-center w-10 h-10 text-gray-500 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800"
              onClick={handleToggle}
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileOpen}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <path
                  d="M4 6H20M4 12H20M4 18H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Responsive View Demo button */}
            <button
              onClick={openVideoModal}
              className={`flex items-center justify-center ${
                isMobile 
                  ? 'w-10 h-10 rounded-lg text-blue-600 border border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/20' 
                  : 'gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/20'
              } transition-colors`}
              aria-label="View Demo"
            >
              <Play className="w-4 h-4" />
              {!isMobile && <span>View Demo</span>}
            </button>
            
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Alerts Dropdown now handles read/unread functionality */}
            <AlertsDropdown />

            <UserDropdown />
          </div>
        </div>
      </header>
      
      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={closeVideoModal} 
        title="Demo of Shout Video"
      />
    </>
  );
}

export default Header;