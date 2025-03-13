import React, { useState, useRef } from 'react';
import { Label } from '../../ui/label';
import { SurveyQuestions } from '../components/SurveyQuestions';
import { Video, HelpCircle, Upload, X } from 'lucide-react';
import { Switch } from '../../ui/switch';
import { ExplainerVideoHelpModal } from '../modals/ExplainerVideoHelpModal';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../ui/select';

export function CampaignDetails({
  formData,
  handleInputChange,
  surveyQuestions,
  handleAddQuestion,
  handleRemoveQuestion,
  handleQuestionChange,
  setIsHelpOpen,
  aiGeneratedFields,
  explainerVideo,
  setExplainerVideo,
  hasExplainerVideo,
  setHasExplainerVideo
}) {
  const [isExplainerHelpOpen, setIsExplainerHelpOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleExplainerToggle = (checked) => {
    setHasExplainerVideo(checked);
    // If toggling off, clear the video
    if (!checked) {
      setExplainerVideo(null);
    }
  };

  const handleExplainerVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processVideoFile(file);
    }
  };

  const processVideoFile = (file) => {
    // Check file size (limit to 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('Video size should be less than 50MB');
      return;
    }
    
    // Check file type
    if (!file.type.match('video/mp4|video/quicktime|video/webm')) {
      alert('Please upload a video file in MP4, MOV, or WebM format');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setExplainerVideo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveExplainerVideo = () => {
    setExplainerVideo(null);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processVideoFile(file);
      e.dataTransfer.clearData();
    }
  };

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-6">
      {/* Explainer Video Section with adjusted height to prevent layout shifts */}
      <div className="space-y-4" style={{ minHeight: hasExplainerVideo ? '200px' : '60px' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="has-explainer-video" className="cursor-pointer flex items-center">
              Add Explainer Video
              <button 
                onClick={() => setIsExplainerHelpOpen(true)}
                className="ml-2 inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="Learn more about explainer videos"
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            </Label>
          </div>
          <Switch 
            id="has-explainer-video" 
            checked={hasExplainerVideo}
            onCheckedChange={handleExplainerToggle}
          />
        </div>
        
        {hasExplainerVideo && (
          <div className="mt-2 space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add a short video (30-90 seconds) to introduce your survey and provide context for participants.
            </p>
            
            {!explainerVideo ? (
              <div 
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors duration-200 ${
                  isDragging 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/10'
                }`}
                onClick={handleBoxClick}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <Video className={`h-8 w-8 mb-2 ${isDragging ? 'text-primary-500' : 'text-gray-400 dark:text-gray-300'}`} />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {isDragging ? 'Drop your video here' : 'Upload your explainer video'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Click or drag and drop your file
                  </p>
                  <input 
                    ref={fileInputRef}
                    id="explainer-video-upload" 
                    type="file" 
                    accept="video/mp4,video/quicktime,video/webm" 
                    className="hidden" 
                    onChange={handleExplainerVideoChange}
                  />
                </div>
              </div>
            ) : (
              <div className="relative border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                <video 
                  src={explainerVideo} 
                  controls 
                  className="w-full h-auto max-h-[300px]"
                />
                <button
                  onClick={handleRemoveExplainerVideo}
                  className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black/90"
                  aria-label="Remove video"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <SurveyQuestions
        surveyQuestions={surveyQuestions}
        handleAddQuestion={handleAddQuestion}
        handleRemoveQuestion={handleRemoveQuestion}
        handleQuestionChange={handleQuestionChange}
        setIsHelpOpen={setIsHelpOpen}
        aiGeneratedFields={aiGeneratedFields}
        className={hasExplainerVideo ? "-mt-2" : ""}
      />

      <ExplainerVideoHelpModal 
        isOpen={isExplainerHelpOpen} 
        onClose={() => setIsExplainerHelpOpen(false)} 
      />
    </div>
  );
}