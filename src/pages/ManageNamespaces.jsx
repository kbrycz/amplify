import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { get, del } from '../lib/api';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import ManageNamespaceHeader from '../components/manageNamespaces/ManageNamespaceHeader';
import NamespaceList from '../components/manageNamespaces/NamespaceList';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function ManageNamespaces() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [namespaces, setNamespaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchNamespaces();
  }, []);

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchNamespaces = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Fetch namespaces where the user is a member
      const data = await get(`/namespaces/account/${user.uid}`);
      setNamespaces(data || []);
    } catch (err) {
      console.error('Error fetching namespaces:', err);
      setError(err.message || 'Failed to fetch namespaces');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (namespaceId) => {
    try {
      // Find the namespace to get its name for the notification
      const namespace = namespaces.find(n => n.id === namespaceId);
      const namespaceName = namespace?.name || 'Namespace';
      
      // Use the del method for deletion
      await del(`/namespaces/${namespaceId}`);
      
      // Update the UI by removing the deleted namespace
      setNamespaces((prev) => prev.filter((n) => n.id !== namespaceId));
      
      // Show success notification
      setNotification({ 
        type: 'success', 
        message: `"${namespaceName}" has been deleted successfully` 
      });
    } catch (err) {
      console.error('Error deleting namespace:', err);
      setNotification({ 
        type: 'error', 
        message: `Failed to delete namespace: ${err.message || 'Unknown error'}` 
      });
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <div className="p-6">
      {/* Notification Banner */}
      {notification.message && (
        <div className={`mb-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
            : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <XCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
          <button 
            onClick={() => setNotification({ type: '', message: '' })}
            className="ml-auto rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Dismiss"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      <ManageNamespaceHeader
        onNewNamespace={() => navigate('/app/namespaces/create')}
        hasNamespaces={!isLoading && namespaces.length > 0}
        isEditMode={isEditMode}
        onToggleEditMode={toggleEditMode}
      />

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <LoadingSpinner message="Loading namespaces..." />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/50">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchNamespaces}
                  className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <NamespaceList
            namespaces={namespaces}
            onDelete={handleDelete}
            onNamespaceClick={(id) => navigate(`/app/namespaces/edit/${id}`)}
            onNewNamespace={() => navigate('/app/namespaces/create')}
            isEditMode={isEditMode}
          />
        </div>
      )}

      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
} 