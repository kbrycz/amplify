import React from 'react';
import { useSidebar } from '../context/SidebarContext';

function Backdrop() {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      onClick={toggleMobileSidebar}
    />
  );
}

export default Backdrop;