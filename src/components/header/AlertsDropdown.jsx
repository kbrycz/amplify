// AlertsDropdown.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle, ChevronDown } from 'lucide-react';
import { Dropdown } from '../ui/Dropdown';
import { get } from '../../lib/api';
import { SERVER_URL, auth } from '../../lib/firebase';

/**
 * Helper: Convert Firestore-like timestamp objects to a JS Date.
 * Supports either { _seconds, _nanoseconds } or { seconds, nanoseconds }.
 */
function parseFirestoreTimestamp(ts) {
  if (!ts) return null;
  if (typeof ts.toDate === 'function') {
    return ts.toDate();
  }
  const seconds = ts._seconds ?? ts.seconds;
  const nanos = ts._nanoseconds ?? ts.nanoseconds ?? 0;
  if (typeof seconds === 'number' && typeof nanos === 'number') {
    return new Date(seconds * 1000 + nanos / 1000000);
  }
  const d = new Date(ts);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Helper: Format a Date into a "time ago" string.
 */
function timeAgo(date) {
  if (!date) return 'Unknown';
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return 'Just now';

  const intervals = [
    { label: 'year', secs: 31536000 },
    { label: 'month', secs: 2592000 },
    { label: 'week', secs: 604800 },
    { label: 'day', secs: 86400 },
    { label: 'hour', secs: 3600 },
    { label: 'minute', secs: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.secs);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
}

function AlertsDropdown() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationButtonRef = useRef(null);
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        setLoading(true);
        const data = await get('/alerts');
        
        if (!data) {
          // No alerts yet - this is normal
          setAlerts([]);
          setUnreadCount(0);
          return;
        }
        
        // Ensure we only store serializable data and format timestamps
        const serializedAlerts = data.map(alert => {
          // Parse the timestamp to a Date object
          const createdAtDate = parseFirestoreTimestamp(alert.createdAt);
          
          return {
            id: alert.id,
            title: alert.alertType || 'Notification',
            message: alert.message,
            time: timeAgo(createdAtDate),
            read: alert.read,
            color: getAlertColor(alert.alertType),
            createdAt: createdAtDate, // Store the actual date for sorting if needed
            extraData: alert.extraData
          };
        });
        
        // Sort alerts by date (newest first)
        serializedAlerts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        
        setAlerts(serializedAlerts);
        const unread = serializedAlerts.filter(alert => !alert.read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error('Error fetching alerts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAlerts();
  }, []);

  // Helper function to determine alert color based on type
  function getAlertColor(alertType) {
    switch (alertType) {
      case 'enhancement_success':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50';
      case 'enhancement_failed':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50';
      case 'campaign_created':
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50';
      default:
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50';
    }
  }

  // Reset showAllAlerts when dropdown is closed
  useEffect(() => {
    if (!isOpen) {
      setShowAllAlerts(false);
    }
  }, [isOpen]);

  // Mark all alerts as read when dropdown is opened
  useEffect(() => {
    if (isOpen && unreadCount > 0 && !isMarkingRead) {
      markAllAsRead();
    }
  }, [isOpen, unreadCount]);

  const markAllAsRead = async () => {
    if (isMarkingRead || unreadCount === 0) return;
    
    setIsMarkingRead(true);
    try {
      // Get the authentication token
      const idToken = await auth.currentUser.getIdToken();
      
      // Make the direct fetch call with PATCH method instead of POST
      const response = await fetch(`${SERVER_URL}/alerts/mark-read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      
      if (!response.ok) {
        throw new Error(`Failed to mark alerts as read: ${response.status}`);
      }
      
      // Update local state
      const updatedAlerts = alerts.map(alert => ({
        ...alert,
        read: true
      }));
      
      setAlerts(updatedAlerts);
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking alerts as read:', err);
    } finally {
      setIsMarkingRead(false);
    }
  };

  const handleAlertClick = (alert) => {
    console.log('Alert clicked:', alert);
    setIsOpen(false);
  };

  const toggleOpen = () => {
    setIsOpen(prev => !prev);
  };

  const toggleShowAllAlerts = () => {
    setShowAllAlerts(prev => !prev);
  };

  // Determine which alerts to display
  const displayedAlerts = showAllAlerts ? alerts : alerts.slice(0, 5);
  const hasMoreAlerts = alerts.length > 5;

  return (
    <div className="relative">
      <button
        ref={notificationButtonRef}
        onClick={toggleOpen}
        className="relative p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 dark:bg-blue-600"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 dark:bg-blue-700 items-center justify-center">
              <span className="text-[10px] font-medium text-white">{unreadCount}</span>
            </span>
          </span>
        )}
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        buttonRef={notificationButtonRef}
        className="fixed sm:absolute right-4 sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-[380px] rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-800 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                <Bell className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
                Loading notifications
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Please wait while we fetch your notifications...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                <Bell className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="mt-6 text-sm font-medium text-gray-900 dark:text-white">
                Unable to load notifications
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-[240px] mx-auto">
                We're having trouble loading your notifications. Please try again later.
              </p>
            </div>
          ) : alerts.length > 0 ? (
            <>
              {displayedAlerts.map((alert) => (
                <button
                  key={alert.id}
                  onClick={() => handleAlertClick(alert)}
                  className="flex items-start gap-4 w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className={`rounded-full p-2 ${alert.color}`}>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {alert.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {alert.message}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                      {alert.time}
                    </p>
                  </div>
                </button>
              ))}
              
              {hasMoreAlerts && (
                <button
                  onClick={toggleShowAllAlerts}
                  className="flex items-center justify-center w-full p-3 text-sm font-medium text-blue-600 hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {showAllAlerts ? (
                    <>
                      Show less
                      <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" />
                    </>
                  ) : (
                    <>
                      View {alerts.length - 5} more
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                <CheckCircle className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="mt-6 text-sm font-medium text-gray-900 dark:text-white">
                All caught up!
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-[240px] mx-auto">
                No new notifications to show.
              </p>
            </div>
          )}
        </div>
      </Dropdown>
    </div>
  );
}

export default AlertsDropdown;