import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SERVER_URL, auth } from '../lib/firebase';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import ManageTemplateHeader from '../components/manageTemplates/ManageTemplateHeader';
import TemplateList from '../components/manageTemplates/TemplateList';

export default function ManageTemplates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/templates`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      const data = await response.json();
      setTemplates(data);
    } catch (err) {
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete template');
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
      const response = await fetch(`${SERVER_URL}/templates/${templateId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update template');
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

      <ManageTemplateHeader
        isEditMode={isEditMode}
        onToggleEdit={() => setIsEditMode(!isEditMode)}
        onNewTemplate={() => navigate('/app/templates/new')}
        hasTemplates={!isLoading && templates.length > 0}
      />

      {isLoading ? (
        <LoadingSpinner message="Loading templates..." />
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/50">
          <div className="flex">
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
        />
      )}

      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}
