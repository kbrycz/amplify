import React from 'react';

export function Label({ className = '', children, ...props }) {
  return (
    <label
      className={`mb-2 block text-sm font-medium text-gray-900 dark:text-white ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}