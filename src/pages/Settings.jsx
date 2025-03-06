import React, { useState } from 'react';
import NotificationsSettings from '../components/settings/NotificationsSettings';
import AppearanceSettings from '../components/settings/AppearanceSettings';
import PrivacySettings from '../components/settings/PrivacySettings';

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState({
    notifications: { error: '', success: '' },
    appearance: { error: '', success: '' },
    privacy: { error: '', success: '' }
  });

  const handleSaveNotifications = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessages(prev => ({
      ...prev,
      notifications: { error: '', success: '' }
    }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessages(prev => ({
        ...prev,
        notifications: { 
          error: '', 
          success: 'Notification preferences have been updated successfully!' 
        }
      }));
      
      setTimeout(() => {
        setMessages(prev => ({
          ...prev,
          notifications: { error: '', success: '' }
        }));
      }, 5000);
    } catch (err) {
      setMessages(prev => ({
        ...prev,
        notifications: { 
          error: 'Failed to update notification preferences',
          success: '' 
        }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <NotificationsSettings 
        isLoading={isLoading}
        messages={messages.notifications}
        onSaveNotifications={handleSaveNotifications}
      />
      <AppearanceSettings />
      <PrivacySettings />
      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}