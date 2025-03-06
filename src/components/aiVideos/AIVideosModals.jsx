import React from 'react';
import { ConfirmationModal } from '../ui/confirmation-modal';
import { VideoModal } from '../responses/VideoModal';
import { VideoEditorModal } from '../responses/VideoEditorModal';

export default function AIVideosModals({
  selectedVideo,
  setSelectedVideo,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  isDeleting,
  handleDeleteConfirm,
  isEditModalOpen,
  setIsEditModalOpen,
  selectedForAction,
  onSaveEdit
}) {
  return (
    <>
      {selectedVideo && (
        <VideoModal
          testimonial={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete AI Video"
        message="Are you sure you want to delete this AI-generated video? This action cannot be undone."
        isLoading={isDeleting}
        simpleConfirm={true}
      />

      <VideoEditorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        video={selectedForAction}
        onSave={onSaveEdit}
      />
    </>
  );
}