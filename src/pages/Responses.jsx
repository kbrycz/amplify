import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { PageHeader } from '../components/ui/page-header';
import { ArrowLeft, Star, Share2, Video, Sparkles } from 'lucide-react';
import { SERVER_URL, auth } from '../lib/firebase';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { ListViewResponse } from '../components/responses/ListViewResponse';
import { VideoModal } from '../components/responses/VideoModal';
import { ErrorMessage } from '../components/ui/error-message';
import { EmptyState } from '../components/ui/empty-state';
import { ConfirmationModal } from '../components/ui/confirmation-modal';
import { VideoEditorModal } from '../components/responses/VideoEditorModal';
import { useToast } from '../components/ui/toast-notification';

export default function Responses() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVideoEditorOpen, setIsVideoEditorOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [starredResponses, setStarredResponses] = useState(new Set());
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [showAIVideosOnly, setShowAIVideosOnly] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const { addToast } = useToast();

  // Check for AI filter in URL query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const aiParam = searchParams.get('ai');
    if (aiParam === 'true') {
      setShowAIVideosOnly(true);
    }
  }, [location.search]);

  useEffect(() => {
    fetchResponses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchResponses = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/survey/videos/${id}`, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      if (!response.ok) throw new Error('Failed to fetch responses');
      const data = await response.json();
      const initialStarred = new Set(data.filter(r => r.starred).map(r => r.id));
      setStarredResponses(initialStarred);
      setResponses(data);
    } catch (err) {
      console.error('Error fetching responses:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedResponse) return;
    setIsDeleting(true);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/videoEditor/delete/${selectedResponse.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${idToken}` }
      });
      if (!response.ok) throw new Error('Failed to delete video');
      setResponses(prev => prev.filter(r => r.id !== selectedResponse.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error('Error deleting video:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (response) => {
    setSelectedResponse(response);
    setIsVideoEditorOpen(true);
  };

  const handleDelete = (response) => {
    setSelectedResponse(response);
    setIsDeleteModalOpen(true);
  };

  const handleStarChange = (responseId, isStarred) => {
    const newStarred = new Set(starredResponses);
    isStarred ? newStarred.add(responseId) : newStarred.delete(responseId);
    setStarredResponses(newStarred);
  };

  // Apply filters based on selected options
  let filteredResponses = responses;
  
  // Apply starred filter if enabled
  if (showStarredOnly) {
    filteredResponses = filteredResponses.filter(response => starredResponses.has(response.id));
  }
  
  // Apply AI videos filter if enabled
  if (showAIVideosOnly) {
    // Filter for responses that have isVideoEnhanced set to true
    filteredResponses = filteredResponses.filter(response => response.isVideoEnhanced === true);
  }

  const handleTransform = (response) => {
    navigate(`/app/campaigns/${id}/responses/${response.id}/polish`);
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(`/app/campaigns/${id}`)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to campaign
      </button>

      <PageHeader
        title="Campaign Responses"
        description="View and manage video testimonials for this campaign."
        className="mb-6"
      >
        <div className="flex gap-2">
          <div
            onClick={() => setShowStarredOnly(!showStarredOnly)}
            className={`inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium transition-colors ${
              showStarredOnly
                ? 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800 dark:hover:bg-gray-800'
            } cursor-pointer`}
          >
            <Star className={`h-4 w-4 ${showStarredOnly ? 'fill-current' : ''}`} />
            Starred
          </div>
          <div
            onClick={() => {
              const newState = !showAIVideosOnly;
              setShowAIVideosOnly(newState);
              
              // Update URL to reflect the AI filter state
              const searchParams = new URLSearchParams(location.search);
              if (newState) {
                searchParams.set('ai', 'true');
              } else {
                searchParams.delete('ai');
              }
              
              // Replace the current URL without reloading the page
              navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
            }}
            className={`inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium transition-colors ${
              showAIVideosOnly
                ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800 dark:hover:bg-gray-800'
            } cursor-pointer`}
          >
            <Sparkles className={`h-4 w-4 ${showAIVideosOnly ? 'fill-current' : ''}`} />
            AI Videos
          </div>
        </div>
      </PageHeader>

      {isLoading ? (
        <LoadingSpinner message="Loading responses..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : responses.length === 0 ? (
        <EmptyState
          title="No responses yet"
          description="Share your campaign link to start collecting video responses from your community."
          primaryAction={{
            label: 'Share Campaign',
            onClick: () => navigate(`/app/campaigns/${id}`),
            icon: <Share2 className="h-5 w-5" />
          }}
        />
      ) : filteredResponses.length === 0 && showStarredOnly ? (
        <EmptyState
          title="No starred responses"
          description="Star your favorite responses to find them quickly later."
          icon={Star}
        />
      ) : filteredResponses.length === 0 && showAIVideosOnly ? (
        <EmptyState
          title="No enhanced videos available"
          description="No videos with AI enhancements were found. Transform your videos using our AI tools to see them here."
          icon={Sparkles}
        />
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          {filteredResponses.map((response) => (
            <ListViewResponse
              key={response.id}
              response={response}
              onVideoClick={(response) => setSelectedTestimonial(response)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTransform={handleTransform}
              onStarChange={handleStarChange}
            />
          ))}
        </div>
      )}

      {selectedTestimonial && (
        <VideoModal
          testimonial={selectedTestimonial}
          onClose={() => setSelectedTestimonial(null)}
        />
      )}

      <VideoEditorModal
        isOpen={isVideoEditorOpen}
        onClose={() => setIsVideoEditorOpen(false)}
        video={selectedResponse}
        onSave={async () => {
          await fetchResponses();
          setIsVideoEditorOpen(false);
        }}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Video"
        message="Are you sure you want to delete this video? This action cannot be undone."
        simpleConfirm={true}
        isLoading={isDeleting}
      />

      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}