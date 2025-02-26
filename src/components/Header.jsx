import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSidebar } from '../context/SidebarContext';
import { Moon, Sun, Bell, Search, X, MessageSquare, Users, Star, Gift, AlertCircle, CheckCircle } from 'lucide-react';
import UserDropdown from './UserDropdown';
import { Dropdown } from './ui/Dropdown';

const notifications = [
  {
    id: 1,
    type: 'response',
    title: 'New Response',
    message: 'Sarah Johnson submitted a new video response',
    time: '2 minutes ago',
    icon: MessageSquare,
    color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50'
  },
  {
    id: 2,
    type: 'milestone',
    title: 'Milestone Reached',
    message: 'Your campaign reached 1,000 responses!',
    time: '1 hour ago',
    icon: Star,
    color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50'
  },
  {
    id: 3,
    type: 'invite',
    title: 'Team Invitation',
    message: 'John invited you to collaborate on "Summer Campaign"',
    time: '2 hours ago',
    icon: Users,
    color: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50'
  },
  {
    id: 4,
    type: 'feature',
    title: 'New Feature',
    message: 'Try our new AI-powered video editing tools',
    time: '1 day ago',
    icon: Gift,
    color: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50'
  }
];

function Header() {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // If no saved preference, check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const inputRef = useRef(null);
  const notificationButtonRef = useRef(null);

  useEffect(() => {
    // Apply theme on mount and when it changes
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

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
  };

  const handleNotificationClick = (notification) => {
    console.log('Clicked notification:', notification);
    setIsNotificationsOpen(false);
  };

  const markAllAsRead = (e) => {
    e.stopPropagation();
    setUnreadCount(0);
    setIsNotificationsOpen(false);
  };

  return (
    <header className="flex w-full bg-white border-gray-200 z-40 dark:border-gray-800 dark:bg-gray-900 border-b">
      <div className="flex items-center justify-between w-full px-4 py-4">
        <div>
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
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="relative">
            <button
              ref={notificationButtonRef}
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 dark:bg-blue-600"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 dark:bg-blue-700 items-center justify-center">
                    <span className="text-[10px] font-medium text-white">{unreadCount}</span>
                  </span>
                </span>
              )}
            </button>

            <Dropdown
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
              buttonRef={notificationButtonRef}
              className="absolute right-0 mt-2 w-[380px] rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {notifications.length > 0 ? (
                  notifications.map((notification) => {
                    const Icon = notification.icon;
                    return (
                      <button
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className="flex items-start gap-4 w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className={`rounded-full p-2 ${notification.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                            {notification.time}
                          </p>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      All caught up!
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      No new notifications to show.
                    </p>
                  </div>
                )}
              </div>
            </Dropdown>
          </div>
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}

export default Header