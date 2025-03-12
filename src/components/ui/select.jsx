import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const SelectContext = React.createContext(null);

export function Select({ children, value, onValueChange, id }) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const ref = useRef(null);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  const handleSelect = (value) => {
    setSelectedValue(value);
    onValueChange?.(value);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ open, setOpen, selectedValue, handleSelect, id }}>
      <div className="relative" ref={ref}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className = '' }) {
  const { open, setOpen, id } = React.useContext(SelectContext);

  return (
    <button
      type="button"
      id={id}
      onClick={() => setOpen(!open)}
      className={`flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 ${className}`}
      aria-haspopup="listbox"
      aria-expanded={open}
    >
      {children}
      <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
  );
}

export function SelectValue({ placeholder }) {
  const { selectedValue } = React.useContext(SelectContext);
  
  return (
    <span className={selectedValue ? '' : 'text-gray-400 dark:text-gray-500'}>
      {selectedValue || placeholder}
    </span>
  );
}

export function SelectContent({ children }) {
  const { open } = React.useContext(SelectContext);
  
  if (!open) return null;
  
  return (
    <div className="absolute z-[999] w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto dark:bg-gray-800 dark:border-gray-700">
      <ul className="py-1" role="listbox">
        {children}
      </ul>
    </div>
  );
}

export function SelectItem({ children, value }) {
  const { selectedValue, handleSelect } = React.useContext(SelectContext);
  const isSelected = selectedValue === value;
  
  return (
    <li
      role="option"
      aria-selected={isSelected}
      onClick={() => handleSelect(value)}
      className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
        isSelected ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' : 'text-gray-900 dark:text-gray-100'
      }`}
    >
      {children}
    </li>
  );
}