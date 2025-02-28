import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import { Home, BarChart3, Users, ChevronDown, X, Wand2, Settings, HelpCircle, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { 
    icon: <Home className="w-5 h-5" />,
    name: 'Home',
    path: '/app/'
  },
  { 
    icon: <Users className="w-5 h-5" />, 
    name: 'Campaigns',
    subItems: [
      { name: 'New Campaign', path: '/app/campaigns/new', primary: true },
      { name: 'Manage Campaigns', path: '/app/campaigns' }
    ]
  },
  {
    icon: <Wand2 className="w-5 h-5" />,
    name: 'Video Enhancer',
    path: '/app/video-enhancer'
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    name: 'Analytics',
    path: '/app/analytics',
  }
];

function Sidebar() {
  const { user } = useAuth();
  const { 
    isExpanded, 
    isMobileOpen, 
    isHovered, 
    setIsHovered, 
    openSubmenu, 
    toggleSubmenu, 
    toggleMobileSidebar,
    closeMobileSidebar 
  } = useSidebar();

  const isOpen = isExpanded || isMobileOpen || isHovered;

  const handleItemClick = () => {
    if (isMobileOpen) {
      closeMobileSidebar();
    }
  };

  return (
    <aside
      className={`fixed lg:sticky top-0 flex flex-col px-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-[60] border-r border-gray-200 
        ${isOpen ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "lg:translate-x-0 -translate-x-full"}
        lg:translate-x-0 lg:relative lg:block`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full relative">
        <div className={`py-8 flex items-center ${!isOpen ? "lg:justify-center" : "justify-between"} relative`}>
          <a href="/" className={`text-2xl font-bold tracking-tight ${isOpen ? 'w-full' : ''}`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 dark:from-blue-500 dark:via-blue-400 dark:to-blue-600">
              {isOpen ? 'Shout' : 'S'}
            </span>
          </a>
          {isMobileOpen && (
            <button
              onClick={toggleMobileSidebar}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto pb-32">
          <ul className="space-y-2 relative z-[70]">
            {navItems.map((item) => (
              <li key={item.name}>
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => {
                      toggleSubmenu(item.name);
                    }}
                    className="flex items-center w-full p-3 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    {item.icon}
                    {isOpen && (
                      <>
                        <span className="ml-3 flex-1 text-left">{item.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${openSubmenu === item.name ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </button>
                  {isOpen && openSubmenu === item.name && (
                    <ul className="mt-2 space-y-1 pl-11">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            onClick={handleItemClick}
                            to={subItem.path}
                            className="block py-2 px-3 text-sm text-gray-600 rounded-lg hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-800"
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  onClick={handleItemClick}
                  className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  {item.icon}
                  {isOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Credits Display */}
        <div className="px-3 py-2 mt-4">
          <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 dark:bg-indigo-900/20">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
              <CreditCard className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            </div>
            {isOpen && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-indigo-700 dark:text-indigo-400">
                  {user?.credits || 0} {user?.credits === 1 ? 'credit' : 'credits'} remaining
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 p-3 space-y-1">
          <Link
            to="/app/support"
            onClick={handleItemClick}
            className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            {isOpen && <span className="ml-3">Support</span>}
          </Link>
          <Link
            to="/app/settings"
            onClick={handleItemClick}
            className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
            {isOpen && <span className="ml-3">Settings</span>}
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;