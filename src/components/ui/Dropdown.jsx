import React, { useState, useRef } from 'react';
/* Dropdown Component */
export function Dropdown({ isOpen, onClose, children, className = '', buttonRef }) {
  const dropdownRef = useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      // Only close if the click is outside both the dropdown and the toggle button
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        (!buttonRef?.current || !buttonRef.current.contains(event.target))
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen) return null;

  return (
    <div ref={dropdownRef} className={className}>
      {children}
    </div>
  );
}