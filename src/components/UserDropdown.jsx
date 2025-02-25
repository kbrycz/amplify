import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, Settings, LogOut, User, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { Dropdown } from './ui/Dropdown';
import { DropdownItem } from './ui/DropdownItem';
/* UserDropdown Component */
export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  // Get user's display name or email
  const displayName = user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email?.split('@')[0] || 'User';
  const firstName = displayName.split(' ')[0];

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => setIsOpen(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
      closeDropdown();
    }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className={`flex items-center gap-2 p-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 ${isOpen ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
      >
        <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <span className="hidden md:block font-medium">{firstName}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        buttonRef={buttonRef}
        className="absolute right-0 mt-2 w-[260px] rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="px-2 py-2 border-b border-gray-200 dark:border-gray-800">
          <p className="font-medium text-gray-900 dark:text-white">{displayName}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>

        <div className="py-2">
          <DropdownItem
            tag={Link}
            to="/app/account"
            className="flex items-center gap-2 w-full px-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            onItemClick={closeDropdown}
          >
            <User className="w-4 h-4" />
            <span>Edit account</span>
          </DropdownItem>

          <DropdownItem
            tag={Link}
            to="/app/support"
            className="flex items-center gap-2 w-full px-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            onItemClick={closeDropdown}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Support</span>
          </DropdownItem>
        </div>

        <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
          <DropdownItem
            tag="button"
            disabled={isLoading}
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoading ? 'Signing out...' : 'Sign out'}</span>
          </DropdownItem>
        </div>
      </Dropdown>
    </div>
  );
}