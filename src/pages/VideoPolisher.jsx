import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SERVER_URL, auth } from '../lib/firebase';
import { useToast } from '../components/ui/toast-notification';
import VideoPolisherHeader from '../components/videoPolisher/VideoPolisherHeader';
import { VideoPreview } from '../components/videoPolisher/VideoPreview';
import VideoDetailsForm from '../components/videoPolisher/VideoDetailsForm';
import { TemplateModal } from '../components/videoPolisher/TemplateModal';

// Keep track of which videos are currently being processed
const processingVideos = new Set();

export function isVideoProcessing(videoId) {
  return processingVideos.has(videoId);
}

export function markVideoProcessingComplete(videoId) {
  processingVideos.delete(videoId);
}

export async function checkVideoProcessingStatus(videoId) {
  try {
    const idToken = await auth.currentUser.getIdToken();
    const response = await fetch(`${SERVER_URL}/creatomate/creatomate-process/status/job/${videoId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 404) {
      return { status: 'pending' };
    } else if (!response.ok) {
      console.error('Failed to check video processing status:', response.status);
      return { status: 'unknown' };
    }
    
    const data = await response.json();
    
    if (data.status === 'completed') {
      return { status: 'completed', data };
    } else if (data.status === 'failed' || data.status === 'error') {
      return { status: 'failed', error: data.error || 'Unknown error' };
    } else {
      return { status: 'processing', progress: data.progress || 0 };
    }
  } catch (error) {
    console.error('Error checking video processing status:', error);
    return { status: 'unknown', error: error.message };
  }
}

export default function VideoPolisher() {
  const { id, campaignId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (id) {
      fetchVideo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchVideo = async () => {
    setIsLoading(true);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/survey/video/${id}`, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      if (!response.ok) throw new Error('Failed to fetch video');
      const data = await response.json();
      setVideo(data);
    } catch (err) {
      console.error('Error fetching video:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVideo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!id) {
      setError("No video ID provided");
      addToast("No video ID provided", "error");
      return;
    }

    if (processingVideos.has(id)) {
      addToast("This video is already being processed. Please wait for it to complete.", "info");
      return;
    }

    console.log("Transform video ID:", id);
    setIsProcessing(true);
    setError(null);
    processingVideos.add(id);
    
    const toastId = addToast(
      "Video processing in progress. This may take a few minutes...",
      "info",
      0 // Don't auto-dismiss
    );

    try {
      const idToken = await auth.currentUser.getIdToken();
      const payload = { 
        videoId: id,
        templateId: selectedTemplate?.id
      };

      const response = await fetch(`${SERVER_URL}/creatomate/creatomate-process`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to process video');
      }

      const responseData = await response.json().catch(() => ({}));
      console.log('Video processing initiated:', responseData);
      const jobId = responseData.jobId;
      
      if (jobId) {
        handleVideoProcessingStart(id, toastId, jobId);
      }
    } catch (err) {
      console.error('Error processing video:', err);
      setError(err.message || 'Failed to process video');
      addToast(err.message || 'Failed to process video', "error", 10000, toastId);
      processingVideos.delete(id);
      setIsProcessing(false);
    }
  };

  // Function that starts polling using the Creatomate status endpoint.
  const handleVideoProcessingStart = (videoId, initialToastId = null, aiVideoId = null) => {
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
          setIsProcessing(false);
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
          return true;
        }
        if (result.status === 'failed') {
          markVideoProcessingComplete(videoId);
          setIsProcessing(false);
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
          setIsProcessing(false);
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
            setIsProcessing(false);
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
          } else if (result.status === 'failed') {
            clearInterval(intervalId);
            markVideoProcessingComplete(videoId);
            setIsProcessing(false);
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
            setIsProcessing(false);
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

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setSuccessMessage("Template selected successfully!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(`/app/campaigns/${campaignId}/responses`)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to campaign
      </button>

      <VideoPolisherHeader />

      <div className="mt-6 flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[calc(100%-500px)]">
          <VideoDetailsForm
            video={video}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            isProcessing={isProcessing}
            successMessage={successMessage}
            error={error}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
          />
        </div>

        <VideoPreview 
          videoUrl={video?.videoUrl}
          selectedTemplate={selectedTemplate}
        />
      </div>

      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
} 