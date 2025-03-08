import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/page-header';
import { ArrowLeft, Star, Share2, Video, Sparkles, Loader2 } from 'lucide-react';
import { SERVER_URL, auth } from '../lib/firebase';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { ListViewResponse } from '../components/responses/ListViewResponse';
import { VideoModal } from '../components/responses/VideoModal';
import { ErrorMessage } from '../components/ui/error-message';
import { TransformModal, markVideoProcessingComplete } from '../components/responses/TransformModal';
import { EmptyState } from '../components/ui/empty-state';
import { ConfirmationModal } from '../components/ui/confirmation-modal';
import { VideoEditorModal } from '../components/responses/VideoEditorModal';
import { useToast } from '../components/ui/toast-notification';

export default function Responses() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVideoEditorOpen, setIsVideoEditorOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTransformModalOpen, setIsTransformModalOpen] = useState(false);
  const [starredResponses, setStarredResponses] = useState(new Set());
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const { addToast } = useToast();
  const [processingVideoIds, setProcessingVideoIds] = useState(new Set());

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

  const filteredResponses = showStarredOnly
    ? responses.filter(response => starredResponses.has(response.id))
    : responses;

  const handleTransform = (response) => {
    setSelectedResponse(response);
    setIsTransformModalOpen(true);
  };

  // Function that starts polling using the Creatomate status endpoint.
  const handleVideoProcessingStart = (videoId, initialToastId = null, aiVideoId = null) => {
    setProcessingVideoIds(prev => new Set(prev).add(videoId));
    const responseObj = responses.find(r => r.id === videoId);
    const campaignId = responseObj?.campaignId;
    let toastId = initialToastId;
    if (!aiVideoId) {
      console.error('No aiVideoId provided for status polling');
      addToast(
        "Unable to track video processing status. Please check AI Videos page later.",
        "warning",
        10000,
        toastId
      );
      return;
    }

    const checkInitialStatus = async () => {
      try {
        const idToken = await auth.currentUser.getIdToken();
        const response = await fetch(`${SERVER_URL}/creatomate/creatomate-process/status/job/${aiVideoId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        if (!response.ok) return false;
        const result = await response.json();
        console.log('Initial video processing status:', result);
        if (result.status === 'succeeded') {
          markVideoProcessingComplete(videoId);
          setProcessingVideoIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(videoId);
            return newSet;
          });
          addToast(
            <div className="flex flex-col space-y-3">
              <p className="font-semibold text-base">Success! Your enhanced video is ready.</p>
              <button 
                onClick={() => {
                  navigate(campaignId ? `/app/campaigns/${campaignId}/ai-videos` : '/app/ai-videos');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium mt-1 w-full text-center"
              >
                View in AI Videos
              </button>
            </div>,
            "success",
            15000,
            toastId
          );
          fetchResponses();
          return true;
        }
        if (result.status === 'failed') {
          markVideoProcessingComplete(videoId);
          setProcessingVideoIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(videoId);
            return newSet;
          });
          addToast(
            `Video enhancement failed: ${result.error || 'Unknown error'}`,
            "error",
            10000,
            toastId
          );
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error checking initial video status:', error);
        return false;
      }
    };

    const pollInterval = 5000; // 5 seconds
    const maxAttempts = 60; // 5 minutes max
    let attempts = 0;
    let intervalId = null;

    checkInitialStatus().then(isResolved => {
      if (isResolved) return;
      const pollStatus = async () => {
        attempts++;
        if (attempts > maxAttempts) {
          addToast(
            "Video processing is taking longer than expected. Please check back later.",
            "info",
            10000,
            toastId
          );
          markVideoProcessingComplete(videoId);
          setProcessingVideoIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(videoId);
            return newSet;
          });
          clearInterval(intervalId);
          return;
        }
        try {
          const idToken = await auth.currentUser.getIdToken();
          const response = await fetch(`${SERVER_URL}/creatomate/creatomate-process/status/job/${aiVideoId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${idToken}`,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });
          if (!response.ok) throw new Error('Failed to check video processing status');
          const result = await response.json();
          console.log('Video processing status:', result);
          if (result.status === 'succeeded') {
            clearInterval(intervalId);
            markVideoProcessingComplete(videoId);
            setProcessingVideoIds(prev => {
              const newSet = new Set(prev);
              newSet.delete(videoId);
              return newSet;
            });
            addToast(
              <div className="flex flex-col space-y-3">
                <p className="font-semibold text-base">Success! Your enhanced video is ready.</p>
                <button 
                  onClick={() => {
                    navigate(campaignId ? `/app/campaigns/${campaignId}/ai-videos` : '/app/ai-videos');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium mt-1 w-full text-center"
                >
                  View in AI Videos
                </button>
              </div>,
              "success",
              15000,
              toastId
            );
            fetchResponses();
          } else if (result.status === 'failed') {
            clearInterval(intervalId);
            markVideoProcessingComplete(videoId);
            setProcessingVideoIds(prev => {
              const newSet = new Set(prev);
              newSet.delete(videoId);
              return newSet;
            });
            addToast(
              `Video enhancement failed: ${result.error || 'Unknown error'}`,
              "error",
              10000,
              toastId
            );
          }
        } catch (error) {
          console.error('Error polling video status:', error);
          if (attempts >= maxAttempts) {
            clearInterval(intervalId);
            markVideoProcessingComplete(videoId);
            setProcessingVideoIds(prev => {
              const newSet = new Set(prev);
              newSet.delete(videoId);
              return newSet;
            });
            addToast(
              `Error checking video status: ${error.message}`,
              "error",
              10000,
              toastId
            );
          }
        }
      };
      pollStatus();
      intervalId = setInterval(pollStatus, pollInterval);
    });
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
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
              processingVideoIds={processingVideoIds}
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

      <TransformModal
        isOpen={isTransformModalOpen}
        onClose={() => setIsTransformModalOpen(false)}
        video={selectedResponse}
        endpoint="/creatomate/creatomate-process"
        onProcessingStart={handleVideoProcessingStart}
      />

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