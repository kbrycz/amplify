import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SERVER_URL, auth } from '../lib/firebase';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import ManageTemplateHeader from '../components/manageTemplates/ManageTemplateHeader';
import TemplateList from '../components/manageTemplates/TemplateList';
import { useNamespace } from '../context/NamespaceContext';

export default function ManageTemplates() {
  const navigate = useNavigate();
  
  // Get the current namespace from context
  const { currentNamespace, namespaces, isLoading: namespacesLoading, fetchUserNamespaces } = useNamespace();
  
  // Find the current namespace ID
  const currentNamespaceObj = namespaces.find(ns => ns.name === currentNamespace);
  const currentNamespaceId = currentNamespaceObj?.id;
  
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Ensure namespaces are loaded when the component mounts
  useEffect(() => {
    if (namespaces.length === 0 && !namespacesLoading) {
      fetchUserNamespaces();
    }
  }, []);

  // Delay showing errors to prevent flashing
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setShowError(true);
      }, 500); // Delay showing error by 500ms
      return () => clearTimeout(timer);
    } else {
      setShowError(false);
    }
  }, [error]);

  // Mark when initial load is complete
  useEffect(() => {
    if (!namespacesLoading && !isLoading) {
      setInitialLoadComplete(true);
    }
  }, [namespacesLoading, isLoading]);

  useEffect(() => {
    // Only proceed if we're not still loading namespaces
    if (!namespacesLoading) {
      if (currentNamespaceId) {
        fetchTemplates();
      } else if (namespaces.length > 0) {
        // Only show error if namespaces are loaded but none is selected
        setError('No namespace selected. Please select a namespace to view templates.');
        setIsLoading(false);
      } else if (namespaces.length === 0) {
        // If no namespaces exist at all
        setError('No namespaces available. Please create a namespace first.');
        setIsLoading(false);
      }
    }
  }, [currentNamespaceId, namespacesLoading, namespaces]);

  const fetchTemplates = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/templates?namespaceId=${currentNamespaceId}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch templates');
      }
      const data = await response.json();
      setTemplates(data);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (templateId) => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/templates/${templateId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete template');
      }
      setTemplates((prev) => prev.filter((t) => t.id !== templateId));
      setSuccessMessage('Template deleted successfully');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error deleting template:', err);
      alert('Failed to delete template: ' + err.message);
    }
  };

  const handleUpdate = async (templateId, formData) => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      // Make sure we include the namespaceId in the form data
      const updateData = {
        ...formData,
        namespaceId: currentNamespaceId
      };
      
      const response = await fetch(`${SERVER_URL}/templates/${templateId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update template');
      }
      const updatedTemplate = await response.json();
      setTemplates((prevTemplates) =>
        prevTemplates.map((t) => (t.id === templateId ? { ...t, ...updatedTemplate } : t))
      );
      setSuccessMessage('Template updated successfully');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return updatedTemplate;
    } catch (err) {
      console.error('Error updating template:', err);
      throw err;
    }
  };

  return (
    <div className="p-6">
      {successMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {successMessage}
        </div>
      )}
      
      {/* Namespace warning - only show after initial load and with a delay */}
      {!currentNamespaceId && !namespacesLoading && namespaces.length > 0 && initialLoadComplete && showError && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400 dark:text-amber-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Namespace Required</h3>
              <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                <p>Please select a namespace to view and manage templates. Templates are shared within a namespace.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <ManageTemplateHeader
        isEditMode={isEditMode}
        onToggleEdit={() => setIsEditMode(!isEditMode)}
        onNewTemplate={() => navigate('/app/templates/new')}
        hasTemplates={!isLoading && templates.length > 0}
        currentNamespace={currentNamespace}
      />

      {namespacesLoading || isLoading ? (
        <LoadingSpinner message={namespacesLoading ? "Loading namespaces..." : "Loading templates..."} />
      ) : error && showError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400 dark:text-red-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <TemplateList
          isLoading={isLoading}
          templates={templates}
          isEditMode={isEditMode}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onTemplateClick={(id) => navigate(`/app/templates/${id}`)}
          onNewTemplate={() => navigate('/app/templates/new')}
          currentNamespaceId={currentNamespaceId}
        />
      )}

      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}
