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
            <div
              key={video.id}
              className="group relative flex flex-col rounded-lg border border-gray-200 bg-white p-4 transition-all duration-300 ease-in-out hover:border-gray-300 hover:shadow-lg hover:scale-[1.01] hover:bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800/50 cursor-pointer"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="flex flex-col gap-4">
                {/* Video Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <img
                    src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?q=80&w=2073'}
                    alt="AI Video thumbnail"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50" />
                  <div className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                    {video.createdAt ? new Date(video.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric'
                    }) : 'Unknown'}
                  </div>
                </div>

                {/* Video Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      AI Generated Video
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Generated from original response
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Video modal */}
      {selectedVideo && (
        <VideoModal
          testimonial={{ videoUrl: selectedVideo.processedVideoUrl }}
          onClose={() => setSelectedVideo(null)}
        />
      )}
      
      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}