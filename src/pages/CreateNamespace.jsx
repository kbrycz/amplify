import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { post } from '../lib/api';
import { ErrorMessage } from '../components/ui/error-message';
import NamespaceSteps from '../components/namespace/NamespaceSteps';
import NamespaceSuccessModal from '../components/namespace/NamespaceSuccessModal';
import NamespaceLoadingModal from '../components/namespace/NamespaceLoadingModal';

export default function CreateNamespace() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [members, setMembers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loadingModal, setLoadingModal] = useState({ isOpen: false, status: 'loading', error: null });
  const [successModal, setSuccessModal] = useState({ isOpen: false, namespaceName: '', namespaceId: null });

  // Set the current user as an admin when the component mounts
  useEffect(() => {
    if (user && members.length === 0) {
      setMembers([
        {
          email: user.email,
          role: 'admin', // This will be mapped to 'admin' permission on the server
          name: user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          isCurrentUser: true
        }
      ]);
    }
  }, [user, members.length]);

  const createNamespace = async () => {
    if (!formData.name?.trim()) {
      setError('Please enter a namespace name');
      return;
    }

    setIsSubmitting(true);
    setLoadingModal({ isOpen: true, status: 'loading', error: null });

    try {
      // Map our frontend data structure to the server's expected format
      const namespaceData = {
        name: formData.name,
        description: formData.description || '',
        accountId: user.uid, // Use the user's UID as the accountId
        members: members.map(member => ({
          email: member.email,
          permission: member.role === 'read-only' ? 'readonly' : member.role, // Map 'read-only' to 'readonly'
          status: member.isCurrentUser ? 'active' : 'pending' // Current user is active, others are pending
        }))
      };

      // Make the API call to create the namespace
      const response = await post('/namespaces', namespaceData);
      
      // Show success in the loading modal first
      setLoadingModal({ isOpen: true, status: 'success', error: null });
      
      // After a short delay, close the loading modal and open the success modal
      setTimeout(() => {
        setLoadingModal({ isOpen: false, status: 'success', error: null });
        setSuccessModal({ 
          isOpen: true, 
          namespaceName: formData.name, 
          namespaceId: response.id 
        });
      }, 1500);
    } catch (err) {
      console.error('Error creating namespace:', err);
      setLoadingModal({
        isOpen: true,
        status: 'error',
        error: err.message || 'Failed to create namespace. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createNamespace();
  };

  const handleRetry = () => {
    createNamespace();
  };

  const handleCloseLoadingModal = () => {
    setLoadingModal({ ...loadingModal, isOpen: false });
  };

  const handleCloseSuccessModal = () => {
    setSuccessModal({ ...successModal, isOpen: false });
    // Navigate to the manage namespaces page
    navigate('/app/namespaces/manage');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Create Namespace
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Create a new namespace for your organization or team
        </p>
      </div>

      {error && <ErrorMessage message={error} className="mb-4" />}

      {/* Progress Bar - Full width */}
      <div className="relative w-full h-1 bg-gray-200 dark:bg-gray-800 mb-6">
        <div
          className="absolute inset-y-0 left-0 bg-indigo-600 dark:bg-indigo-400 transition-all duration-500"
          style={{ width: `${((currentStep + 1) / 3) * 100}%` }}
        />
      </div>

      <NamespaceSteps
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        formData={formData}
        setFormData={setFormData}
        members={members}
        setMembers={setMembers}
        currentUser={user}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
      />

      {/* Loading Modal */}
      <NamespaceLoadingModal
        isOpen={loadingModal.isOpen}
        status={loadingModal.status}
        error={loadingModal.error}
        onClose={handleCloseLoadingModal}
        onRetry={handleRetry}
        namespaceName={formData.name}
      />

      {/* Success Modal */}
      <NamespaceSuccessModal
        isOpen={successModal.isOpen}
        onClose={handleCloseSuccessModal}
        namespaceName={successModal.namespaceName}
        namespaceId={successModal.namespaceId}
      />
    </div>
  );
} 