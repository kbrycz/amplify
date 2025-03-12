import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Server, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useServerStatus } from '../../context/ServerStatusContext';

export default function ServerDownBanner({ isVisible, onClose }) {
  // Get the server status context safely
  const serverStatus = useServerStatus();
  const refreshServerStatus = serverStatus?.refreshServerStatus;
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle animation states when visibility changes
  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      // Small delay to ensure the DOM has updated before starting animation
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      // Wait for exit animation to complete before removing from DOM
      const timer = setTimeout(() => setIsShowing(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Debug log to help troubleshoot visibility issues
  useEffect(() => {
    console.log('ServerDownBanner visibility:', { isVisible, isShowing, isAnimating });
  }, [isVisible, isShowing, isAnimating]);

  const handleRefresh = async (e) => {
    // Prevent event propagation
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Refresh button clicked');
    setIsRefreshing(true);
    
    try {
      if (refreshServerStatus) {
        await refreshServerStatus();
      } else {
        // Fallback if context is not available
        window.location.reload();
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // If not showing at all, return null
  if (!isShowing) return null;

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ease-in-out bg-gradient-to-r from-red-600 via-red-500 to-red-600 shadow-lg border-b border-red-700 ${
        isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="w-full relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white"></div>
          <div className="absolute right-0 bottom-0 h-24 w-24 rounded-full bg-white"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between flex-wrap relative">
            <div className="w-0 flex-1 flex items-center">
              <div className="flex-shrink-0 mr-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center animate-ping opacity-30 pointer-events-none">
                    <WifiOff className="h-5 w-5 text-white" />
                  </div>
                  <div className="relative bg-red-800 bg-opacity-50 p-2 rounded-full">
                    <Server className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="ml-1 font-medium text-white">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-300" />
                  <span className="md:inline text-sm sm:text-base">
                    <strong className="md:hidden font-bold">Server issue!</strong>
                    <strong className="hidden md:inline font-bold">We're experiencing server issues.</strong> 
                    <span className="opacity-90"> Our team is working to resolve this as quickly as possible.</span>
                  </span>
                </div>
                <div className="mt-1 text-xs text-red-100 hidden sm:block opacity-80">
                  Please try again later or click refresh to check if service has been restored.
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0 sm:ml-3 flex items-center z-10">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="mr-3 flex items-center px-4 py-1.5 border border-transparent rounded-full shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-600 focus:ring-white transition-all disabled:opacity-50 transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <RefreshCw className={`h-4 w-4 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Checking...' : 'Refresh'}
              </button>
              
              {onClose && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                  }}
                  className="flex p-1.5 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white transition-colors transform hover:scale-105 active:scale-95 cursor-pointer"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Animated pulse effect */}
        <div className="absolute right-0 top-0 h-full w-full overflow-hidden pointer-events-none">
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-32 bg-gradient-to-r from-transparent to-white opacity-10 blur-md animate-pulse"></div>
          <div className="absolute -left-4 top-1/3 transform -translate-y-1/2 w-8 h-32 bg-gradient-to-r from-white to-transparent opacity-10 blur-md animate-pulse delay-700"></div>
        </div>
      </div>
    </div>
  );
} 