import React from "react";

export function Switch({ id, checked, onCheckedChange, disabled = false }) {
  return (
    <label 
      htmlFor={id} 
      className={`relative inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input 
        type="checkbox" 
        id={id} 
        className="sr-only peer" 
        checked={checked} 
        onChange={(e) => onCheckedChange(e.target.checked)}
        disabled={disabled}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
    </label>
  );
} 