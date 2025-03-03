import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { SERVER_URL } from '../lib/firebase';
import { X } from 'lucide-react';
import { themes } from '../components/survey/themes';
import { SurveyHeader } from '../components/survey/SurveyHeader';
import { ContactForm } from '../components/survey/ContactForm';
import { LocationForm } from '../components/survey/LocationForm';
import { VideoResponse } from '../components/survey/VideoResponse';
import { SuccessMessage } from '../components/survey/SuccessMessage';
import { NavigationButtons } from '../components/survey/NavigationButtons';
import { ProgressBar } from '../components/survey/ProgressBar';
import { LoadingScreen } from '../components/survey/LoadingScreen';
import { ErrorScreen } from '../components/survey/ErrorScreen';

const steps = [
  { id: 'intro', title: 'Welcome' },
  { id: 'contact', title: 'Contact Info' },
  { id: 'location', title: 'Location' },
  { id: 'response', title: 'Your Response' },
  { id: 'success', title: 'Thank You' }
];

export default function Survey() {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState('intro');
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [videoDuration, setVideoDuration] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const errorTimeoutRef = useRef(null);
  const [repsLoaded, setRepsLoaded] = useState(false);
  const MAX_VIDEO_DURATION = 120; // 2 minutes in seconds
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    zipCode: '',
    videoFile: null,
    videoUrl: null,
    currentQuestionIndex: 0
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const apiUrl = `${SERVER_URL}/campaign/campaigns/survey/${id}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Campaign not found');
      }
      const data = await response.json();
      setCampaign(data);
    } catch (err) {
      console.error('Error fetching campaign:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      errorTimeoutRef.current = setTimeout(() => {
        setError(null);
      }, 5000);
    }
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        const duration = Math.round(video.duration);
        setVideoDuration(duration);

        if (duration > MAX_VIDEO_DURATION) {
          setError(`Video is too long (${Math.round(duration / 60)}:${String(duration % 60).padStart(2, '0')}). Please upload a video shorter than 2 minutes.`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setError(null);
          setFormData(prev => ({
            ...prev,
            videoFile: file,
            videoUrl: URL.createObjectURL(file)
          }));
        }
      };

      video.src = URL.createObjectURL(file);
    }
  };

  const handleRemoveVideo = () => {
    setVideoDuration(null);
    setError(null);
    setFormData(prev => ({
      ...prev,
      videoFile: null,
      videoUrl: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.videoFile) {
      setError('Please record or upload a video response before submitting');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (videoDuration > MAX_VIDEO_DURATION) {
      setError(`Video must be shorter than 2 minutes. Current length: ${Math.round(videoDuration / 60)}:${String(videoDuration % 60).padStart(2, '0')}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsUploading(true);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const formDataToSend = new FormData();
    formDataToSend.append('campaignId', id);
    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('zipCode', formData.zipCode);
    formDataToSend.append('video', formData.videoFile);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${SERVER_URL}/survey/upload`, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 201) {
        setCurrentStep('success');
      } else {
        setError(`Failed to upload video. Server responded with status ${xhr.status}`);
        console.error('Upload failed:', xhr.status, xhr.responseText);
      }
      setIsUploading(false);
      setUploadProgress(0);
    };

    xhr.onerror = () => {
      setError('Failed to upload video due to a network error.');
      console.error('Network error during upload');
      setIsUploading(false);
      setUploadProgress(0);
    };

    xhr.send(formDataToSend);
  };

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const goToNextStep = () => {
    if (!isLastStep) {
      setError(null);
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setError(null);
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  if (isLoading) return <LoadingScreen />;
  if (error && !campaign) return <ErrorScreen error={error} />;

  return (
    <div className={`min-h-screen ${campaign.theme ? themes[campaign.theme].background : 'bg-gray-50 dark:bg-gray-900'}`}>
      <ProgressBar 
        currentStepIndex={currentStepIndex} 
        totalSteps={steps.length} 
        theme={campaign.theme} 
        themes={themes} 
      />

      <div className={`mx-auto px-4 py-16 sm:px-6 sm:py-24 ${
        currentStep === 'response' 
          ? 'max-w-2xl lg:max-w-5xl' 
          : 'max-w-2xl'
      } lg:px-8`}>
        {error && (
          <div className={`mb-6 rounded-lg border ${
            campaign.theme 
              ? `${themes[campaign.theme].border} bg-black/20` 
              : 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/50'
          } p-4`}>
            <div className="flex items-start">
              <div className={`mr-3 flex-shrink-0 ${
                campaign.theme 
                  ? themes[campaign.theme].text 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                <X className="h-5 w-5" />
              </div>
              <div>
                <h3 className={`text-sm font-medium ${
                  campaign.theme 
                    ? themes[campaign.theme].text 
                    : 'text-red-800 dark:text-red-200'
                }`}>Error</h3>
                <div className={`mt-2 text-sm ${
                  campaign.theme 
                    ? themes[campaign.theme].subtext 
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'intro' && (
          <SurveyHeader 
            campaign={campaign} 
            theme={campaign.theme} 
            themes={themes}
            previewImage={campaign.previewImage}
            goToNextStep={goToNextStep}
          />
        )}

        {currentStep === 'contact' && (
          <ContactForm 
            formData={formData} 
            handleInputChange={handleInputChange} 
            theme={campaign.theme}
            themes={themes} 
            onRepsLoaded={setRepsLoaded} 
          />
        )}

        {currentStep === 'location' && (
          <LocationForm 
            formData={formData} 
            handleInputChange={handleInputChange} 
            theme={campaign.theme}
            themes={themes}
            onRepsLoaded={setRepsLoaded}
          />
        )}

        {currentStep === 'response' && (
          <VideoResponse 
            campaign={campaign}
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
            formData={formData}
            handleVideoUpload={handleVideoUpload}
            handleRemoveVideo={handleRemoveVideo}
            videoDuration={videoDuration}
            theme={campaign.theme}
            themes={themes}
          />
        )}

        {currentStep === 'success' && (
          <SuccessMessage 
            theme={campaign.theme} 
            themes={themes} 
          />
        )}

        <NavigationButtons 
          currentStep={currentStep}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          goToPreviousStep={goToPreviousStep}
          goToNextStep={goToNextStep}
          handleSubmit={handleSubmit}
          theme={campaign.theme}
          themes={themes}
          formData={formData}
          videoFile={formData.videoFile}
          videoDuration={videoDuration}
          repsLoaded={repsLoaded} 
        />
      </div>
    </div>
  );
}