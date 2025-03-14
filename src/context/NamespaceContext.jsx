import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserNamespaces } from '../lib/api';
import { useAuth } from './AuthContext';

const NamespaceContext = createContext();

// Key for storing the current namespace in localStorage
const CURRENT_NAMESPACE_KEY = 'currentNamespace';

export function NamespaceProvider({ children }) {
  const { user } = useAuth();
  const [currentNamespace, setCurrentNamespace] = useState(() => {
    // Try to get the namespace from localStorage
    const savedNamespace = localStorage.getItem(CURRENT_NAMESPACE_KEY);
    return savedNamespace || 'default';
  });
  const [isNamespaceModalOpen, setIsNamespaceModalOpen] = useState(false);
  const [namespaces, setNamespaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPermission, setUserPermission] = useState(null);

  // Fetch namespaces when user changes
  useEffect(() => {
    if (user) {
      fetchNamespacesFromServer();
    }
  }, [user]);

  // Save current namespace to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(CURRENT_NAMESPACE_KEY, currentNamespace);
    
    // Update userPermission when currentNamespace changes
    if (namespaces.length > 0) {
      const currentNamespaceObj = namespaces.find(ns => ns.name === currentNamespace);
      if (currentNamespaceObj) {
        setUserPermission(currentNamespaceObj.userPermission || null);
      } else {
        setUserPermission(null);
      }
    }
  }, [currentNamespace, namespaces]);

  const fetchNamespacesFromServer = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedNamespaces = await fetchUserNamespaces();
      
      if (fetchedNamespaces && Array.isArray(fetchedNamespaces)) {
        setNamespaces(fetchedNamespaces);
        
        // If current namespace is not in the list, set to default or first available
        if (fetchedNamespaces.length > 0) {
          const namespaceNames = fetchedNamespaces.map(ns => ns.name);
          if (!namespaceNames.includes(currentNamespace)) {
            setCurrentNamespace(namespaceNames[0]);
          }
          
          // Update userPermission for the current namespace
          const currentNamespaceObj = fetchedNamespaces.find(ns => ns.name === currentNamespace);
          if (currentNamespaceObj) {
            setUserPermission(currentNamespaceObj.userPermission || null);
          }
        }
      } else {
        console.error('Invalid namespaces data format:', fetchedNamespaces);
        setNamespaces([]);
        setError('Unable to load your namespaces. Please try again or contact support if the issue persists.');
      }
    } catch (err) {
      console.error('Error fetching namespaces:', err);
      
      // Provide more user-friendly error messages based on the error type
      if (err.name === 'ServerError') {
        setError('Server connection issue. Please check your internet connection and try again.');
      } else if (err.message.includes('User not authenticated')) {
        setError('Your session has expired. Please sign in again.');
      } else {
        setError('Unable to load your namespaces. Please try again later.');
      }
      
      setNamespaces([]);
    } finally {
      // Add a small delay before setting isLoading to false to prevent UI flashing
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  const openNamespaceModal = () => {
    setIsNamespaceModalOpen(true);
  };
  
  const closeNamespaceModal = () => setIsNamespaceModalOpen(false);
  
  const switchNamespace = (namespace) => {
    setCurrentNamespace(namespace);
    closeNamespaceModal();
  };

  // Navigate to create namespace page
  const createNamespace = (namespace) => {
    // This will be handled by the API call in the CreateNamespace component
    // After creation, we'll refetch the namespaces
    fetchNamespacesFromServer();
  };

  const value = {
    currentNamespace,
    namespaces,
    isNamespaceModalOpen,
    isLoading,
    error,
    userPermission,
    openNamespaceModal,
    closeNamespaceModal,
    switchNamespace,
    createNamespace,
    fetchUserNamespaces: fetchNamespacesFromServer
  };

  return (
    <NamespaceContext.Provider value={value}>
      {children}
    </NamespaceContext.Provider>
  );
}

export function useNamespace() {
  const context = useContext(NamespaceContext);
  if (!context) {
    throw new Error('useNamespace must be used within a NamespaceProvider');
  }
  return context;
} 