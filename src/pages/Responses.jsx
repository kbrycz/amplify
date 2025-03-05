import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/page-header';
import { ArrowLeft, Star, Share2, Video, Sparkles } from 'lucide-react';
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
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch responses');
      }

      // Just store raw data; let ListViewResponse handle date parsing
      const data = await response.json();

      // Initialize starred from the returned data
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
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete video');
      }

      // Remove from local state
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
    if (isStarred) {
      newStarred.add(responseId);
    } else {
      newStarred.delete(responseId);
    }
    setStarredResponses(newStarred);
  };

  const filteredResponses = showStarredOnly
    ? responses.filter(response => starredResponses.has(response.id))
    : responses;

  const handleTransform = (response) => {
    setSelectedResponse(response);
    setIsTransformModalOpen(true);
  };

  // Add a function to handle when a video starts processing
  const handleVideoProcessingStart = (videoId) => {
    setIsTransformModalOpen(false);
    
    // Add the video ID to the processing set
    setProcessingVideoIds(prev => {
      const newSet = new Set(prev);
      newSet.add(videoId);
      return newSet;
    });
    
    // Find the response object to get the campaign ID if available
    const response = responses.find(r => r.id === videoId);
    const campaignId = response?.campaignId;
    
    // Start polling for video processing status
    const pollInterval = 5000; // 5 seconds
    const maxAttempts = 60; // 5 minutes max (60 * 5 seconds)
    let attempts = 0;
    
    // Show initial processing toast
    const toastId = addToast(
      <div className="flex flex-col space-y-2">
        <p>Video enhancement in progress...</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '0%' }}></div>
        </div>
      </div>,
      "info",
      0 // Don't auto-dismiss
    );
    
    const pollStatus = async () => {
      try {
        attempts++;
        
        // Call the actual status endpoint to check processing status
        const idToken = await auth.currentUser.getIdToken();
        const response = await fetch(`${SERVER_URL}/videoProcessor/status/${videoId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to check video processing status');
        }
        
        const result = await response.json();
        console.log('Video processing status:', result);
        
        // Update progress toast if we have progress information
        if (result.status === 'processing' && result.progress) {
          const progressPercent = Math.min(Math.round(result.progress * 100), 99);
          
          // Update the toast with progress
          addToast(
            <div className="flex flex-col space-y-2">
              <p>Video enhancement in progress: {progressPercent}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>,
            "info",
            0, // Don't auto-dismiss
            toastId // Replace the existing toast
          );
          
          // Continue polling if still processing
          setTimeout(pollStatus, pollInterval);
        }
        // If processing is complete
        else if (result.status === 'completed') {
          // Mark the video as no longer processing
          markVideoProcessingComplete(videoId);
          setProcessingVideoIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(videoId);
            return newSet;
          });
          
          // Show success message when processing completes with a button to navigate to AI Videos
          addToast(
            <div className="flex flex-col space-y-3">
              <p className="font-semibold text-base">Success! Your enhanced video is ready.</p>
              <button 
                onClick={() => {
                  if (campaignId) {
                    navigate(`/app/campaigns/${campaignId}/ai-videos`);
                  } else {
                    navigate('/app/ai-videos');
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium mt-1 w-full text-center"
              >
                View in AI Videos
              </button>
            </div>,
            "success",
            15000, // Show for 15 seconds to give user time to click
            toastId // Replace the existing toast
          );
        } 
        // If processing failed
        else if (result.status === 'failed') {
          // Mark the video as no longer processing
          markVideoProcessingComplete(videoId);
          setProcessingVideoIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(videoId);
            return newSet;
          });
          
          // Show error message
          addToast(
            `Video enhancement failed: ${result.error || 'Unknown error'}`, 
            "error",
            10000,
            toastId // Replace the existing toast
          );
        }
        // If status is unknown or any other status
        else {
          // If we've reached max attempts but the video is still not complete
          if (attempts >= maxAttempts) {
            // Mark the video as no longer processing in our UI, but don't stop the actual processing
            markVideoProcessingComplete(videoId);
            setProcessingVideoIds(prev => {
              const newSet = new Set(prev);
              newSet.delete(videoId);
              return newSet;
            });
            
            // Show a message indicating that processing is taking longer than expected
            addToast(
              "Video processing is taking longer than expected. Please check the AI Videos page later.", 
              "info",
              10000,
              toastId // Replace the existing toast
            );
          } else {
            // Continue polling
            setTimeout(pollStatus, pollInterval);
          }
        }
      } catch (error) {
        console.error('Error checking video processing status:', error);
        
        // Continue polling despite error
        if (attempts < maxAttempts) {
          setTimeout(pollStatus, pollInterval);
        } else {
          // Mark the video as no longer processing after max attempts
          markVideoProcessingComplete(videoId);
          setProcessingVideoIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(videoId);
            return newSet;
          });
          
          // Show error message
          addToast(
            "Unable to determine video processing status. Please check the AI Videos page later.", 
            "warning",
            10000,
            toastId // Replace the existing toast
          );
        }
      }
    };
    
    // Start polling immediately
    pollStatus();
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
        <div className="mt-6 grid grid-cols-1 gap-4">
          {filteredResponses.map((response) => (
            <ListViewResponse
              key={response.id}
              response={response}
              onVideoClick={(response) => {
                setSelectedTestimonial(response);
              }}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTransform={handleTransform}
              onStarChange={handleStarChange}
              processingVideoIds={processingVideoIds}
            />
          ))}
        </div>
      )}

      {/* Video modal */}
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
        endpoint="/videoProcessor/process-video"
        onProcessingStart={handleVideoProcessingStart}
      />

      {/* Video Editor Modal */}
      <VideoEditorModal
        isOpen={isVideoEditorOpen}
        onClose={() => setIsVideoEditorOpen(false)}
        video={selectedResponse}
        onSave={async () => {
          // Refresh the list after saving changes
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