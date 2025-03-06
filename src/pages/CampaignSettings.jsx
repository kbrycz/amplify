import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { SERVER_URL, auth } from '../lib/firebase';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { ConfirmationModal } from '../components/ui/confirmation-modal';
import { PhonePreview } from '../components/create-campaign/PhonePreview';
import CampaignSettingsHeader from '../components/campaignSettings/CampaignSettingsHeader';
import CampaignSettingsForm from '../components/campaignSettings/CampaignSettingsForm';

export default function CampaignSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('sunset');
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaign/campaigns/${id}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch campaign');
      }
      const data = await response.json();
      setCampaign(data);
      setSelectedTheme(data.theme || 'sunset');
      setSurveyQuestions(
        data.surveyQuestions?.map((q, i) => ({ id: i + 1, question: q })) || []
      );
      setPreviewImage(data.previewImage);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setSurveyQuestions([
      ...surveyQuestions,
      { id: surveyQuestions.length + 1, question: '' }
    ]);
  };

  const handleRemoveQuestion = (questionId) => {
    setSurveyQuestions(surveyQuestions.filter(q => q.id !== questionId));
  };

  const handleQuestionChange = (questionId, value) => {
    setSurveyQuestions(
      surveyQuestions.map(q =>
        q.id === questionId ? { ...q, question: value } : q
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement save functionality
    alert('TODO: Save changes');
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const idToken = await auth.currentUser.getIdToken();
      // Immediately navigate away—don’t wait for the response.
      navigate('/app/campaigns');
      await fetch(`${SERVER_URL}/campaign/campaigns/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.error('Error deleting campaign:', err);
      // Already navigated away—no need to set error state.
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading campaign settings..." />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/50">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <CampaignSettingsHeader
        id={id}
        campaignName={campaign?.name}
        navigate={navigate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[800px,auto] gap-6 items-start">
        <CampaignSettingsForm
          campaign={campaign}
          handleSubmit={handleSubmit}
          isSaving={isSaving}
          isDeleting={isDeleting}
          successMessage={successMessage}
          error={error}
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
          surveyQuestions={surveyQuestions}
          handleAddQuestion={handleAddQuestion}
          handleRemoveQuestion={handleRemoveQuestion}
          handleQuestionChange={handleQuestionChange}
          setIsHelpOpen={setIsHelpOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
        />
        <PhonePreview
          selectedTheme={selectedTheme}
          previewImage={previewImage}
          formData={campaign}
          surveyQuestions={surveyQuestions}
          currentStep={3}
        />
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Campaign"
        message={`Are you sure you want to delete "${campaign?.name}"? This action cannot be undone and will permanently remove all associated data.`}
        confirmButtonText="Delete Campaign"
      />

      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}