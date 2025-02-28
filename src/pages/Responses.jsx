import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/page-header';
import { ArrowLeft, Star } from 'lucide-react';
import { SERVER_URL, auth } from '../lib/firebase';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { ListViewResponse } from '../components/responses/ListViewResponse';
import { VideoModal } from '../components/responses/VideoModal';
import { ErrorMessage } from '../components/ui/error-message';
import { TransformModal } from '../components/responses/TransformModal';
import { ConfirmationModal } from '../components/ui/confirmation-modal';
import { VideoEditorModal } from '../components/responses/VideoEditorModal';

export default function Responses() {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVideoEditorOpen, setIsVideoEditorOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTransformModalOpen, setIsTransformModalOpen] = useState(false);
  const [starredResponses, setStarredResponses] = useState(new Set());
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);

  useEffect(() => {
    fetchResponses();
  }, [id]);

  const fetchResponses = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/survey/videos/${id}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch responses');
      }

      const data = await response.json();
      // Initialize starred responses
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
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete video');
      }

      // Remove the deleted response from the list
      setResponses(responses.filter(r => r.id !== selectedResponse.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error('Error deleting video:', err);
      // Show error message to user
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
    const newStarredResponses = new Set(starredResponses);
    if (isStarred) {
      newStarredResponses.add(responseId);
    } else {
      newStarredResponses.delete(responseId);
    }
    setStarredResponses(newStarredResponses);
  };

  const filteredResponses = showStarredOnly 
    ? responses.filter(response => starredResponses.has(response.id))
    : responses;

  const handleTransform = (response) => {
    setSelectedResponse(response);
    setIsTransformModalOpen(true);
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
        description="View and manage video testimonials for this campaign"
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
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">No responses yet.</p>
        </div>
      ) : filteredResponses.length === 0 && showStarredOnly ? (
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">No starred responses.</p>
        </div>
      ) : ( 
        <div className="mt-8 space-y-4">
          {filteredResponses.map(response => (
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
      />

      {/* Video Editor Modal */}
      <VideoEditorModal
        isOpen={isVideoEditorOpen}
        onClose={() => setIsVideoEditorOpen(false)}
        video={selectedResponse}
        onSave={async () => {
          await fetchResponses(); // Refresh responses after save
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