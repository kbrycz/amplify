import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { Home, BarChart3, Users, ChevronDown, X, Wand2, Settings, HelpCircle, FileText, Building } from 'lucide-react';
import NamespaceSelector from '../namespace/NamespaceSelector';

// Hook to detect dark mode
function useDarkMode() {
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });

  React.useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

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
    icon: <FileText className="w-5 h-5" />,
    name: 'Templates',
    subItems: [
      { name: 'Create Template', path: '/app/templates/new', primary: true },
      { name: 'Manage Templates', path: '/app/templates' }
    ]
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    name: 'Analytics',
    path: '/app/analytics'
  }
];

const mobileNavItems = [
  { 
    icon: <Settings className="w-5 h-5" />,
    name: 'Settings',
    path: '/app/settings'
  },
  {
    icon: <HelpCircle className="w-5 h-5" />,
    name: 'Support',
    path: '/app/support'
  }
];

function Sidebar() {
  const isDark = useDarkMode();
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
      <div className="flex flex-col h-full">
        <div className={`py-8 flex items-center justify-center relative`}>
          <a href="/" className={`${isOpen ? 'w-full' : ''}`}>
            <img 
              src={`/images/${isDark ? 'logo-white.png' : 'logo-color.png'}`}
              alt="Shout"
              className={`${isOpen ? 'h-12' : 'h-8'} w-auto transition-all duration-300 mx-auto`}
            />
          </a>
          {isMobileOpen && (
            <button
              onClick={toggleMobileSidebar} 
              className="absolute right-0 p-2 text-gray-500 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2 relative z-[70]">
            {navItems.map((item) => (
              <li key={item.name} className="relative">
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
            {/* Mobile-only navigation items */}
            <li className="lg:hidden mt-4">
              {mobileNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={handleItemClick}
                  className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  {item.icon}
                  {isOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              ))}
              
              {/* Add NamespaceSelector to mobile navigation */}
              {isOpen && <NamespaceSelector />}
            </li>
          </ul>
        </nav>

        <div className="mt-auto pb-4 hidden lg:flex lg:flex-col">
          <Link
            to="/app/settings"
            onClick={handleItemClick}
            className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="ml-3">Settings</span>}
          </Link>
          <Link
            to="/app/support"
            onClick={handleItemClick}
            className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <HelpCircle className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="ml-3">Support</span>}
          </Link>
          
          {/* Namespace Selector for desktop */}
          {isOpen && <NamespaceSelector />}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;