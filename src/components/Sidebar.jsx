import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import { Home, BarChart3, Users, Settings, ChevronDown, X } from 'lucide-react';

const navItems = [
  { 
    icon: <Home className="w-5 h-5" />,
    name: 'Dashboard',
    path: '/app'
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
    icon: <BarChart3 className="w-5 h-5" />,
    name: 'Analytics',
    path: '/app/analytics'
  }
];

function Sidebar() {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, openSubmenu, toggleSubmenu, toggleMobileSidebar } = useSidebar();

  const isOpen = isExpanded || isMobileOpen || isHovered;

  return (
    <aside
      className={`fixed lg:sticky top-0 flex flex-col px-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-[60] border-r border-gray-200 
        ${isOpen ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "lg:translate-x-0 -translate-x-full"}
        lg:translate-x-0 lg:relative lg:block`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        <div className={`py-8 flex items-center ${!isOpen ? "lg:justify-center" : "justify-between"}`}>
          <a href="/" className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {isOpen ? 'Amplify' : 'A'}
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

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.name)}
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

        <div className="mt-auto">
          <div className="sticky bottom-0 pb-8">
            <Link
              to="/settings"
              className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <Settings className="w-5 h-5" />
              {isOpen && <span className="ml-3">Settings</span>}
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar