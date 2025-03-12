import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { get, put } from '../lib/api';
import { ErrorMessage } from '../components/ui/error-message';
import NamespaceSteps from '../components/namespace/NamespaceSteps';
import NamespaceSuccessModal from '../components/namespace/NamespaceSuccessModal';
import NamespaceLoadingModal from '../components/namespace/NamespaceLoadingModal';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { ChevronLeft } from 'lucide-react';

export default function EditNamespace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [members, setMembers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingModal, setLoadingModal] = useState({ isOpen: false, status: 'loading', error: null });
  const [successModal, setSuccessModal] = useState({ isOpen: false, namespaceName: '', namespaceId: null });

  // Fetch namespace data when component mounts
  useEffect(() => {
    const fetchNamespace = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const namespaceData = await get(`/namespaces/${id}`);
        
        if (!namespaceData) {
          setError('Namespace not found');
          return;
        }
        
        // Set form data
        setFormData({
          name: namespaceData.name || '',
          description: namespaceData.description || ''
        });
        
        // Map members from server format to our format
        const mappedMembers = namespaceData.members?.map(member => ({
          email: member.email,
          role: member.permission === 'readonly' ? 'read-only' : member.permission,
          name: member.name || '',
          isCurrentUser: member.email === user.email
        })) || [];
        
        setMembers(mappedMembers);
      } catch (err) {
        console.error('Error fetching namespace:', err);
        setError(err.message || 'Failed to fetch namespace details');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchNamespace();
    }
  }, [id, user.email]);

  const updateNamespace = async () => {
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
        accountId: user.uid,
        members: members.map(member => ({
          email: member.email,
          permission: member.role === 'read-only' ? 'readonly' : member.role,
          status: member.isCurrentUser ? 'active' : 'pending'
        }))
      };

      // Make the API call to update the namespace
      const response = await put(`/namespaces/${id}`, namespaceData);
      
      // Show success in the loading modal first
      setLoadingModal({ isOpen: true, status: 'success', error: null });
      
      // After a short delay, close the loading modal and open the success modal
      setTimeout(() => {
        setLoadingModal({ isOpen: false, status: 'success', error: null });
        setSuccessModal({ 
          isOpen: true, 
          namespaceName: formData.name, 
          namespaceId: id 
        });
      }, 1500);
    } catch (err) {
      console.error('Error updating namespace:', err);
      setLoadingModal({
        isOpen: true,
        status: 'error',
        error: err.message || 'Failed to update namespace. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateNamespace();
  };

  const handleRetry = () => {
    updateNamespace();
  };

  const handleCloseLoadingModal = () => {
    setLoadingModal({ ...loadingModal, isOpen: false });
  };

  const handleCloseSuccessModal = () => {
    setSuccessModal({ ...successModal, isOpen: false });
    // Navigate to the manage namespaces page
    navigate('/app/namespaces/manage');
  };

  const handleBack = () => {
    navigate('/app/namespaces/manage');
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[300px]">
        <LoadingSpinner message="Loading namespace details..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="mb-4 inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Namespaces
        </button>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Edit Namespace
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Update your namespace settings and members
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
        isEditMode={true}
        finalStepText="Update Namespace"
      />

      {/* Loading Modal */}
      <NamespaceLoadingModal
        isOpen={loadingModal.isOpen}
        status={loadingModal.status}
        error={loadingModal.error}
        onClose={handleCloseLoadingModal}
        onRetry={handleRetry}
        namespaceName={formData.name}
        isEditMode={true}
      />

      {/* Success Modal */}
      <NamespaceSuccessModal
        isOpen={successModal.isOpen}
        onClose={handleCloseSuccessModal}
        namespaceName={successModal.namespaceName}
        namespaceId={successModal.namespaceId}
        isEditMode={true}
      />
    </div>
  );
} 