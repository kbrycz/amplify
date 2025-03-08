import React from 'react';
import { Sparkles, Video } from 'lucide-react';
import { LoadingSpinner } from '../ui/loading-spinner';
import { ErrorMessage } from '../ui/error-message';
import { EmptyState } from '../ui/empty-state';
import { ListViewResponse } from '../responses/ListViewResponse';

// Helper function to convert Firebase Storage gs:// URLs to HTTPS URLs
const convertGsUrlToHttps = (url) => {
  if (!url) return null;
  
  // If it's already an HTTPS URL, return it as is
  if (url.startsWith('https://')) {
    return url;
  }
  
  // Convert gs:// URL to HTTPS URL
  if (url.startsWith('gs://')) {
    // Extract bucket name and path
    const gsPattern = /gs:\/\/([^\/]+)\/(.+)/;
    const match = url.match(gsPattern);
    
    if (match && match.length === 3) {
      const [, bucket, path] = match;
      return `https://storage.googleapis.com/${bucket}/${path}`;
    }
  }
  
  // Return original URL if conversion failed
  return url;
};

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
    return (
      <div className="mt-4">
        <ErrorMessage message={error} />
      </div>
    );
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
            videoUrl: convertGsUrlToHttps(video.processedVideoUrl),
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