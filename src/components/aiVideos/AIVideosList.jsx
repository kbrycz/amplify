import React from 'react';
import { Sparkles, Video } from 'lucide-react';
import { LoadingSpinner } from '../ui/loading-spinner';
import { ErrorMessage } from '../ui/error-message';
import { EmptyState } from '../ui/empty-state';
import { ListViewResponse } from '../responses/ListViewResponse';

export default function AIVideosList({
  aiVideos,
  isLoading,
  error,
  onVideoClick,
  onEdit,
  onDelete,
  campaignId,
  navigate
}) {
  if (isLoading) {
    return <LoadingSpinner message="Loading AI videos..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (aiVideos.length === 0) {
    return (
      <EmptyState
        title="No AI-generated videos yet"
        description="Transform your video responses into polished, professional content with our AI tools."
        icon={Sparkles}
        primaryAction={{
          label: 'View Responses',
          onClick: () => navigate(`/app/campaigns/${campaignId}/responses`),
          icon: <Video className="h-5 w-5" />
        }}
      />
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
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
          onVideoClick={onVideoClick}
          onEdit={onEdit}
          onDelete={onDelete}
          onStarChange={() => {}}
        />
      ))}
    </div>
  );
}