// AlertsDropdown.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { Dropdown } from './ui/Dropdown';
import { get, post } from '../lib/api';

function AlertsDropdown() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationButtonRef = useRef(null);

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
        
        // Ensure we only store serializable data
        const serializedAlerts = data.map(alert => ({
          id: alert.id,
          title: alert.title,
          message: alert.message,
          time: alert.time,
          read: alert.read,
          color: alert.color
        }));
        
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

  const markAllAsRead = async () => {
    try {
      await post('/alerts/mark-all-read', {});
      
      // Update local state
      const updatedAlerts = alerts.map(alert => ({
        ...alert,
        read: true
      }));
      
      setAlerts(updatedAlerts);
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking alerts as read:', err);
    }
  };

  const handleAlertClick = (alert) => {
    console.log('Alert clicked:', alert);
    setIsOpen(false);
  };

  const toggleOpen = () => {
    setIsOpen(prev => !prev);
  };

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
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-800">
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
            alerts.map((alert) => (
              <button
                key={alert.id}
                onClick={() => handleAlertClick(alert)}
                className="flex items-start gap-4 w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className={`rounded-full p-2 ${alert.color || 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50'}`}>
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
                    {alert.time || 'Just now'}
                  </p>
                </div>
              </button>
            ))
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