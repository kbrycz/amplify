import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { get } from '../lib/api';
import { useToast } from '../components/ui/toast-notification';

const ServerStatusContext = createContext();

export function useServerStatus() {
  return useContext(ServerStatusContext);
}

export function ServerStatusProvider({ children }) {
  const [isServerDown, setIsServerDown] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(null);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  
  // Refs to track check status and prevent multiple simultaneous checks
  const isCheckingRef = useRef(false);
  const checkTimeoutRef = useRef(null);
  const eventListenerAddedRef = useRef(false);
  
  // Get toast safely - it might be undefined if ToastProvider is not available
  const toastContext = useToast();

  // Function to check server status
  const checkServerStatus = useCallback(async (showToastOnRecover = false) => {
    // Prevent multiple simultaneous checks
    if (isCheckingRef.current) {
      console.log('Health check already in progress, skipping');
      return;
    }
    
    try {
      isCheckingRef.current = true;
      console.log('Performing health check...');
      
      // Try to make a simple request to the server
      await get('/health');
      
      // If successful, server is up
      const wasDown = isServerDown;
      
      if (wasDown && showToastOnRecover && toastContext?.toast) {
        // Show a success toast when server recovers
        toastContext.toast({
          title: "Connection Restored",
          description: "The server is now available. Your experience should be back to normal.",
          variant: "success",
          duration: 5000,
        });
      }
      
      setIsServerDown(false);
      setConsecutiveFailures(0);
      return true;
    } catch (error) {
      // If request fails, server is down - set immediately
      console.error('Server health check failed:', error);
      
      // Set server as down immediately on any failure
      setIsServerDown(true);
      
      // Reset the dismissed state when server goes down
      setBannerDismissed(false);
      
      // Still track consecutive failures for analytics
      setConsecutiveFailures(prev => prev + 1);
      
      return false;
    } finally {
      setLastCheckTime(new Date());
      isCheckingRef.current = false;
    }
  }, [isServerDown, toastContext]);

  // Schedule the next health check based on server status
  const scheduleNextCheck = useCallback(() => {
    // Clear any existing timeout
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }
    
    // If server is down, check more frequently (every 60 seconds)
    // If server is up, check less frequently (every 5 minutes)
    const checkInterval = isServerDown ? 60000 : 300000;
    
    console.log(`Scheduling next health check in ${checkInterval/1000} seconds`);
    
    checkTimeoutRef.current = setTimeout(() => {
      checkServerStatus(true);
      // Schedule the next check after this one completes
      scheduleNextCheck();
    }, checkInterval);
  }, [isServerDown, checkServerStatus]);

  // Listen for server issue events from the API
  useEffect(() => {
    // Only add the event listener once
    if (!eventListenerAddedRef.current) {
      const handleServerIssueDetected = () => {
        console.log('Server issue event detected');
        
        // Only trigger a health check if we haven't checked recently (within 10 seconds)
        const now = new Date();
        const timeSinceLastCheck = lastCheckTime ? now - lastCheckTime : Infinity;
        
        if (timeSinceLastCheck > 10000) {
          console.log('Triggering health check due to server issue event');
          checkServerStatus();
        } else {
          console.log('Recent health check already performed, setting server as down');
          setIsServerDown(true);
          setBannerDismissed(false);
        }
      };
      
      window.addEventListener('server-issue-detected', handleServerIssueDetected);
      eventListenerAddedRef.current = true;
      
      return () => {
        window.removeEventListener('server-issue-detected', handleServerIssueDetected);
        eventListenerAddedRef.current = false;
      };
    }
  }, [checkServerStatus, lastCheckTime]);

  // Initial health check and schedule recurring checks
  useEffect(() => {
    // Initial check when component mounts
    console.log('Performing initial health check');
    checkServerStatus();
    
    // Schedule recurring checks
    scheduleNextCheck();
    
    // Clean up on unmount
    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, [checkServerStatus, scheduleNextCheck]);

  // Function to dismiss the banner
  const dismissBanner = () => {
    setBannerDismissed(true);
  };

  // Function to manually trigger a server status check
  const refreshServerStatus = async () => {
    console.log('Manual health check requested');
    const result = await checkServerStatus(true);
    
    // After a manual check, reschedule the next automatic check
    scheduleNextCheck();
    
    return result;
  };

  // Debug log to help troubleshoot visibility issues (only log when state changes)
  useEffect(() => {
    console.log('ServerStatusContext state:', { isServerDown, bannerDismissed });
  }, [isServerDown, bannerDismissed]);

  const value = {
    isServerDown,
    bannerDismissed,
    dismissBanner,
    checkServerStatus,
    refreshServerStatus,
    lastCheckTime
  };

  return (
    <ServerStatusContext.Provider value={value}>
      {children}
    </ServerStatusContext.Provider>
  );
} 