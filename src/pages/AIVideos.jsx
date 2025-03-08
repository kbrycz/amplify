import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SERVER_URL, auth } from '../lib/firebase';
import { useToast } from '../components/ui/toast-notification';
import AIVideosHeader from '../components/aiVideos/AIVideosHeader';
import AIVideosList from '../components/aiVideos/AIVideosList';
import AIVideosModals from '../components/aiVideos/AIVideosModals';

export default function AIVideos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [aiVideos, setAiVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedForAction, setSelectedForAction] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAIVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchAIVideos = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/creatomate/ai-videos/campaign/${id}`, {
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
      setAiVideos(prev => prev.filter(video => video.id !== selectedForAction.id));
      addToast("AI video deleted successfully", "success", 3000);
    } catch (err) {
      console.error('Error deleting AI video:', err);
      addToast(`Failed to delete AI video: ${err.message}`, "error", 5000);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <AIVideosHeader id={id} navigate={navigate} />
      <AIVideosList 
        aiVideos={aiVideos}
        isLoading={isLoading}
        error={error}
        onVideoClick={setSelectedVideo}
        onEdit={handleEdit}
        onDelete={handleDelete}
        campaignId={id}
        navigate={navigate}
      />
      <AIVideosModals
        selectedVideo={selectedVideo}
        setSelectedVideo={setSelectedVideo}
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        isDeleting={isDeleting}
        handleDeleteConfirm={handleDeleteConfirm}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        selectedForAction={selectedForAction}
        onSaveEdit={async () => {
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