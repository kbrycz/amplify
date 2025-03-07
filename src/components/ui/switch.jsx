import React from "react";

export function Switch({ checked = true, onCheckedChange, disabled, className, ...props }) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <div 
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full 
        transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-indigo-500 focus-visible:ring-offset-2 
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        ${checked ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}
        ${className || ''}
      `}
      role="switch"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      }}
      {...props}
    >
      <span 
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg 
          ring-0 transition duration-200 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0.5'}
        `}
      />
    </div>
  );
} 