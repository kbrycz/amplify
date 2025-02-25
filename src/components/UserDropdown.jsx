import React, { useState, useRef } from 'react';
import { ChevronDown, Settings, LogOut, User, HelpCircle } from 'lucide-react';
import { Dropdown } from './ui/Dropdown';
import { DropdownItem } from './ui/DropdownItem';
/* UserDropdown Component */
export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className={`flex items-center gap-2 p-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 ${isOpen ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
      >
        <span className="overflow-hidden rounded-full h-8 w-8 bg-gray-200 dark:bg-gray-700">
          <img
            width={32}
            height={32}
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&q=80&fit=crop"
            alt="User"
            className="object-cover w-full h-full"
          />
        </span>
        <span className="hidden md:block font-medium">Musharof</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        buttonRef={buttonRef}
        className="absolute right-0 mt-2 w-[260px] rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="px-2 py-2 border-b border-gray-200 dark:border-gray-800">
          <p className="font-medium text-gray-900 dark:text-white">Musharof Chowdhury</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">randomuser@pimjo.com</p>
        </div>

        <div className="py-2">
          <DropdownItem
            tag="a"
            href="/profile"
            className="flex items-center gap-2 w-full px-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            onItemClick={closeDropdown}
          >
            <User className="w-4 h-4" />
            <span>Edit profile</span>
          </DropdownItem>

          <DropdownItem
            tag="a"
            href="/settings"
            className="flex items-center gap-2 w-full px-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            onItemClick={closeDropdown}
          >
            <Settings className="w-4 h-4" />
            <span>Account settings</span>
          </DropdownItem>

          <DropdownItem
            tag="a"
            href="/support"
            className="flex items-center gap-2 w-full px-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            onItemClick={closeDropdown}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Support</span>
          </DropdownItem>
        </div>

        <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
          <DropdownItem
            tag="a"
            href="/signout"
            className="flex items-center gap-2 w-full px-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            onItemClick={closeDropdown}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </DropdownItem>
        </div>
      </Dropdown>
    </div>
  );
}