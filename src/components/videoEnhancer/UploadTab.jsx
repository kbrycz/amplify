import React from 'react';
import { X, Upload, Loader2, Sparkles } from 'lucide-react';

const UploadTab = ({
  videoFile,
  setVideoFile,
  videoDuration,
  setVideoDuration,
  error,
  setError,
  isUploadProcessing,
  uploadProcessingId,
  setActiveTab,
  handleVideoUpload,
  handleRemoveVideo,
  setSelectedVideo,
  setIsTransformModalOpen
}) => {
  return (
    <div>
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <label className="relative flex flex-col items-center justify-center w-full h-48 overflow-hidden border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50">
          {videoFile ? (
            <div className="relative w-full h-full p-4">
              <video
                src={videoFile.url}
                className="w-full h-full object-contain rounded-lg"
                controls
              />
              {!isUploadProcessing && (
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  className="absolute top-2 right-2 p-2 rounded-full bg-gray-900/80 text-white backdrop-blur-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {isUploadProcessing && (
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="flex items-center justify-center mb-2">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Processing video...</span>
                    </div>
                    <p className="text-sm">Your video is being enhanced with AI</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full p-3 bg-blue-100 dark:bg-blue-900/50">
                <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Click to upload a video
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Video must be between 10 seconds and 3 minutes
              </p>
            </div>
          )}
          <input
            type="file"
            className="hidden"
            accept="video/*"
            onChange={handleVideoUpload}
            disabled={isUploadProcessing}
          />
        </label>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mt-4 flex justify-between">
          {isUploadProcessing && uploadProcessingId && (
            <button
              type="button"
              onClick={() => setActiveTab('videos')}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              View All Videos
            </button>
          )}
          <div className="ml-auto">
            <button
              type="button"
              disabled={!videoFile || videoDuration < 10 || videoDuration > 180 || isUploadProcessing}
              onClick={() => {
                if (videoFile && videoFile.file) {
                  const videoObj = {
                    file: videoFile.file,
                    url: videoFile.url,
                    duration: videoDuration,
                    id: uploadProcessingId
                  };
                  setSelectedVideo(videoObj);
                  setIsTransformModalOpen(true);
                } else {
                  setError("No video file selected");
                }
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploadProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Enhance with AI
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadTab;