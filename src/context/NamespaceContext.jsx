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
  const [isLoading, setIsLoading] = useState(false);
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
        setError('Received invalid data from server');
      }
    } catch (err) {
      console.error('Error fetching namespaces:', err);
      setError(err.message || 'Failed to load namespaces. Please try again.');
      setNamespaces([]);
    } finally {
      setIsLoading(false);
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