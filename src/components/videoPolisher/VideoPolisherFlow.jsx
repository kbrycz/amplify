import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SERVER_URL, auth } from '../../lib/firebase';
import { Card, CardContent } from '../../components/ui/card';
import { useFormCache } from '../../hooks/useFormCache';
import { PhonePreview } from '../create-template/PhonePreview';
import { InternalName } from '../create-template/steps/InternalName';
import { Captions } from '../create-template/steps/Captions';
import { Outro } from '../create-template/steps/Outro';
import { StepNavigation } from '../shared/templates/StepNavigation';
import { useToast } from '../../components/ui/toast-notification';

// Theme configuration – same as CreateTemplate
const themes = {
  sunset: {
    background: 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600',
    text: 'text-white',
    subtext: 'text-orange-100',
    border: 'border-white/20',
    input: 'bg-white/20',
    name: 'Sunset Vibes'
  },
  midnight: {
    background: 'bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900',
    text: 'text-white',
    subtext: 'text-primary-200',
    border: 'border-primary-900/50',
    input: 'bg-primary-950/50',
    name: 'Midnight primary'
  },
  nature: {
    background: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600',
    text: 'text-white',
    subtext: 'emerald-100',
    border: 'border-white/20',
    input: 'bg-white/20',
    name: 'Nature Fresh'
  },
  ocean: {
    background: 'bg-gradient-to-br from-cyan-500 via-primary-500 to-primary-600',
    text: 'text-white',
    subtext: 'text-cyan-100',
    border: 'border-white/20',
    input: 'bg-white/20',
    name: 'Ocean Depths'
  }
};

// Steps for the video polisher flow
const steps = [
  { name: 'Name Video' },
  { name: 'Captions' },
  { name: 'Outro' }
];

export default function VideoPolisherFlow() {
  const { id, campaignId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  // Multi–step form state (similar to CreateTemplate)
  const initialFormData = {
    name: '',
    title: '',
    description: '',
    category: '',
    businessName: '',
    website: '',
    email: '',
    phone: ''
  };
  const [formData, setFormData, clearFormCache] = useFormCache(initialFormData, 'video-polisher-form');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState('sunset');
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState({ style: 'standard', position: 'bottom' });
  const [selectedOutroTheme, setSelectedOutroTheme] = useState('sunset');
  const [outroLogo, setOutroLogo] = useState(null);
  const [customOutroColor, setCustomOutroColor] = useState('#3B82F6');
  const [outroText, setOutroText] = useState('');
  const [outroTextColor, setOutroTextColor] = useState('#FFFFFF');
  const [showOutro, setShowOutro] = useState(true);
  
  // Fetch the video using the provided id
  useEffect(() => {
    if (id) {
      fetchVideo();
    }
  }, [id]);
  
  const fetchVideo = async () => {
    setIsLoading(true);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/survey/video/${id}`, {
        headers: { 'Authorization': `Bearer ${idToken}` }
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
  
  // Input handler for form fields
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  // Step navigation
  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return Boolean(formData.name?.trim());
      case 1:
      case 2:
        return true;
      default:
        return false;
    }
  };
  
  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit(e);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  
  // Polling function to check processing status
  const handleVideoProcessingStart = (videoId, jobId, toastId) => {
    const pollInterval = 5000; // 5 seconds
    const maxAttempts = 60; // 5 minutes max
    let attempts = 0;
    const pollStatus = async () => {
      attempts++;
      if (attempts > maxAttempts) {
        addToast("Video processing is taking longer than expected. Please check back later.", "info", 10000, toastId);
        setIsProcessing(false);
        clearInterval(intervalId);
        return;
      }
      try {
        const idToken = await auth.currentUser.getIdToken();
        const response = await fetch(`${SERVER_URL}/creatomate/creatomate-process/status/job/${jobId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        if (!response.ok) throw new Error('Failed to check status');
        const result = await response.json();
        if (result.status === 'succeeded') {
          clearInterval(intervalId);
          setIsProcessing(false);
          addToast(
            <div className="flex flex-col space-y-3">
              <p className="font-semibold text-base">Success! Your enhanced video is ready.</p>
              <button 
                onClick={() => {
                  navigate(campaignId ? `/app/campaigns/${campaignId}/responses` : '/app/campaigns');
                }}
                className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded text-sm font-medium mt-1 w-full text-center"
              >
                Go to Responses
              </button>
            </div>,
            "success",
            15000,
            toastId
          );
        } else if (result.status === 'failed') {
          clearInterval(intervalId);
          setIsProcessing(false);
          addToast(`Video enhancement failed: ${result.error || 'Unknown error'}`, "error", 10000, toastId);
        }
      } catch (error) {
        if (attempts >= maxAttempts) {
          clearInterval(intervalId);
          setIsProcessing(false);
          addToast(`Error checking video status: ${error.message}`, "error", 10000, toastId);
        }
      }
    };
    pollStatus();
    const intervalId = setInterval(pollStatus, pollInterval);
  };
  
  // Handle form submission: call the creatomate endpoint to enhance the video
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setError("Please enter a video name");
      return;
    }
    setIsProcessing(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You must be logged in to enhance a video");
      const idToken = await user.getIdToken();
      const payload = {
        videoId: video.id, // using the fetched video's id
        name: formData.name,
        captionType: typeof selectedCaptionStyle === 'object' ? selectedCaptionStyle.style : selectedCaptionStyle,
        captionPosition: typeof selectedCaptionStyle === 'object' ? selectedCaptionStyle.position : 'bottom',
        outtroBackgroundColors: showOutro ? (selectedOutroTheme === 'custom' ? customOutroColor : selectedOutroTheme) : 'none',
        outtroFontColor: showOutro ? outroTextColor : '',
        image: showOutro ? outroLogo : null,
        additionalData: JSON.stringify({
          formData,
          selectedTheme,
          selectedCaptionStyle,
          selectedOutroTheme,
          outroLogo,
          customOutroColor,
          outroText,
          outroTextColor,
          showOutro
        })
      };
      const toastId = addToast("Video processing in progress. This may take a few minutes...", "info", 0);
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
      const responseData = await response.json();
      const jobId = responseData.jobId;
      if (jobId) {
        handleVideoProcessingStart(video.id, jobId, toastId);
      }
    } catch (err) {
      setError(err.message || "Failed to process video");
      addToast(err.message || "Failed to process video", "error", 10000);
      setIsProcessing(false);
    }
  };
  
  const renderContent = () => {
    if (currentStep === 0) {
      return <InternalName formData={formData} handleInputChange={handleInputChange} />;
    } else if (currentStep === 1) {
      return <Captions selectedCaptionStyle={selectedCaptionStyle} setSelectedCaptionStyle={setSelectedCaptionStyle} />;
    } else if (currentStep === 2) {
      return (
        <Outro
          selectedOutroTheme={selectedOutroTheme}
          setSelectedOutroTheme={setSelectedOutroTheme}
          outroLogo={outroLogo}
          setOutroLogo={setOutroLogo}
          customOutroColor={customOutroColor}
          setCustomOutroColor={setCustomOutroColor}
          outroText={outroText}
          setOutroText={setOutroText}
          outroTextColor={outroTextColor}
          setOutroTextColor={setOutroTextColor}
          showOutro={showOutro}
          setShowOutro={setShowOutro}
        />
      );
    }
    return null;
  };
  
  return (
    <div className="p-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Enhance Video</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Customize and enhance your video using our AI enhancement tool. Use 1 credit to transform your video.
          </p>
          <div className="relative max-w-[800px] h-1 bg-gray-200 dark:bg-gray-800 mt-4">
            <div
              className="absolute inset-y-0 left-0 bg-primary-600 dark:bg-primary-400 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
        <div className={`grid grid-cols-1 ${video ? 'lg:grid-cols-[800px,auto]' : ''} gap-6 items-start`}>
          <Card className="w-full">
            <CardContent>
              <form onSubmit={(e) => {
                if (currentStep !== steps.length - 1) {
                  e.preventDefault();
                  handleNext(e);
                } else {
                  handleSubmit(e);
                }
              }} className="space-y-8">
                {renderContent()}
                <div className="mt-8">
                  <StepNavigation
                    currentStep={currentStep}
                    totalSteps={steps.length}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    isSubmitting={isProcessing}
                    formData={formData}
                    selectedCaptionStyle={selectedCaptionStyle}
                    finalStepText="Use 1 Credit to Enhance Video"
                  />
                </div>
              </form>
            </CardContent>
          </Card>
          {video && (
            <PhonePreview
              selectedTheme={selectedTheme}
              formData={formData}
              currentStep={currentStep}
              themes={themes}
              selectedCaptionStyle={selectedCaptionStyle}
              selectedOutroTheme={selectedOutroTheme}
              outroLogo={outroLogo}
              customOutroColor={customOutroColor}
              outroText={outroText}
              outroTextColor={outroTextColor}
              showOutro={showOutro}
              videoUrl={video.videoUrl}  // Use the fetched video's URL
            />
          )}
        </div>
      </div>
    </div>
  );
}