import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/page-header';
import { ArrowLeft, Star, Video, Sparkles } from 'lucide-react';
import { SERVER_URL, auth } from '../lib/firebase';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { ListViewResponse } from '../components/responses/ListViewResponse';
import { VideoModal } from '../components/responses/VideoModal';
import { VideoEditorModal } from '../components/responses/VideoEditorModal';
import { ConfirmationModal } from '../components/ui/confirmation-modal';
import { EmptyState } from '../components/ui/empty-state';
import { ErrorMessage } from '../components/ui/error-message';
import { useToast } from '../components/ui/toast-notification';

export default function AIVideos() {
  const { id } = useParams();
  const [aiVideos, setAiVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedForAction, setSelectedForAction] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchAIVideos();
  }, [id]);

  const fetchAIVideos = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/videoProcessor/ai-videos/campaign/${id}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (response.status === 404) {
        setAiVideos([]);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch AI videos');
      }

      const data = await response.json();
      setAiVideos(data);
    } catch (err) {
      console.error('Error fetching AI videos:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (video) => {
    setSelectedForAction(video);
    setIsEditModalOpen(true);
  };

  const handleDelete = (video) => {
    setSelectedForAction(video);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedForAction) return;
    
    setIsDeleting(true);
    
    // Close the modal immediately
    setIsDeleteModalOpen(false);
    
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/videoProcessor/ai-videos/${selectedForAction.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete AI video');
      }

      // Remove the deleted video from the state
      setAiVideos(prev => prev.filter(video => video.id !== selectedForAction.id));
      
      // Show success toast
      addToast("AI video deleted successfully", "success", 3000);
    } catch (err) {
      console.error('Error deleting AI video:', err);
      
      // Show error toast
      addToast(`Failed to delete AI video: ${err.message}`, "error", 5000);
    } finally {
      setIsDeleting(false);
    }
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
        title="AI Generated Videos"
        description="View and manage AI-generated videos for this campaign."
        className="mb-6"
      />

      {isLoading ? (
        <LoadingSpinner message="Loading AI videos..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : aiVideos.length === 0 ? (
        <EmptyState
          title="No AI-generated videos yet"
          description="Transform your video responses into polished, professional content with our AI tools."
          icon={Sparkles}
          primaryAction={{
            label: 'View Responses',
            onClick: () => navigate(`/app/campaigns/${id}/responses`),
            icon: <Video className="h-5 w-5" />
          }}
        />
      ) : (
        <div className="mt-8 space-y-4">
          {aiVideos.map(video => (
            <ListViewResponse
              key={video.id}
              response={{
                ...video,
                name: 'AI Generated Video',
                email: 'Generated from original response',
                videoUrl: video.processedVideoUrl,
                thumbnailUrl: video.thumbnailUrl || 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?q=80&w=2073'
              }}
              onVideoClick={setSelectedVideo}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStarChange={() => {}}
            />
          ))}
        </div>
      )}
      
      {/* Video modal */}
      {selectedVideo && (
        <VideoModal
          testimonial={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete AI Video"
        message="Are you sure you want to delete this AI-generated video? This action cannot be undone."
        isLoading={isDeleting}
        simpleConfirm={true}
      />

      {/* Edit Modal */}
      <VideoEditorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        video={selectedForAction}
        onSave={async () => {
          // TODO: Implement save functionality
          setIsEditModalOpen(false);
          await fetchAIVideos();
        }}
      />
      
      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}