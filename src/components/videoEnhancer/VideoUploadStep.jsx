import React, { useRef, useState } from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';
import { Label } from '../../components/ui/label';

const MAX_FILE_SIZE_MB = 100; // 100MB max file size
const MIN_DURATION_SEC = 3; // 3 seconds minimum
const MAX_DURATION_SEC = 180; // 3 minutes maximum

const VideoUploadStep = ({ uploadedVideo, setUploadedVideo, setError }) => {
  const fileInputRef = useRef(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const validateVideo = (file, videoElement) => {
    return new Promise((resolve, reject) => {
      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        reject(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
        return;
      }

      // Check video duration once metadata is loaded
      videoElement.onloadedmetadata = () => {
        const duration = videoElement.duration;
        
        if (duration < MIN_DURATION_SEC) {
          reject(`Video is too short. Minimum duration is ${MIN_DURATION_SEC} seconds.`);
        } else if (duration > MAX_DURATION_SEC) {
          reject(`Video is too long. Maximum duration is ${MAX_DURATION_SEC / 60} minutes.`);
        } else {
          resolve();
        }
      };

      videoElement.onerror = () => {
        reject("Failed to load video. Please try a different file.");
      };
    });
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsValidating(true);
      setValidationMessage("Validating video...");
      setError(null);

      // Create object URL for preview
      const url = URL.createObjectURL(file);
      
      // Create a video element to check duration
      const videoElement = document.createElement('video');
      videoElement.src = url;
      
      // Validate the video
      await validateVideo(file, videoElement);
      
      // If validation passes, set the uploaded video
      setUploadedVideo({ 
        file, 
        url,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
      setValidationMessage("");
      setError(null);
    } catch (err) {
      console.error("Video validation failed:", err);
      setValidationMessage("");
      setError(err);
      
      // Clean up
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveVideo = () => {
    setUploadedVideo(null);
    setValidationMessage("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="video-upload" className="text-lg font-medium">Upload Your Video</Label>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload the video you want to enhance with AI. We support MP4, MOV, and WebM formats.
        </p>
      </div>
      
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <label className="relative flex flex-col items-center justify-center w-full h-64 overflow-hidden border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50">
          {uploadedVideo ? (
            <div className="relative w-full h-full p-4">
              <video 
                src={uploadedVideo.url} 
                className="w-full h-full object-contain rounded-lg" 
                controls 
              />
              <button
                type="button"
                onClick={handleRemoveVideo}
                className="absolute top-2 right-2 p-2 rounded-full bg-gray-900/80 text-white backdrop-blur-sm hover:bg-gray-900"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 right-2 bg-gray-900/80 text-white text-xs p-2 rounded backdrop-blur-sm">
                {uploadedVideo.file.name} ({(uploadedVideo.file.size / (1024 * 1024)).toFixed(2)} MB)
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6">
              {isValidating ? (
                <>
                  <div className="mb-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {validationMessage}
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-4 rounded-full p-3 bg-blue-100 dark:bg-blue-900/50">
                    <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Click to upload a video
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Video must be between {MIN_DURATION_SEC} seconds and {MAX_DURATION_SEC / 60} minutes.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Maximum file size: {MAX_FILE_SIZE_MB}MB
                  </p>
                </>
              )}
            </div>
          )}
          <input
            id="video-upload"
            type="file"
            className="hidden"
            accept="video/mp4,video/quicktime,video/webm"
            onChange={handleVideoUpload}
            ref={fileInputRef}
            disabled={isValidating}
          />
        </label>
      </div>
      
      {uploadedVideo && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-start">
          <div className="mr-2 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Video uploaded successfully!</p>
            <p>Your video is ready to be enhanced. Continue to the next step to customize captions.</p>
          </div>
        </div>
      )}
      
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        <p className="flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>For best results, use a video with good lighting and clear audio.</span>
        </p>
      </div>
    </div>
  );
};

export default VideoUploadStep;