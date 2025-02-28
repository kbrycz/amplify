import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/page-header';
import { ArrowLeft, Star } from 'lucide-react';
import { SERVER_URL, auth } from '../lib/firebase';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { ListViewResponse } from '../components/responses/ListViewResponse';
import { VideoModal } from '../components/responses/VideoModal';
import { ErrorMessage } from '../components/ui/error-message';

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

  useEffect(() => {
    fetchAIVideos();
  }, [id]);

  const fetchAIVideos = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/videoProcessor/ai-videos`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

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
        description="View and manage AI-generated videos for this campaign"
      />

      {isLoading ? (
        <LoadingSpinner message="Loading AI videos..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : aiVideos.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">No AI-generated videos yet.</p>
        </div>
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
        onConfirm={async () => {
          // TODO: Implement delete functionality
          setIsDeleteModalOpen(false);
        }}
        title="Delete AI Video"
        message="Are you sure you want to delete this AI-generated video? This action cannot be undone."
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